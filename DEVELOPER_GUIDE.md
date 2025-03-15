# Developer's Guide - Lessons from MePad Project

## Project Structure Best Practices

### Frontend Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── auth/      # Authentication related components
│   │   ├── meetings/  # Meeting related components
│   │   └── shared/    # Shared/common components
│   ├── context/       # React context providers
│   ├── services/      # API and other services
│   └── utils/         # Helper functions
├── .env              # Development environment variables
├── .env.production   # Production environment variables
└── vercel.json       # Vercel deployment configuration
```

### Backend Structure
```
Backend/
├── src/
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── utils/        # Helper functions
├── .env             # Development environment variables
├── .env.production  # Production environment variables
└── vercel.json      # Vercel deployment configuration
```

## Common Development Pitfalls & Solutions

### 1. CORS Issues
CORS errors are common when your frontend and backend are on different domains.

**Solution:**
```javascript
// Backend/src/app.js
const allowedOrigins = [
    'http://localhost:5173',  // Local frontend
    'https://your-frontend.vercel.app' // Production frontend
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
```

### 2. Environment Variables
Always keep separate environment files for development and production.

**Local Development:**
```plaintext
# frontend/.env
VITE_API_URL=http://localhost:5002/api

# Backend/.env
PORT=5002
NODE_ENV=development
MONGO_URI=your_mongodb_uri
```

**Production:**
```plaintext
# frontend/.env.production
VITE_API_URL=https://your-backend.vercel.app/api

# Backend/.env.production
NODE_ENV=production
MONGO_URI=your_mongodb_uri
```

## Vercel Deployment Checklist

### Frontend Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure build settings:
   ```json
   // frontend/vercel.json
   {
       "buildCommand": "npm run build",
       "devCommand": "npm run dev",
       "installCommand": "npm install",
       "framework": "vite",
       "outputDirectory": "dist"
   }
   ```
4. Add environment variables in Vercel dashboard:
   - `VITE_API_URL`

### Backend Deployment
1. Configure Vercel settings:
   ```json
   // Backend/vercel.json
   {
       "version": 2,
       "builds": [
           {
               "src": "server.js",
               "use": "@vercel/node"
           }
       ],
       "routes": [
           {
               "src": "/(.*)",
               "dest": "server.js",
               "headers": {
                   "Access-Control-Allow-Origin": "https://your-frontend.vercel.app",
                   "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                   "Access-Control-Allow-Headers": "X-Requested-With,Content-Type,Accept,Authorization",
                   "Access-Control-Allow-Credentials": "true"
               }
           }
       ]
   }
   ```
2. Add environment variables in Vercel dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV`
   - `CORS_ORIGIN`

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use different values for development and production
   - Keep sensitive keys secure

2. **API Security**
   - Implement rate limiting
   - Use HTTPS in production
   - Validate all user inputs
   - Implement proper authentication

3. **CORS Security**
   - Only allow necessary origins
   - Be specific with allowed methods and headers
   - Use secure options for credentials

## Testing Deployment

1. **Frontend Checks**
   - Test registration/login
   - Check network requests in browser console
   - Verify API URL is correct
   - Check for CORS errors

2. **Backend Checks**
   - Verify environment variables
   - Test API endpoints
   - Check database connection
   - Monitor error logs

## Common Issues & Solutions

1. **"Port already in use" Error**
   ```javascript
   // Backend/src/server.js
   const startServer = (port) => {
       try {
           app.listen(port);
       } catch (error) {
           if (error.code === 'EADDRINUSE') {
               startServer(port + 1);
           }
       }
   };
   ```

2. **API Connection Issues**
   - Double-check API URLs
   - Verify environment variables
   - Check CORS configuration
   - Inspect network requests

3. **Database Connection**
   - Verify MongoDB URI
   - Check network access settings
   - Monitor connection logs

## Best Practices

1. **Code Organization**
   - Use consistent file structure
   - Separate concerns (controllers, routes, models)
   - Implement proper error handling
   - Use meaningful variable names

2. **Version Control**
   - Use meaningful commit messages
   - Create .gitignore for sensitive files
   - Branch for features/fixes

3. **Documentation**
   - Document API endpoints
   - Maintain README files
   - Comment complex logic
   - Include setup instructions

4. **Development Workflow**
   - Use local environment for development
   - Test thoroughly before deployment
   - Monitor errors in production
   - Keep dependencies updated

## Monitoring & Maintenance

1. **Error Tracking**
   - Implement error logging
   - Monitor server logs
   - Track frontend errors

2. **Performance**
   - Monitor API response times
   - Check database performance
   - Optimize frontend loading

3. **Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Update documentation 