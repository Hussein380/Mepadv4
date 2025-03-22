# Vercel Deployment Guide

## Option 1: Deploy as a Monorepo (Recommended)

### 1. Push your code to GitHub
Ensure your entire project is pushed to a GitHub repository.

### 2. Create a New Project on Vercel
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click "Add New" > "Project"
- Import your GitHub repository
- Configure the project:
  - Framework preset: "Other"
  - Root Directory: `./` (leave empty)
  - Build Command: `npm run build`
  - Output Directory: `frontend/dist`
  - Install Command: `npm install`
- Add Environment Variables:
  - All variables from both `frontend/.env.production` and `Backend/.env.production`
- Click "Deploy"

## Option 2: Deploy Frontend and Backend Separately

### Deploy Backend First
1. Create a new Vercel project
2. Configure:
   - Root Directory: `Backend/`
   - Framework preset: "Node.js"
   - Build Command: `npm install`
   - Output Directory: Leave empty
3. Add all environment variables from `Backend/.env.production`
4. Deploy and note the URL (e.g., `your-backend-name.vercel.app`)

### Then Deploy Frontend
1. Create another Vercel project
2. Configure:
   - Root Directory: `frontend/`
   - Framework preset: "Vite"
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`
3. Add environment variables from `frontend/.env.production`
4. Important: Add `VITE_API_URL=https://your-backend-name.vercel.app/api`
5. Deploy

## Troubleshooting

### 404 Not Found Errors
If you're getting 404 errors when accessing API routes:
- Make sure the routing in `vercel.json` files is correct
- Check if CORS origins are properly configured
- Verify that environment variables are correctly set

### API Connection Issues
- Ensure `VITE_API_URL` points to the correct backend URL
- Check the Network tab in browser DevTools to see what URLs are being called
- Verify backend logs in Vercel to see if requests are reaching the server

### Permissions/CORS Issues
- Make sure `CORS_ORIGIN` in backend includes the frontend URL
- Check browser console for CORS errors 