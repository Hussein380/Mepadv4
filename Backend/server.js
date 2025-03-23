const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');
require('dotenv').config();

const app = express();

// Log environment variables for debugging
console.log('Environment:', process.env.NODE_ENV);
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

// Connect to database
connectDB();

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:5173',
    'http://localhost:8080',
    'https://mepadv4-frontend.vercel.app'
];

// Add the frontend URL from environment variable if it exists
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

// Add the CORS_ORIGIN from environment variable if it exists
if (process.env.CORS_ORIGIN) {
    // Split by comma if it's a comma-separated list
    const corsOrigins = process.env.CORS_ORIGIN.split(',');
    corsOrigins.forEach(origin => {
        if (origin.trim() && !allowedOrigins.includes(origin.trim())) {
            allowedOrigins.push(origin.trim());
        }
    });
}

// Log allowed origins for debugging
console.log('Allowed Origins:', allowedOrigins);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);
        
        console.log('Request origin:', origin);
        
        // Always allow the production frontend
        if (origin === 'https://mepadv4-frontend.vercel.app') {
            return callback(null, true);
        }
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Root route handler
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'MePad API is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'API is healthy',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
}

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/meetings', require('./src/routes/meetingRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log('Allowed origins:', allowedOrigins);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
}); 
