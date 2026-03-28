// Import assets
import NLPImage from "@attached/NLP.jpg";
import TimeSeriesImage from "@attached/time_series.png";
import SalaryWiseImage from "@attached/SalaryWise.jpg";
import LendingClubImage from "@attached/lending_club.png";
import CNNFilterImage from "@attached/block1_conv1_filter27.png";
import ChatPDFImage from "@attached/chat_with_PDF.png";
import FirstAmericanLogo from "@attached/first_american_india_logo.jpeg";
import ConvergyticsLogo from "@attached/convergytics_solutions_logo.jpeg";
import clevrlogo from "@asset/clevr.png?url";
import quationlogo from "@asset/quation.jpeg?url";


export const skillsData = {
  coreSkills: [
    { name: "Generative AI & LLMs", value: 4.4 },
    { name: "RAG Systems", value: 4.3 },
    { name: "LLM Evaluation", value: 4.2 },
    { name: "Agentic AI Systems", value: 4.2 },
    { name: "Machine Learning", value: 3.8 },
    { name: "MLOps & LLMOps", value: 3.8 },
    { name: "ETL Pipelines", value: 4.0 },
    { name: "AI Application Development", value: 4.0 },
    { name: "Data Visualization", value: 4.6 }
  ],
  technicalSkills: [
    { name: "Python", value: 4.5 },
    { name: "SQL", value: 4.6 },
    { name: "LangChain", value: 4.2 },
    { name: "LangGraph", value: 4.2 },
    { name: "LlamaIndex", value: 4.2 },
    { name: "DSPy", value: 4.0 },
    { name: "Prompt Engineering", value: 4.4 },
    { name: "Vector Databases", value: 4.3 },
    { name: "Hugging Face", value: 4.0 },
    { name: "Git", value: 4.2 },
    { name: "Docker", value: 4.0 },
    { name: "Apache Airflow", value: 3.8 },
    { name: "MLflow", value: 3.6 },
    { name: "Kubernetes", value: 3.8 },
    { name: "API Testing (Postman)", value: 4.0 },
    { name: "AWS & Azure", value: 3.6 }
  ],
  softSkills: [
    { name: "Conflict Management", value: 4.0 },
    { name: "Analytical Thinking", value: 4.5 },
    { name: "Leadership", value: 4.0 },
    { name: "Communication", value: 4.5 },
    { name: "Project Management", value: 4.2 },
    { name: "Problem Solving", value: 4.6 },
    { name: "Collaboration", value: 4.4 }
  ],
};

