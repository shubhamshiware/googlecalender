# Sample Data for Testing

Use the following sample data to populate your calendar with test events.

## Sample User

**Email:** demo@example.com  
**Password:** demo123456  
**Name:** Demo User

## Sign Up

```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo User",
    "email": "demo@example.com",
    "password": "demo123456"
  }'
```

After signing up, save the returned token for the next requests.

## Sample Events

Replace `YOUR_TOKEN` with the actual JWT token from login.

### Event 1: Team Standup (Recurring Daily)
```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Team Standup",
    "description": "Daily team sync at 9 AM",
    "start": "2024-01-15T09:00:00Z",
    "end": "2024-01-15T09:30:00Z",
    "color": "#3B82F6",
    "repeat": "daily"
  }'
```

### Event 2: Weekly Sprint Review (Recurring Weekly)
```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Sprint Review",
    "description": "Weekly sprint review and planning",
    "start": "2024-01-19T14:00:00Z",
    "end": "2024-01-19T15:30:00Z",
    "color": "#10B981",
    "repeat": "weekly"
  }'
```

### Event 3: Project Deadline (No Repeat)
```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Project Deadline",
    "description": "Submit project deliverables",
    "start": "2024-01-20T17:00:00Z",
    "end": "2024-01-20T18:00:00Z",
    "color": "#EF4444",
    "repeat": "none"
  }'
```

### Event 4: Client Meeting (No Repeat)
```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Client Meeting",
    "description": "Quarterly business review with stakeholders",
    "start": "2024-01-22T10:00:00Z",
    "end": "2024-01-22T11:30:00Z",
    "color": "#8B5CF6",
    "repeat": "none"
  }'
```

### Event 5: Monthly All-Hands (Recurring Monthly)
```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "All-Hands Meeting",
    "description": "Company-wide monthly all-hands",
    "start": "2024-01-30T15:00:00Z",
    "end": "2024-01-30T16:00:00Z",
    "color": "#F59E0B",
    "repeat": "monthly"
  }'
```

### Event 6: Team Lunch (No Repeat)
```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Team Lunch",
    "description": "Casual team lunch outing",
    "start": "2024-01-17T12:00:00Z",
    "end": "2024-01-17T13:00:00Z",
    "color": "#06B6D4",
    "repeat": "none"
  }'
```

### Event 7: Performance Review (No Repeat)
```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Performance Review",
    "description": "1-on-1 performance review",
    "start": "2024-01-25T11:00:00Z",
    "end": "2024-01-25T12:00:00Z",
    "color": "#EC4899",
    "repeat": "none"
  }'
```

## Alternative: Bulk Import Script

Create `backend/scripts/seed.ts`:

```typescript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';
import Event from '../src/models/Event';
import bcrypt from 'bcrypt';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/google-calendar');
    
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    
    // Create user
    const hashedPassword = await bcrypt.hash('demo123456', 10);
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
    });
    
    // Create events
    const events = [
      {
        title: 'Team Standup',
        description: 'Daily team sync at 9 AM',
        start: new Date('2024-01-15T09:00:00Z'),
        end: new Date('2024-01-15T09:30:00Z'),
        userId: user._id,
        color: '#3B82F6',
        repeat: 'daily',
      },
      {
        title: 'Sprint Review',
        description: 'Weekly sprint review and planning',
        start: new Date('2024-01-19T14:00:00Z'),
        end: new Date('2024-01-19T15:30:00Z'),
        userId: user._id,
        color: '#10B981',
        repeat: 'weekly',
      },
      {
        title: 'Project Deadline',
        description: 'Submit project deliverables',
        start: new Date('2024-01-20T17:00:00Z'),
        end: new Date('2024-01-20T18:00:00Z'),
        userId: user._id,
        color: '#EF4444',
        repeat: 'none',
      },
      {
        title: 'Client Meeting',
        description: 'Quarterly business review with stakeholders',
        start: new Date('2024-01-22T10:00:00Z'),
        end: new Date('2024-01-22T11:30:00Z'),
        userId: user._id,
        color: '#8B5CF6',
        repeat: 'none',
      },
      {
        title: 'All-Hands Meeting',
        description: 'Company-wide monthly all-hands',
        start: new Date('2024-01-30T15:00:00Z'),
        end: new Date('2024-01-30T16:00:00Z'),
        userId: user._id,
        color: '#F59E0B',
        repeat: 'monthly',
      },
    ];
    
    await Event.insertMany(events);
    
    console.log('✅ Database seeded successfully!');
    console.log('📧 Login with: demo@example.com / demo123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
```

Then run:
```bash
npx ts-node scripts/seed.ts
```

## Testing Checklist

- [ ] Sign up with sample user
- [ ] Login with sample user
- [ ] View events in week view
- [ ] View events in month view
- [ ] Create new event by clicking time slot
- [ ] Edit existing event
- [ ] Delete event
- [ ] Drag event to different time
- [ ] Toggle dark mode
- [ ] Navigate between weeks/months
- [ ] Use sidebar calendar picker

## Data Notes

- All times are in UTC (Z suffix)
- Adjust times to your timezone if needed
- Recurring events generate occurrences on-demand
- Events persist in MongoDB after page refresh
- Remove sample events before deploying

## Cleanup

To delete all events:
```bash
curl -X DELETE http://localhost:5000/events \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Note: This endpoint doesn't exist by default. Add if needed for testing.
