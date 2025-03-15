import { useState, useEffect, useRef } from 'react';
import { BiBot, BiSend, BiX, BiInfoCircle, BiLoader } from 'react-icons/bi';
import { generateText } from '../../services/ai';
import toast from 'react-hot-toast';
import { meetings } from '../../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] rounded-lg p-2.5 ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : 'bg-slate-800/70 text-white rounded-tl-none'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-1 pb-1 border-b border-slate-700/50">
            <BiBot className="text-indigo-400 text-sm" />
            <span className="text-xs font-medium text-indigo-300">MePad Assistant</span>
          </div>
        )}
        <div className="whitespace-pre-wrap markdown-content text-sm">
          {isUser ? message : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Style headings
                h1: ({node, ...props}) => <h1 className="text-lg font-bold my-1.5 text-white" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-base font-bold my-1.5 text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-sm font-bold my-1 text-white" {...props} />,
                // Style paragraphs
                p: ({node, ...props}) => <p className="mb-1.5" {...props} />,
                // Style lists
                ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-1.5" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-1.5" {...props} />,
                // Style links
                a: ({node, ...props}) => <a className="text-indigo-300 hover:underline" {...props} />,
                // Style code blocks
                code: ({node, inline, ...props}) => 
                  inline 
                    ? <code className="bg-slate-700 px-1 rounded text-xs" {...props} />
                    : <code className="block bg-slate-700 p-1.5 rounded text-xs my-1.5 overflow-x-auto" {...props} />,
                // Style blockquotes
                blockquote: ({node, ...props}) => <blockquote className="border-l-3 border-indigo-500 pl-2 italic my-1.5 text-xs" {...props} />,
              }}
            >
              {message}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AIChatbot({ userMeetings = [], dashboardData = {} }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      text: "Hello! I'm your MePad Assistant. I can help you with information about your meetings, dashboard tasks, and more. What would you like to know?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [meetingsData, setMeetingsData] = useState(userMeetings);
  const messagesEndRef = useRef(null);

  // Fetch meetings data if not provided
  useEffect(() => {
    if (userMeetings.length === 0) {
      const fetchMeetings = async () => {
        try {
          const response = await meetings.getAll();
          if (response.data && response.data.data) {
            setMeetingsData(response.data.data);
          } else {
            console.warn('No meetings data found in API response');
          }
        } catch (error) {
          console.error('Error fetching meetings:', error);
          toast.error('Could not load meetings data. Some AI features may be limited.');
          // Continue with empty meetings data rather than breaking the component
        }
      };
      fetchMeetings();
    } else {
      setMeetingsData(userMeetings);
    }
  }, [userMeetings]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: userMessage, isUser: true },
    ]);
    
    setLoading(true);

    try {
      // Create context for the AI
      const meetingsContext = meetingsData && meetingsData.length > 0 
        ? `Here are the user's meetings: ${JSON.stringify(meetingsData.map(m => ({
            title: m.title,
            date: m.date,
            participants: m.participants?.map(p => p.name || p.email) || [],
            summary: m.summary || 'No summary available'
          })))}`
        : 'The user has no meetings scheduled.';
      
      const dashboardContext = dashboardData && Object.keys(dashboardData).length > 0
        ? `Here is the user's dashboard data: ${JSON.stringify(dashboardData)}`
        : 'No dashboard data available.';

      // Create the prompt with context
      const prompt = `
You are MePad Assistant, an AI assistant for a meeting management application called MePad.
The user is asking: "${userMessage}"

CONTEXT ABOUT THE USER:
${meetingsContext}
${dashboardContext}

INSTRUCTIONS:
1. If the user asks about meetings, provide specific information from the context.
2. If the user asks about dashboard data, provide specific information from the context.
3. If the user asks about how to use MePad features, provide helpful guidance.
4. If the user asks something outside the scope of MePad, politely redirect them to MePad-related topics.
5. Keep responses concise, friendly, and helpful.
6. Format your response using Markdown:
   - Use **bold** for emphasis
   - Use headings (## or ###) for section titles
   - Use bullet points or numbered lists where appropriate
   - Use code blocks for any code or structured data
   - Use > for quotes or important notes
7. If you don't have specific information requested, acknowledge that and suggest what the user could do instead.

Your response:`;

      const response = await generateText(prompt, { temperature: 0.7 });
      
      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: response.text, isUser: false },
      ]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('Failed to generate response. Please try again.');
      
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now() + 1, 
          text: "I'm sorry, I encountered an error processing your request. Please try again.", 
          isUser: false 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/30 backdrop-blur-md rounded-xl p-3 border border-indigo-900/20 shadow-xl flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <BiBot className="text-xl text-indigo-400" />
          <h2 className="text-base font-semibold text-white">MePad Assistant</h2>
        </div>
        <div className="bg-indigo-900/20 text-xs text-indigo-300 px-2 py-0.5 rounded-full">
          AI Powered
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2 mb-3 flex items-start gap-2">
        <BiInfoCircle className="text-indigo-400 text-base flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          Ask me about your meetings, dashboard data, or how to use MePad features. I'm here to help!
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-2 py-1 mb-3 custom-scrollbar">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-slate-800/70 text-white rounded-lg p-2 rounded-tl-none flex items-center gap-2">
              <BiLoader className="animate-spin text-indigo-400" />
              <span className="text-slate-300 text-xs">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your meetings or dashboard..."
          className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className={`p-1.5 rounded-lg ${
            !input.trim() || loading
              ? 'bg-indigo-700/50 text-indigo-300/50 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <BiSend className="text-lg" />
        </button>
      </form>
    </div>
  );
} 