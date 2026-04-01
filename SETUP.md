# TrustBound - Freelance Escrow Platform

Complete integration of Frontend + Backend

## Project Structure

```
tech titans/
├── frontend/          # React Frontend
│   ├── index.html    # Main HTML (replaces with comprehensive version)
│   ├── src/
│   └── package.json
└── trustbound/
    ├── backend/      # Express.js Backend
    │   ├── server.js
    │   ├── routes/   (auth, projects, disputes)
    │   ├── models/   (User, Project, Dispute)
    │   ├── middleware/
    │   └── package.json
    └── frontend/     # Production build
        └── build/
```

## Backend Setup

### 1. Install Dependencies

```bash
cd trustbound/backend
npm install
```

Dependencies already in package.json:
- Express.js
- MongoDB (mongoose)
- Socket.io (real-time disputes)
- JWT (authentication)
- CORS
- jsPDF (invoice generation)

### 2. Environment Variables

Create `.env` file in `backend/`:

```
MONGO_URI=mongodb://localhost:27017/trustbound
JWT_SECRET=your-super-secret-key-here-min-32-chars
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB

```bash
# Start MongoDB locally (Windows)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in .env
```

### 4. Start Backend Server

```bash
cd trustbound/backend
npm run dev
# Server runs on http://localhost:5000
```

### Server Routes

- `GET /api/health` - Health check
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET/POST /api/projects` - Manage projects
- `GET/POST /api/disputes` - Manage disputes
- WebSocket: Real-time dispute chat via Socket.io

## Frontend Setup

### 1. Update Frontend HTML

The comprehensive `trustbound.html` has been integrated with:
- All pages (Landing, Auth, Dashboard, Project Detail, Wallet, Disputes, Invoices)
- API integration endpoints
- Socket.io for real-time chat
- Authentication with JWT tokens

Replace `frontend/index.html` with the comprehensive version that includes:

```javascript
// API Configuration
const API_BASE_URL = '/api';  // Uses backend on same server
const SOCKET_URL = window.location.origin;

// API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  return await response.json();
}

// Socket.io for real-time disputes
socket = io(SOCKET_URL);
socket.on('receive_message', (msg) => {
  // Update chat UI
});
```

### 2. Run Frontend Locally (Development)

```bash
# Option 1: Open index.html directly
open frontend/index.html

# Option 2: Use a local server
cd frontend
python -m http.server 3000
# Access at http://localhost:3000
```

### 3. Build for Production

```bash
cd trustbound/frontend
npm run build
# Creates optimized build in build/ folder
```

The backend serves the frontend build:
```javascript
// server.js
const FRONTEND_BUILD = path.join(__dirname, '../frontend/build');
app.use(express.static(FRONTEND_BUILD));
app.get('*', (req, res) => res.sendFile(path.join(FRONTEND_BUILD, 'index.html')));
```

## Running Together

### Development Mode

**Terminal 1 - Backend:**
```bash
cd trustbound/backend
npm run dev
# Backend: http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
python -m http.server 3000
# Frontend: http://localhost:3000
```

Frontend API calls to: `http://localhost:5000/api`

### Production Mode

```bash
# Build frontend
cd trustbound/frontend
npm run build

# Start backend (serves frontend)
cd ../backend
npm start

# Visit http://localhost:5000
# Backend serves both API and frontend
```

## Features Integrated

### Frontend Pages

1. **Landing** - Marketing site & CTA
2. **Auth** - Register & Login with role selection
3. **Dashboard** - Active projects, stats
4. **Project Detail** - Milestones, contract, escrow balance
5. **Wallet** - Escrow balance & transaction history
6. **Disputes** - Real-time chat for dispute resolution
7. **Invoices** - Invoice generation & printing

### Backend APIs

#### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate user
- Response: `{ token, user }` (JWT)

#### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create project (locks escrow)
- `GET /api/projects/:id` - Project details
- `PUT /api/projects/:id` - Update project status

#### Disputes
- `GET /api/disputes` - List active disputes
- `POST /api/disputes` - Create dispute
- `GET /api/disputes/:id/messages` - Chat history
- WebSocket: Real-time messaging

#### Health
- `GET /api/health` - Check backend status

## Database Models

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: 'freelancer' | 'client',
  wallet: Number,
  createdAt: Date
}
```

### Project
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  freelancer: ObjectId (ref User),
  client: ObjectId (ref User),
  budget: Number,
  status: 'in_progress' | 'completed' | 'disputed',
  escrowAmount: Number,
  milestones: [{
    title: String,
    amount: Number,
    status: 'pending' | 'approved' | 'released'
  }],
  createdAt: Date
}
```

### Dispute
```javascript
{
  _id: ObjectId,
  project: ObjectId (ref Project),
  initiator: ObjectId (ref User),
  status: 'open' | 'resolved',
  messages: [{
    sender: ObjectId,
    text: String,
    timestamp: Date
  }],
  createdAt: Date
}
```

## Testing

### Demo Account
- Email: `arjun@example.com`
- Password: `password`
- Click "🚀 Try Demo Account" button

### Test Flows

1. **Register** → Create account as Freelancer/Client
2. **Create Project** → Add title, budget, deadline
3. **Generate Milestones** → AI breaks project into 5 milestones
4. **View Escrow** → See locked funds in wallet
5. **Approve Milestone** → Release payment
6. **Dispute** → Chat with client, resolve issues
7. **Invoice** → Generate & print invoice

## Troubleshooting

### Backend not starting
```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Use different port
PORT=3001 npm run dev
```

### MongoDB connection error
```bash
# Make sure MongoDB is running
# Update MONGO_URI in .env
# Or use MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/trustbound
```

### CORS errors when frontend calls backend
```javascript
// Backend already has CORS enabled
app.use(cors());

// If issues persist, update server.js:
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));
```

### Socket.io not connecting
```javascript
// Ensure Socket.io is properly initialized
socket = io(window.location.origin, {
  reconnection: true,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log('✓ Connected to server:', socket.id);
});
```

## Next Steps

1. **Update frontend/index.html** with comprehensive version (in Downloads)
2. **Configure MongoDB** - Create database
3. **Test Auth Flow** - Register & login
4. **Create Sample Project** - Test escrow locking
5. **Test Disputes** - Real-time chat validation
6. **Deploy** - Use Heroku/Vercel for production

## API Base URL

Update in frontend/index.html:

```javascript
// Local development
const API_BASE_URL = 'http://localhost:5000/api';

// Production (same domain)
const API_BASE_URL = '/api';
```

## Deployment

### Heroku

```bash
# Backend
cd trustbound/backend
heroku create trustbound-api
heroku config:set MONGO_URI=<your-mongodb-atlas-uri>
git push heroku main

# Frontend
cd trustbound/frontend
npm run build
# Deploy build/ folder or commit and redeploy backend
```

### Vercel

```bash
# Frontend
vercel deploy

# Update API_BASE_URL to: https://trustbound-api.herokuapp.com/api
```

---

**Status**: ✅ Backend ready | ⏳ Frontend integration in progress

Contact: [Your Info]
