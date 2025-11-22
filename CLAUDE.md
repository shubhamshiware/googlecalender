# Development Reference Guide

Quick reference for common development tasks and commands.

## Project Overview

**Google Calendar Web App** - Full-stack calendar application with React frontend and Express backend.

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript + MongoDB
- **Database:** MongoDB (local or Atlas)

## Setup Commands

### First Time Setup
```bash
# Backend
cd backend
npm install
# Create .env file with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/google-calendar
# JWT_SECRET=your-secret-key
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
# Create .env file with:
# VITE_API_URL=http://localhost:5000
npm run dev
```

### Quick Start (After Initial Setup)
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

## Build Commands

### Backend
```bash
npm run build      # Compile TypeScript to JavaScript
npm run dev        # Development mode with ts-node
npm start          # Run production build
```

### Frontend
```bash
npm run dev        # Development server (Vite)
npm run build      # Production build
npm run preview    # Preview production build
```

## Important Files to Know

### Backend
- `src/server.ts` - Main server entry point
- `src/controllers/` - Business logic
- `src/models/` - Database schemas
- `src/routes/` - API endpoints
- `src/middleware/authMiddleware.ts` - JWT verification
- `.env` - Configuration variables

### Frontend
- `src/App.tsx` - Main app with routing
- `src/context/AuthContext.tsx` - Authentication state
- `src/context/CalendarContext.tsx` - Calendar state
- `src/components/` - React components
- `src/utils/` - Helper functions
- `.env` - API endpoint configuration

## Database

### MongoDB Local
```bash
# Start MongoDB (if using local)
mongod

# Or use MongoDB Atlas (cloud)
```

### MongoDB Compass
- Download: https://www.mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`
- View/edit data directly

## Testing API

### With curl
```bash
# Sign up
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### With Postman
1. Create new collection
2. Add requests for each endpoint
3. Use environment variables for token and base URL

## Common Issues & Solutions

### Port 5000 already in use
```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB connection refused
- Ensure MongoDB is running
- Check connection string in .env
- For Atlas: whitelist IP in security settings

### CORS errors
- Verify frontend .env has correct VITE_API_URL
- Verify backend .env has correct PORT
- Ensure backend is running before frontend

### Frontend shows login page after refresh
- Check if token exists in localStorage
- Verify JWT_SECRET matches between sessions
- Check browser console for errors

## Code Style & Standards

### TypeScript
- Use strict mode (enabled in tsconfig.json)
- Define interfaces for all data structures
- Use proper typing for React components

### React Components
- Functional components with hooks
- Use custom hooks for logic (useAuth, useCalendar)
- Props typed with TypeScript interfaces

### Express Routes
- Group related routes
- Use middleware for authentication
- Return proper HTTP status codes

## Performance Tips

### Frontend
- Use React.memo for expensive components
- Lazy load components with React.lazy
- Minimize re-renders with useCallback
- Use keys properly in lists

### Backend
- Index frequently queried fields
- Use pagination for large datasets
- Cache recurring event calculations
- Use async/await properly

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS in production
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Sanitize database queries
- [ ] Use CORS properly
- [ ] Implement CSRF protection

## Deployment Notes

### Backend (Heroku/Railway/Fly.io)
1. Set environment variables on platform
2. Run `npm run build` to compile
3. Platform runs `npm start`
4. MongoDB Atlas connection required

### Frontend (Vercel/Netlify)
1. Set VITE_API_URL to production backend
2. Run `npm run build`
3. Deploy dist/ folder
4. Platform automatically builds on git push

## Future Enhancements

- [ ] Add event reminders/notifications
- [ ] Implement calendar sharing
- [ ] Add Google Calendar API integration
- [ ] Real-time updates with WebSockets
- [ ] Event categories and tags
- [ ] Search functionality
- [ ] Time zone support
- [ ] Multi-calendar support
- [ ] Event attachments
- [ ] Collaborative editing

## Development Workflow

1. **Plan**: Understand requirements
2. **Design**: Sketch UI/API
3. **Backend**: Implement models, controllers, routes
4. **Frontend**: Implement components, pages
5. **Connect**: Wire frontend to backend
6. **Test**: Manual testing, API testing
7. **Polish**: UI refinements, error handling
8. **Deploy**: Build and deploy

## Dependencies to Know

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcrypt**: Password hashing
- **cors**: Cross-origin requests
- **dotenv**: Environment variables

### Frontend
- **react**: UI library
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **tailwindcss**: CSS framework
- **typescript**: Type safety

## Troubleshooting Commands

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for type errors
npx tsc --noEmit

# Kill all node processes
pkill node

# View logs
tail -f logs/*.log
```

## Documentation Files

- `README.md` - Project overview and features
- `SETUP.md` - Detailed setup instructions
- `API.md` - API documentation and examples
- `SAMPLE_DATA.md` - Test data for development
- `CLAUDE.md` - This file

## Quick Links

- Backend Port: http://localhost:5000
- Frontend Port: http://localhost:5173
- API Base: http://localhost:5000
- MongoDB Local: mongodb://localhost:27017
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

## Team Notes

- Always use TypeScript - no JavaScript files in src/
- Keep components small and reusable
- Put business logic in controllers/context
- Use consistent naming conventions
- Comment complex logic
- Test API endpoints with curl before UI testing
- Keep .env files out of version control
