
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import fs from "fs/promises";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file in the server directory
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later."
});

const getPortfolioContext = async () => {
    try {
        const dataPath = path.resolve(process.cwd(), 'client/src/data/data.ts');
        // Read the file, remove exports and imports to clean it up for the LLM
        const dataContent = (await fs.readFile(dataPath, 'utf-8'))
            .replace(/export const /g, 'const ')
            .replace(/import .* from .*/g, '');

        const context = `
        Here is the portfolio data of the professional you are representing.
        Use this information to ground your response and connect the proposed solution
        to their actual skills and experience.

        --- START PORTFOLIO DATA ---
        ${dataContent}
        --- END PORTFOLIO DATA ---
        `;
        return context;
    } catch (error) {
        console.error("Error reading portfolio data:", error);
        return "No portfolio context available.";
    }
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.use("/api", apiLimiter);

  app.get("/api/user-data", (req: Request, res: Response) => {
    res.json({
      name: "Mohammed Aamir Shuaib",
      title: "Generative AI Specialist",
      experience: "4+ years"
    });
  });

  app.post("/api/generate-pitch", async (req: Request, res: Response) => {
    const { problem } = req.body;

    if (!problem || typeof problem !== 'string' || problem.length < 10) {
      return res.status(400).json({ success: false, message: "A detailed problem description is required (minimum 10 characters)." });
    }

    try {
      const portfolioContext = await getPortfolioContext();

      const systemPrompt = `
        You are an expert AI and Data Science consultant acting as a "Project Pitch Generator" for a professional's portfolio website.
        Your task is to analyze a business problem submitted by a potential client or recruiter and generate a concise, compelling project proposal.

        **CRITICAL INSTRUCTIONS:**
        1.  **Analyze the User's Problem:** Understand the core business need described by the user.
        2.  **Propose a Concrete Solution:** Devise a specific, actionable AI, Data Science, or Automation solution. Be creative but realistic.
        3.  **Leverage the Portfolio:** You MUST connect your proposed solution directly to the professional's skills, technologies, and, most importantly, their past project experience. **Reference one or more specific projects by name (e.g., "[[VOC Complaint Analyzer]]")** from their resume.
        4.  **Recommend Technologies:** List a relevant tech stack for the solution, ensuring it aligns with the professional's expertise shown in the portfolio data.
        5.  **Maintain a Professional Tone:** Write in a clear, confident, and consultative voice.
        6.  **Format with Markdown:** Use markdown for headings, bold text, and lists to structure the output clearly. Do not wrap the entire response in a code block.

        **PORTFOLIO CONTEXT:**
        ${portfolioContext}
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Here is the business problem: "${problem}"`,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      });
      
      const pitch = completion.choices[0].message.content;

      res.status(200).json({ success: true, pitch: pitch });

    } catch (error: any) {
      console.error("Error in /api/generate-pitch:", error);
      if (error.response) {
          console.error(error.response.status, error.response.data);
          return res.status(500).json({ success: false, message: "An error occurred while communicating with the AI service." });
      }
      res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
  });

  app.post("/api/contact", (req: Request, res: Response) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    console.log("Contact form submission:", { name, email, message });
    return res.status(200).json({
      success: true,
      message: "Thank you for your message. I'll get back to you soon!"
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
