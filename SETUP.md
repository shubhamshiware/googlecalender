# Complete Setup Guide

## Step-by-Step Installation

### Step 1: Clone or Extract Project
```bash
# Navigate to project directory
cd googlecalender
```

### Step 2: MongoDB Setup

#### Option A: Local MongoDB

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer and follow setup wizard
3. MongoDB will be available at: `mongodb://localhost:27017`

**Mac (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

#### Option B: MongoDB Atlas (Cloud)
1. Visit: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new project
4. Create a cluster (M0 free tier)
5. Create database user
6. Whitelist IP address
7. Copy connection string: `mongodb+srv://user:password@cluster.mongodb.net/dbname`

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Windows (PowerShell)
echo 'PORT=5000
MONGO_URI=mongodb://localhost:27017/google-calendar
JWT_SECRET=google-calendar-secret-key-2024' > .env

# Or manually create .env and add:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/google-calendar
# JWT_SECRET=google-calendar-secret-key-2024

# Start development server
npm run dev
```

Expected output:
```
Server is running on port 5000
MongoDB connected successfully
```

### Step 4: Frontend Setup

**In a new terminal:**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (if not exists)
# Windows (PowerShell)
echo 'VITE_API_URL=http://localhost:5000' > .env

# Or manually create .env and add:
# VITE_API_URL=http://localhost:5000

# Start development server
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 5: Access Application

Open browser and navigate to: **http://localhost:5173**

## Testing the Application

### Create Test Account
1. Click "Sign Up"
2. Enter:
   - Name: John Doe
   - Email: john@example.com
   - Password: test123456
3. Click Sign Up

### Create Test Event
1. Click on any time slot in week view
2. Fill in event details:
   - Title: Team Meeting
   - Start: Current date at 10:00 AM
   - End: Current date at 11:00 AM
   - Color: Blue
   - Repeat: None
3. Click Save

### Test Drag & Drop
1. Click and drag an event up or down to change time
2. Drag to a different day
3. Click event to edit

### Test Other Features
- Click "Month" to switch to month view
- Click dates in sidebar mini calendar
- Toggle dark mode (moon icon in navbar)
- Click "Today" button to jump to current date

## API Testing with curl

### Test Authentication

**Sign Up:**
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

Save the returned token for subsequent requests.

### Test Events

**Create Event:**
```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Project Deadline",
    "description": "Submit final deliverables",
    "start": "2024-01-20T15:00:00Z",
    "end": "2024-01-20T16:30:00Z",
    "color": "#EF4444",
    "repeat": "none"
  }'
```

**Get Events:**
```bash
curl -X GET "http://localhost:5000/events?start=2024-01-01&end=2024-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Update Event:**
```bash
curl -X PUT http://localhost:5000/events/EVENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated Meeting Title",
    "color": "#3B82F6"
  }'
```

**Delete Event:**
```bash
curl -X DELETE http://localhost:5000/events/EVENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Environment Variables Reference

### Backend (.env)
```
PORT              - Server port (default: 5000)
MONGO_URI         - MongoDB connection string
JWT_SECRET        - Secret key for JWT tokens
```

### Frontend (.env)
```
VITE_API_URL      - Backend API URL (default: http://localhost:5000)
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (Backend)
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Unix/Mac
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
1. Verify MongoDB is running:
   ```bash
   mongosh
   ```
2. Check connection string in `.env`
3. For Atlas, whitelist your IP in security settings

### CORS Error
- Ensure `VITE_API_URL` in frontend `.env` matches backend `PORT`
- Verify backend is running on correct port
- Clear browser cache and cookies

### Dependencies Installation Error
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# For TypeScript errors
npm run build

# Check for type issues
npx tsc --noEmit
```

## Production Deployment

### Backend (e.g., Heroku)
1. Build: `npm run build`
2. Set environment variables on hosting platform
3. Deploy dist/ folder

### Frontend (e.g., Vercel)
1. Build: `npm run build`
2. Deploy dist/ folder
3. Set `VITE_API_URL` to production backend URL

## Performance Tips

- Use MongoDB Compass to monitor database
- Check network tab in browser DevTools
- Monitor API response times
- Test with multiple concurrent users

## Development Workflow

1. **Backend changes**: Restart server (npm run dev auto-restarts with ts-node)
2. **Frontend changes**: Auto-reload on save (Vite feature)
3. **Database changes**: Apply migrations if needed
4. **API testing**: Use Postman or curl

## Next Steps

- Read full [README.md](./README.md) for feature details
- Check [API documentation](./API.md) for detailed endpoint specs
- Review security best practices for production
- Implement additional features from enhancement list
