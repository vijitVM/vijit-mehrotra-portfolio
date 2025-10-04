import { useState, ReactNode } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Loader, Clipboard, Check } from "lucide-react";
import { PitchSkeleton } from "./PitchSkeleton";

const renderFormattedPitch = (text: string) => {

    const parseInlineFormatting = (line: string): ReactNode[] => {
        const parts = line.split(/(\*\*.*?\*\*)/g);

        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="text-white font-semibold">{part.substring(2, part.length - 2)}</strong>;
            }
            return part;
        });
    };

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const elements: ReactNode[] = [];
    let listItems: ReactNode[] = [];

    lines.forEach((line, index) => {
        line = line.trim();

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

    if (listItems.length > 0) {
        elements.push(<ul key="ul-final" className="space-y-2 mt-2 mb-4 pl-5 list-disc list-outside">{listItems}</ul>);
    }

    return elements;
};

const examplePrompts = [
    "We're an e-commerce store with a high cart abandonment rate. We need a way to offer a targeted discount to users before they leave the site.",
    "Our customer support team is overwhelmed with repetitive questions. We want to build a chatbot that can handle the most common queries automatically.",
    "We have a lot of sales data in spreadsheets, but we don't have an easy way to visualize it and identify trends. We need a dashboard to track our key metrics.",
];

export const ProjectPitchGenerator = () => {
  const [businessProblem, setBusinessProblem] = useState("");
  const [projectPitch, setProjectPitch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred.");
      }

      if (!response.body) {
        throw new Error("The response body is empty.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

        for (const line of lines) {
            const jsonStr = line.replace('data: ', '');
            try {
                const parsed = JSON.parse(jsonStr);
                setProjectPitch(prevPitch => prevPitch + parsed.content);
            } catch (e) {
                console.error("Failed to parse stream chunk:", e);
            }
        }
      }

    } catch (error: any) {
      console.error("Error generating project pitch:", error);
      setError(error.message || "Sorry, I encountered an error. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!projectPitch) return;
    navigator.clipboard.writeText(projectPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 bg-gray-900/50 rounded-lg w-full max-w-3xl mx-auto">
      <div className="mb-4">
        <Textarea
          placeholder="e.g., We're an e-commerce store with high cart abandonment..."
          value={businessProblem}
          onChange={(e) => setBusinessProblem(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white min-h-[120px] focus:ring-cyan-500"
          rows={5}
        />
      </div>

    <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Or try one of these examples:</p>
        <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, index) => (
                <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setBusinessProblem(prompt)}
                    className="text-gray-300 bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:text-white"
                >
                    {prompt.split(' ').slice(0, 5).join(' ') + '...'}
                </Button>
            ))}
        </div>
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
      
      <AnimatePresence mode="wait">
        {isLoading && !projectPitch && <PitchSkeleton key="skeleton" />}

        {projectPitch && (
            <motion.div
            key="pitch"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mt-6 p-5 bg-gray-800/70 rounded-lg border border-gray-700"
            >
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
                aria-label="Copy to clipboard"
            >
                {copied ? (
                <Check className="text-green-400" size={16} />
                ) : (
                <Clipboard className="text-gray-400" size={16} />
                )}
            </button>
            
            <div className="w-full prose prose-invert">
                {renderFormattedPitch(projectPitch)}
            </div>
            </motion.div>
        )}
       </AnimatePresence>

    </div>
  );
};

export default ProjectPitchGenerator;
