## Instructions for Building the Backend System

### **Project Overview**
This backend system is part of a Meeting Management System designed to streamline meeting workflows, task assignments, and progress tracking. The backend will:

1. Handle user authentication and role-based access control.
2. Provide endpoints for managing users, meetings, and tasks.
3. Store data securely in MongoDB.
4. Ensure clean API design for seamless integration with a React frontend.

The tech stack for this backend includes:
- **Node.js**: For server-side scripting.
- **Express.js**: For building the REST API.
- **MongoDB**: For database storage.
- **JWT (JSON Web Tokens)**: For secure authentication.
- **Mongoose**: For object modeling and database interaction.

### **Steps to Create the Backend System**

#### **1. Set Up the Environment**
1. Install **Node.js** and ensure you have the latest version.
2. Initialize a new Node.js project:
   ```bash
   mkdir meeting-management-backend
   cd meeting-management-backend
   npm init -y
   ```
3. Install required dependencies:
   ```bash
   npm install express mongoose bcrypt jsonwebtoken dotenv cors
   npm install --save-dev nodemon
   ```

#### **2. Create the Project Structure**
Organize your backend project as follows:
```
meeting-management-backend/
|-- node_modules/
|-- src/
|   |-- config/
|   |   |-- db.js
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- meetingController.js
|   |   |-- taskController.js
|   |-- middleware/
|   |   |-- authMiddleware.js
|   |-- models/
|   |   |-- User.js
|   |   |-- Meeting.js
|   |   |-- Task.js
|   |-- routes/
|   |   |-- authRoutes.js
|   |   |-- meetingRoutes.js
|   |   |-- taskRoutes.js
|-- .env
|-- .gitignore
|-- package.json
|-- server.js
```

#### **3. Configure the Database**
1. Create a `db.js` file in the `config/` directory to set up the MongoDB connection:
   ```javascript
   const mongoose = require('mongoose');

   const connectDB = async () => {
       try {
           await mongoose.connect(process.env.MONGO_URI, {
               useNewUrlParser: true,
               useUnifiedTopology: true,
           });
           console.log('MongoDB connected');
       } catch (error) {
           console.error('Database connection error:', error.message);
           process.exit(1);
       }
   };

   module.exports = connectDB;
   ```
2. Add the MongoDB URI in the `.env` file:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/meeting-management
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

#### **4. Define the Models**
1. **User Model (`User.js`)**:
   ```javascript
   const mongoose = require('mongoose');
   const bcrypt = require('bcrypt');

   const UserSchema = new mongoose.Schema({
       email: { type: String, required: true, unique: true },
       password: { type: String, required: true },
       role: { type: String, enum: ['admin', 'participant'], default: 'participant' },
   });

   UserSchema.pre('save', async function (next) {
       if (!this.isModified('password')) return next();
       this.password = await bcrypt.hash(this.password, 10);
       next();
   });

   module.exports = mongoose.model('User', UserSchema);
   ```

2. **Meeting Model (`Meeting.js`)**:
   ```javascript
   const mongoose = require('mongoose');

   const MeetingSchema = new mongoose.Schema({
       title: { type: String, required: true },
       description: { type: String },
       date: { type: Date, required: true },
       createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
       participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
   });

   module.exports = mongoose.model('Meeting', MeetingSchema);
   ```

3. **Task Model (`Task.js`)**:
   ```javascript
   const mongoose = require('mongoose');

   const TaskSchema = new mongoose.Schema({
       description: { type: String, required: true },
       status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
       assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
       deadline: { type: Date },
       meetingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
   });

   module.exports = mongoose.model('Task', TaskSchema);
   ```

#### **5. Build the API**
1. **Authentication Routes (`authRoutes.js`)**:
   ```javascript
   const express = require('express');
   const { register, login } = require('../controllers/authController');
   const router = express.Router();

   router.post('/register', register);
   router.post('/login', login);

   module.exports = router;
   ```
2. **Meeting Routes (`meetingRoutes.js`)**:
   ```javascript
   const express = require('express');
   const { createMeeting, getMeetings } = require('../controllers/meetingController');
   const authMiddleware = require('../middleware/authMiddleware');
   const router = express.Router();

   router.post('/', authMiddleware, createMeeting);
   router.get('/', authMiddleware, getMeetings);

   module.exports = router;
   ```
3. **Task Routes (`taskRoutes.js`)**:
   ```javascript
   const express = require('express');
   const { createTask, updateTask } = require('../controllers/taskController');
   const authMiddleware = require('../middleware/authMiddleware');
   const router = express.Router();

   router.post('/', authMiddleware, createTask);
   router.patch('/:id', authMiddleware, updateTask);

   module.exports = router;
   ```

#### **6. Implement Middleware**
1. **Auth Middleware (`authMiddleware.js`)**:
   ```javascript
   const jwt = require('jsonwebtoken');

   const authMiddleware = (req, res, next) => {
       const token = req.headers['authorization']?.split(' ')[1];
       if (!token) return res.status(401).json({ message: 'Unauthorized' });

       try {
           const decoded = jwt.verify(token, process.env.JWT_SECRET);
           req.user = decoded;
           next();
       } catch (error) {
           res.status(401).json({ message: 'Invalid token' });
       }
   };

   module.exports = authMiddleware;
   ```

#### **7. Start the Server**
1. **Server Entry Point (`server.js`)**:
   ```javascript
   const express = require('express');
   const dotenv = require('dotenv');
   const connectDB = require('./src/config/db');
   const authRoutes = require('./src/routes/authRoutes');
   const meetingRoutes = require('./src/routes/meetingRoutes');
   const taskRoutes = require('./src/routes/taskRoutes');

   dotenv.config();
   const app = express();

   app.use(express.json());
   connectDB();

   app.use('/api/auth', authRoutes);
   app.use('/api/meetings', meetingRoutes);
   app.use('/api/tasks', taskRoutes);

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

#### **8. Test the Backend**
- Use Postman or Swagger to test the APIs.
- Ensure endpoints are functioning as expected.

With this structure and these instructions, you can quickly set up a clean and functional backend system for the Meeting Management System. Let me know if you need help with any specific part!

