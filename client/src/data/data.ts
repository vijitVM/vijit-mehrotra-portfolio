// Import assets
import DL from "../attached_assets/DeepLearning.AI.jpg";
import NLPImage from "../attached_assets/NLP.jpg";
import TimeSeriesImage from "../attached_assets/time_series.png";
import LendingClubImage from "../attached_assets/lending_club.png";
import CNNFilterImage from "../attached_assets/block1_conv1_filter27.png";
import ChatPDFImage from "../attached_assets/chat_with_PDF.png";

export const skillsData = {
  coreSkills: [
    { name: "Generative AI & LLMs", value: 4.5 },
    { name: "Machine Learning", value: 4.1 },
    { name: "NLP", value: 4.0 },
    { name: "CICD", value: 4.0 },
    { name: "Data Visualization", value: 4.6 },
    { name: "App Development", value: 3.5 },
    { name: "EDA", value: 4.2 },
    { name: "ML Ops", value: 3.2 },
    { name: "ETL Pipelines", value: 4.0 },
  ],
  technicalSkills: [
    { name: "Python", value: 4.5 },
    { name: "SQL", value: 4.5 },
    { name: "TensorFlow", value: 3.8 },
    { name: "LangChain", value: 4.2 },
    { name: "Git", value: 4.0 },
    { name: "Docker", value: 3.5 },
    { name: "Power BI", value: 3.2 },
    { name: "AWS & AZURE", value: 3.7 },
    { name: "MySQL", value: 4.3 },
  ],
  softSkills: [
    { name: "Conflict Management", value: 4.0 },
    { name: "Analytical Thinking", value: 4.7 },
    { name: "Leadership", value: 4.0 },
    { name: "Communication", value: 4.5 },
    { name: "Project Management", value: 4.2 },
    { name: "Problem Solving", value: 4.6 },
    { name: "Collaboration", value: 4.4 },
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
    logo: "QS",
    positions: [
      {
        id: 101,
        role: "Consultant, Data Science",
        period: "May 2024 - Present",
        details: [
          "Data Analysis Assistant: Built a RAG-based chatbot trained on Market Mix Modeling data to support brand and market analysis. Integrated LLMs, vector databases, and Langfuse for prompt monitoring and automated SQL generation. Built an end-to-end workflow with semantic search, query refinement, error handling, and data visualization to deliver marketing insights and optimize decision-making.(Technologies: gpt-4o-mini, gpt-4o,PostgreSQL, Custom GenAI, Langfuse)",
          "AI-Powered Web Scraping & Compliance Assistant: Built a GenAI-powered web scraping LLM agent to automate data extraction from websites based on user provided URL and description. The agent analyzes internal links to gather relevant insights and assists in answering predefined compliance-related questions.(Technologies: gpt-4o-mini, gpt-4o,Custom GenAI, Langfuse, Playwright)",
          "Task Automation Bot: Developed a GenAI-powered automation bot for Jira to streamline agile workflows. Automated Jira story creation, Planning Poker estimations, and sprint planning, enabling teams to generate well-structured user stories, estimate effort collaboratively, and optimize backlog refinement. Reduced manual effort by around 50% while ensuring clarity, consistency, and efficiency in agile development. (Technolgies: gpt-4o-mini, gpt-4o,Custom GenAI, Langfuse, Jira API, Milvus)",
          "Data Catalog Chatbot Assistant: Built a multi-agent healthcare Q&A RAG- chatbot to handle structured (SQL) and unstructured (PDF's, Excel) data. Integrated with Google AI for real-time, secure data access, enhancing data discovery and collaboration. (Technologies: gpt-4o, Milvus, Langfuse, SQL, Google AI, Langchain, Neo4j, FlashRank, Custom GenAI)",
        ],
      },
      {
        id: 102,
        role: "Consultant, Data Analyst / Data Engineer",
        period: "May 2023 - Apr 2024",
        details: [
          "Automated lead generation process by designing robust ETL pipelines in PostgreSQL/Python, seamlessly integrating quarterly and weekly Excel account lists into production database tables for real-time access.",
          "Accelerated data retrieval by 60% and optimized database schema by 30%, ensuring swift delivery of accurate insights for timely decision-making.",
          "Uncovered strategic opportunities through comprehensive quarterly buyer analysis on account target list, revealing priority coverage percentages for key marketing strategies (buy more, cross-sell, acquisition) with exceptional accuracy of 97-100%.",
          "Empowered client analysis by creating a dedicated Channel Lead Table in the database, facilitating direct exploration of buyer lever priorities.",
          "Fuelled targeted marketing campaigns by crafting precise, data-driven messages that resonated with specific audience segments, business lines, and account attributes, ultimately boosting purchases, cross-selling, and customer acquisition.",
        ],
      },
    ],
    awards: [
      "🏆 2023 - India Impact Award Winner",
      "🏆 2024 - Most Popular Innovator (Team Award)",
    ],
  },
  {
    id: 2,
    company: "Convergytics Solutions Private Limited",
    companyPeriod: "Jan 2022 - May 2023",
    location: "Bengaluru",
    color: "bg-purpleAccent",
    textColor: "text-purpleAccent",
    logo: "CS",
    positions: [
      {
        id: 201,
        role: "Business Consultant",
        period: "May 2022 - May 2023",
        details: [
          "Substantiated model credibility through meticulous A/B and hypothesis testing across diverse segments and business lines.",
          "Slashed data processing time by 50% by implementing automated ETL pipelines, ensuring timely data availability for critical decisions.",
          "Fueled marketing campaign performance by providing data-driven insights and analyzing retention patterns for optimized customer sales.",
          "Forged collaborative client partnerships for weekly, monthly, and quarterly account targeting campaigns through seamless cooperation with internal teams.",
          "Transformed data into compelling narratives using impactful visualizations created in Excel and Python, promoting clear communication and understanding.",
          "Leveraged Agile Analysis principles to deliver informative reports that empowered strategic decision-making across the organization.",
        ],
      },
      {
        id: 202,
        role: "Intern",
        period: "Jan 2022 - Apr 2022",
        details: [
          "Assisted with data analytics projects and learned various data processing methodologies.",
          "Supported the team with data preparation and initial analysis tasks.",
        ],
      },
    ],
    awards: [],
  },
  {
    id: 3,
    company: "CLEVR DE GmbH",
    companyPeriod: "Sep 2021 - Oct 2021",
    location: "Sankt Inbert, Germany",
    color: "bg-blueAccent",
    textColor: "text-blueAccent",
    logo: "CL",
    positions: [
      {
        id: 301,
        role: "Junior Consultant",
        period: "Sep 2021 - Oct 2021",
        details: [
          "Participated in the Mendix ('Low Code / No Code') platform training program and contributed towards the development of an internal Mendix application.",
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
    logo: "FAI",
    positions: [
      {
        id: 401,
        role: "Graduate Trainee",
        period: "Jun 2017 - Aug 2017",
        details: [
          "Responsible for providing transaction and analytics services to the UK office within the Real Estate and Mortgage Industry through Data Mining.",
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
    githubUrl: "https://github.com/vijitVM/Lending-Club-",
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
      score: "GPA - 2.9/5",
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
      name: "Generative AI with Large Language Models",
      issuer: "DeepLearning.AI",
      logo: "DL",
      colorClass: "bg-gray-700",
    },
    {
      id: 2,
      name: "Generative AI for Everyone",
      issuer: "DeepLearning.AI",
      logo: "DL",
      colorClass: "bg-gray-700",
    },
    {
      id: 3,
      name: "Google Data Analytics Certificate",
      issuer: "Coursera",
      logo: "CS",
      colorClass: "bg-blue-700",
    },
  ],
};
