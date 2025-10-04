import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectPitchGenerator } from "./ProjectPitchGenerator";
import { Wand2 } from 'lucide-react';

export const ProjectPitchGeneratorModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-8 bg-transparent border-cyan-500/30 hover:bg-cyan-900/40 text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
          <Wand2 className="mr-2 h-4 w-4" />
          Create a Project Proposal with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-full max-h-[90vh] bg-gray-900/90 backdrop-blur-sm border-gray-700 text-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 text-2xl">Automated Project Pitch Generator</DialogTitle>
          <DialogDescription className="text-gray-400">
            Have a business problem? Describe it below, and my AI assistant will generate a project proposal outlining how I could help.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4">
            <ProjectPitchGenerator />
        </div>
      </DialogContent>
    </Dialog>
  );
};
