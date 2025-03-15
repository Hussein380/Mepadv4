import aiService from '../services/ai';

/**
 * Test file for AI Service
 * Run this file with Node.js to test the AI service functionality
 * 
 * Usage: node ai-service-test.js
 */

// Configuration
const TEST_TIMEOUT = 30000; // 30 seconds timeout for API calls

// Test data
const testMeetingNotes = `
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

const testMeetingPurpose = "Quarterly planning meeting to discuss product roadmap and resource allocation";
const testParticipants = ["John", "Sarah", "Mike", "Lisa"];
const testTranscript = `
John: I think we should reconsider the timeline for this project.
Sarah: I agree, the current deadline seems unrealistic.
Mike: We've already committed to the client. We can't change it now.
John: But rushing could compromise quality.
Sarah: Maybe we can deliver in phases?
Mike: That's actually a good compromise. Let's outline what that could look like.
John: I'm relieved we found a solution everyone can agree on.
`;

// Test functions
async function testSummarizeMeeting() {
  console.log("\n=== Testing Summarize Meeting ===");
  try {
    console.log("Sending request to summarize meeting notes...");
    const result = await aiService.summarizeMeeting(testMeetingNotes);
    console.log("✅ Success! Summary received:");
    console.log(result.text);
    return true;
  } catch (error) {
    console.error("❌ Error testing summarizeMeeting:", error.displayMessage || error.message);
    return false;
  }
}

async function testExtractActionItems() {
  console.log("\n=== Testing Extract Action Items ===");
  try {
    console.log("Sending request to extract action items...");
    const result = await aiService.extractActionItems(testMeetingNotes);
    console.log("✅ Success! Action items received:");
    console.log(JSON.stringify(result, null, 2));
    return true;
  } catch (error) {
    console.error("❌ Error testing extractActionItems:", error.displayMessage || error.message);
    return false;
  }
}

async function testGenerateAgenda() {
  console.log("\n=== Testing Generate Agenda ===");
  try {
    console.log("Sending request to generate agenda...");
    const result = await aiService.generateAgenda([], testParticipants, testMeetingPurpose);
    console.log("✅ Success! Agenda received:");
    console.log(result.text);
    return true;
  } catch (error) {
    console.error("❌ Error testing generateAgenda:", error.displayMessage || error.message);
    return false;
  }
}

async function testAnalyzeSentiment() {
  console.log("\n=== Testing Analyze Sentiment ===");
  try {
    console.log("Sending request to analyze sentiment...");
    const result = await aiService.analyzeMeetingSentiment(testTranscript);
    console.log("✅ Success! Sentiment analysis received:");
    console.log(JSON.stringify(result, null, 2));
    return true;
  } catch (error) {
    console.error("❌ Error testing analyzeMeetingSentiment:", error.displayMessage || error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log("Starting AI Service Tests...");
  console.log("API Key present:", !!aiService.GEMINI_API_KEY);
  
  let results = {
    summarize: false,
    actionItems: false,
    agenda: false,
    sentiment: false
  };
  
  try {
    results.summarize = await testSummarizeMeeting();
    results.actionItems = await testExtractActionItems();
    results.agenda = await testGenerateAgenda();
    results.sentiment = await testAnalyzeSentiment();
    
    // Summary
    console.log("\n=== Test Results Summary ===");
    console.log(`Summarize Meeting: ${results.summarize ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Extract Action Items: ${results.actionItems ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Generate Agenda: ${results.agenda ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Analyze Sentiment: ${results.sentiment ? '✅ PASS' : '❌ FAIL'}`);
    
    const overallResult = Object.values(results).every(r => r);
    console.log(`\nOverall Result: ${overallResult ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
  } catch (error) {
    console.error("Error running tests:", error);
  }
}

// Set timeout for the entire test suite
const testTimeout = setTimeout(() => {
  console.error("Tests timed out after", TEST_TIMEOUT / 1000, "seconds");
  process.exit(1);
}, TEST_TIMEOUT);

// Run tests and clear timeout when done
runAllTests().then(() => {
  clearTimeout(testTimeout);
}); 