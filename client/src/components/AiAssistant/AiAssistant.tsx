import React, { useState, useRef, useEffect } from 'react';

// Enhanced markdown component to handle headings, bold text, and lists
const EnhancedMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  lines.forEach((line, index) => {
    const isListItem = line.trim().startsWith('* ') || line.trim().startsWith('- ') || /^\d+\. /.test(line.trim());

    if (!isListItem) {
      inList = false;
      listType = null;
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={index} className="text-xl font-bold mt-4 mb-2 dark:text-gray-200">{line.substring(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={index} className="text-lg font-semibold mt-3 mb-1 dark:text-gray-300">{line.substring(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={index} className="text-md font-semibold mt-2 dark:text-gray-400">{line.substring(4)}</h3>);
    } else if (isListItem) {
      const currentListType = /^\d+\. /.test(line.trim()) ? 'ol' : 'ul';
      const itemContent = line.replace(/^(\* |\- |\d+\. )/, '');
      const processedContent = itemContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      const listItem = <li key={index} dangerouslySetInnerHTML={{ __html: processedContent }} />;

      if (!inList || currentListType !== listType) {
        listType = currentListType;
        elements.push(React.createElement(listType, { key: `list-${index}`, className: `${listType === 'ul' ? 'list-disc' : 'list-decimal'} list-inside` }, [listItem]));
        inList = true;
      } else {
        const lastElement = elements[elements.length - 1];
        if (React.isValidElement(lastElement) && lastElement.type === listType) {
           lastElement.props.children.push(listItem);
        }
      }
    } else {
      const processedContent = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: processedContent }} />);
    }
  });

  return <div className="prose prose-sm max-w-none text-left dark:text-gray-300">{elements}</div>;
};


const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisMode, setAnalysisMode] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && !analysisMode) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 100;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [input, analysisMode]);

  const streamResponse = async (response: Response, onContent: (content: string) => void) => {
      if (!response.body) throw new Error('No response body');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonString = line.substring(6);
            try {
              const parsed = JSON.parse(jsonString);
              if (parsed.content) {
                onContent(parsed.content);
              }
            } catch (e) { console.error("Failed to parse JSON:", jsonString); }
          }
        }
      }
  };
  
  const handleSendMessage = async (predefinedQuestion?: string) => {
    const question = predefinedQuestion || input;
    if (question.trim() === '' || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    let assistantMessage = '';
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/ask-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history: messages }),
      });
      await streamResponse(response, (content) => {
        assistantMessage += content;
        setMessages(prev => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1].content = assistantMessage;
          return updatedMessages;
        });
      });
    } catch (error) {
      console.error('Error asking assistant:', error);
      setMessages(prev => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1].content = 'Sorry, something went wrong.';
        return updatedMessages;
      });
    } finally { setIsLoading(false); }
  };

  const handleAnalyzeJobFit = async () => {
    if (jobDescription.trim().length < 50 || isLoading) return;

    const userMessage = `Please analyze the following job description:\n\n---\n\n${jobDescription}`;
    setMessages([{ role: 'user', content: userMessage }]);
    setAnalysisMode(false);
    setIsLoading(true);
    setJobDescription('');

    let assistantMessage = '';
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/analyze-job-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      await streamResponse(response, (content) => {
        assistantMessage += content;
        setMessages(prev => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1].content = assistantMessage;
          return updatedMessages;
        });
      });
    } catch (error) {
       console.error('Error analyzing job fit:', error);
       setMessages(prev => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1].content = 'Sorry, an error occurred during the analysis.';
        return updatedMessages;
      });
    } finally { setIsLoading(false); }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
  };

  const InitialView = () => (
    <div className="text-center text-gray-500 dark:text-gray-400 p-4">
      <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Welcome! How can I help?</h4>
      <p className="text-sm mb-4">I can answer questions about Vijit\'s portfolio or analyze a job description for you.</p>
      <div className="flex flex-col gap-2 text-sm">
        <button onClick={() => handleSendMessage('What are his key technical skills?')} className="p-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          What are his key technical skills?
        </button>
        <button onClick={() => handleSendMessage('Tell me about the VOC Complaint Analyzer project.')} className="p-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          Tell me about a key project.
        </button>
        <button onClick={() => setAnalysisMode(true)} className="p-2 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors font-semibold">
          Analyze a Job Description
        </button>
      </div>
    </div>
  );

  const AnalysisView = () => (
    <div className="flex flex-col h-full p-4">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Candidate Fit Analysis</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Paste a job description below to generate a detailed "Candidate Fit Report".</p>
        <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here... (min. 50 characters)"
            className="flex-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 dark:placeholder-gray-400"
            disabled={isLoading}
        />
        <div className="mt-3 flex gap-2">
            <button onClick={() => setAnalysisMode(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                Back
            </button>
            <button 
                onClick={handleAnalyzeJobFit} 
                disabled={isLoading || jobDescription.length < 50} 
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-400 dark:disabled:bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors">
                {isLoading ? 'Analyzing...' : 'Analyze Fit'}
            </button>
        </div>
    </div>
  );

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors" aria-label="Toggle AI Assistant">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </button>
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col" style={{ height: '32rem' }}>
           {analysisMode ? <AnalysisView /> : (
            <>
              <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-t-lg flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Portfolio Assistant</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Q&A and Candidate Fit Analysis</p>
                </div>
                <button onClick={handleNewConversation} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="New Conversation">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
              </div>
              <div ref={chatBoxRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 && <InitialView />}
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect x="4" y="12" width="16" height="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v-2a3 3 0 0 0-3-3H8" /></svg>
                      </div>
                    )}
                    <div className={`p-3 rounded-xl max-w-xs md:max-w-md break-words ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                      {msg.role === 'assistant' ? <EnhancedMarkdown content={msg.content} /> : <p className="whitespace-pre-wrap">{msg.content}</p>}
                      {isLoading && msg.role === 'assistant' && messages.indexOf(msg) === messages.length - 1 && <div className="typing-indicator"><span/><span/><span/></div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-gray-200 dark:border-gray-700"><div className="flex items-start">
                <textarea ref={textareaRef} rows={1} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask a question..." className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 resize-none" disabled={isLoading} />
                <button onClick={() => handleSendMessage()} disabled={isLoading} className="self-stretch px-4 py-2 bg-blue-600 text-white rounded-r-md disabled:bg-blue-400 dark:disabled:bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors">Send</button>
              </div></div>
            </>
           )}
        </div>
      )}
       <style>{`
        .prose p { margin: 0.5em 0; }
        .typing-indicator span { height: 8px; width: 8px; background-color: #9E9E9E; border-radius: 50%; display: inline-block; animation: wave 1.3s infinite; }
        .typing-indicator span:nth-of-type(1) { animation-delay: -1.1s; }
        .typing-indicator span:nth-of-type(2) { animation-delay: -0.9s; }
        .typing-indicator span:nth-of-type(3) { animation-delay: -0.7s; }
        @keyframes wave { 0%, 60%, 100% { transform: initial; } 30% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
};

export default AiAssistant;
