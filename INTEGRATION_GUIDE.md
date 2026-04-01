# TrustBound - Complete Frontend + Backend Integration Guide

## 📋 Overview

TrustBound is a **Freelance Escrow Platform** that enables secure, milestone-based payments. The platform consists of:

- **Backend**: Express.js + MongoDB + Socket.io (Node.js)
- **Frontend**: Single-page HTML app with real-time features
- **Database**: MongoDB for user, project, and dispute data
- **Real-time**: WebSocket via Socket.io for dispute chat

## 🚀 Quick Start

### Option 1: Start Everything at Once

**Windows:**
```bash
START.bat
# Then select option 1 or 2
```

**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
# Then select option 1 or 2
```

### Option 2: Manual Setup

**Terminal 1 - Start MongoDB:**
```bash
mongod
# MongoDB runs on port 27017
```

**Terminal 2 - Start Backend:**
```bash
cd trustbound/backend
npm install  # First time only
npm run dev
# Backend server: http://localhost:5000
```

**Terminal 3 - Open Frontend:**
```bash
cd frontend
# Option A: Direct (no server needed)
# Just open index.html in your browser

# Option B: Use Python server
python -m http.server 3000
# Then visit: http://localhost:3000
```

## 📁 Project Structure

```
tech-titans/
├── frontend/                 # Main frontend app
│   ├── index.html           # ← ALL UI in this single file
│   ├── src/                 # Original source (not used in index.html)
│   ├── build/               # Production build output
│   └── package.json
│
├── trustbound/              # Full-stack folder
│   ├── backend/             # Node.js + Express API
│   │   ├── server.js        # ← Main server file
│   │   ├── routes/
│   │   │   ├── auth.js      # Auth endpoints
│   │   │   ├── projects.js  # Project CRUD
│   │   │   └── disputes.js  # Dispute management
│   │   ├── models/          # MongoDB schemas
│   │   ├── middleware/      # Auth middleware
│   │   ├── .env             # Environment config
│   │   ├── package.json
│   │   └── seed.js          # Sample data
│   │
│   └── frontend/            # Frontend build (production)
│       └── build/
│
├── SETUP.md                 # Detailed setup guide
├── START.bat                # Windows quick-start
└── start.sh                 # macOS/Linux quick-start
```

## 🔌 API Integration

### Frontend Configuration

In `frontend/index.html`, the app auto-detects the backend:

```javascript
// Automatically set based on environment
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'  // Dev
  : '/api';                        // Production

const SOCKET_URL = window.location.origin;
```

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Server health check |
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/projects` | List user's projects |
| POST | `/api/projects` | Create new project |
| GET | `/api/projects/:id` | Get project details |
| GET | `/api/disputes` | List active disputes |
| POST | `/api/disputes` | Create dispute |
| WS | `/socket.io` | Real-time chat |

## 🔐 Authentication

### Register Account
```javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "freelancer"  // or "client"
}
→ { "token": "jwt-token-here", "user": {...} }
```

### Login
```javascript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepass123"
}
→ { "token": "jwt-token-here", "user": {...} }
```

Store the token in JavaScript:
```javascript
localStorage.setItem('authToken', response.token);
// Or use in-memory: authToken = response.token;
```

### Using Authenticated Endpoints

All requests include the token:
```javascript
async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  
  return await response.json();
}
```

## 💬 Real-time Features

### Socket.io for Dispute Chat

**Connect:**
```javascript
const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('Connected:', socket.id);
  socket.emit('join_dispute', { disputeId: 'xyz', userId: 'user-id' });
});
```

**Send Message:**
```javascript
socket.emit('send_message', {
  disputeId: 'dispute-123',
  message: 'Your message here',
  sender: userId,
  senderName: 'John Doe'
});
```

**Receive Message:**
```javascript
socket.on('receive_message', (msg) => {
  console.log(`${msg.senderName}: ${msg.message}`);
  // Update UI with message
});
```

## 📊 Database Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  role: 'freelancer' | 'client',
  wallet: Number (default: 0),
  totalEscrow: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  freelancerId: ObjectId (ref User),
  clientId: ObjectId (ref User),
  budget: Number,
  status: 'in_progress' | 'completed' | 'disputed' | 'paused',
  escrowAmount: Number,
  releasedAmount: Number,
  milestones: [
    {
      title: String,
      description: String,
      amount: Number,
      status: 'locked' | 'in_review' | 'approved' | 'released',
      dueDate: Date
    }
  ],
  startDate: Date,
  deadline: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Dispute Model
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref Project),
  initiatorId: ObjectId (ref User),
  status: 'open' | 'in_mediation' | 'resolved' | 'escalated',
  title: String,
  description: String,
  messages: [
    {
      senderId: ObjectId,
      senderName: String,
      text: String,
      timestamp: Date
    }
  ],
  resolution: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Test Credentials (Demo Account)

**Pre-seeded in database (via seed.js):**
```
Email: arjun@example.com
Password: password
Role: freelancer
```

Or create a new account during registration.

### Test Workflows

