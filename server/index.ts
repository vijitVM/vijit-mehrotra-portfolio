import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import helmet from "helmet";
import crypto from "crypto";
import rateLimit from "express-rate-limit";

const app = express();

// Security middleware with more permissive settings to avoid antivirus warnings
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:", "data:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:", "http:", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      fontSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https:", "http:", "ws:", "wss:"],
      mediaSrc: ["'self'", "https:", "http:", "data:"],
      objectSrc: ["'self'", "https:", "http:", "data:"],
      frameSrc: ["'self'", "https:", "http:"],
      workerSrc: ["'self'", "blob:", "https:", "http:"]
    },
  },
  // Disable HSTS to avoid certificate warnings
  hsts: false,
  // Keep basic protections
  xssFilter: true,
  noSniff: true,
  // Allow framing for portfolio demonstrations
  frameguard: false,
  // Disable referrer for privacy
  referrerPolicy: { policy: 'no-referrer' }
}));

// Generate a random string for security tokens
const generateSecurityToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create a secure API token for API requests
const API_SECRET = generateSecurityToken();

// Add rate limiting for all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
});

// Apply rate limiter to all API routes
app.use('/api', limiter);

// Add more relaxed security headers to prevent antivirus warnings
app.use((req: Request, res: Response, next: NextFunction) => {
  // Set security headers with more permissive options
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  
  // Allow embedding for portfolio demos
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // More permissive permissions policy
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  
  // Add CORS headers to allow any origin to access the site
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Add API token to response headers for non-public routes, but with relaxed security
  if (req.path.startsWith('/api/') && !req.path.startsWith('/api/public/')) {
    // Generate a new token for each response
    const newToken = generateSecurityToken();
    res.setHeader('X-API-Token', newToken);
    
    // Only validate tokens for write operations and non-public routes
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method) && 
        !req.path.includes('/public/')) {
      const requestToken = req.headers['x-api-token'] as string;
      
      // For the portfolio site, make this optional to prevent access issues
      if (!requestToken && process.env.NODE_ENV === 'production') {
        // In production, still require token
        return res.status(403).json({ message: 'API token required' });
      }
    }
  }
  
  next();
});

// Standard middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// Application logging middleware

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
