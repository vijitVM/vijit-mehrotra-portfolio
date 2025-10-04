import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import fs from "fs/promises";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later."
});

const getPortfolioContext = async () => {
    try {
        const dataPath = path.resolve(process.cwd(), 'client/src/data/data.ts');
        const dataContent = (await fs.readFile(dataPath, 'utf-8'))
            .replace(/export const /g, 'const ')
            .replace(/import .* from .*/g, '');

        const context = `
        Here is the portfolio data of the professional you are representing, Vijit Mehrotra.
        Use this information as the absolute source of truth for his skills and experience.

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

  // New endpoint for Job Fit Analysis
  app.post("/api/analyze-job-fit", async (req: Request, res: Response) => {
    const { jobDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.length < 50) {
      return res.status(400).json({ success: false, message: "A detailed job description is required (minimum 50 characters)." });
    }

    try {
      const portfolioContext = await getPortfolioContext();

      const systemPrompt = `
        You are an AI recruitment analyst creating a "Candidate Fit Report" for Vijit Mehrotra.
        Analyze the job description (JD) against his portfolio.

        **Report Structure:**
        1.  **Overall Match Score:** Start with a percentage score reflecting alignment.
        2.  **Critical Requirements Deconstruction:** Identify and list the top 5-7 core requirements from the JD.
        3.  **Evidence-Based Mapping:** For each requirement, map it to specific evidence from Vijit's portfolio. You MUST cite projects using the "[[Project Name]]" format.
        4.  **Growth Opportunities / Gap Analysis:** Identify requirements not directly met and frame them as growth opportunities, suggesting how his existing skills can bridge these gaps.
        5.  **Tailored Interview Questions:** Create 2-3 insightful questions for the recruiter based on the JD and Vijit's projects.

        **Instructions:**
        - Be evidence-based and professional.
        - Format the output as a single, clean markdown document.
        - The analysis should be persuasive but honest.

        **PORTFOLIO CONTEXT:**
        ${portfolioContext}
      `;

      const stream = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Here is the Job Description to analyze: 

---

${jobDescription}`,
          },
        ],
        max_tokens: 2048, 
        temperature: 0.4,
        stream: true,
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.end();

    } catch (error: any) {
      console.error("Error in /api/analyze-job-fit:", error);
      res.status(500).json({ success: false, message: "An internal server error occurred while analyzing the job description." });
    }
  });
  
  app.get("/api/user-data", (req: Request, res: Response) => {
    res.json({
      name: "Vijit Mehrotra",
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

      const stream = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
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
        stream: true,
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.end();

    } catch (error: any) {
      console.error("Error in /api/generate-pitch:", error);
      res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
  });

  app.post("/api/ask-assistant", async (req: Request, res: Response) => {
    const { question, history } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ success: false, message: "A question is required." });
    }

    try {
      const portfolioContext = await getPortfolioContext();

      const systemPrompt = `
        You are a helpful and friendly AI assistant for a professional's portfolio website.
        Your name is "Portfolio Assistant".
        Your ONLY purpose is to answer questions about the professional's work experience, projects, and skills, based exclusively on the context provided below.

        **CRITICAL INSTRUCTIONS:**
        1.  **Strictly Ground Your Answers:** Base all your answers STRICTLY on the provided portfolio data. DO NOT invent, hallucinate, or infer any information not present in the context.
        2.  **Be Conversational:** Answer in a natural, conversational, and helpful tone.
        3.  **Politely Decline Off-Topic Questions:** If the user asks a question that is not related to the professional's portfolio (e.g., "What is the weather like?", "Can you write a poem?", "Who are you?"), you MUST politely decline. A good response would be: "I'm sorry, I can only answer questions about the projects, skills, and experience detailed in this portfolio. How can I help you with that?"
        4.  **Keep It Concise:** Provide clear and concise answers.
        5.  **Refer to the Professional:** Refer to the owner of the portfolio as "the professional" or by his name, "Vijit Mehrotra".

        **PORTFOLIO CONTEXT:**
        ${portfolioContext}
      `;

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...(history || []).map((msg: { role: string; content: string }) => ({ role: msg.role, content: msg.content })),
        {
          role: "user",
          content: question,
        },
      ];


      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 500,
        temperature: 0.5,
        stream: true,
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.end();

    } catch (error: any) {
      console.error("Error in /api/ask-assistant:", error);
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
