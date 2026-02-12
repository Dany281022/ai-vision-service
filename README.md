# AI Vision Service – AIE1018 Assignment

## Overview
AI-powered SaaS for image analysis using OpenAI Vision (gpt-4o-mini). Users upload images for detailed descriptions. Tiered access via Clerk: Free (1 analysis), Premium (unlimited via real Clerk Billing).

Technologies:
- Frontend: Next.js 14 (Pages Router) + Tailwind CSS
- Backend: FastAPI (Python) on Vercel
- Auth: Clerk (multi-provider + Billing)
- AI: OpenAI gpt-4o-mini
- Deployment: Vercel

## Features (all required + bonus)
- Health endpoint
- Image analyze endpoint (validation, size/type check, base64, OpenAI)
- Usage endpoint (shows tier + count)
- Free: 1 analysis/session (in-memory)
- Premium: unlimited (detected via Clerk JWT 'pla' claim)
- Pro landing page with pricing tiers
- Analysis page: upload, preview, loading, result, usage display, upgrade prompt
- Clerk UserButton + manage subscription link
- Error handling (400, 413, 429, 500)

Bonus: Real Clerk Billing integration (tier enforced backend)

## Setup
1. Clone repo
2. `npm install`
3. `pip install -r requirements.txt`
4. Fill `.env.local` with Clerk + OpenAI keys
5. `npm run dev`

## API
- GET /api/health → status
- POST /api/analyze → {description: "..."} (multipart file + Bearer token)
- GET /api/usage → {tier, analyses_used, limit}

## Deployment
vercel --prod
Add env vars in Vercel: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, CLERK_JWKS_URL, OPENAI_API_KEY

## Known Limitations
- Usage in-memory → resets on redeploy
- No analysis history

Live: [your-vercel-url]
