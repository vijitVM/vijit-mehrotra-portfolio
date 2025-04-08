import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import rateLimit from "express-rate-limit";

// Configure rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again later."
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply rate limiting to all API routes
  app.use("/api", apiLimiter);
  
  // Simple API endpoint to get some basic data
  app.get("/api/user-data", (req: Request, res: Response) => {
    res.json({
      name: "Mohammed Aamir Shuaib",
      title: "Generative AI Specialist",
      experience: "4+ years"
    });
  });

  // Add sanitization for any form submissions (for contact form)
  app.post("/api/contact", (req: Request, res: Response) => {
    // In a real application, you'd want to validate and sanitize this input
    // and connect to a real email service
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    
    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    
    // In production, you would send an email here
    console.log("Contact form submission:", { name, email, message });
    
    // Return success
    return res.status(200).json({ 
      success: true, 
      message: "Thank you for your message. I'll get back to you soon!" 
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
