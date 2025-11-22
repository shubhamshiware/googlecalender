# Feature Testing Guide

## Quick Start

### Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm install  # if not done
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # if not done
npm run dev
```

Open browser to `http://localhost:5173`

---

## Testing Feature 1: Event Color Coding

### Test 1A: Create Event with Color
1. Login or sign up
2. Click on any time slot in Week View or date in Month View
3. Fill in event details:
   - Title: "Team Meeting"
   - Description: "Weekly sync"
   - Start/End times
4. **Select a color** from the color picker (click a colored circle)
5. Click "Save"
6. **Verify**: Event appears on calendar with selected color

### Test 1B: Edit Event Color
1. Click on an existing event
2. Modal opens - observe current color is selected
3. Choose a **different color**
4. Click "Save"
5. **Verify**: Event color changes immediately on calendar

### Test 1C: Persist Color
1. Create event with Red color
2. **Refresh page** (Ctrl+R)
3. **Verify**: Event still shows Red color (persisted in database)

### Test 1D: Switch Views
1. Create event with Purple color in Week View
2. Click "Month" button in navbar
3. **Verify**: Event shows Purple in Month View

### Test 1E: Multiple Colors
1. Create 5 events, each with different color:
   - Blue, Red, Green, Yellow, Purple
2. View in both Week and Month
3. **Verify**: Each event displays correct color

---

## Testing Feature 2: Event Reminders

### Prerequisites
- Browser must support Notification API (Chrome, Firefox, Edge, Safari)
- User should be logged in
- Allow notifications when browser prompts

### Test 2A: Enable Notifications
1. Login to application
2. **Look for 🔔 button** in top navbar (right side)
3. Click 🔔 button
4. **Browser dialog appears** asking for notification permission
5. Click "Allow"
6. **Button should disappear** (means permission granted)

### Test 2B: Create Upcoming Event
1. Note current time (e.g., 2:30 PM)
2. Create event starting **6+ minutes from now** (e.g., 2:37 PM)
   - Title: "Test Event Reminder"
   - Start: In 6+ minutes
   - End: 1 hour later
   - Color: Your choice
3. Click "Save"
4. **Wait patiently** - reminder triggers 5 minutes before start

### Test 2C: Verify Toast Notification
1. At exactly 5 minutes before event start:
2. **Blue toast appears** in bottom-right corner
3. Toast shows:
   - Title: "Event Reminder"
   - Message: "You have an event starting soon: Test Event Reminder"
4. Toast auto-dismisses after 6 seconds
5. OR click ✕ button to dismiss manually

### Test 2D: Verify Browser Notification
1. At exactly 5 minutes before event start:
2. **Native OS notification appears** (if permission granted)
3. Notification shows event title
4. Click notification to bring browser to front

### Test 2E: Multiple Events
1. Create 3 events at different times:
   - Event A: Starting in 10 minutes
   - Event B: Starting in 15 minutes  
   - Event C: Starting in 20 minutes
2. Wait for each reminder time
3. **Verify**: Each event gets its own toast notification

### Test 2F: Logout Clears Reminders
1. Create event starting in 10 minutes
2. Logout from application
3. **Wait past 5-minute mark** before event
4. **Verify**: No notification appears
5. Login again
6. **Toast appears immediately** (reminders resume)

### Test 2G: Page Refresh
1. Create event starting in 10 minutes
2. **Refresh page** (Ctrl+R)
3. Wait for reminder time
4. **Verify**: Reminder still fires after refresh
5. (No duplicate reminders)

### Test 2H: Recurring Events
1. Create recurring event (Weekly, Daily, or Monthly)
2. Note several occurrences appear
3. **Verify**: Each occurrence can get its own reminder

### Test 2I: Permission Denied
1. Open browser developer tools (F12)
2. Console → Run: `Notification.requestPermission().then(p => Notification.permission = 'denied')`
3. Or manually deny permission in browser settings
4. Create event
5. Wait for reminder time
6. **Toast notification appears** (in-app only, no browser notification)
7. 🔔 button should reappear in navbar

