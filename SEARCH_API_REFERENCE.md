# Search & Filter API Reference

## Endpoint: GET /events/search

Search and filter events with flexible query parameters.

### Base URL
```
http://localhost:5000/events/search
```

### Authentication
```
Headers:
  Authorization: Bearer <JWT_TOKEN>
```

---

## Query Parameters

### text
**Type**: `string` (optional)

**Description**: Search in event title and description (case-insensitive)

**Examples**:
```
GET /events/search?text=meeting
GET /events/search?text=project%20update
GET /events/search?text=coffee&color=%233B82F6
```

---

### startDate
**Type**: `string` (ISO 8601 format) (optional)

**Description**: Filter events starting on or after this date

**Format**: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`

**Examples**:
```
GET /events/search?startDate=2024-11-21
GET /events/search?startDate=2024-11-01&endDate=2024-11-30
```

---

### endDate
**Type**: `string` (ISO 8601 format) (optional)

**Description**: Filter events starting on or before this date

**Format**: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`

**Examples**:
```
GET /events/search?endDate=2024-11-30
GET /events/search?startDate=2024-11-01&endDate=2024-11-30
```

---

### color
**Type**: `string` (hex color) (optional)

**Description**: Filter by event color

**Valid values**:
- `#3B82F6` - Blue
- `#EF4444` - Red
- `#10B981` - Green
- `#F59E0B` - Yellow
- `#8B5CF6` - Purple
- `#EC4899` - Pink
- `#06B6D4` - Cyan

**Examples**:
```
GET /events/search?color=%233B82F6
GET /events/search?color=%23EF4444&category=Work
```

**Note**: URL-encoded `#` = `%23`

---

### category
**Type**: `string` (optional)

**Description**: Filter by event category

**Valid values**:
- `Work` - Work events
- `Personal` - Personal events
- `Other` - Other events

**Examples**:
```
GET /events/search?category=Work
GET /events/search?category=Personal
GET /events/search?category=Other&upcoming=true
```

---

### upcoming
**Type**: `boolean` (optional)

**Description**: Filter by event timing

**Valid values**:
- `true` - Only upcoming events (start time >= now)
- `false` - Only past events (end time < now)
- Not specified - All events

**Examples**:
```
GET /events/search?upcoming=true
GET /events/search?upcoming=false
GET /events/search?text=meeting&upcoming=true
```

---

## Response Format

### Success Response (200 OK)
```json
{
  "events": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Team Meeting",
      "description": "Weekly sync with team",
      "start": "2024-11-21T10:00:00.000Z",
      "end": "2024-11-21T11:00:00.000Z",
      "color": "#3B82F6",
      "category": "Work",
      "repeat": "weekly",
      "userId": "507f1f77bcf86cd799439010",
      "createdAt": "2024-11-20T15:30:00.000Z",
      "updatedAt": "2024-11-20T15:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Project Review",
      "description": "Q4 review",
      "start": "2024-11-22T14:00:00.000Z",
      "end": "2024-11-22T15:30:00.000Z",
      "color": "#EF4444",
      "category": "Work",
      "repeat": "none",
      "userId": "507f1f77bcf86cd799439010",
      "createdAt": "2024-11-20T16:00:00.000Z",
      "updatedAt": "2024-11-20T16:00:00.000Z"
    }
  ]
}
```

### Error Response (500 Internal Server Error)
```json
{
  "message": "Failed to search events",
  "error": {}
}
```

---

## Common Use Cases

### Search for "meeting"
```
GET /events/search?text=meeting
```

### Get all work events
```
GET /events/search?category=Work
```

### Get upcoming blue events
```
GET /events/search?color=%233B82F6&upcoming=true
```

### Get personal events from November 2024
```
GET /events/search?category=Personal&startDate=2024-11-01&endDate=2024-11-30
```

### Search and filter combined
```
GET /events/search?text=project&category=Work&upcoming=true&color=%238B5CF6
```

### Get all past events
```
GET /events/search?upcoming=false
```

