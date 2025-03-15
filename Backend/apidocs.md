# MePad API Documentation

## Base URL
- Production: `https://me-pad-backend.vercel.app/api`
- Development: `http://localhost:5002/api`

## Authentication
All endpoints (except login/register) require JWT token in header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```
**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
**Response:**
```json
{
    "success": true,
    "data": {
        "token": "jwt_token",
        "user": {
            "email": "user@example.com",
            "id": "user_id"
        }
    }
}
```

#### Login
```http
POST /auth/login
```
**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

### Meetings

#### Create Meeting
```http
POST /meetings
```
**Request Body:**
```json
{
    "title": "Project Kickoff",
    "date": "2024-03-20T10:00:00Z",
    "venue": "Conference Room A",
    "summary": "Initial project discussion",
    "participants": [
        {
            "name": "John Doe",
            "email": "john@example.com"
        }
    ],
    "actionPoints": [
        {
            "description": "Create project timeline",
            "assignedTo": "john@example.com",
            "dueDate": "2024-03-25T00:00:00Z"
        }
    ]
}
```

#### Get All Meetings
```http
GET /meetings
```

#### Get Single Meeting
```http
GET /meetings/:id
```

#### Update Meeting
```http
PUT /meetings/:id
```

#### Delete Meeting
```http
DELETE /meetings/:id
```

### Action Points

#### Add Action Point
```http
POST /meetings/:meetingId/action-points
```

#### Update Action Point
```http
PUT /meetings/:meetingId/action-points/:actionId
```

#### Delete Action Point
```http
DELETE /meetings/:meetingId/action-points/:actionId
```

### Dashboard

#### Get Dashboard Data
```http
GET /dashboard
```
**Response:**
```json
{
    "success": true,
    "data": {
        "stats": {
            "totalMeetings": 10,
            "upcomingMeetings": 3,
            "pendingActions": 5,
            "completedActions": 15
        },
        "recentMeetings": [],
        "pendingActions": []
    }
}
```

## Error Responses
All error responses follow this format:
```json
{
    "success": false,
    "error": "Error message here"
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
