
import { GoogleGenerativeAI } from "@google/generative-ai";

// IMPORTANT: In a real-world application, you must protect this API key.
// It should be stored in an environment variable and not hardcoded.
// For example: const API_KEY = process.env.GEMINI_API_KEY;
const API_KEY = "YOUR_API_KEY_HERE"; // <-- Replace with your actual key

const genAI = new GoogleGenerativeAI(API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { businessProblem } = req.body;

  if (!businessProblem) {
    return res.status(400).json({ error: 'Business problem is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      As an expert project manager and technology consultant, create a detailed, professional project proposal based on the following business problem.
      The proposal should be well-structured, clear, and impressive to a potential client.

      The structure should be:
      # A catchy and relevant title for the project
      ## 1. Business Problem Analysis
      (Analyze the user's provided problem in detail)
      ## 2. Proposed Solution
      (Propose a specific, actionable technology-based solution. Be creative and practical.)
      ### Key Features:
      (Use a bulleted list to highlight the core features of your proposed solution. Use Markdown for bullets, e.g., "- Feature 1")
      ## 3. Expected Impact & ROI
      (Describe the expected positive outcomes, return on investment, and benefits of implementing the solution. Be specific if possible.)

      Here is the business problem:
      "${businessProblem}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.status(200).json({ pitch: text });
  } catch (error) {
    console.error("AI generation failed:", error);
    res.status(500).json({ error: "Failed to generate AI pitch" });
  }
}