// Restructured experience data to group by company
export const experienceData = [
  {
    id: 1,
    company: "Quation Solutions Private Limited",
    companyPeriod: "May 2023 - Present",
    location: "Bengaluru",
    color: "bg-blueAccent",
    textColor: "text-blueAccent",
    logo: quationlogo,
    logoType: "image",
    positions: [
      {
        id: 101,
        role: "Senior Consultant, Data Science",
        period: "May 2025 - Present",
        details: [
          "Leading development of agentic AI systems across industries",
          "Built a social intelligence platform scaling 7.5K → 15K records/day (~90% accuracy)",
          "Designed multi-agent pipelines for automation and insights",
          "Reduced processing time by 60%+ and improved data quality by 30%+"
        ],
        projects: [
          {
            title: "Agentic Social Listening & Growth Intelligence Platform",
            sections: [
              { title: "Overview", points: ["Built and scaled an agentic social listening system to identify growth and competitive signals from large-scale Twitter data"] },
              { title: "Architecture & System Design", points: ["Multi-agent pipeline (LangGraph) for ingestion → deduplication → entity extraction → classification → signal generation", "Transitioned from linear workflow to stateful agentic architecture"] },
              { title: "Modeling & Optimization", points: ["DSPy (SIMBA + CoT) for classification optimization", "Hybrid model usage (GPT-OSS, Mistral, LLaMA)"] },
              { title: "Data Engineering", points: ["Semantic deduplication using embeddings + vector search (PGVector with HNSW)"] },
              { title: "Impact", points: ["Scaled from 7.5K → 15K records/day", "Reduced processing time by 60%", "Improved accuracy from ~80% → ~90%", "Increased actionable insights by 20–25%"] }
            ],
            techStack: "Python, LangGraph, DSPy (SIMBA, CoT), GPT-OSS (20B/120B), Mistral, LLaMA, Nomic Embeddings, PGVector (HNSW), SQL, Langfuse"
          },
          {
            title: "VOC Complaint Intelligence System",
            sections: [
              { title: "Overview", points: ["Built agentic pipelines for analyzing customer complaints in automotive domain"] },
              { title: "Capabilities", points: ["Classification, sentiment analysis, auto-tagging, emotion detection"] },
              { title: "Integration", points: ["Real-time dashboards for CX monitoring"] },
              { title: "Impact", points: ["Reduced manual triage effort", "Improved response time"] }
            ],
            techStack: "Python, OpenAI APIs, NLP, Sentiment Analysis, Langfuse, BI Dashboarding Tools"
          },
          {
            title: "Data & Email Processing Automation",
            sections: [
              { title: "Overview", points: ["Automated extraction and processing of purchase orders and invoices from emails"] },
              { title: "System Design", points: ["Handled PDFs, Excel files, and email attachments"] },
              { title: "Automation", points: ["Scheduled workflows for continuous processing"] },
              { title: "Impact", points: ["~95% accuracy", "Reduced manual effort significantly"] }
            ],
            techStack: "Python, Java, Windows Task Scheduler, PDF Processing, Excel Processing, SQL Database, Outlook Email Automation"
          }
        ]
      },
      {
        id: 102,
        role: "Consultant, Data Science",
        period: "May 2024 - April 2025",
        details: [
          "Built RAG-based GenAI systems for data querying and automation",
          "Reduced manual effort by 30–70% across workflows",
          "Developed AI tools for code review, compliance, and analytics",
        ],
        projects: [
          {
            title: "RAG-Based Data Analysis Assistant",
            sections: [
              { title: "Overview", points: ["Built GenAI chatbot for querying Marketing Mix Modeling data"] },
              { title: "Capabilities", points: ["Natural language queries → SQL generation", "Retrieval over structured and unstructured data"] },
              { title: "Impact", points: ["40% faster insights", "60% reduction in SQL requests"] }
            ],
            techStack: "gpt-4o, gpt-4o-mini, PostgreSQL, Vector Database, Langfuse, Custom RAG Pipeline"
          },
          {
            title: "AI-Powered Web Scraping & Compliance Assistant",
            sections: [
              { title: "Overview", points: ["Built LLM-powered agent for automated web data extraction"] },
              { title: "Capabilities", points: ["Link analysis and compliance workflows"] },
              { title: "Impact", points: ["50% reduction in manual effort"] }
            ],
            techStack: "gpt-4o, gpt-4o-mini, Playwright, Langfuse, Custom GenAI Pipelines"
          },
          {
            title: "GenAI Workflow Automation Bot (Jira)",
            sections: [
              { title: "Overview", points: ["Automated agile workflows including story creation and planning"] },
              { title: "Impact", points: ["30% improvement in team efficiency"] }
            ],
            techStack: "gpt-4o, gpt-4o-mini, Jira API, Langfuse, Milvus DB"
          },
          {
            title: "GenAI Code Review System",
            sections: [
              { title: "Overview", points: ["Automated code review, cleaning, and vulnerability detection"] },
              { title: "Impact", points: ["Improved development speed by ~30%"] }
            ],
            techStack: "OpenAI o3-mini, GitLab API, GitLab CI/CD, Langfuse, Custom LLMOps Pipelines"
          },
          {
            title: "Data Catalog Intelligence Assistant",
            sections: [
              { title: "Overview", points: ["Multi-agent RAG system for querying enterprise data"] },
              { title: "Capabilities", points: ["Query SQL + PDFs + Excel in natural language"] },
              { title: "Impact", points: ["Reduced data retrieval time by ~70%"] }
            ],
            techStack: "gpt-4o, Milvus DB, Langchain, Neo4j, FlashRank, SQL, Langfuse, Google AI"
          }
        ]
      },
      {
        id: 103,
        role: "Consultant, Data Analyst / Data Engineer",
        period: "May 2023 - Apr 2024",
        details: [
          "Built ETL pipelines improving data retrieval speed by 60%",
          "Delivered analytics with 97–100% accuracy for decision-making",
          "Enabled targeted marketing through data-driven segmentation",
        ],
        projects: [
          {
            title: "Lead Generation & Marketing Data Platform",
            sections: [
              { title: "Overview", points: ["Built ETL pipelines and analytics systems for marketing data"] },
              { title: "Performance", points: ["Improved data retrieval speed by ~60%", "Optimized database schema by ~30%"] },
              { title: "Impact", points: ["Enabled targeted campaigns and segmentation"] }
            ],
            techStack: "Python, PostgreSQL, SQL, Excel, Data Pipelines"
          }
        ]
      },
    ],
    awards: [],
  },
  {
    id: 2,
    company: "Convergytics Solutions Private Limited",
    companyPeriod: "Jan 2022 - May 2023",
    location: "Bengaluru",
    color: "bg-purpleAccent",
    textColor: "text-purpleAccent",
    logo: ConvergyticsLogo,
    logoType: "image",
    positions: [
      {
        id: 201,
        role: "Business Consultant",
        period: "May 2022 - May 2023",
        details: [
          "Reduced data processing time by 50% through automation",
          "Delivered insights for marketing and retention strategies",
          "Conducted A/B testing and hypothesis-driven analysis",
        ],
      },
      {
        id: 202,
        role: "Intern",
        period: "Jan 2022 - Apr 2022",
        details: [
          "Supported data cleaning, transformation, and analysis using SQL, Excel, and Python",
          "Contributed to marketing and sales analytics workflows",
          "Assisted in generating actionable insights from large datasets",
        ],
      },
    ],
    awards: ["🏆 2023 - Fresher of the Year Award"],
  },
  {
    id: 3,
    company: "CLEVR DE GmbH",
    companyPeriod: "Sep 2021 - Oct 2021",
    location: "Sankt Inbert, Germany",
    color: "bg-blueAccent",
    textColor: "text-blueAccent",
    logo: clevrlogo,
    logoType: "image",
    positions: [
      {
        id: 301,
        role: "Junior Consultant",
        period: "Sep 2021 - Oct 2021",
        details: [
          "Contributed to internal application development and implementation initiatives",
          "Improved operational efficiency by ~15%",
        ],
      },
    ],
    awards: [],
  },
  {
    id: 4,
    company: "First American (India)",
    companyPeriod: "Jun 2017 - Aug 2017",
    location: "Bengaluru",
    color: "bg-orangeAccent",
    textColor: "text-orangeAccent",
    logo: FirstAmericanLogo,
    logoType: "image",
    positions: [
      {
        id: 401,
        role: "Graduate Trainee",
        period: "Jun 2017 - Aug 2017",
        details: [
          "Supported transaction and analytics services for real estate and mortgage datasets",
          "Performed data mining and analysis for business operations",
        ],
      },
    ],
    awards: [],
  },
];

