const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/index');
const cors = require('cors');
const helmet = require('helmet'); // For setting security headers
const compression = require('compression'); // For compressing response bodies
const rateLimit = require('express-rate-limit'); // For rate limiting
const mongoSanitize = require('express-mongo-sanitize'); // Prevent NoSQL injection
const xss = require('xss-clean'); // Prevent XSS attacks
require('dotenv').config();

// Log a hello message when the server starts
console.log('Hello! Backend server is starting...');

const app = express();

// Connect to the database
connectDB();

// Root route to verify server is running
app.get('/', (req, res) => {
  res.send('Hello! Backend server is running.');
});

// Middleware to parse JSON bodies with an increased size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Use Helmet to secure HTTP headers with more specific settings
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "trusted-cdn.com"],
      },
    },
    referrerPolicy: { policy: 'no-referrer' },
    crossOriginEmbedderPolicy: true,
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },
  })
);

// Data sanitization against NoSQL query injection and XSS
app.use(mongoSanitize());
app.use(xss());

// **Enable CORS with enhanced options**
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'http://192.168.18.29:5173', 
    'http://192.168.1.7:5173',
    'https://the-life-savers-fronend.vercel.app' // Correct frontend domain
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight
  credentials: true, // Allow credentials (cookies/auth headers)
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  optionsSuccessStatus: 204 // Status for successful OPTIONS requests
};

app.use(cors(corsOptions));

// **Handle preflight requests globally**
app.options('*', cors(corsOptions)); // Handle preflight across all routes

// Compress response bodies for better performance
app.use(compression());

// Rate limiting to prevent DDoS and brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Define routes
app.use('/api', userRoutes);

// Error handling for undefined routes
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Global error handler
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const message = error.message || 'Internal Server Error';

  // Log the error stack in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    console.error(error.stack);
  }

  res.status(statusCode).json({
    message,
    status: statusCode,
  });
});

// Graceful shutdown of the server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started on port ${process.env.PORT || 5000}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
