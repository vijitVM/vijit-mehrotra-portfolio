export interface BuildingItem {
    type: "building" | "exploring" | "learning";
    content: string;
  }
  
  export const buildingData: BuildingItem[] = [
    {
      type: "building",
      content: "Self-healing AI agents" // Your current project
    },
    {
      type: "exploring",
      content: "OpenAI, Langchain and Langgraph for building AI agents" // Technology you're exploring
    },
    {
      type: "learning",
      content: "Exploring how self-healging AI Agents work" 
    }
      ];