### Test 2J: Already Permitted
1. If you've already granted permission:
2. Create event
3. Wait for reminder time
4. **Both toast AND browser notification appear**
5. 🔔 button stays hidden

---

## Edge Cases Testing

### Edge Case 1: Event Starting Very Soon
1. Create event starting in **2 minutes**
2. Remainder triggers at -5 minutes (in the past)
3. **Verify**: Toast appears immediately

### Edge Case 2: Event Starting in Past
1. Try to create event with start time in past
2. EventModal should allow it (your choice)
3. If past event, reminder **should NOT fire**

### Edge Case 3: Switch Between Views
1. Create event in Week View
2. Switch to Month View
3. Create another event
4. Switch back to Week View
5. **Verify**: Reminders still work for all events

### Edge Case 4: Overlapping Events
1. Create 2 events starting at exact same time
2. Create third event 1 second later
3. Wait for reminder time
4. **Verify**: All 3 reminders fire around same time

### Edge Case 5: Browser Tab Inactive
1. Create event in calendar
2. Minimize browser or switch to different tab
3. Wait for reminder time
4. **Verify**: Toast still appears when switching back
5. **Browser notification still appears** (OS level)

---

## Visual Verification Checklist

### Color Coding ✓
- [ ] Events display with correct background color
- [ ] Color matches selection in EventModal
- [ ] Colors visible in both Week and Month views
- [ ] Colors persist after page refresh
- [ ] All 7 colors selectable and distinct

### Reminders ✓
- [ ] 🔔 button appears in navbar
- [ ] Browser permission dialog appears on click
- [ ] Toast notification appears 5 minutes before event
- [ ] Toast shows correct event title
- [ ] Toast auto-dismisses after 6 seconds
- [ ] Toast has manual dismiss button (✕)
- [ ] Browser notification appears (if permission granted)
- [ ] No duplicate reminders after page refresh
- [ ] Reminders clear on logout
- [ ] Reminders resume on login

---

## Troubleshooting

### Toast Not Appearing
**Check**:
- Is event more than 5 minutes away?
- Are you logged in?
- Did you wait exactly 5 minutes before start?
- Check browser console (F12) for errors

**Solution**:
- Refresh page
- Check token is valid in localStorage
- Create new event further in future

### Browser Notification Not Appearing
**Check**:
- Did you click 🔔 button?
- Did you allow permission in browser?
- Check browser notification settings
- Check OS notification settings

**Solution**:
- Chrome: Settings → Privacy → Notifications → Check domain allowed
- Firefox: about:preferences → Privacy → Permissions
- Windows: Settings → System → Notifications

### Event Color Not Showing
**Check**:
- Is color field selected in EventModal?
- Did you click Save?
- Refresh page

**Solution**:
- Check browser console for API errors
- Verify backend is running
- Check event was saved (should appear on calendar)

### Reminders Not Clearing After Logout
**Issue**: Reminders still showing after logout

**Solution**:
- This is a browser behavior
- Refresh page completely
- Check token was removed from localStorage

---

## Performance Notes

- Each reminder is ~2KB in memory
- 100 events = ~200KB active timers
- Timers are garbage collected on logout
- No performance impact after reminders fire

---

## Browser Compatibility

| Browser | Colors | Reminders | Notes |
|---------|--------|-----------|-------|
| Chrome  | ✅     | ✅        | Full support |
| Firefox | ✅     | ✅        | Full support |
| Safari  | ✅     | ✅        | Full support |
| Edge    | ✅     | ✅        | Full support |
| IE 11   | ✅     | ⚠️        | Reminders need polyfill |

---

## Success Criteria

✅ All tests pass
✅ No console errors
✅ Colors persist in database
✅ Reminders fire at correct time
✅ No duplicate reminders
✅ Clean logout/login cycle
✅ Both views work correctly
✅ Dark mode supported
✅ Responsive on mobile
