export interface BuildingItem {
    type: "building" | "exploring" | "learning";
    content: string;
  }
  
export const buildingData: BuildingItem[] = [
  {
    type: "building",
    content: "Architecting self-healing, agentic workflows for enterprise automation"
  },
  {
    type: "exploring",
    content: "Advanced LLM orchestration patterns using LangGraph and DSPy for deterministic AI"
  },
  {
    type: "learning",
    content: "Optimizing for observability and reliability in production-grade multi-agent systems"
  }
];