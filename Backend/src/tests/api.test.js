const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let adminToken = '';
let participantToken = '';
let meetingId = '';
let taskId = '';
let adminId = '';
let participantId = '';

// Add this before running tests
const validateResponse = (response, expectedFields) => {
    if (!response.success) {
        throw new Error('Response indicates failure');
    }
    
    expectedFields.forEach(field => {
        if (!response.data[field]) {
            throw new Error(`Missing expected field: ${field}`);
        }
    });
};

const testAPI = async () => {
    try {
        // Generate unique email for participant
        const timestamp = Date.now();
        const participantEmail = `participant${timestamp}@example.com`;

        // 1. Test login with existing user
        console.log('\n1. Testing login...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: "admin2@example.com",
            password: "123456"
        });
        validateResponse(loginResponse.data, ['_id', 'email', 'role', 'token']);
        adminToken = loginResponse.data.data.token;
        adminId = loginResponse.data.data._id;
        console.log('Login successful:', loginResponse.data);

        // 2. Create a test participant
        console.log('\n2. Testing participant registration...');
        const participantResponse = await axios.post(`${API_URL}/auth/register`, {
            email: participantEmail,
            password: "123456",
            role: "participant"
        });
        participantToken = participantResponse.data.data.token;
        participantId = participantResponse.data.data._id;
        console.log('Participant registered:', participantResponse.data);

        // 3. Test meeting creation
        console.log('\n3. Testing meeting creation...');
        const meetingResponse = await axios.post(
            `${API_URL}/meetings`,
            {
                title: "First Team Meeting",
                description: "Discussing project roadmap",
                date: new Date(Date.now() + 86400000),
                duration: 60,
                participants: [participantResponse.data.data._id]
            },
            {
                headers: { Authorization: `Bearer ${adminToken}` }
            }
        );
        meetingId = meetingResponse.data.data._id;
        console.log('Meeting created:', meetingResponse.data);

        // 4. Test participant access to meeting
        console.log('\n4. Testing participant access...');
        const participantMeetingResponse = await axios.get(
            `${API_URL}/meetings/${meetingId}`,
            {
                headers: { Authorization: `Bearer ${participantToken}` }
            }
        );
        console.log('Participant can access meeting:', participantMeetingResponse.data);

        // 5. Test validation errors
        console.log('\n5. Testing validations...');
        try {
            await axios.post(
                `${API_URL}/meetings/${meetingId}/tasks`,
                {
                    title: "",
                    priority: "invalid"
                },
                {
                    headers: { Authorization: `Bearer ${adminToken}` }
                }
            );
        } catch (error) {
            console.log('Validation working as expected:', error.response.data);
        }

        // 6. Test task creation and assignment
        console.log('\n6. Testing task creation...');
        const taskResponse = await axios.post(
            `${API_URL}/meetings/${meetingId}/tasks`,
            {
                title: "Update Documentation",
                description: "Add API documentation",
                priority: "high",
                deadline: new Date(Date.now() + 172800000),
                assignedTo: participantResponse.data.data._id // Assign to participant
            },
            {
                headers: { Authorization: `Bearer ${adminToken}` }
            }
        );
        taskId = taskResponse.data.data._id;
        console.log('Task created:', taskResponse.data);

        // 7. Test participant task update
        console.log('\n7. Testing participant task update...');
        const participantTaskUpdate = await axios.put(
            `${API_URL}/tasks/${taskId}`,
            {
                status: "in-progress"
            },
            {
                headers: { Authorization: `Bearer ${participantToken}` }
            }
        );
        console.log('Participant updated task:', participantTaskUpdate.data);

        console.log('\nAll tests passed successfully! ✅');

    } catch (error) {
        console.error('\nTest failed ❌:', error.response?.data || error.message);
        if (error.response) {
            console.error('Error status:', error.response.status);
            console.error('Error details:', error.response.data);
        }
    } finally {
        await cleanup();
    }
};

async function cleanup() {
    try {
        console.log('\nCleaning up test data...');
        
        // Delete in correct order to avoid foreign key issues
        // First delete tasks
        if (taskId) {
            try {
                await axios.delete(`${API_URL}/tasks/${taskId}`, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
                console.log('Test task deleted');
            } catch (error) {
                console.log('Task cleanup skipped:', error.message);
            }
        }

        // Then delete meeting
        if (meetingId) {
            try {
                await axios.delete(`${API_URL}/meetings/${meetingId}`, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
                console.log('Test meeting deleted');
            } catch (error) {
                console.log('Meeting cleanup skipped:', error.message);
            }
        }

        // Finally delete participant
        if (participantId) {
            try {
                await axios.delete(`${API_URL}/auth/users/${participantId}`, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
                console.log('Test participant deleted');
            } catch (error) {
                console.log('Participant cleanup skipped:', error.message);
            }
        }

        console.log('Cleanup completed successfully');
    } catch (error) {
        console.error('Cleanup failed:', error.message);
    }
}

// Add this function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Modify the test run
console.log('Starting API tests...');
(async () => {
    await testAPI();
    // Wait 2 seconds before running again
    await delay(2000);
    // Run again if needed
    // await testAPI();
})(); 