# Automatic Award Status Updates ✅

## 🎯 Feature Overview

Awards now automatically update from **"published"** to **"completed"** when their ceremony date has passed. This happens automatically when viewing the awards list.

---

## 🔄 How It Works

### Automatic Status Transition

```
Published Award (ceremony_date in future)
    ↓
    ⏰ Ceremony date passes
    ↓
Automatically updates to "Completed"
```

### Implementation

**Location**: `OrganizerController.php` → `getAwards()` method

**Logic**:
```php
// After fetching awards
foreach ($awards as $award) {
    // Only update published awards with past ceremony dates
    if ($award->status === 'published' && 
        $award->ceremony_date && 
        Carbon::parse($award->ceremony_date)->isPast()) {
        
        // Update status to completed
        $award->status = 'completed';
        $award->save();
        $updatedCount++;
    }
}
```

---

## 📋 Update Rules

### When Status Changes

| Current Status | Ceremony Date | Action | New Status |
|---------------|---------------|--------|------------|
| **published** | In the past | ✅ Auto-update | **completed** |
| **published** | In the future | ⏸️ No change | **published** |
| **published** | `null` | ⏸️ No change | **published** |
| **draft** | Any | ⏸️ No change | **draft** |
| **completed** | Any | ⏸️ No change | **completed** |
| **closed** | Any | ⏸️ No change | **closed** |

### What Gets Updated

✅ **Updated**: Published awards with ceremony_date in the past  
❌ **Not Updated**: Draft, completed, or closed awards  
❌ **Not Updated**: Published awards without ceremony_date  
❌ **Not Updated**: Published awards with future ceremony_date  

---

## 🕐 When Updates Occur

### Trigger Points

The automatic status update happens when:
1. **Organizer views Awards page** (`GET /organizers/data/awards`)
2. Award list is fetched from database
3. **Before** displaying to user

### Update Frequency

- **On-demand**: Only when awards are fetched
- **Automatic**: No manual intervention needed
- **Immediate**: User sees updated status right away

---

## 📊 Examples

### Example 1: Award Ceremony Passed Yesterday

**Before Viewing Awards:**
```json
{
  "id": 1,
  "title": "Ghana Music Awards 2024",
  "status": "published",
  "ceremony_date": "2024-12-14"  // Yesterday
}
```

**After Viewing Awards (Auto-updated):**
```json
{
  "id": 1,
  "title": "Ghana Music Awards 2024",
  "status": "completed",  // ✅ Auto-changed!
  "ceremony_date": "2024-12-14"
}
```

**User Experience:**
- Organizer visits Awards page
- System detects ceremony date passed
- Status automatically updates to "completed"
- Award moves to "Completed" tab
- User sees current accurate status

---

### Example 2: Award Ceremony Tomorrow

**Award Data:**
```json
{
  "id": 2,
  "title": "Ghana Sports Awards 2025",
  "status": "published",
  "ceremony_date": "2024-12-16"  // Tomorrow
}
```

**Result:**
- ⏸️ No change (ceremony date in future)
- Remains "published"
- No database update

---

### Example 3: Draft Award with Past Date

**Award Data:**
```json
{
  "id": 3,
  "title": "Ghana Movie Awards 2024",
  "status": "draft",
  "ceremony_date": "2024-11-15"  // Past
}
```

**Result:**
- ⏸️ No change (status is "draft", not "published")
- Organizer must manually publish first
- Then it can auto-complete

---

### Example 4: Published Award, No Ceremony Date

**Award Data:**
```json
{
  "id": 4,
  "title": "Ghana Tech Awards 2025",
  "status": "published",
  "ceremony_date": null  // No date set
}
```

**Result:**
- ⏸️ No change (no ceremony date to check)
- Remains "published"
- Organizer should set ceremony date

---

## 💡 Benefits

### For Organizers
✅ **No manual status updates needed**  
✅ **Always shows accurate award status**  
✅ **Awards automatically move to Completed tab**  
✅ **Reduces administrative overhead**  

### For System
✅ **Data always reflects reality**  
✅ **No outdated statuses**  
✅ **Automatic maintenance**  
✅ **Consistent behavior**  

---

## ⚙️ Technical Details

### Performance

**Efficient Design:**
- Only updates awards that need it
- Tracks number of updates (`$updatedCount`)
- No unnecessary database queries
- In-place updates on existing collection

**Database Impact:**
- One `UPDATE` query per award that needs updating
- Typically affects 0-2 awards per request
- Minimal performance impact

### Code Flow

