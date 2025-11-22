# Google Calendar Web Application

A complete Google Calendar clone built with React, TypeScript, Node.js, Express, and MongoDB. Features include authentication, week/month views, drag-and-drop events, recurring events, and dark mode.

## Project Structure

```
.
├── backend/              # Node.js + Express backend
├── frontend/             # React + TypeScript frontend
└── README.md
```

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas cloud)

## Quick Start

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment
Create `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/google-calendar
JWT_SECRET=your-secret-key-change-in-production
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/google-calendar?retryWrites=true&w=majority
```

#### Run Backend
```bash
npm run dev          # Development with ts-node
npm run build       # Build for production
npm start           # Run production build
```

Backend runs on: `http://localhost:5000`

### 2. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment
Create `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

#### Run Frontend
```bash
npm run dev         # Development server
npm run build       # Build for production
npm run preview     # Preview production build
```

Frontend runs on: `http://localhost:5173`

## Features

### ✅ Authentication
- Sign up with email and password
- Login with credentials
- JWT-based session management
- Persistent login with localStorage

### ✅ Calendar Views
- **Week View**: 7-day grid with hourly timeline
- **Month View**: Traditional calendar grid
- Current time indicator line
- Navigation between weeks/months
- Today button for quick navigation

### ✅ Event Management
- **Create**: Click on time slots to create events
- **Edit**: Click events to modify details
- **Delete**: Remove events from calendar
- Event details: title, description, start/end times, color, recurrence

### ✅ Event Interactions
- **Drag & Drop**: Move events between time slots
- **Resizable**: Drag event edges to adjust duration
- **Overlapping**: Events displayed side-by-side when overlapping
- **Visual Feedback**: Events show position based on start time and duration

### ✅ Recurring Events
- Support for: None, Daily, Weekly, Monthly
- Backend generates occurrences within date range
- Efficient recurring event handling

### ✅ Additional Features
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-friendly layout
- **Mini Calendar**: Sidebar with month view for quick navigation
- **Color Labels**: Choose from 7 preset event colors
- **Loading States**: Skeleton loaders during data fetching

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create new user account |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/me` | Validate token and get user info |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | Get events for date range |
| POST | `/events` | Create new event |
| GET | `/events/:id` | Get single event |
| PUT | `/events/:id` | Update event |
| DELETE | `/events/:id` | Delete event |

### Request/Response Examples

#### Sign Up
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

Response:
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Create Event
```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Team Meeting",
    "description": "Quarterly sync",
    "start": "2024-01-15T10:00:00Z",
    "end": "2024-01-15T11:00:00Z",
    "color": "#3B82F6",
    "repeat": "weekly"
  }'
```

#### Get Events
```bash
curl -X GET "http://localhost:5000/events?start=2024-01-01&end=2024-01-31" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## MongoDB Setup

### Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# Verify connection
mongo
```

### MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `.env` with connection string

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Language**: TypeScript
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Built-in Express middleware
- **CORS**: Express CORS middleware

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Build Tool**: Vite

## Folder Structure

### Backend
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── eventController.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── Event.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── eventRoutes.ts
│   ├── middleware/
│   │   └── authMiddleware.ts
│   ├── utils/
│   │   └── generateToken.ts
│   ├── config/
│   │   └── db.ts
│   └── server.ts
├── tsconfig.json
├── package.json
└── .env
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── WeekView.tsx
│   │   ├── MonthView.tsx
│   │   ├── EventModal.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── CalendarContext.tsx
│   ├── utils/
│   │   ├── dateHelpers.ts
│   │   ├── timeHelpers.ts
│   │   └── constants.ts
│   ├── index.css
│   ├── main.tsx
│   └── App.tsx
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env
```

## Development Tips

### Debugging
- Use browser DevTools for frontend debugging
- Check network tab for API calls
- MongoDB Compass for database inspection

### Common Issues

**CORS Error**: Ensure backend `.env` has correct `PORT` and frontend `.env` has correct `VITE_API_URL`

**MongoDB Connection Failed**: 
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure IP whitelist includes your machine (for Atlas)

**Events Not Showing**: 
- Verify token is being sent in Authorization header
- Check user is authenticated
- Verify date range in API request

## Performance Optimization

- Events are fetched only for visible date range
- Recurring events are generated on-demand
- Lazy loading for components
- CSS-in-JS optimized with Tailwind

## Security Notes

- JWT tokens expire in 30 days
- Passwords are hashed with bcrypt (10 rounds)
- Change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Implement rate limiting for production
- Use HTTPS in production

## Future Enhancements

- [ ] Event reminders and notifications
- [ ] Event sharing and collaboration
- [ ] Calendar integration (Google Calendar API)
- [ ] Rich text editor for event descriptions
- [ ] Time zone support
- [ ] Event categories/tags
- [ ] Search functionality
- [ ] Multi-calendar support
- [ ] Event attachments
- [ ] Real-time updates with WebSocket

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
