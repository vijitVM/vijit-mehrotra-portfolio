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
    { name: "RAG Systems", value: 4.4 },
    { name: "LLM Evaluation", value: 4.2 },
    { name: "Agentic AI Systems", value: 4.2 },
    { name: "Machine Learning", value: 3.8 },
    { name: "MLOps & LLMOps", value: 3.8 },
    { name: "ETL Pipelines", value: 4.0 },
    { name: "AI Application Development", value: 4.0 },
    { name: "Data Visualization", value: 4.3 }
  ],
  technicalSkills: [
    { name: "Python", value: 4.4 },
    { name: "SQL", value: 4.2 },
    { name: "LangChain", value: 4.4 },
    { name: "LangGraph", value: 4.0 },
    { name: "LlamaIndex", value: 4.0 },
    { name: "DSPy", value: 4.0 },
    { name: "Prompt Engineering", value: 4.3 },
    { name: "Vector Databases", value: 4.3 },
    { name: "Git", value: 4.0 },
    { name: "Hugging Face", value: 4.0 },
    { name: "Docker", value: 4.0 },
    { name: "Apache Airflow", value: 3.8 },
    { name: "MLflow / Langfuse", value: 3.8 },
    { name: "Kubernetes", value: 3.8 },
    { name: "API Testing (Postman)", value: 3.8 },
    { name: "AWS & Azure", value: 3.6 }
  ],
  softSkills: [
    { name: "Conflict Management", value: 4.0 },
    { name: "Analytical Thinking", value: 4.4 },
    { name: "Leadership", value: 4.0 },
    { name: "Communication", value: 4.1 },
    { name: "Project Management", value: 4.2 },
    { name: "Problem Solving", value: 4.2 },
    { name: "Collaboration", value: 4.2 }
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
        role: "Senior Consultant, GenAI / LLM Engineer",
        period: "May 2025 - Present",
        details: [
          "Architecting agentic AI systems for enterprise automation in Healthcare and FMCG",
          "Spearheaded a social intelligence platform scaling to 15K records/day at 90% accuracy",
          "Orchestrating multi-agent pipelines to turn complex data into actionable business intelligence"
        ],
        projects: [
          {
            title: "Healthcare Field Intelligence GenAI Assistant",
            sections: [
              { title: "The Enterprise Challenge", points: ["District Managers, HCPs, and Sales reps struggled to query isolated healthcare datasets and unstructured context, spending hours on manual search."] },
              { title: "Production System Design", points: ["Architected a secure, multi-persona RAG system connecting LangChain and ChromaDB with Redshift and Cube.js contextual querying."] },
              { title: "LLMOps & Telemetry", points: ["Optimized prompt compiler graphs to slash response latencies from ~35s down to <10s; integrated Langfuse for absolute real-time trace tracking and quality assurance."] },
              { title: "Measurable Business Impact", points: ["Response accuracy increased by 30% while cutting manual lookups by 60–70%, enabling direct, role-based strategic decisions."] }
            ],
            techStack: "Python, LangChain, ChromaDB, Azure OpenAI, AWS, Amazon Redshift, Cube.js, Langfuse"
          },
          {
            title: "Agentic Social Listening System",
            sections: [
              { title: "The Enterprise Challenge", points: ["IT Client could not parse massive, noisy competitive signals from unstructured Twitter streams at scale, suffering from high duplication and weak classification."] },
              { title: "Production System Design", points: ["Designed a stateful multi-agent pipeline using LangGraph to automate signal ingestion → deduplication → classification → intelligence generation.", "Engineered hybrid vector search using PGVector with HNSW index for millisecond-level deduplication."] },
              { title: "LLMOps & Telemetry", points: ["Programmatically optimized prompt structures using DSPy (SIMBA + Chain-of-Thought) across hybrid open/closed-source models (GPT, LLaMA, Mistral)."] },
              { title: "Measurable Business Impact", points: ["Scaled signal processing capacity by 100% (from 7.5K to 15K records/day) while boosting extraction accuracy to 90%."] }
            ],
            techStack: "Python, LangGraph, DSPy (SIMBA, CoT), GPT-OSS, Mistral, LLaMA, Nomic Embeddings, PGVector (HNSW), SQL, Langfuse"
          },
          {
            title: "Growth Bets: Batch Intelligence Platform",
            sections: [
              { title: "The Enterprise Challenge", points: ["Strategic business validation of high-potential growth initiatives was bottlenecked by slow, manual analysis of market and regulatory reports."] },
              { title: "Production System Design", points: ["Architected high-throughput batch pipelines orchestrated by autonomous agent crews using CrewAI to parallelize deep-dive signal validation."] },
              { title: "LLMOps & Telemetry", points: ["Integrated unified tracing with Langfuse to monitor cost, token consumption, and agent drift across large batch runs."] },
              { title: "Measurable Business Impact", points: ["Reduced validation turnaround time by 60% and accelerated delivery of qualified strategic growth bets by 20–25%."] }
            ],
            techStack: "Python, CrewAI, SQL, Batch Processing Pipelines, LLaMA, Langfuse"
          },
          {
            title: "VOC Complaint Intelligence System",
            sections: [
              { title: "The Enterprise Challenge", points: ["Automotive customer feedback and complaints in public channels were unorganized, leading to slow customer-experience response rates and expensive manual triage."] },
              { title: "Production System Design", points: ["Built agentic NLP pipelines utilizing OpenAI models for emotional analytics, automatic sentiment tagging, and complaint severity categorization."] },
              { title: "LLMOps & Telemetry", points: ["Connected pipelines to live CX dashboards for real-time threat-monitoring and alert triggers."] },
              { title: "Measurable Business Impact", points: ["Eliminated manual customer triage and halved internal response times to high-risk complaints."] }
            ],
            techStack: "Python, OpenAI APIs, NLP, Sentiment Analysis, Langfuse, BI Dashboarding Tools"
          },
          {
            title: "Data & Email Processing Automation",
            sections: [
              { title: "The Enterprise Challenge", points: ["Manual extraction of purchase orders and invoices from dense email threads and multi-format attachments was slow, error-prone, and delayed financial matching."] },
              { title: "Production System Design", points: ["Engineered scheduled document processing agents handling PDFs, Excel files, and attachments using Java and Python."] },
              { title: "LLMOps & Telemetry", points: ["Integrated continuous transaction logging and email-trigger webhooks for full auditability."] },
              { title: "Measurable Business Impact", points: ["Achieved a 95% PO ingestion accuracy rate and saved dozens of manual accounting hours weekly."] }
            ],
            techStack: "Python, Java, Windows Task Scheduler, PDF Processing, Excel Processing, SQL Database, Outlook Email Automation"
          }
        ]
      },
      {
        id: 102,
        role: "Consultant, Data Science - GenAI / LLM Systems",
        period: "May 2024 - April 2025",
        details: [
          "Built RAG-based GenAI systems for data querying and automation",
          "Reduced manual effort by 30–70% across workflows",
          "Developed AI tools for code review, compliance, and analytics"
        ],
        projects: [
          {
            title: "RAG-Based Data Analysis Assistant",
            sections: [
              { title: "The Enterprise Challenge", points: ["Marketing Mix Modeling teams spent too much time manually writing SQL queries to query multi-source relational databases and unstructured catalog reports."] },
              { title: "Production System Design", points: ["Built a GenAI chatbot utilizing natural language to SQL code compilation pipelines, executing secure queries over PostgreSQL databases."] },
              { title: "Measurable Business Impact", points: ["Sped up insight retrieval by 40% and reduced manual SQL query requests from MMM teams by 60%."] }
            ],
            techStack: "gpt-4o, gpt-4o-mini, PostgreSQL, Vector Database, Langfuse, Custom RAG Pipeline"
          },
          {
            title: "AI-Powered Web Scraping & Compliance Assistant",
            sections: [
              { title: "The Enterprise Challenge", points: ["Compliance teams manually parsed deep-nested websites and legal text to check regulatory standards, leading to slow risk mitigation."] },
              { title: "Production System Design", points: ["Developed a Playwright-based autonomous scraping agent running semantic parsing of scraped document graphs for compliance validation."] },
              { title: "Measurable Business Impact", points: ["Halved manual compliance audit effort and improved report validation speed."] }
            ],
            techStack: "gpt-4o, gpt-4o-mini, Playwright, Langfuse, Custom GenAI Pipelines"
          },
          {
            title: "GenAI Workflow Automation Bot (Jira)",
            sections: [
              { title: "The Enterprise Challenge", points: ["Product management spent dozens of hours manually writing agile user stories, defining requirements, and mapping project sprints."] },
              { title: "Production System Design", points: ["Created a Jira API integration bot compiling requirements into full user stories and automating ticket generation with semantic sprint mapping."] },
              { title: "Measurable Business Impact", points: ["Boosted development team agile planning efficiency by 30%."] }
            ],
            techStack: "gpt-4o, gpt-4o-mini, Jira API, Langfuse, Milvus DB"
          },
          {
            title: "GenAI Code Review System",
            sections: [
              { title: "The Enterprise Challenge", points: ["Manual code reviews slowed down the CI/CD pipeline and occasionally missed subtle architectural vulnerabilities or code smells."] },
              { title: "Production System Design", points: ["Designed a GitLab CI/CD pipeline agent using OpenAI models to automate line-by-line syntax checking, security checks, and code-cleanup recommendations."] },
              { title: "Measurable Business Impact", points: ["Decreased overall manual pull request review time and boosted code delivery speeds by ~30%."] }
            ],
            techStack: "OpenAI o3-mini, GitLab API, GitLab CI/CD, Langfuse, Custom LLMOps Pipelines"
          },
          {
            title: "Data Catalog Intelligence Assistant",
            sections: [
              { title: "The Enterprise Challenge", points: ["Data governance analysts struggled to navigate sparse data catalogs, Excel documentation, and PDF schema reports scattered across platforms."] },
              { title: "Production System Design", points: ["Engineered a multi-agent RAG system utilizing Neo4j graph databases, Milvus, and FlashRank rerankers for unified natural language schema search."] },
              { title: "Measurable Business Impact", points: ["Slashed enterprise data schema retrieval times by ~70%."] }
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
          "Enabled targeted marketing through data-driven segmentation"
        ],
        projects: [
          {
            title: "Lead Generation & Marketing Data Platform",
            sections: [
              { title: "The Enterprise Challenge", points: ["Sales and growth teams were throttled by slow, manual processing of high-volume marketing leads, resulting in delayed campaign attribution and high database indexing overhead."] },
              { title: "Production System Design", points: ["Engineered a robust, automated ETL processing framework using Python and optimized SQL routines to centralize multi-channel marketing metrics."] },
              { title: "Measurable Business Impact", points: ["Accelerated data ingestion and query execution times by 60%, reduced PostgreSQL schema overhead by 30%, and empowered marketing teams to trigger real-time, segment-targeted lead campaigns."] }
            ],
            techStack: "Python, PostgreSQL, SQL, Excel, Data Pipelines"
          }
        ]
      }
    ],
    awards: []
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
          "Conducted A/B testing and hypothesis-driven analysis"
        ]
      },
      {
        id: 202,
        role: "Intern",
        period: "Jan 2022 - Apr 2022",
        details: [
          "Supported data cleaning, transformation, and analysis using SQL, Excel, and Python",
          "Contributed to marketing and sales analytics workflows",
          "Assisted in generating actionable insights from large datasets"
        ]
      }
    ],
    awards: ["🏆 2023 - Fresher of the Year Award"]
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
          "Improved operational efficiency by ~15%"
        ]
      }
    ],
    awards: []
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
          "Performed data mining and analysis for business operations"
        ]
      }
    ],
    awards: []
  }
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

export const getProficiencyTier = (value: number): string => {
  if (value >= 4.3) return "Subject Matter Expert";
  if (value >= 4.0) return "Advanced Production";
  if (value >= 3.7) return "Strong Practice";
  return "Hands-on Capability";
};

export const getCompactTier = (value: number): string => {
  if (value >= 4.3) return "Expert";
  if (value >= 4.0) return "Advanced";
  if (value >= 3.7) return "Strong";
  return "Active";
};

