# Frontend Deployment Guide (Vercel)

Follow these steps to deploy your Next.js frontend to Vercel.

## 1. Create a New Project
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.

## 2. Configure the Project
Vercel usually auto-detects Next.js, but double-check these settings:

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | `Next.js` |
| **Root Directory** | `frontend` | 

> [!NOTE]
> Make sure to click "Edit" next to **Root Directory** and select the `frontend` folder if your repo has both backend and frontend.

## 3. Environment Variables
Copy the content from `frontend/vercel.env` and add it to the **Environment Variables** section.

| Key | Value |
| :--- | :--- |
| `BACKEND_URL` | `https://easy-backend-pkd1.onrender.com` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://easy-backend-pkd1.onrender.com` |

## 4. Deploy
Click **Deploy**. Vercel will build your app.

## 5. Post-Deployment (Crucial!)
Once your frontend is live (e.g., `https://easy-frontend-xyz.vercel.app`), you **MUST** go back to your **Render Backend Dashboard**:
1. Go to **Environment**.
2. Edit `CORS_ORIGIN`.
3. Add your new Vercel URL to the list (comma-separated).
   - Example: `http://localhost:3000,http://localhost:5173,https://easy-frontend-xyz.vercel.app`
4. Save changes on Render.

If you don't do step 5, your frontend will fail to talk to the backend due to CORS errors.
