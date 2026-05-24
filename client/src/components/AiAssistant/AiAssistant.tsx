import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { 
  Sparkles, 
  RefreshCw, 
  Send, 
  BrainCircuit, 
  User, 
  FileText, 
  ArrowLeft, 
  Bot, 
  Terminal,
  X
} from 'lucide-react';

const AiAssistant: React.FC = () => {
  const { theme } = useTheme();
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
    <div className="text-center p-3 flex flex-col items-center h-full justify-center">
      <div className={`p-3 rounded-full mb-3 ${
        theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-amber-500/10 text-amber-600'
      }`}>
        <BrainCircuit className="h-8 w-8 animate-pulse" />
      </div>
      <h4 className={`font-bold text-base mb-1 ${
        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
      }`}>
        AI Systems Co-Pilot
      </h4>
      <p className={`text-xs mb-4 max-w-xs leading-relaxed ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Ask complex queries regarding my production system architectures, tool stacks, or generate an instant fit report.
      </p>
      
      <div className="flex flex-col gap-2.5 w-full text-xs max-w-xs">
        <button 
          onClick={() => handleSendMessage('What are his key technical skills?')} 
          className={`flex items-center gap-2.5 p-2.5 text-left rounded-xl transition-all duration-200 border ${
            theme === 'dark' 
              ? 'bg-[#161B22]/70 hover:bg-[#21262D] border-gray-800 text-gray-300 hover:border-cyan-500/40' 
              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 hover:border-amber-500/40'
          }`}
        >
          <Sparkles className={`h-4 w-4 shrink-0 ${theme === 'dark' ? 'text-cyan-400' : 'text-amber-500'}`} />
          <span>What are his key technical skills?</span>
        </button>
        <button 
          onClick={() => handleSendMessage('Tell me about the VOC Complaint Intelligence System.')} 
          className={`flex items-center gap-2.5 p-2.5 text-left rounded-xl transition-all duration-200 border ${
            theme === 'dark' 
              ? 'bg-[#161B22]/70 hover:bg-[#21262D] border-gray-800 text-gray-300 hover:border-cyan-500/40' 
              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 hover:border-amber-500/40'
          }`}
        >
          <Terminal className={`h-4 w-4 shrink-0 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
          <span>Tell me about his key projects.</span>
        </button>
        <button 
          onClick={() => setAnalysisMode(true)} 
          className={`flex items-center gap-2.5 p-2.5 text-left rounded-xl transition-all duration-200 border font-bold ${
            theme === 'dark' 
              ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-400' 
              : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-700'
          }`}
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span>Evaluate My Job Description</span>
        </button>
      </div>
    </div>
  );

  const AnalysisView = () => (
    <div className="flex flex-col h-full p-4 justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setAnalysisMode(false)}
            className={`p-1 rounded-md transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-150 text-gray-600'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h3 className={`font-bold text-base ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            Candidate Fit Report
          </h3>
        </div>
        <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Paste an open job requirement below to run an automated compliance and skills fit diagnostic against my professional profile.
        </p>
      </div>

      <div className="flex-1 my-3 relative flex flex-col">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here... (minimum 50 characters)"
          className={`w-full flex-1 p-3 border rounded-xl resize-none text-xs leading-relaxed focus:outline-none focus:ring-1 ${
            theme === 'dark'
              ? 'bg-[#161B22] border-gray-800 focus:border-cyan-500/50 text-gray-200 focus:ring-cyan-500/30 placeholder-gray-500'
              : 'bg-gray-50 border-gray-200 focus:border-amber-500/50 text-gray-800 focus:ring-amber-500/30 placeholder-gray-400'
          }`}
          disabled={isLoading}
        />
        <div className="absolute bottom-2 right-2 text-[10px] text-gray-500 font-mono">
          {jobDescription.length} chars
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={handleAnalyzeJobFit} 
          disabled={isLoading || jobDescription.length < 50} 
          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 shadow-cyan-950/20'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 shadow-amber-500/10'
          }`}
        >
          {isLoading ? 'Running Analysis...' : 'Generate Compliance Report'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Premium Toggle Orb Button */}
      <motion.button 
        onClick={() => setIsOpen(!isOpen)} 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-2xl transition-all duration-300 border focus:outline-none ${
          theme === 'dark'
            ? 'bg-[#0D1117]/90 hover:bg-[#161B22] border-cyan-500/30 hover:border-cyan-400 text-cyan-400 shadow-cyan-950/40'
            : 'bg-white/90 hover:bg-gray-50 border-amber-500/30 hover:border-amber-400 text-amber-600 shadow-amber-500/20'
        }`}
        aria-label="Toggle AI Co-Pilot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <BrainCircuit className="h-6 w-6 sm:h-7 sm:w-7" />
              {/* Outer pulsing border glow ring */}
              <span className={`absolute -inset-1 rounded-full animate-ping opacity-25 ${
                theme === 'dark' ? 'bg-cyan-500' : 'bg-amber-500'
              }`} style={{ animationDuration: '3s' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Main Console Box Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`absolute bottom-20 right-0 w-[90vw] sm:w-96 rounded-2xl shadow-2xl flex flex-col border overflow-hidden ${
              theme === 'dark' 
                ? 'bg-[#0D1117]/95 backdrop-blur-md border-gray-800 shadow-black/80' 
                : 'bg-white/95 backdrop-blur-md border-gray-200 shadow-gray-400/20'
            }`} 
            style={{ height: '32rem' }}
          >
             {analysisMode ? <AnalysisView /> : (
              <>
                {/* Premium Console Header */}
                <div className={`p-3.5 flex justify-between items-center border-b ${
                  theme === 'dark' ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        theme === 'dark' ? 'bg-cyan-400' : 'bg-amber-400'
                      }`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${
                        theme === 'dark' ? 'bg-cyan-500' : 'bg-amber-500'
                      }`}></span>
                    </span>
                    <div>
                      <h3 className={`font-bold text-xs uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                      }`}>
                        SYSTEM CO-PILOT
                      </h3>
                      <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest leading-none">
                        v1.02-stable
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleNewConversation} 
                    className={`p-1.5 rounded-lg border transition-colors ${
                      theme === 'dark' 
                        ? 'bg-gray-800/30 hover:bg-gray-800 border-gray-800 hover:border-gray-700 text-gray-400' 
                        : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600'
                    }`}
                    title="Reset Session"
                    aria-label="New Conversation"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Chat feed messages */}
                <div ref={chatBoxRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.length === 0 && <InitialView />}
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.role === 'assistant' && (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border ${
                          theme === 'dark' ? 'bg-cyan-950/40 border-cyan-800/30 text-cyan-400' : 'bg-amber-50 border-amber-200/50 text-amber-600'
                        }`}>
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      <div className={`p-3 rounded-2xl max-w-xs md:max-w-md break-words text-xs leading-relaxed relative ${
                        msg.role === 'user' 
                          ? (theme === 'dark' 
                              ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 rounded-br-none shadow-sm' 
                              : 'bg-amber-500/10 border border-amber-500/20 text-amber-900 rounded-br-none shadow-sm')
                          : (theme === 'dark' 
                              ? 'bg-[#161B22]/90 border border-gray-800 text-gray-300 rounded-bl-none' 
                              : 'bg-gray-50 border border-gray-150 text-gray-800 rounded-bl-none')
                      }`}>
                        {msg.role === 'assistant' ? (
                          <div className="prose prose-xs max-w-none text-left dark:text-gray-300 dark:prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                        {isLoading && msg.role === 'assistant' && messages.indexOf(msg) === messages.length - 1 && (
                          <div className="typing-indicator mt-1.5 flex gap-1 items-center">
                            <span className={theme === 'dark' ? 'bg-cyan-500' : 'bg-amber-500'} />
                            <span className={theme === 'dark' ? 'bg-cyan-500' : 'bg-amber-500'} />
                            <span className={theme === 'dark' ? 'bg-cyan-500' : 'bg-amber-500'} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Text Box Bar */}
                <div className={`p-2.5 border-t ${
                  theme === 'dark' ? 'bg-gray-900/40 border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-end gap-1.5">
                    <textarea 
                      ref={textareaRef} 
                      rows={1} 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)} 
                      onKeyPress={handleKeyPress} 
                      placeholder="Ask co-pilot a question..." 
                      className={`flex-1 p-2.5 border rounded-xl resize-none text-xs focus:outline-none focus:ring-1 ${
                        theme === 'dark' 
                          ? 'bg-[#161B22] border-gray-800 focus:border-cyan-500/50 text-gray-200 focus:ring-cyan-500/30 placeholder-gray-500' 
                          : 'bg-white border-gray-200 focus:border-amber-500/50 text-gray-800 focus:ring-amber-500/30 placeholder-gray-400'
                      }`} 
                      disabled={isLoading} 
                    />
                    <button 
                      onClick={() => handleSendMessage()} 
                      disabled={isLoading || !input.trim()} 
                      className={`p-2.5 rounded-xl transition-all duration-300 shadow-md ${
                        theme === 'dark'
                          ? 'bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white disabled:bg-gray-800 disabled:text-gray-600 border border-cyan-500/20 hover:border-cyan-400 shadow-cyan-950/20'
                          : 'bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-white disabled:bg-gray-200 disabled:text-gray-400 border border-amber-500/20 hover:border-amber-400 shadow-amber-500/10'
                      }`}
                      aria-label="Send Message"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </>
             )}
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .prose p { margin: 0.5em 0; }
        .typing-indicator span { height: 6px; width: 6px; border-radius: 50%; display: inline-block; animation: wave 1.3s infinite; }
        .typing-indicator span:nth-of-type(1) { animation-delay: -1.1s; }
        .typing-indicator span:nth-of-type(2) { animation-delay: -0.9s; }
        .typing-indicator span:nth-of-type(3) { animation-delay: -0.7s; }
        @keyframes wave { 0%, 60%, 100% { transform: initial; } 30% { transform: translateY(-6px); } }
      `}</style>
    </div>
  );
};

export default AiAssistant;
