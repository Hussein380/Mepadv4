import { useState, useEffect } from 'react';
import { BiBot, BiRefresh, BiCopy, BiDownload, BiInfoCircle, BiHelpCircle, BiX, BiCheckCircle, BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import aiService from '../../services/ai';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Error display component for better error visualization
const ErrorDisplay = ({ error, onDismiss }) => {
  if (!error) return null;
  
  let errorMessage = 'An unknown error occurred';
  let errorDetails = null;
  
  // Handle different error formats
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (typeof error === 'object') {
    // New error format
    if (error.message) {
      errorMessage = error.message;
      errorDetails = error.details;
    } 
    // Legacy error format
    else if (error.displayMessage || error.stack) {
      errorMessage = error.displayMessage || error.message || 'An unknown error occurred';
      errorDetails = error.stack;
    }
    // API error
    else if (error.response?.data?.error) {
      errorMessage = error.response.data.error.message || 'API Error';
      errorDetails = JSON.stringify(error.response.data, null, 2);
    }
  }
  
  return (
    <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-start">
        <h3 className="text-red-300 font-medium mb-1">Error</h3>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-slate-400 hover:text-white"
          >
            <BiX className="text-xl" />
          </button>
        )}
      </div>
      <p className="text-slate-300 text-sm">{errorMessage}</p>
      {errorDetails && (
        <div className="mt-2 pt-2 border-t border-red-800/30">
          <p className="text-slate-400 text-xs whitespace-pre-wrap">{errorDetails}</p>
        </div>
      )}
      <div className="mt-3">
        <button 
          onClick={() => window.location.reload()}
          className="text-xs bg-red-900/30 hover:bg-red-800/40 text-red-300 px-3 py-1 rounded-md transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

// Feature Guide component for interactive tutorials
const FeatureGuide = ({ activeTab, onDismiss }) => {
  const [step, setStep] = useState(1);
  const [dismissed, setDismissed] = useState(false);
  
  // Reset step when tab changes
  useEffect(() => {
    setStep(1);
    setDismissed(false);
  }, [activeTab]);
  
  if (dismissed) return null;
  
  const guides = {
    summarize: [
      {
        title: "Summarize Meeting Notes",
        content: "This feature helps you create concise summaries of your meeting notes. Simply paste your meeting notes in the text area below.",
        example: "Team discussed Q3 marketing strategy. John presented social media campaign results: 15% increase in engagement. Sarah suggested focusing on TikTok for Q3. Team agreed to increase budget by $5000."
      },
      {
        title: "What You'll Get",
        content: "The AI will extract key decisions, action items, and main discussion points from your notes.",
        example: "Key Decisions:\n- Increase marketing budget by $5000\n- Focus on TikTok for Q3\n\nAction Items:\n- John: Create TikTok strategy doc\n- Sarah: Analyze competitor TikTok accounts"
      }
    ],
    actionItems: [
      {
        title: "Extract Action Items",
        content: "This feature identifies and organizes action items from your meeting notes. Paste your notes with tasks, assignees, and deadlines.",
        example: "Meeting Notes - Product Team\n\nAction Items:\n- Alex will finalize the UI mockups by June 15th (high priority)\n- Maria needs to fix the login bug by tomorrow\n- Team to review Sarah's API documentation by end of week"
      },
      {
        title: "What You'll Get",
        content: "The AI will extract each task with its assignee, due date, and priority level in a structured format.",
        example: "[{\n  \"description\": \"Finalize UI mockups\",\n  \"assignedTo\": \"Alex\",\n  \"dueDate\": \"2023-06-15\",\n  \"priority\": \"high\"\n}]"
      }
    ],
    agenda: [
      {
        title: "Generate Meeting Agenda",
        content: "This feature helps you create a structured agenda for upcoming meetings. Enter the purpose of your meeting below.",
        example: "Quarterly planning meeting to discuss product roadmap and resource allocation"
      },
      {
        title: "What You'll Get",
        content: "The AI will generate a complete agenda with time allocations for each topic.",
        example: "Meeting Agenda: Quarterly Planning\n\n1. Welcome and Introduction (5 min)\n2. Q2 Review (15 min)\n3. Product Roadmap Discussion (25 min)\n4. Resource Allocation (20 min)\n5. Questions and Next Steps (10 min)\n\nTotal Duration: 75 minutes"
      }
    ],
    sentiment: [
      {
        title: "Analyze Meeting Sentiment",
        content: "This feature analyzes the tone and engagement level of your meeting. Paste a transcript of the conversation below.",
        example: "John: I think we should reconsider the timeline for this project.\nSarah: I agree, the current deadline seems unrealistic.\nMike: We've already committed to the client. We can't change it now.\nJohn: But rushing could compromise quality.\nSarah: Maybe we can deliver in phases?"
      },
      {
        title: "What You'll Get",
        content: "The AI will assess the overall sentiment, engagement level, and key moments of agreement or disagreement.",
        example: "{\n  \"sentiment\": \"mixed\",\n  \"engagement\": \"high\",\n  \"keyMoments\": \"Disagreement about timeline, agreement on phased delivery\"\n}"
      }
    ]
  };
  
  const currentGuide = guides[activeTab] || guides.summarize;
  const currentStep = currentGuide[step - 1];
  
  const handleNext = () => {
    if (step < currentGuide.length) {
      setStep(step + 1);
    } else {
      setDismissed(true);
      if (onDismiss) onDismiss();
    }
  };
  
  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };
  
  return (
    <div className="bg-gradient-to-r from-indigo-900/30 to-violet-900/30 backdrop-blur-md rounded-lg p-4 mb-6 border border-indigo-700/30 shadow-lg animate-fadeIn">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600/20 text-indigo-300 p-1 rounded-full">
            <BiInfoCircle className="text-lg" />
          </div>
          <h3 className="text-indigo-300 font-medium">{currentStep.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-indigo-400">{step}/{currentGuide.length}</span>
          <button 
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <BiX className="text-lg" />
          </button>
        </div>
      </div>
      
      <p className="text-slate-300 text-sm mb-3">{currentStep.content}</p>
      
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 mb-3">
        <p className="text-xs text-slate-400 mb-1">Example:</p>
        <div className="text-sm text-white whitespace-pre-line">{currentStep.example}</div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-xs text-indigo-300">
          {step === currentGuide.length ? (
            <span className="flex items-center gap-1">
              <BiCheckCircle />
              Ready to try it yourself!
            </span>
          ) : (
            <span>Click next to continue</span>
          )}
        </div>
        <button
          onClick={handleNext}
          className="px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 rounded-md text-sm flex items-center gap-1 transition-colors"
        >
          {step === currentGuide.length ? 'Got it' : 'Next'}
          <BiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default function MeetingAssistant({ meetingId, meetingData }) {
  const [activeTab, setActiveTab] = useState('summarize');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  // Set minimal placeholder text when tab changes
  useEffect(() => {
    // If meeting data is available, use it as a starting point
    if (meetingData?.notes && activeTab === 'summarize') {
      setInputText(meetingData.notes);
    } else if (meetingData?.notes && activeTab === 'actionItems') {
      setInputText(meetingData.notes);
    } else {
      // Otherwise, provide minimal prompts
      switch (activeTab) {
        case 'summarize':
          setInputText('');
          break;
        case 'actionItems':
          setInputText('');
          break;
        case 'agenda':
          setInputText('');
          break;
        case 'sentiment':
          setInputText('');
          break;
      }
    }
    
    // Show guide when tab changes
    setShowGuide(true);
  }, [activeTab, meetingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      let response;
      
      switch (activeTab) {
        case 'summarize':
          response = await aiService.summarizeMeeting(inputText);
          setResult({ type: 'summary', content: response.text });
          break;
        
        case 'actionItems':
          try {
            const actionItems = await aiService.extractActionItems(inputText);
            setResult({ type: 'actionItems', content: actionItems });
          } catch (actionError) {
            console.error('Action items extraction error:', actionError);
            toast.error('Could not extract action items. Please try reformatting your input.');
            setResult({ 
              type: 'actionItems', 
              content: [{ 
                description: "Error extracting action items. Please try again with more structured notes.",
                assignedTo: null,
                dueDate: null,
                priority: null
              }] 
            });
          }
          break;
        
        case 'agenda':
          response = await aiService.generateAgenda(
            meetingData ? [meetingData] : [], 
            meetingData?.participants || [], 
            inputText
          );
          setResult({ type: 'agenda', content: response.text });
          break;
        
        case 'sentiment':
          try {
            const sentiment = await aiService.analyzeMeetingSentiment(inputText);
            setResult({ type: 'sentiment', content: sentiment });
          } catch (sentimentError) {
            console.error('Sentiment analysis error:', sentimentError);
            toast.error('Could not analyze sentiment. Please try again.');
            setResult({ 
              type: 'sentiment', 
              content: { 
                analysis: "Error analyzing sentiment. Please try again with a more detailed transcript.",
                sentiment: "unknown",
                engagement: "unknown"
              } 
            });
          }
          break;
        
        default:
          toast.error('Unknown operation');
      }
    } catch (error) {
      console.error('AI Assistant error:', error);
      
      // Create a user-friendly error message
      let userErrorMessage = 'Error processing your request';
      if (error.displayMessage) {
        userErrorMessage = error.displayMessage;
      } else if (error.message) {
        // Clean up technical error messages
        if (error.message.includes('SyntaxError')) {
          userErrorMessage = 'Could not process the AI response format. Please try again.';
        } else if (error.message.includes('network')) {
          userErrorMessage = 'Network error. Please check your connection and try again.';
        } else {
          userErrorMessage = `Error: ${error.message}`;
        }
      }
      
      setError({
        message: userErrorMessage,
        details: error.stack || 'No additional details available'
      });
      
      toast.error(userErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    let textToCopy = '';
    
    if (result?.type === 'actionItems' || result?.type === 'sentiment') {
      textToCopy = JSON.stringify(result.content, null, 2);
    } else {
      textToCopy = result?.content || '';
    }
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };

  const downloadResult = () => {
    let content = '';
    let filename = `mepad-ai-${activeTab}-${new Date().toISOString().slice(0, 10)}.txt`;
    
    if (result?.type === 'actionItems' || result?.type === 'sentiment') {
      content = JSON.stringify(result.content, null, 2);
      filename = filename.replace('.txt', '.json');
    } else {
      content = result?.content || '';
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderResult = () => {
    if (!result) return null;
    
    switch (result.type) {
      case 'summary':
      case 'agenda':
        return (
          <div className="whitespace-pre-line bg-slate-800/50 p-4 rounded-lg border border-indigo-900/20 max-h-[400px] overflow-y-auto custom-scrollbar">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Style headings
                h1: ({node, ...props}) => <h1 className="text-xl font-bold my-2 text-white" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold my-2 text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-md font-bold my-1 text-white" {...props} />,
                // Style paragraphs
                p: ({node, ...props}) => <p className="mb-2" {...props} />,
                // Style lists
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                // Style links
                a: ({node, ...props}) => <a className="text-indigo-300 hover:underline" {...props} />,
                // Style code blocks
                code: ({node, inline, ...props}) => 
                  inline 
                    ? <code className="bg-slate-700 px-1 rounded text-xs" {...props} />
                    : <code className="block bg-slate-700 p-2 rounded text-xs my-2 overflow-x-auto" {...props} />,
                // Style blockquotes
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-3 italic my-2" {...props} />,
              }}
            >
              {result.content}
            </ReactMarkdown>
          </div>
        );
      
      case 'actionItems':
        return (
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
            {Array.isArray(result.content) ? (
              result.content.map((item, index) => (
                <div key={index} className="bg-slate-800/50 p-3 rounded-lg border border-indigo-900/20">
                  <h4 className="font-medium text-white text-sm">{item.description}</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.assignedTo && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-300">
                        Assigned to: {item.assignedTo}
                      </span>
                    )}
                    {item.dueDate && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-300">
                        Due: {item.dueDate}
                      </span>
                    )}
                    {item.priority && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-fuchsia-500/20 text-fuchsia-300">
                        Priority: {item.priority}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-800/50 p-3 rounded-lg border border-indigo-900/20">
                <p className="text-slate-300 text-sm">No action items found or could not parse the response.</p>
              </div>
            )}
          </div>
        );
      
      case 'sentiment':
        return (
          <div className="bg-slate-800/50 p-4 rounded-lg border border-indigo-900/20 max-h-[400px] overflow-y-auto custom-scrollbar">
            {typeof result.content === 'object' ? (
              <div className="space-y-3">
                {result.content.sentiment && (
                  <div>
                    <h4 className="text-xs font-medium text-slate-300">Overall Sentiment</h4>
                    <p className="text-white font-medium text-sm">{result.content.sentiment}</p>
                  </div>
                )}
                {result.content.engagement && (
                  <div>
                    <h4 className="text-xs font-medium text-slate-300">Engagement Level</h4>
                    <p className="text-white font-medium text-sm">{result.content.engagement}</p>
                  </div>
                )}
                {result.content.keyMoments && (
                  <div>
                    <h4 className="text-xs font-medium text-slate-300">Key Moments</h4>
                    <p className="text-white text-sm">{result.content.keyMoments}</p>
                  </div>
                )}
                {result.content.participants && (
                  <div>
                    <h4 className="text-xs font-medium text-slate-300">Participant Engagement</h4>
                    <p className="text-white text-sm">{result.content.participants}</p>
                  </div>
                )}
                {result.content.analysis && (
                  <div>
                    <h4 className="text-xs font-medium text-slate-300">Analysis</h4>
                    <p className="text-white text-sm">{result.content.analysis}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white text-sm">{JSON.stringify(result.content)}</p>
            )}
          </div>
        );
      
      default:
        return <p className="text-slate-300">Unknown result type</p>;
    }
  };

  // Define tabs with more descriptive input labels
  const tabs = [
    { id: 'summarize', label: 'Summarize Notes', inputLabel: 'Enter your meeting notes to generate a concise summary' },
    { id: 'actionItems', label: 'Extract Action Items', inputLabel: 'Enter your meeting notes to extract tasks, assignees, and deadlines' },
    { id: 'agenda', label: 'Generate Agenda', inputLabel: 'Describe the purpose of your meeting to generate a structured agenda' },
    { id: 'sentiment', label: 'Analyze Sentiment', inputLabel: 'Enter your meeting transcript to analyze tone and engagement' }
  ];

  // Get active tab
  const getActiveTab = () => tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <div className="bg-slate-900/30 backdrop-blur-md rounded-xl p-6 border border-indigo-900/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BiBot className="text-2xl text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">AI Meeting Assistant</h2>
        </div>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all"
          title="Help"
        >
          <BiHelpCircle />
        </button>
      </div>

      {/* Help Section */}
      {showHelp && (
        <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start">
            <h3 className="text-indigo-300 font-medium mb-3">How to use the AI Meeting Assistant</h3>
            <button 
              onClick={() => setShowHelp(false)}
              className="text-slate-400 hover:text-white"
            >
              <BiX className="text-xl" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-indigo-200 font-medium mb-1">Summarize Notes</h4>
              <p className="text-slate-300">
                Paste your meeting notes and get a concise summary highlighting key points, decisions, and action items.
              </p>
            </div>
            <div>
              <h4 className="text-indigo-200 font-medium mb-1">Extract Action Items</h4>
              <p className="text-slate-300">
                Extract specific tasks, assignees, and deadlines from your meeting notes in a structured format.
              </p>
            </div>
            <div>
              <h4 className="text-indigo-200 font-medium mb-1">Generate Agenda</h4>
              <p className="text-slate-300">
                Create a structured meeting agenda based on meeting purpose and participants.
              </p>
            </div>
            <div>
              <h4 className="text-indigo-200 font-medium mb-1">Analyze Sentiment</h4>
              <p className="text-slate-300">
                Understand the overall tone and engagement level of your meeting based on the transcript.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feature Guide */}
      {showGuide && (
        <FeatureGuide 
          activeTab={activeTab} 
          onDismiss={() => setShowGuide(false)} 
        />
      )}

      {/* Error Display */}
      {error && <ErrorDisplay error={error} onDismiss={() => setError(null)} />}

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setResult(null);
              setError(null);
            }}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="inputText" className="block text-sm font-medium text-slate-300 mb-2">
            {getActiveTab().inputLabel}
          </label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-40 bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder={
              activeTab === 'summarize' 
                ? "Enter your meeting notes here..." 
                : activeTab === 'actionItems'
                ? "Enter your meeting notes with action items here..."
                : activeTab === 'agenda'
                ? "Enter the purpose of your meeting here..."
                : "Enter your meeting transcript here..."
            }
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setInputText('');
              setResult(null);
              setError(null);
            }}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
              loading || !inputText.trim()
                ? 'bg-indigo-700/50 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Processing...' : 'Generate'}
          </button>
        </div>
      </form>

      {/* Result */}
      {result && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Result</h3>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all"
                title="Copy to clipboard"
              >
                <BiCopy />
              </button>
              <button
                onClick={downloadResult}
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all"
                title="Download result"
              >
                <BiDownload />
              </button>
            </div>
          </div>
          {renderResult()}
        </div>
      )}
    </div>
  );
} 