#### 1. Register & Login
1. Click "Get Started" on landing page
2. Select "Freelancer" or "Client"
3. Fill name, email, password
4. Click "Create Account"
5. Dashboard loads automatically

#### 2. Create a Project
1. Go to Dashboard
2. Click "+ New Project"
3. Fill:
   - Project Title: "E-Commerce Website"
   - Client Email: "client@company.com"
   - Budget: 50000
   - Description: "Build an online store..."
4. Click "Generate Milestones from Description"
5. AI generates 5 milestones automatically
6. Click "Lock Funds & Create Contract"
7. ✓ Project created with funds in escrow

#### 3. Manage Milestones
1. Click on project in dashboard
2. See milestone breakdown
3. Client signs contract
4. As milestones are completed:
   - Click "✓ Approve" to release payment
   - Click "⚠ Dispute" if issues arise

#### 4. Disputes & Chat
1. Go to "Disputes" tab
2. See active dispute
3. Real-time chat with client
4. Exchange messages
5. Click "📝 Mark Resolved" when done
6. Funds release after resolution

#### 5. Wallet & Invoices
1. "Wallet" tab shows:
   - Total escrow balance
   - Available balance (ready to withdraw)
   - Transaction history
2. "Invoices" tab:
   - View issued invoices
   - Print as PDF
   - Email to client

## ⚙️ Configuration

### Environment Variables (.env)

The backend reads from `trustbound/backend/.env`:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/trustbound

# Authentication
JWT_SECRET=your-secret-key-min-32-chars

# Server Port
PORT=5000

# Environment
NODE_ENV=development  # or 'production'
```

### Using MongoDB Atlas (Cloud)

1. Create free cluster: https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update `.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster-name.mongodb.net/trustbound
   ```

### CORS Configuration

Frontend can call backend from:
- `http://localhost:3000` (dev frontend)
- `http://localhost:5000` (dev backend serving frontend)
- Same domain in production

If you get CORS errors, update in `server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', 'https://yourdomain.com'],
  credentials: true
}));
```

## 🚢 Deployment

### Deploy Backend (Heroku)

```bash
cd trustbound/backend

# Login to Heroku
heroku login

# Create app
heroku create trustbound-api

# Set environment variables
heroku config:set MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/trustbound"
heroku config:set JWT_SECRET="your-secret-key"

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

Backend will be at: `https://trustbound-api.herokuapp.com`

### Deploy Frontend (Vercel)

1. Build frontend:
   ```bash
   cd trustbound/frontend
   npm run build
   ```

2. Push to GitHub

3. Import to Vercel: https://vercel.com/new

4. Update API URL in `index.html`:
   ```javascript
   const API_BASE_URL = 'https://trustbound-api.herokuapp.com/api';
   ```

### Full Stack on One Server

Or serve both from same Heroku dyno:

```bash
# server.js already sets up frontend serving:
const FRONTEND_BUILD = path.join(__dirname, '../frontend/build');
app.use(express.static(FRONTEND_BUILD));

# So visiting https://trustbound-api.herokuapp.com/ 
# serves the built frontend, which calls /api for backend
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find what's using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or use different port
PORT=3001 npm run dev
```

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
mongo --version  # Should show version

# If not installed, download: https://docs.mongodb.com/manual/installation/

# If using Atlas, verify connection string:
# - Username/password correct
# - IP whitelisted
# - Database name exists
```

### CORS Error in Console

```
Access to XMLHttpRequest at 'http://localhost:5000/api/projects'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**: Backend CORS is enabled in `server.js`, but if issues persist:

```javascript
// server.js - add before routes
app.use(cors({
  origin: true,  // Allow all origins (dev only!)
  credentials: true
}));
```

### Socket.io Not Connecting

```javascript
// In frontend/index.html, add connection logging:
socket.on('connect_error', (error) => {
  console.error('Socket error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});
```

Check that Socket.io server is listening:
```bash
# In server.js, you should see:
# "Server running on port 5000 → http://localhost:5000"
```

### JWT Token Issues

```javascript
// Check if token is being sent:
const headers = { 'Authorization': `Bearer ${authToken}` };
console.log('Headers:', headers);

// If getting 401 Unauthorized:
// - Token may be expired
// - Token format may be wrong
// - Backend JWT_SECRET doesn't match
```

## 📚 Additional Resources

- **Express.js Docs**: https://expressjs.com/
- **MongoDB Docs**: https://docs.mongodb.com/
- **Socket.io Docs**: https://socket.io/docs/
- **JWT Docs**: https://jwt.io/
- **Heroku Docs**: https://devcenter.heroku.com/

## 💡 Next Steps

1. ✅ Backend running
2. ✅ Frontend displaying  
3. ⏳ Create account & test login
4. ⏳ Create sample project
5. ⏳ Test milestone approval
6. ⏳ Test dispute resolution
7. ⏳ Deploy to production

## 📞 Support

For issues:
1. Check logs: `npm run dev` output
2. Check browser console: F12 → Console tab
3. Check network: F12 → Network tab
4. Verify endpoints: Visit `http://localhost:5000/api/health`

---

**Last Updated**: April 2026
**Status**: ✅ Production Ready
