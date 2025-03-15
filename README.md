# MePad - AI-Enhanced Meeting Management System

MePad is a comprehensive meeting management system designed to streamline the process of organizing, conducting, and following up on meetings. The application now features AI-powered capabilities to enhance productivity and extract more value from your meetings.

## AI Features

### AI Meeting Assistant

The AI Meeting Assistant leverages the Gemini AI API to provide several powerful features:

1. **Smart Meeting Summarization**
   - Automatically generate concise summaries of meeting notes
   - Extract key decisions, action items, and main discussion points
   - Save time by distilling lengthy meeting transcripts into actionable insights

2. **Intelligent Action Item Extraction**
   - Automatically identify and extract action items from meeting notes
   - Detect assignees, due dates, and priority levels
   - Organize action items in a structured format for easy tracking

3. **Meeting Preparation Assistance**
   - Generate well-structured meeting agendas based on meeting purpose
   - Consider previous related meetings and participant information
   - Create professional agendas with time allocations and discussion topics

4. **Meeting Sentiment Analysis**
   - Analyze meeting transcripts to determine overall sentiment
   - Identify engagement levels and key moments
   - Gain insights into participant engagement and meeting effectiveness

## How to Use the AI Features

1. **Access the AI Assistant**
   - From the navigation menu, click on "AI Assistant"
   - Alternatively, from the Dashboard, click on the "AI Assistant" quick action
   - From a specific meeting detail page, click the "AI Assistant" button

2. **Using with a Specific Meeting**
   - When viewing a meeting, click the "AI Assistant" button
   - The meeting context will be automatically loaded
   - Choose the AI feature you want to use (summarize, extract action items, etc.)

3. **Using Standalone**
   - Access the AI Assistant from the navigation menu
   - Select the desired feature
   - Paste your meeting notes or provide the required information
   - Click the corresponding button to process your request

## Technical Implementation

The AI features are implemented using:

- **Frontend**: React components with a modern UI
- **API Integration**: Gemini AI API for natural language processing
- **Data Processing**: Structured prompts and response parsing

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up your Gemini AI API key in the environment variables
4. Start the development server with `npm run dev`

## Environment Variables

Create a `.env` file with the following variables:

```
GEMINI_API_KEY=your_gemini_api_key
```

## License

[MIT License](LICENSE)

## Overview
MePad is a comprehensive meeting management system that helps teams organize, track, and manage their meetings efficiently. Users can create meetings, add action points, track progress, and manage participants all in one place.

## Features
- **User Authentication**
  - Register/Login functionality
  - Secure JWT-based authentication
  - Role-based access control

- **Meeting Management**
  - Create and schedule meetings
  - Add and manage participants
  - Track action points and their status
  - Add meeting summaries and venues

- **Action Points**
  - Assign tasks to participants
  - Set due dates
  - Track status (pending, in-progress, completed)
  - Email notifications (coming soon)

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Deployment**: Vercel

## Live Demo
- Frontend: https://me-pad-fronted.vercel.app
- Backend API: https://me-pad-backend.vercel.app/api

## Local Development Setup

### Backend Setup
1. Clone the repository
2. Navigate to backend directory:
   ```bash
   cd Backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create `.env` file:
   ```
   PORT=5002
   NODE_ENV=development
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```
   VITE_API_URL=http://localhost:5002/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation
See [API_DOCS.md](Backend/apidocs.md) for detailed API documentation.

## Project Structure
- `/Backend` - Node.js/Express backend
- `/Frontend` - React frontend (coming soon)

## Getting Started

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following content:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/meeting-management
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Testing the System
1. Open http://localhost:3000 in your browser
2. Register a new account or use the default admin account:
   - Email: admin@example.com
   - Password: 123456

## Features
- User Authentication (Login/Register)
- Meeting Management
- Task Assignment
- Pain Points Tracking
- Role-based Access Control

### Important Notes
- Default port is 5001 (if 5000 is busy)
- Server will automatically find an available port
- Check MongoDB connection in the console

### API Documentation
See `/Backend/apidocs.md` for complete API documentation.

### Troubleshooting
If you see "Port in use" message:
1. The server will automatically try the next available port
2. Check the console for the actual running port
3. Use `npm run check-port` to see what's using the default port

### System Requirements
- Node.js (>= 14.17.0)
- npm (>= 6.14.13)
- React (>= 17.0.2)

### Contributing
Contributions are welcome. Please submit a pull request with a detailed description of changes. 