```php
1. Fetch awards from database
   ↓
2. Loop through each award
   ↓
3. Check: published + ceremony_date + isPast()?
   ↓
4. If YES: Update status to 'completed' + Save
   ↓
5. If NO: Skip to next award
   ↓
6. Continue with normal processing (stats, formatting, etc.)
```

---

## 🧪 Testing Scenarios

### Test 1: Award Ceremonies Today at Different Times

**Scenario A: Ceremony at 6:00 PM, Current Time 5:00 PM**
- Expected: Remains "published" (not past yet)

**Scenario B: Ceremony at 6:00 PM, Current Time 7:00 PM**
- Expected: Updates to "completed" (passed)

### Test 2: Multiple Awards

**Setup:**
- Award A: Published, ceremony yesterday → Should update to completed
- Award B: Published, ceremony tomorrow → Should remain published
- Award C: Draft, ceremony yesterday → Should remain draft
- Award D: Completed, ceremony last week → Should remain completed

**Expected Results:**
- Only Award A updates
- Others remain unchanged

### Test 3: Edge Cases

**Award with ceremony_date exactly = now:**
- Depends on `isPast()` implementation
- Typically updates when date portion has passed

**Award with null ceremony_date:**
- No update (null check prevents error)

**Award already completed:**
- No update (not published)

---

## 🔒 Safety Features

### Prevents Issues

1. **Null Safety**: Checks `ceremony_date` exists before comparison
2. **Status Check**: Only affects "published" awards
3. **Date Validation**: Uses Carbon's `isPast()` for reliable comparison
4. **Idempotent**: Running multiple times has same effect as once

### What Can't Go Wrong

❌ **Can't accidentally complete draft awards**  
❌ **Can't break awards without ceremony dates**  
❌ **Can't change already completed/closed awards**  
❌ **Can't create duplicate updates**  

---

## 📝 Database Changes

### What Gets Modified

**Table**: `awards`  
**Column**: `status`  
**Change**: `'published'` → `'completed'`  
**Condition**: `ceremony_date < NOW()` AND `status = 'published'`

### SQL Equivalent

```sql
UPDATE awards 
SET status = 'completed' 
WHERE status = 'published' 
  AND ceremony_date IS NOT NULL 
  AND ceremony_date < NOW()
  AND organizer_id = ?;
```

---

## 🎯 Future Enhancements

### Potential Additions

1. **Scheduled Job**: Run update via cron instead of on-demand
2. **Notification**: Email organizer when award auto-completes
3. **Audit Log**: Track when automatic updates occur
4. **Batch Updates**: Update all awards system-wide periodically
5. **Grace Period**: Delay completion by X hours after ceremony

### Current Limitation

- Only runs when organizer views awards page
- Doesn't update if organizer doesn't log in
- Consider adding scheduled job for critical use cases

---

## 📊 Monitoring

### Track Updates

The code includes an `$updatedCount` variable:
```php
$updatedCount = 0;

foreach ($awards as $award) {
    if (/* conditions */) {
        // ... update
        $updatedCount++;
    }
}

// Could log: "Auto-updated {$updatedCount} awards to completed"
```

### Add Logging (Optional)

```php
if ($updatedCount > 0) {
    Log::info("Auto-updated {$updatedCount} awards to completed", [
        'organizer_id' => $organizer->id,
        'timestamp' => Carbon::now()
    ]);
}
```

---

## ✅ Implementation Checklist

### Completed
- [x] Auto-update logic implemented
- [x] Only updates published awards
- [x] Checks ceremony date has passed
- [x] Null-safe ceremony date check
- [x] Updates count tracked
- [x] Integrated into getAwards method

### To Test
- [ ] Award with past ceremony updates to completed
- [ ] Award with future ceremony remains published  
- [ ] Draft awards aren't affected
- [ ] Awards without ceremony_date aren't affected
- [ ] Multiple awards update correctly
- [ ] Tab counts update after auto-completion
- [ ] Frontend displays updated status

---

## 🎉 Summary

### What Was Added

✅ **Automatic status updates** for published awards with past ceremony dates  
✅ **Happens on-demand** when viewing awards  
✅ **Safe and efficient** with proper checks  
✅ **Reduces manual work** for organizers  

### Key Points

- **Trigger**: When organizer views Awards page
- **Condition**: Published + ceremony_date in past
- **Action**: Update status to "completed"
- **Frequency**: Every time awards are fetched
- **Impact**: Minimal performance overhead

### Files Modified

- **Backend**: `src/controllers/OrganizerController.php` (~20 lines added)

---

**Awards now automatically complete when their ceremony has passed!** 🎊
