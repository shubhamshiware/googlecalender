# Quick Start Guide

Get the Google Calendar app running in 5 minutes.

## Prerequisites Check

```bash
node --version    # Should be v16 or higher
npm --version     # Should be v8 or higher
```

MongoDB should be running:
```bash
mongosh            # If using local MongoDB
```

## 1️⃣ Backend Setup (Terminal 1)

```bash
cd backend
npm install
npm run dev
```

✅ When you see: `Server is running on port 5000`

## 2️⃣ Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✅ When you see: `Local: http://localhost:5173/`

## 3️⃣ Open Application

**In browser:** http://localhost:5173

## 4️⃣ Create Test Account

1. Click "Sign Up"
2. Fill in details:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Password**: test123456
3. Click "Sign Up"

## 5️⃣ Create Test Event

1. Click any time slot in week view
2. Fill in:
   - **Title**: Team Meeting
   - **Start Time**: Today at 10:00 AM
   - **End Time**: Today at 11:00 AM
3. Click "Save"

## ✅ You're Done!

Now you can:
- ✨ Drag events to different times
- 📅 Switch to month view
- 🌙 Toggle dark mode
- 📝 Edit/delete events
- ➕ Create recurring events

## 🔧 Troubleshooting

### Port 5000 in use?
```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB not running?
```bash
# Start MongoDB
mongod              # For local installation
# Or use MongoDB Atlas (cloud)
```

### CORS error?
Check frontend `.env` has:
```
VITE_API_URL=http://localhost:5000
```

Check backend `.env` has:
```
PORT=5000
```

### Still stuck?
Read full setup guide: `SETUP.md`

## 📚 Documentation

- **README.md** - Overview & features
- **SETUP.md** - Detailed setup
- **API.md** - API endpoints
- **CLAUDE.md** - Dev tips

## 🎮 Try These Features

1. **Create Event**: Click time slot → fill form → save
2. **Edit Event**: Click event → modify → save
3. **Drag Event**: Drag event to new time
4. **Recurring**: Create event with repeat=weekly
5. **Dark Mode**: Click moon icon in top right
6. **Month View**: Click "Month" button
7. **Mini Calendar**: Use sidebar to jump dates
8. **Colors**: Choose color when creating event

## 🧪 Test with cURL

Get auth token:
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"test123456"}'
```

Create event:
```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title":"Test Event",
    "start":"2024-01-20T10:00:00Z",
    "end":"2024-01-20T11:00:00Z",
    "color":"#3B82F6"
  }'
```

## 🚀 Next Steps

1. Explore the code in `backend/src` and `frontend/src`
2. Try creating complex recurring events
3. Test on mobile devices
4. Read full documentation
5. Deploy to production (see SETUP.md)

## 📱 Mobile Testing

Frontend responds to:
- Desktop (1024px+) - Full sidebar
- Tablet (768px) - Collapsed sidebar  
- Mobile (< 768px) - Full screen view

Test with browser DevTools device emulator.

## 🎯 What's Next?

- ✅ Set up complete
- ✅ Add test data from SAMPLE_DATA.md
- ⭐ Customize colors and styling
- 🔐 Change JWT_SECRET for production
- 🌐 Deploy backend (Heroku, Railway, etc.)
- 🌐 Deploy frontend (Vercel, Netlify, etc.)

---

**Happy Calendar-ing! 📅**
