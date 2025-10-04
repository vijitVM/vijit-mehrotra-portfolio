import OpenAI from 'openai';

// Initialize the OpenAI client, which will automatically use the
// OPENAI_API_KEY from your environment variables.
const openai = new OpenAI();

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { businessProblem } = req.body;

  if (!businessProblem) {
    return res.status(400).json({ error: 'Business problem is required' });
  }

  try {
    const systemPrompt = `
      As an expert project manager and technology consultant, create a detailed, professional project proposal based on the following business problem.
      The proposal should be well-structured, clear, and impressive to a potential client. Your name is Gemini, an AI assistant.

      The response must follow this exact Markdown structure:
      # A catchy and relevant title for the project
      ## 1. Business Problem Analysis
      (Analyze the user's provided problem in detail)
      ## 2. Proposed Solution
      (Propose a specific, actionable technology-based solution. Be creative and practical.)
      ### Key Features:
      (Use a bulleted list to highlight the core features of your proposed solution. Use Markdown for bullets, e.g., "- Feature 1")
      ## 3. Expected Impact & ROI
      (Describe the expected positive outcomes, return on investment, and benefits of implementing the solution. Be specific if possible.)
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the business problem: "${businessProblem}"` },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const pitch = completion.choices[0]?.message?.content?.trim();

    if (!pitch) {
        throw new Error("The AI model did not return a valid response.");
    }

    res.status(200).json({ pitch });

  } catch (error: any) {
    console.error("AI generation failed:", error);
    // Provide a more specific error message if available
    const errorMessage = error.response ? error.response.data.error.message : error.message;
    res.status(500).json({ error: `Failed to generate AI pitch: ${errorMessage}` });
  }
}
