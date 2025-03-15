// 1. Admin Login
POST /api/auth/login
{
    "email": "admin@example.com",
    "password": "123456"
}

// 2. Get Dashboard Data
GET /api/dashboard/admin

// 3. Create Meeting
POST /api/meetings
{
    "title": "Team Sync",
    "description": "Weekly sync meeting",
    "date": "2024-01-20T10:00:00Z",
    "duration": 60,
    "participants": ["user1_id", "user2_id"]
}

// 4. Assign Tasks
POST /api/meetings/:meetingId/tasks
{
    "title": "Update Documentation",
    "assignedTo": "user1_id",
    "deadline": "2024-01-25"
}

// 5. Add Pain Points if needed
POST /api/meetings/:meetingId/painpoints
{
    "title": "Communication Gap",
    "severity": "high"
} 