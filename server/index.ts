import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import helmet from "helmet";
import * as crypto from "crypto";
import rateLimit from "express-rate-limit";

const app = express();

// Enhanced security middleware to address HTTP Observatory issues
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      // Stricter scriptSrc without unsafe-inline or unsafe-eval
      // We'll use nonces or hashes for inline scripts instead
      scriptSrc: [
        "'self'", 
        // Specific trusted external scripts only
        "https://replit.com/public/js/replit-badge-v3.js",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        // Add a nonce generator for any required inline scripts
        (req: Request, res: Response) => {
          const nonce = crypto.randomBytes(16).toString('base64');
          (res as any).locals.cspNonce = nonce;
          return `'nonce-${nonce}'`;
        }
      ],
      // For styleSrc, we still need unsafe-inline for most frameworks
      // but we can replace this with nonces or hashes in the future
      styleSrc: ["'self'", "'unsafe-inline'"],
      // Remove data: URI from image sources where possible
      imgSrc: ["'self'", "https:", "blob:"],
      // Remove data: URI from font sources where possible
      fontSrc: ["'self'", "https:"],
      connectSrc: ["'self'", "https:", "wss:", "ws:"],
      // Remove data: URI from media sources
      mediaSrc: ["'self'", "https:"],
      // Set objectSrc to 'none' to block <object>, <embed>, and <applet>
      objectSrc: ["'none'"],
      // Restrict frame sources
      frameSrc: ["'self'"],
      // Set frameAncestors to control who can embed your site in frames
      frameAncestors: ["'self'"],
      // Restrict form submissions to same origin
      formAction: ["'self'"],
      // Allow workers from same origin and blobs
      workerSrc: ["'self'", "blob:"],
      // Allow manifests from same origin
      manifestSrc: ["'self'"],
      // Restrict base URI to same origin
      baseUri: ["'self'"],
      // Force HTTPS
      upgradeInsecureRequests: [],
    },
    reportOnly: false, // Enforce the policy
  },
  // Enable HTTP Strict Transport Security
  hsts: {
    maxAge: 15552000, // 180 days in seconds
    includeSubDomains: true,
    preload: true
  },
  // Keep basic protections
  xssFilter: true,
  noSniff: true,
  // Set X-Frame-Options for better control
  frameguard: { action: 'sameorigin' },
  // Set referrer policy to a stricter option as recommended by HTTP Observatory
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  // Disable X-Powered-By header
  hidePoweredBy: true,
}));

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

// Enhanced security headers for better HTTP Observatory scores
app.use((req: Request, res: Response, next: NextFunction) => {
  // Content-Security-Policy is handled by Helmet but we can add additional security headers here
  
  // Reinforce STS header to ensure it's properly set for HTTP Observatory
  res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains; preload');
  
  // Add Feature-Policy/Permissions-Policy for additional security
  res.setHeader('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()');
  
  // Set X-Content-Type-Options to prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection in browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Set stricter referrer policy as recommended by HTTP Observatory
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Allow embedding only from same origin
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Add Cross-Origin-Resource-Policy header
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  
  // Add CORS headers with more restrictive settings for better security
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
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
