# Backend Deployment Guide (Render)

Follow these steps to deploy your Node.js/Express backend to Render.

## 1. Create a New Web Service
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub/GitLab repository.

## 2. Configure the Service
Use the following settings:

| Setting | Value | Note |
| :--- | :--- | :--- |
| **Name** | `easy-backend` (or your preference) | |
| **Root Directory** | `backend` | **Crucial:** Your server code is in this subfolder. |
| **Environment** | `Node` | |
| **Region** | (Choose closest to you) | |
| **Branch** | `main` (or your default branch) | |
| **Build Command** | `npm install` | |
| **Start Command** | `npm start` | Runs `node src/server.js` |

## 3. Environment Variables
You **MUST** add these variables in the **Environment** tab of your Render service. 

> [!WARNING]
> **CORS_ORIGIN**: I have included your text below, but for the actual deployment, you **MUST** add your deployed frontend URL to `CORS_ORIGIN` once you have it (e.g., `https://easy-frontend.onrender.com`). Separate multiple URLs with a comma.

Copy and paste these Key-Value pairs:

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://<USER>:<PASSWORD>@cluster...` |
| `JWT_SECRET` | `your_secret_here` |
| `JWT_EXPIRES_IN` | `7d` |
| `COOKIE_NAME` | `easy_token` |
| `CORS_ORIGIN` | `http://localhost:3000,http://localhost:5173` **(ADD YOUR FRONTEND URL HERE)** |
| `EMAIL_SIMULATION` | `false` |
| `EMAIL_USER` | `your_email@gmail.com` |
| `EMAIL_PASS` | `your_app_password` |
| `GOOGLE_CLIENT_ID` | `your_client_id...` |
| `GOOGLE_CLIENT_SECRET` | `your_client_secret...` |
| `GOOGLE_CALLBACK_URL` | `https://YOUR-BACKEND-ON-RENDER.onrender.com/api/auth/google/callback` |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | `your_api_key` |
| `CLOUDINARY_API_SECRET` | `your_api_secret` |

**Important Note on `GOOGLE_CALLBACK_URL`**: 
- Once your service is created, Render will give you a URL like `https://easy-backend-xyz.onrender.com`.
- You **MUST** update the `GOOGLE_CALLBACK_URL` variable in Render to match that domain (e.g., `https://easy-backend-xyz.onrender.com/api/auth/google/callback`).
- You also need to authorize this new domain/callback URL in your **Google Cloud Console**.

## 4. Deploy
Click **Create Web Service**. Render will start the build. Watch the logs for "Your service is live".
