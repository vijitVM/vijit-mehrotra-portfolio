export interface BuildingItem {
    type: "building" | "exploring" | "learning";
    content: string;
  }
  
  export const buildingData: BuildingItem[] = [
    {
      type: "building",
      content: "LLM Powered OCR Extraction" // Your current project
    },
    {
      type: "exploring",
      content: "OpenAI, Langchain, OpenCV" // Technology you're exploring
    },
    {
      type: "learning",
      content: "Exploring how LLMs enhance OCR text extraction" // Learning goal
    }
  ];
