// Standalone test script for the Gemini AI API
import axios from 'axios';

// Gemini AI API configuration
const GEMINI_API_KEY = 'AIzaSyD2Zxg_EP32z79Ubd-odUO_y8OYfFmNQGE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_MODEL = 'models/gemini-1.5-pro';

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

// Test data
const testPrompt = `
Summarize the following meeting notes:

Team Meeting - July 10, 2023
Attendees: John, Sarah, Mike, Lisa

Agenda:
1. Project status update
2. Budget review
3. Timeline adjustments

Discussion:
- John presented the current project status. We're 70% complete.
- Sarah raised concerns about the budget. We're currently 15% over budget.
- Mike suggested cutting some features to meet the deadline.
- Lisa will talk to the client about extending the deadline by 2 weeks.

Action Items:
- John will update the project plan by Wednesday
- Sarah will revise the budget by Friday
- Mike will prioritize features by Thursday
- Lisa will contact the client by tomorrow

Next meeting: July 17, 2023
`;

async function listModels() {
  console.log("Listing available models...");
  try {
    const response = await geminiApi.get('/models');
    console.log("Available models:");
    response.data.models.forEach(model => {
      console.log(`- ${model.name} (${model.supportedGenerationMethods.join(', ')})`);
    });
    return response.data.models;
  } catch (error) {
    console.error("Error listing models:", error.message);
    if (error.response) {
      console.error(`API Error (${error.response.status}):`, error.response.data?.error?.message || 'Unknown API error');
    }
    return [];
  }
}

async function testGeminiAPI() {
  console.log("Starting Gemini AI API Test...");
  console.log("API Key present:", !!GEMINI_API_KEY);
  console.log("API URL:", GEMINI_API_URL);
  console.log("Model:", GEMINI_MODEL);
  
  // First list available models
  await listModels();
  
  try {
    console.log("\nSending request to Gemini API...");
    
    const response = await geminiApi.post(`/${GEMINI_MODEL}:generateContent`, {
      contents: [
        {
          parts: [
            {
              text: testPrompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
    
    if (!response.data.candidates || response.data.candidates.length === 0) {
      console.error("❌ No response generated from AI");
      return;
    }
    
    console.log("✅ Success! Response received from Gemini API:");
    console.log("\nSummary:");
    console.log(response.data.candidates[0].content.parts[0].text);
    
    console.log("\nTest completed successfully!");
    
  } catch (error) {
    console.error("❌ Error testing Gemini API:");
    
    if (error.response) {
      console.error(`API Error (${error.response.status}):`, error.response.data?.error?.message || 'Unknown API error');
    } else if (error.request) {
      console.error('No response received from AI service. Please check your internet connection.');
    } else {
      console.error(error.message);
    }
  }
}

// Run the test
testGeminiAPI(); 