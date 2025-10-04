import { useState, ReactNode } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Wand2, Loader } from "lucide-react";

// More robust parser for the AI's markdown response
const renderFormattedPitch = (text: string) => {

    // Function to parse a single line for bold text
    const parseInlineFormatting = (line: string): ReactNode[] => {
        // Split the line by the bold markdown `**text**`
        const parts = line.split(/(\*\*.*?\*\*)/g);

        return parts.map((part, index) => {
            // Check if the part is bolded text
            if (part.startsWith('**') && part.endsWith('**')) {
                // Return a <strong> element, removing the asterisks
                return <strong key={index} className="text-white font-semibold">{part.substring(2, part.length - 2)}</strong>;
            }
            // Otherwise, return the text part as is
            return part;
        });
    };

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const elements: ReactNode[] = [];
    let listItems: ReactNode[] = [];

    lines.forEach((line, index) => {
        line = line.trim();

        // Flush list items if the current line is not a list item
        if (!line.startsWith('- ') && !line.startsWith('* ') && listItems.length > 0) {
            elements.push(<ul key={`ul-${index}`} className="space-y-2 mt-2 mb-4 pl-5 list-disc list-outside">{listItems}</ul>);
            listItems = [];
        }

        if (line.startsWith('# ')) {
            elements.push(<h2 key={index} className="text-2xl font-bold text-cyan-300 mt-8 mb-4 border-b border-gray-700 pb-2">{parseInlineFormatting(line.substring(2))}</h2>);
        } else if (line.startsWith('## ')) {
            elements.push(<h3 key={index} className="text-xl font-semibold text-cyan-400 mt-6 mb-3">{parseInlineFormatting(line.substring(3))}</h3>);
        } else if (line.startsWith('### ')) {
            elements.push(<h4 key={index} className="text-lg font-semibold text-white mt-4 mb-2">{parseInlineFormatting(line.substring(4))}</h4>);
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
            listItems.push(<li key={index} className="text-gray-300 leading-relaxed">{parseInlineFormatting(line.substring(2))}</li>);
        } else {
            elements.push(<p key={index} className="text-gray-300 leading-relaxed my-2">{parseInlineFormatting(line)}</p>);
        }
    });

    // After the loop, flush any remaining list items
    if (listItems.length > 0) {
        elements.push(<ul key="ul-final" className="space-y-2 mt-2 mb-4 pl-5 list-disc list-outside">{listItems}</ul>);
    }

    return elements;
};


export const ProjectPitchGenerator = () => {
  const [businessProblem, setBusinessProblem] = useState("");
  const [projectPitch, setProjectPitch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGeneratePitch = async () => {
    if (!businessProblem) return;

    setIsLoading(true);
    setProjectPitch("");
    setError("");

    try {
      const response = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem: businessProblem }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An unknown error occurred while fetching the pitch.");
      }

      setProjectPitch(data.pitch);

    } catch (error: any) {
      console.error("Error generating project pitch:", error);
      setError(error.message || "Sorry, I encountered an error. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Removed the redundant h3 and p tags from here
    <div className="p-4 bg-gray-900/50 rounded-lg w-full max-w-3xl mx-auto">
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

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-900/40 text-red-300 border border-red-700 rounded-lg"
        >
          <p className="font-semibold">An Error Occurred</p>
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {projectPitch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-5 bg-gray-800/70 rounded-lg border border-gray-700"
        >
          <div className="w-full prose prose-invert">
             {renderFormattedPitch(projectPitch)}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectPitchGenerator;
