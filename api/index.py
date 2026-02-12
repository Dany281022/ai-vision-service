import os
import base64
from fastapi import FastAPI, UploadFile, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from openai import OpenAI
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer

app = FastAPI(title="AI Vision Service")

clerk_config = ClerkConfig(jwks_url=os.getenv("CLERK_JWKS_URL"))
clerk_guard = ClerkHTTPBearer(clerk_config)

ALLOWED_EXT = {'.jpg', '.jpeg', '.png', '.webp'}
MAX_SIZE = 5 * 1024 * 1024

usage_tracker = {}  # {user_id: count} - in-memory (limitation connue)

@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "AI Vision Service"}

@app.post("/api/analyze")
async def analyze(file: UploadFile, creds: HTTPAuthorizationCredentials = Depends(clerk_guard)):
    user_id = creds.decoded["sub"]

    # Détection tier via Clerk Billing (session token claim 'pla' = plan actif)
    # D'après docs Clerk : 'pla' = "u:premium_vision" ou similaire
    plan_claim = creds.decoded.get("pla", "")
    tier = "premium" if "premium_vision" in plan_claim.lower() else "free"

    # Fallback metadata si besoin
    if tier == "free":
        metadata = creds.decoded.get("public_metadata", {})
        tier = metadata.get("subscription_tier", "free")

    if not check_usage(user_id, tier):
        raise HTTPException(429, "Free tier limit (1 analysis) reached. Upgrade to Premium.")

    if not file.filename:
        raise HTTPException(400, "No file provided")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(400, f"Invalid type. Allowed: {', '.join(ALLOWED_EXT)}")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(413, "File too large (>5MB)")

    b64 = base64.b64encode(content).decode('utf-8')

    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": [
                    {"type": "text", "text": "Describe this image in detail: objects, colors, mood, notable features."},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}}
                ]}
            ],
            max_tokens=400
        )
        desc = resp.choices[0].message.content
        return {"description": desc}
    except Exception as e:
        raise HTTPException(500, f"AI error: {str(e)}")

@app.get("/api/usage")
def usage(creds: HTTPAuthorizationCredentials = Depends(clerk_guard)):
    user_id = creds.decoded["sub"]
    plan_claim = creds.decoded.get("pla", "")
    tier = "premium" if "premium_vision" in plan_claim.lower() else "free"
    used = usage_tracker.get(user_id, 0)
    lim = "unlimited" if tier == "premium" else 1
    return {"user_id": user_id, "tier": tier, "analyses_used": used, "limit": lim}

def check_usage(uid: str, tier: str) -> bool:
    if tier == "premium":
        return True
    cnt = usage_tracker.get(uid, 0)
    if cnt >= 1:
        return False
    usage_tracker[uid] = cnt + 1
    return True
    