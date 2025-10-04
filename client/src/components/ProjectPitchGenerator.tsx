import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Wand2, Loader } from "lucide-react";

const renderFormattedPitch = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');

    const elements = lines.map((line, index) => {
        line = line.trim();

        // Headings (###, ##, #)
        if (line.startsWith('# ')) {
            return <h2 key={index} className="text-2xl font-bold text-cyan-300 mt-8 mb-4 border-b border-gray-700 pb-2">{line.substring(2)}</h2>;
        }
        if (line.startsWith('## ')) {
            return <h3 key={index} className="text-xl font-semibold text-cyan-400 mt-6 mb-3">{line.substring(3)}</h3>;
        }
        if (line.startsWith('### ')) {
            return <h4 key={index} className="text-lg font-semibold text-white mt-4 mb-2">{line.substring(4)}</h4>;
        }

        // Bullet points (-, *)
        if (line.startsWith('- ') || line.startsWith('* ')) {
            const content = line.substring(2);
            // Handle bolding within the list item
            const parts = content.split(/(\\\*\\\*.*?\\\*\\\*)/g);
            return (
                <li key={index} className="ml-5 list-disc list-outside text-gray-300 leading-relaxed">
                     {parts.map((part, partIndex) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={partIndex} className="text-white font-semibold">{part.replace(/\\\*\\\*/g, '')}</strong>;
                        }
                        return part;
                     })}
                </li>
            );
        }
        
        // Handle bold text within paragraphs
        const p_parts = line.split(/(\\\*\\\*.*?\\\*\\\*)/g);
        return (
            <p key={index} className="text-gray-300 leading-relaxed my-2">
                {p_parts.map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                         return <strong key={partIndex} className="text-white font-semibold">{part.replace(/\\\*\\\*/g, '')}</strong>
                    }
                    return part;
                })}
            </p>
        )
    });

    // Group consecutive list items into a single <ul>
    const groupedElements: JSX.Element[] = [];
    let currentList: JSX.Element[] = [];

    for (const el of elements) {
        if (el.type === 'li') {
            currentList.push(el);
        } else {
            if (currentList.length > 0) {
                groupedElements.push(<ul key={groupedElements.length} className="space-y-2 mt-2 mb-4">{currentList}</ul>);
                currentList = [];
            }
            groupedElements.push(el);
        }
    }
    if (currentList.length > 0) {
        groupedElements.push(<ul key={groupedElements.length} className="space-y-2 mt-2 mb-4">{currentList}</ul>);
    }

    return groupedElements;
};


export const ProjectPitchGenerator = () => {
  const [businessProblem, setBusinessProblem] = useState("");
  const [projectPitch, setProjectPitch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePitch = async () => {
    if (!businessProblem) return;

    setIsLoading(true);
    setProjectPitch(""); // Clear previous pitch

    try {
      // This is a placeholder for the actual API call. The response is formatted with Markdown.
      const response = await new Promise<string>((resolve) =>
        setTimeout(() => {
          const generatedPitch = `
# Project Proposal: Enhancing E-Commerce Conversion Rates

## 1. Business Problem Analysis
Your online store is experiencing a common but critical issue: **high traffic with low conversion rates**. This indicates that while your marketing is effective at attracting visitors, potential customers are hesitating or abandoning their carts before completing a purchase. Our analysis suggests that a targeted, real-time intervention is needed to convert this interest into revenue.

## 2. Proposed Solution
I propose the development of a **Behavioral Analysis and Smart Discount System**. This intelligent system will leverage machine learning to predict user intent and deliver a compelling offer to at-risk customers just before they leave your site.

### Key Features:
- **Real-Time Data Collection:** The system will utilize user behavior data, including page visit history, time spent on each page, mouse movement, and cart contents.
- **Predictive Behavioral Analysis:** We will implement a lightweight machine learning model that runs in the browser to identify patterns associated with cart abandonment. This includes rapid mouse movements towards the exit button or extended periods of inactivity.
- **Intelligent Pop-Up Trigger Logic:** A script will be developed to trigger a pop-up modal only when a user exhibits behavior indicating they are about to leave. This avoids disrupting engaged shoppers.
- **Dynamic & Personalized Offers:** The pop-up will present a dynamic discount (e.g., 10-15%) specifically for the items in the user's cart, creating a powerful and personalized incentive to complete the purchase.

## 3. Expected Impact & ROI
- **Increased Conversion Rate:** We project a **15-25% increase** in conversions from users who would have otherwise abandoned their carts.
- **Higher Customer Lifetime Value:** By converting hesitant shoppers, we not only save the sale but also create a positive brand interaction that encourages future purchases.
- **Actionable Customer Insights:** The system will provide valuable data on which products are most frequently abandoned and at what point in the customer journey, informing future marketing and pricing strategies.
`;
          resolve(generatedPitch.trim());
        }, 1500)
      );

      setProjectPitch(response);
    } catch (error) {
      console.error("Error generating project pitch:", error);
      setProjectPitch("Sorry, I encountered an error while generating the pitch. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="p-4 bg-gray-900/50 rounded-lg w-full max-w-3xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-2">
        Automated Project Pitch Generator
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Have a business problem? Describe it below, and my AI assistant will
        generate a project proposal outlining how I could help.
      </p>

      <div className="mb-4">
        <Textarea
          placeholder="e.g., We're an e-commerce store with high cart abandonment. We need a way to offer a discount to users before they leave."
          value={businessProblem}
          onChange={(e) => setBusinessProblem(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white min-h-[120px] focus:ring-cyan-500"
          rows={5}
        />
      </div>

      <Button
        onClick={handleGeneratePitch}
        disabled={isLoading || !businessProblem}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition-all duration-300 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader className="animate-spin mr-2" size={20} />
        ) : (
          <Wand2 className="mr-2" size={20} />
        )}
        {isLoading ? "Generating..." : "Generate Project Pitch"}
      </Button>

      {projectPitch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-5 bg-gray-800/70 rounded-lg border border-gray-700"
        >
          <div className="w-full">
             {renderFormattedPitch(projectPitch)}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectPitchGenerator;
