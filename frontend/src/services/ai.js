import axios from 'axios';

// Gemini AI API configuration from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'models/gemini-1.5-pro';

// Create a configured axios instance for Gemini API
const geminiApi = axios.create({
  baseURL: GEMINI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add API key to all requests
geminiApi.interceptors.request.use(config => {
  config.params = config.params || {};
  config.params.key = GEMINI_API_KEY;
  return config;
});

// Add response interceptor for debugging
geminiApi.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

/**
 * Generate text using Gemini AI
 * @param {string} prompt - The prompt to send to Gemini
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Object>} - The response from Gemini
 */
export const generateText = async (prompt, options = {}) => {
  if (!prompt || prompt.trim() === '') {
    throw new Error('Prompt cannot be empty');
  }
  
  try {
    const response = await geminiApi.post(`/${GEMINI_MODEL}:generateContent`, {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: options.temperature || 0.7,
        topK: options.topK || 40,
        topP: options.topP || 0.95,
        maxOutputTokens: options.maxTokens || 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });
    
    if (!response.data.candidates || response.data.candidates.length === 0) {
      throw new Error('No response generated from AI');
    }
    
    return {
      text: response.data.candidates[0].content.parts[0].text,
      raw: response.data
    };
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    
    // Create a more descriptive error message
    let errorMessage = 'Failed to generate text';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = `API Error (${error.response.status}): ${error.response.data?.error?.message || 'Unknown API error'}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from AI service. Please check your internet connection.';
    }
    
    // Attach the error message to the error object
    error.displayMessage = errorMessage;
    
    throw error;
  }
};

/**
 * Summarize meeting notes
 * @param {string} meetingNotes - The meeting notes to summarize
 * @returns {Promise<Object>} - The summarized meeting notes
 */
export const summarizeMeeting = async (meetingNotes) => {
  const prompt = `
    Summarize the following meeting notes. Extract:
    1. Key decisions made
    2. Action items (with assignees if mentioned)
    3. Main discussion points
    4. Follow-up items
    
    Meeting Notes:
    ${meetingNotes}
    
    Format the summary in a clear, structured way using Markdown:
    - Use ## for section headings
    - Use bullet points for lists
    - Use **bold** for emphasis
    - Use > for important notes or quotes
  `;
  
  return generateText(prompt, { temperature: 0.3 });
};

/**
 * Extract action items from meeting notes
 * @param {string} meetingNotes - The meeting notes to extract action items from
 * @returns {Promise<Object>} - The extracted action items
 */
export const extractActionItems = async (meetingNotes) => {
  const prompt = `
    Extract all action items from the following meeting notes.
    For each action item, identify:
    1. The task description
    2. The assignee (if mentioned)
    3. The due date (if mentioned)
    4. The priority level (if mentioned)
    
    Meeting Notes:
    ${meetingNotes}
    
    Format the action items as a JSON array with the following structure:
    [
      {
        "description": "Task description",
        "assignedTo": "Person name or null if not specified",
        "dueDate": "YYYY-MM-DD or null if not specified",
        "priority": "high/medium/low or null if not specified"
      }
    ]

    Make sure to use double quotes for all property names and string values, and ensure the JSON is properly formatted.
  `;
  
  const response = await generateText(prompt, { temperature: 0.2 });
  try {
    // Extract the JSON part from the response
    const jsonMatch = response.text.match(/\[\s*\{.*\}\s*\]/s);
    if (jsonMatch) {
      try {
        // Try to parse the extracted JSON
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        
        // Try to fix common JSON formatting issues
        let fixedJson = jsonMatch[0]
          // Replace single quotes with double quotes
          .replace(/'/g, '"')
          // Fix unquoted property names
          .replace(/(\s*)(\w+)(\s*):(\s*)/g, '$1"$2"$3:$4')
          // Fix trailing commas in arrays/objects
          .replace(/,(\s*[\]}])/g, '$1');
        
        try {
          return JSON.parse(fixedJson);
        } catch (secondError) {
          console.error('Failed to fix JSON:', secondError);
          // Return a fallback empty array with an error message
          return [{ 
            description: "Could not parse action items. Please try reformatting your input.",
            assignedTo: null,
            dueDate: null,
            priority: "high"
          }];
        }
      }
    }
    
    // If no JSON-like structure was found, return a fallback
    console.warn('No JSON structure found in response');
    return [{ 
      description: "No action items detected. Please provide more detailed meeting notes.",
      assignedTo: null,
      dueDate: null,
      priority: null
    }];
  } catch (error) {
    console.error('Error processing action items:', error);
    // Return a fallback instead of throwing
    return [{ 
      description: "Error processing action items: " + error.message,
      assignedTo: null,
      dueDate: null,
      priority: null
    }];
  }
};

/**
 * Generate a meeting agenda based on previous meetings and topics
 * @param {Array} previousMeetings - Array of previous meeting objects
 * @param {Array} participants - Array of participant names
 * @param {string} meetingPurpose - The purpose of the meeting
 * @returns {Promise<Object>} - The generated agenda
 */
export const generateAgenda = async (previousMeetings, participants, meetingPurpose) => {
  const previousMeetingsText = previousMeetings
    .map(m => `Meeting on ${m.date}: ${m.title}\nKey points: ${m.summary || 'No summary available'}`)
    .join('\n\n');
  
  const prompt = `
    Generate a structured meeting agenda for a meeting with the following details:
    
    Purpose: ${meetingPurpose}
    
    Participants: ${participants.join(', ')}
    
    Previous related meetings:
    ${previousMeetingsText}
    
    Create a well-structured agenda with:
    1. Welcome and introduction (2 minutes)
    2. 3-5 main discussion topics with estimated time for each
    3. Time for questions and next steps
    4. Total meeting duration recommendation
    
    Format the agenda using Markdown:
    - Use ## for main sections
    - Use ### for subsections
    - Use bullet points for lists
    - Use **bold** for emphasis
    - Use > for important notes
  `;
  
  return generateText(prompt, { temperature: 0.7 });
};

/**
 * Analyze meeting sentiment and engagement
 * @param {string} meetingTranscript - The meeting transcript to analyze
 * @returns {Promise<Object>} - The sentiment analysis results
 */
export const analyzeMeetingSentiment = async (meetingTranscript) => {
  const prompt = `
    Analyze the sentiment and engagement in the following meeting transcript.
    Provide:
    1. Overall meeting sentiment (positive, neutral, negative)
    2. Engagement level (high, medium, low)
    3. Key moments of agreement or disagreement
    4. Participants who were most and least engaged (if identifiable)
    
    Meeting Transcript:
    ${meetingTranscript}
    
    Format the analysis as a JSON object with the following structure:
    {
      "sentiment": "positive/neutral/negative",
      "engagement": "high/medium/low",
      "keyMoments": "Description of key moments",
      "participants": "Analysis of participant engagement"
    }

    Make sure to use double quotes for all property names and string values, and ensure the JSON is properly formatted.
  `;
  
  const response = await generateText(prompt, { temperature: 0.3 });
  try {
    // Extract the JSON part from the response
    const jsonMatch = response.text.match(/\{.*\}/s);
    if (jsonMatch) {
      try {
        // Try to parse the extracted JSON
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        
        // Try to fix common JSON formatting issues
        let fixedJson = jsonMatch[0]
          // Replace single quotes with double quotes
          .replace(/'/g, '"')
          // Fix unquoted property names
          .replace(/(\s*)(\w+)(\s*):(\s*)/g, '$1"$2"$3:$4')
          // Fix trailing commas in objects
          .replace(/,(\s*\})/g, '$1');
        
        try {
          return JSON.parse(fixedJson);
        } catch (secondError) {
          console.error('Failed to fix JSON:', secondError);
          // Return a fallback with the text as analysis
          return { 
            analysis: response.text,
            sentiment: "unknown",
            engagement: "unknown"
          };
        }
      }
    }
    // If JSON parsing fails, return the text response
    return { 
      analysis: response.text,
      sentiment: "unknown",
      engagement: "unknown"
    };
  } catch (error) {
    console.error('Error parsing sentiment analysis:', error);
    return { 
      analysis: response.text,
      error: error.message
    };
  }
};

// Export configuration for testing
export const config = {
  GEMINI_API_KEY,
  GEMINI_API_URL,
  GEMINI_MODEL
};

export default {
  generateText,
  summarizeMeeting,
  extractActionItems,
  generateAgenda,
  analyzeMeetingSentiment,
  GEMINI_API_KEY // Expose API key for testing
}; 