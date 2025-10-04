
import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const ProjectPitchGenerator = () => {
  const [problem, setProblem] = React.useState("");
  const [pitch, setPitch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGeneratePitch = async () => {
    setIsLoading(true);
    setPitch("");
    setError(null);

    try {
      const response = await fetch("/api/generate-pitch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problem }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "An unknown error occurred.");
      }

      setPitch(data.pitch);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8 bg-card/50 backdrop-blur-lg border-border/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Automated Project Pitch Generator</CardTitle>
        <CardDescription>
          Have a business problem? Describe it below, and my AI assistant will generate a project proposal outlining how I could help.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Textarea
            placeholder="e.g., 'My e-commerce store has a high rate of abandoned carts.'"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full text-base bg-background/70"
          />
          <Button onClick={handleGeneratePitch} disabled={isLoading || !problem}>
            {isLoading ? "Generating Pitch..." : "Generate Project Pitch"}
          </Button>
          {error && (
            <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-300">
              <p className="font-semibold">An Error Occurred:</p>
              <p>{error}</p>
            </div>
          )}
          {pitch && (
            <div className="prose prose-invert mt-4 max-w-none rounded-lg border border-border/30 bg-background/50 p-6">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{pitch}</ReactMarkdown>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
