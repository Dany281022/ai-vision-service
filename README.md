# AI Vision Service

**An AI-powered SaaS application for image analysis, built with FastAPI and Next.js.**

 **Deployed Application Link**: [https://ai-vision-service-9lzjze5gh-dany-deugoues-projects.vercel.app](https://ai-vision-service-9lzjze5gh-dany-deugoues-projects.vercel.app)
## Project Overview
This project is a **SaaS application** that allows users to upload images and receive AI-generated detailed descriptions (using OpenAI Vision API). The application includes:
- **Secure authentication** via Clerk.
- **Tier management** (Free: 1 analysis, Premium: unlimited).
- **File validation** (format, size).
- **Deployment on Vercel** with a backend (FastAPI) and frontend (Next.js) architecture.

**Technologies Used**:
- Backend: FastAPI (Python)
- Frontend: Next.js (React)
- Authentication: Clerk
- AI: OpenAI Vision API (gpt-4o-mini)
- Deployment: Vercel

---

##  Features

### Implemented Features
- **Image Upload and Analysis**:
  - Supports `.jpg`, `.jpeg`, `.png`, `.webp` formats (max 5MB).
  - Converts images to base64 and sends them to the OpenAI API to generate descriptions.
- **Authentication**:
  - Login via Clerk (Email, Google, GitHub).
  - Route protection with JWT.
- **Tier Management**:
  - **Free**: 1 analysis per session.
  - **Premium**: Unlimited analyses.
- **User Interface**:
  - Landing page with pricing tiers.
  - Analysis page with image preview and result display.
- **Error Handling**:
  - Clear messages for invalid files or exceeded limits.

### Bonus Features (if applicable)
- <Add any bonus features here, e.g., analysis history, result downloads, etc.>

---

##  Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- [Clerk](https://clerk.com/) account (for authentication)
- [OpenAI](https://platform.openai.com/) API key

### Clone the Repository
```bash
git clone https://github.com/Dany281022/ai-vision-service.git
cd ai-vision-service