export const projectsData = [
  {
    id: 1,
    title: "Natural Language Processing",
    description:
      "Implementation of different NLP Models used for text analysis that I had done during my Masters Degree.",
    image: NLPImage,
    githubUrl: "https://github.com/vijitVM/NLP",
  },
  {
    id: 2,
    title: "Business Analytics",
    description:
      "Implementation of Time Series analysis problem in which we had to forecast the next 3 months future dates. This was done during my Masters Degree.",
    image: TimeSeriesImage,
    githubUrl: "https://github.com/vijitVM/Machine-Learning-",
  },
  {
    id: 3,
    title: "Lending Club Loan Analysis",
    description:
      "Analysis of Lending Club loan data where we had to predict if a borrower will default the loan based on his credit history.",
    image: LendingClubImage,
    githubUrl: "https://github.com/vijitVM/Lending-Club",
  },
  {
    id: 4,
    title: "CNN Filter Visualization",
    description:
      "Visualization of the Filters of a CNN VGG16 Model using Random Generated Images using the Gradient Ascent Algorithm.",
    image: CNNFilterImage,
    githubUrl: "https://github.com/vijitVM/CNN-Filter-Visulization",
  },
  {
    id: 5,
    title: "Chat With PDF's",
    description:
      "A simple app that uses OpenAI, HuggingFace and Langchain to Chat with PDF's, allowing users to ask questions and get answers from documents.",
    image: ChatPDFImage,
    githubUrl: "https://github.com/vijitVM/Chat-with-PDF",
  },

  {
    id: 6,
    title: "SalaryWise AI",
    description:
      "An Intelligent Financial Management Powerd By AI.",
    image: SalaryWiseImage,
    githubUrl: "https://github.com/vijitVM/salarywise-ai",
    liveUrl: "https://salarywise-ai.onrender.com/",
  },
];

export const educationData = {
  formal: [
    {
      id: 1,
      degree: "Masters in Data Analytics",
      institution: "University of Hildesheim",
      period: "2017 - 2020",
      year: "2020",
      details:
        "Post Graduate program with Major in Data Analytics and Data Science",
      score: "GPA - 3.25/5",
    },
    {
      id: 2,
      degree: "Bachlelor Of Computer Application",
      institution: "Jain University",
      period: "2014 - 2017",
      year: "2017",
      details: "3 Year BCA with Major in Data Analytics",
      score: "CGPA - 8.625/10",
    },
  ],
  certifications: [
    {
      id: 1,
      name: "Neo4j Professional Certificate",
      issuer: "Neo4j",
      logo: "N4J",
      colorClass: "bg-gray-700",
    },
    {
      id: 2,
      name: "AI Agents Course",
      issuer: "Hugging Face",
      logo: "HF",
      colorClass: "bg-gray-700",
    },
    {
      id: 3,
      name: "Generative AI with Large Language Models",
      issuer: "DeepLearning.AI",
      logo: "DL",
      colorClass: "bg-gray-700",
    },
    {
      id: 4,
      name: "Generative AI for Everyone",
      issuer: "DeepLearning.AI",
      logo: "DL",
      colorClass: "bg-gray-700",
    },
    {
      id: 5,
      name: "Google Data Analytics Certificate",
      issuer: "Coursera",
      logo: "CS",
      colorClass: "bg-blue-700",
    },
  ],
};
