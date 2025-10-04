import React, { useState, useRef, useEffect } from 'react';

// A simple component to render basic markdown (bold and lists)
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const renderLine = (line: string) => {
    // Replace **text** with <strong>text</strong>
    const bolded = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <p dangerouslySetInnerHTML={{ __html: bolded }} />;
  };

  const lines = content.split('\n');
  const elements = [];
  let listItems: string[] = [];

  lines.forEach((line, index) => {
    const isListItem = line.startsWith('*') || line.startsWith('-') || /\d+\./.test(line.substring(0, 3));
    
    if (isListItem) {
      listItems.push(line.replace(/^(\* |\- |\d+\. )/, ''));
    } else {
      if (listItems.length > 0) {
        elements.push(
          <ul className="list-disc list-inside">
            {listItems.map((item, i) => <li key={i}>{renderLine(item)}</li>)}
          </ul>
        );
        listItems = [];
      }
      if (line.trim() !== '') {
        elements.push(renderLine(line));
      }
    }
  });

  if (listItems.length > 0) {
    elements.push(
      <ul className="list-disc list-inside">
        {listItems.map((item, i) => <li key={i}>{renderLine(item)}</li>)}
      </ul>
    );
  }

  return <div className="prose prose-sm text-left">{elements.map((el, i) => <div key={i}>{el}</div>)}</div>;
};

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 100;
      if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/ask-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input, history: messages }),
      });
      if (!response.body) throw new Error('No response body');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
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
                assistantMessage += parsed.content;
                setMessages(prev => {
                  const lastMsgIndex = prev.length - 1;
                  const updatedMessages = [...prev];
                  if (updatedMessages[lastMsgIndex].role === 'assistant') {
                    updatedMessages[lastMsgIndex].content = assistantMessage;
                  }
                  return updatedMessages;
                });
              }
            } catch (e) { console.error("Failed to parse JSON:", jsonString); }
          }
        }
      }
    } catch (error) {
      console.error('Error asking assistant:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally { setIsLoading(false); }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors" aria-label="Toggle AI Assistant">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </button>
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-2xl flex flex-col" style={{ height: '32rem' }}>
          <div className="p-4 bg-gray-100 rounded-t-lg"><h3 className="font-bold text-lg text-gray-800">Project Q&A Assistant</h3><p className="text-sm text-gray-600">Ask me about projects, skills, or experience.</p></div>
          <div ref={chatBoxRef} className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 && <div className="text-center text-gray-500 my-4">I can answer questions about Vijit Mehrotra's portfolio.</div>}
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect x="4" y="12" width="16" height="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v-2a3 3 0 0 0-3-3H8" /></svg>
                  </div>
                )}
                <div className={`p-3 rounded-xl max-w-xs md:max-w-md ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                  {msg.role === 'assistant' ? <SimpleMarkdown content={msg.content} /> : msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t"><div className="flex items-start">
            <textarea ref={textareaRef} rows={1} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask a question..." className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" disabled={isLoading} />
            <button onClick={handleSendMessage} disabled={isLoading} className="self-stretch px-4 py-2 bg-blue-600 text-white rounded-r-md disabled:bg-blue-400 hover:bg-blue-700 transition-colors">Send</button>
          </div></div>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