### Get events this week (example: Nov 18-24)
```
GET /events/search?startDate=2024-11-18&endDate=2024-11-24
```

---

## cURL Examples

### Basic search
```bash
curl -X GET "http://localhost:5000/events/search?text=meeting" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search with multiple filters
```bash
curl -X GET "http://localhost:5000/events/search?text=meeting&category=Work&upcoming=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Date range query
```bash
curl -X GET "http://localhost:5000/events/search?startDate=2024-11-01&endDate=2024-11-30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Color filter
```bash
curl -X GET "http://localhost:5000/events/search?color=%233B82F6" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## JavaScript/Fetch Examples

### Using searchService (Frontend)
```typescript
import { searchService } from '../services/searchService';

const token = localStorage.getItem('token');

// Search and filter
const results = await searchService.searchEvents(token, {
  text: 'meeting',
  category: 'Work',
  upcoming: true,
});

console.log(results);
```

### Using Axios directly
```typescript
import axios from 'axios';

const token = localStorage.getItem('token');
const API_URL = 'http://localhost:5000';

const response = await axios.get(`${API_URL}/events/search`, {
  params: {
    text: 'meeting',
    category: 'Work',
    upcoming: true,
  },
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

console.log(response.data.events);
```

### Using Fetch API
```typescript
const token = localStorage.getItem('token');
const params = new URLSearchParams();
params.append('text', 'meeting');
params.append('category', 'Work');
params.append('upcoming', 'true');

const response = await fetch(
  `http://localhost:5000/events/search?${params.toString()}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const data = await response.json();
console.log(data.events);
```

---

## Query Combination Logic

### Multiple Filters (AND Logic)
All specified parameters are combined with AND logic:
```
GET /events/search?category=Work&color=%233B82F6&upcoming=true
```
Returns events where:
- Category IS "Work" AND
- Color IS "#3B82F6" AND
- Start time IS >= now

### Text Search (OR Logic)
Text parameter searches across multiple fields (OR):
```
GET /events/search?text=project
```
Returns events where:
- Title contains "project" OR
- Description contains "project"

### Combined Text + Filters (AND Logic)
Text parameter combined with filters uses AND logic:
```
GET /events/search?text=project&category=Work
```
Returns events where:
- (Title contains "project" OR Description contains "project") AND
- Category IS "Work"

---

## Response Characteristics

### Empty Results
When no events match criteria:
```json
{
  "events": []
}
```

### Recurring Events
Recurring events are expanded to individual occurrences within the specified date range:
- Request with date range expands recurring events
- Request without date range returns base recurring event

### Sorting
Results are sorted by start time (ascending):
```
start time ascending order
```

### Max Results
No hard limit on results, but consider pagination for large datasets:
- Consider applying date range filters
- Use category/color filters to narrow down
- Implement pagination on frontend if needed

---

## Performance Tips

1. **Use date range filters** to limit result set
2. **Combine multiple filters** instead of just text search
3. **Avoid very broad searches** (just `?text=a` returns too many)
4. **Use category filter** to narrow down results
5. **Consider date range** for large result sets

---

## Error Handling

### Invalid Date Format
```json
{
  "message": "Failed to search events",
  "error": "Invalid date format"
}
```

### Missing Authentication
```
401 Unauthorized
```

### Server Error
```json
{
  "message": "Failed to search events",
  "error": {}
}
```

---

## Pagination (Future)

Currently no pagination, but recommended approach:
```bash
GET /events/search?text=meeting&limit=20&skip=0
```

---

## Rate Limiting (Future)

Monitor your API usage. May implement rate limiting:
- 100 requests per minute per user
- 1000 requests per hour per user

---

## Changelog

### Version 1.0 (Current)
- ✅ Text search (title & description)
- ✅ Date range filtering
- ✅ Color filtering
- ✅ Category filtering
- ✅ Upcoming/past filtering
- ✅ Recurring event expansion
- ✅ User isolation

---

## Support

For issues or questions:
1. Check error response message
2. Verify token is valid
3. Check browser console for details
4. Review this documentation
5. Check application logs
