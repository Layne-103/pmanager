# Ticket Creation - Quick Reference Guide

## 🚀 Quick Start

### Open Create Modal
```
Method 1: Click "New Ticket" FAB (+ button bottom-right)
Method 2: Click "Create your first ticket" (if no tickets exist)
```

### Fill Form
```
1. Title (required): Min 3, max 200 characters
2. Description (optional): Max 2000 characters
3. Tags (optional): Select from dropdown
4. Click "Create Ticket"
```

## ⚡ Keyboard Shortcuts

```
Tab         → Move to next field
Shift+Tab   → Move to previous field
Enter       → Submit form (when valid)
Escape      → Close modal
```

## ✅ Validation Rules

### Title Field
| Rule | Condition | Message |
|------|-----------|---------|
| Required | Empty | "Title is required" |
| Min Length | < 3 chars | "Title must be at least 3 characters" |
| Max Length | > 200 chars | "Title must not exceed 200 characters" |

### Description Field
| Rule | Condition | Message |
|------|-----------|---------|
| Max Length | > 2000 chars | "Description must not exceed 2000 characters" |

## 🎨 Visual Indicators

### Form States
| State | Visual | Meaning |
|-------|--------|---------|
| Default | Gray border | Ready for input |
| Active | Blue border | Field focused |
| Valid | Green border + ✓ | Input is correct |
| Invalid | Red border + ⚠️ | Error in input |
| Submitting | Disabled + spinner | Saving to server |

### Character Counter Colors
| Range | Color | Meaning |
|-------|-------|---------|
| 0-180 | Gray | Normal |
| 181-200 | Orange | Approaching limit |
| >200 | Red | Exceeded (blocked) |

## 📋 Common Scenarios

### Scenario 1: Quick Ticket
```
1. Open modal
2. Type title: "Fix navbar bug"
3. Click "Create Ticket"
4. Done! ✅
```

### Scenario 2: Detailed Ticket with Tags
```
1. Open modal
2. Title: "Implement user authentication"
3. Description: "Add JWT-based auth with refresh tokens..."
4. Tags: Select "Backend", "Security"
5. Click "Create Ticket"
6. Success! 🎉
```

### Scenario 3: Edit Existing Ticket
```
1. Click "Edit" on ticket card
2. Modify title/description
3. Add/remove tags (saves immediately)
4. Click "Update Ticket"
5. Updated! ✨
```

## 🐛 Error Messages

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Title is required" | Empty title | Enter at least 3 characters |
| "Title must be at least 3 characters" | Title too short | Add more text |
| "Failed to create ticket: Network Error" | No internet | Check connection and retry |
| "Failed to add tag" | Tag doesn't exist | Refresh and try again |

## 💡 Tips & Best Practices

### Title Writing
✅ **Good**: "Fix login page redirect bug"  
✅ **Good**: "Add user profile settings"  
❌ **Bad**: "bug"  
❌ **Bad**: "fix"  

### Description Writing
- Use clear, concise language
- Include steps to reproduce (for bugs)
- Mention expected vs actual behavior
- Markdown is supported:
  ```markdown
  # Heading
  - Bullet point
  **Bold text**
  `code`
  ```

### Tag Selection
- Use consistent tags across tickets
- Limit to 3-5 relevant tags
- Create new tags in Tags page if needed

## 📊 Form Behavior

### Auto-Save: ❌ No
- Form does NOT auto-save drafts
- Must click "Create Ticket" to save
- Cancel will discard all changes

### Validation: ✅ Real-time
- Validates as you type (after first blur)
- Shows errors immediately
- Prevents invalid submission

### Tag Management
- **New tickets**: Tags saved with ticket
- **Existing tickets**: Tags update immediately (separate API call)

## 🔄 Data Flow

```
User Input
    ↓
Real-time Validation
    ↓
Submit Button Enabled (if valid)
    ↓
Click "Create Ticket"
    ↓
API Call to Backend
    ↓
Success → Close Modal + Toast
    OR
Error → Stay Open + Error Toast
```

## 🎯 Success Criteria

A ticket is successfully created when:
1. ✅ Title is 3-200 characters
2. ✅ Description is 0-2000 characters (if provided)
3. ✅ API responds with 201 Created
4. ✅ Modal closes
5. ✅ Success toast appears
6. ✅ New ticket appears in list

## 📱 Mobile Usage

### Touch Targets
- All buttons: Minimum 44x44px
- Easy to tap on mobile devices
- Proper spacing between elements

### Mobile Keyboard
- Auto-focuses on title field
- Keyboard opens automatically
- "Done" button submits form

### Scrolling
- Modal scrolls on small screens
- Form remains accessible
- Tags section always visible

## 🛠️ Troubleshooting

### Modal won't open
- Check if FAB button is visible
- Try refreshing page
- Check browser console for errors

### Submit button disabled
- Ensure title has min 3 characters
- Check for red error messages
- Verify all validation passes

### Tags not appearing
- Go to Tags page first
- Create tags if none exist
- Refresh Tickets page

### Toast notification not showing
- Notifications appear top-right
- Auto-dismiss after 4-5 seconds
- Can be manually closed

## 🎓 Training Checklist

For new users:
- [ ] Open create modal
- [ ] Try submitting empty form (should fail)
- [ ] Enter title < 3 chars (see error)
- [ ] Enter valid title (see checkmark)
- [ ] Add description
- [ ] Select tags
- [ ] Submit and see success toast
- [ ] Edit created ticket
- [ ] Add/remove tags from ticket

## 📞 Support

### Need Help?
1. Check validation error messages
2. Review character counters
3. See full documentation: `TICKET_CREATION_COMPLETE.md`
4. Check browser console for technical errors

### Reporting Issues
Include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser and version
5. Screenshot (if applicable)

---

**Last Updated**: December 2025  
**Version**: 1.0  
**Status**: Production Ready ✅
