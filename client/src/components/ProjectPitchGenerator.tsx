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
  const [error, setError] = useState("");

  const handleGeneratePitch = async () => {
    if (!businessProblem) return;

    setIsLoading(true);
    setProjectPitch("");
    setError("");

    try {
      const response = await fetch('/api/generate', { // Correct API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessProblem }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "An unknown error occurred while fetching the pitch.");
      }

      const data = await response.json();
      setProjectPitch(data.pitch);

    } catch (error: any) {
      console.error("Error generating project pitch:", error);
      setError(error.message || "Sorry, I encountered an error. Please check the console for details.");
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
          <div className="w-full">
             {renderFormattedPitch(projectPitch)}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectPitchGenerator;
