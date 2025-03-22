# Separate Deployment Guide for MePad

## Step 1: Deploy Backend First

1. Create a new Vercel project
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Import your GitHub repository

2. Configure the project:
   - Root Directory: `Backend/`
   - Framework preset: "Node.js"
   - Build Command: `npm install`
   - Output Directory: Leave empty

3. Add the following environment variables:
   ```
   PORT=8080
   NODE_ENV=production
   MONGO_URI=mongodb+srv://huznigarane:huznigarane@cluster0.nxrmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=meetingmanager123456
   JWT_EXPIRE=30d
   GEMINI_API_KEY=AIzaSyD2Zxg_EP32z79Ubd-odUO_y8OYfFmNQGE
   GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta
   GEMINI_MODEL=models/gemini-1.5-pro
   ```

4. Deploy and note the URL (e.g., `your-backend-name.vercel.app`)

5. After deployment, add these additional environment variables:
   ```
   CORS_ORIGIN=https://your-frontend-name.vercel.app
   FRONTEND_URL=https://your-frontend-name.vercel.app
   PUBLIC_URL=https://your-frontend-name.vercel.app
   ```
   (You'll need to come back and update these after deploying the frontend)

## Step 2: Deploy Frontend

1. Create another Vercel project
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Import your GitHub repository

2. Configure the project:
   - Root Directory: `frontend/`
   - Framework preset: "Vite"
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`

3. Add the following environment variables:
   ```
   VITE_API_URL=https://your-backend-name.vercel.app/api
   VITE_GEMINI_API_KEY=AIzaSyD2Zxg_EP32z79Ubd-odUO_y8OYfFmNQGE
   VITE_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta
   VITE_GEMINI_MODEL=models/gemini-1.5-pro
   ```
   (Replace `your-backend-name.vercel.app` with your actual backend URL)

4. Deploy and note the URL (e.g., `your-frontend-name.vercel.app`)

## Step 3: Update Backend CORS Settings

1. Go back to your backend project in Vercel
2. Update these environment variables with your actual frontend URL:
   ```
   CORS_ORIGIN=https://your-frontend-name.vercel.app
   FRONTEND_URL=https://your-frontend-name.vercel.app
   PUBLIC_URL=https://your-frontend-name.vercel.app
   ```
3. Redeploy your backend

## Verification & Troubleshooting

### Test the API Connection
1. Visit your frontend URL in a browser
2. Open DevTools (F12) and go to the Network tab
3. Check if API requests to your backend are working

### Common Issues:

#### CORS Errors
If you see CORS errors in the console:
- Verify the `CORS_ORIGIN` value in your backend environment variables exactly matches your frontend URL
- Make sure to include the protocol (https://) and no trailing slash

#### 404 Not Found
If API endpoints return 404:
- Check that the path is correct in your `VITE_API_URL` (should end with `/api`)
- Verify the backend routes are working by visiting `https://your-backend-name.vercel.app/api/health`

#### Connection Errors
If you cannot connect to the backend:
- Make sure your MongoDB connection string is correct
- Check Vercel logs for any backend errors

#### Routing Issues
- Check both vercel.json files to ensure routes are configured correctly
- The backend's vercel.json should have `/api/(.*)` routes pointing to server.js 