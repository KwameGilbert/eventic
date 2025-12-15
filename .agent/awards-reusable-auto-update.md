# Reusable Award Auto-Update Function ✅

## 🎯 Implementation

Created a **reusable static method** in the Award model that can be called from anywhere in the application to automatically update award statuses.

---

## 📝 The Method

### **Location**: `src/models/Award.php`

### **Method Signature**:
```php
public static function autoUpdateCompletedStatuses(?int $organizerId = null): int
```

### **Full Implementation**:
```php
/**
 * Automatically update published awards to "completed" if ceremony date has passed.
 * This method can be called from anywhere to ensure awards have the correct status.
 * 
 * @param int|null $organizerId Optional organizer ID to limit updates to specific organizer
 * @return int Number of awards updated
 */
public static function autoUpdateCompletedStatuses(?int $organizerId = null): int
{
    $now = \Illuminate\Support\Carbon::now();
    
    // Build query for published awards with past ceremony dates
    $query = self::where('status', self::STATUS_PUBLISHED)
        ->whereNotNull('ceremony_date')
        ->where('ceremony_date', '<', $now);
    
    // Optionally filter by organizer
    if ($organizerId !== null) {
        $query->where('organizer_id', $organizerId);
    }
    
    // Get awards that need updating
    $awards = $query->get();
    
    $updatedCount = 0;
    foreach ($awards as $award) {
        $award->status = self::STATUS_COMPLETED;
        $award->save();
        $updatedCount++;
    }
    
    return $updatedCount;
}
```

---

## ✨ Features

### **Flexible Usage**
- ✅ Can be called with an organizer ID (updates only that organizer's awards)
- ✅ Can be called without parameter (updates all awards system-wide)
- ✅ Returns count of awards updated for logging/monitoring

### **Smart Query**
- ✅ Uses efficient database query with WHERE clauses
- ✅ Only fetches awards that need updating
- ✅ No unnecessary database hits

### **Safe & Reliable**
- ✅ Uses status constants (`self::STATUS_PUBLISHED`, `self::STATUS_COMPLETED`)
- ✅ Null-safe ceremony_date check
- ✅ Scoped to only published awards

---

## 🔄 Usage Examples

### **Example 1: Update Specific Organizer's Awards**
```php
// In OrganizerController
$updatedCount = Award::autoUpdateCompletedStatuses($organizer->id);
// Returns number of awards updated for this organizer
```

### **Example 2: Update All Awards (System-wide)**
```php
// In a scheduled job or admin function
$updatedCount = Award::autoUpdateCompletedStatuses();
// Returns total number of awards updated across all organizers
```

### **Example 3: With Logging**
```php
$updatedCount = Award::autoUpdateCompletedStatuses($organizerId);

if ($updatedCount > 0) {
    Log::info("Auto-updated {$updatedCount} awards to completed", [
        'organizer_id' => $organizerId,
        'timestamp' => now()
    ]);
}
```

---

## 📍 Currently Used In

### **Backend Endpoints**

#### 1. **OrganizerController::getDashboard()**
```php
// Before fetching upcoming award
Award::autoUpdateCompletedStatuses($organizer->id);

$upcomingAward = Award::where('organizer_id', $organizer->id)
    ->where('status', 'published')
    ->where('ceremony_date', '>', Carbon::now())
    ->first();
```

**Why**: Ensures dashboard shows accurate upcoming awards (no past awards shown as "upcoming")

---

#### 2. **OrganizerController::getAwards()**
```php
// Before showing awards list
Award::autoUpdateCompletedStatuses($organizer->id);

$awards = Award::where('organizer_id', $organizer->id)
    ->with(['categories', 'images', 'votes'])
    ->get();
```

**Why**: Ensures awards list shows current status for all awards

---

#### 3. **OrganizerController::getAwardDetails()**
```php
// Before showing award details
Award::autoUpdateCompletedStatuses($organizer->id);

$award = Award::with(['organizer.user', 'categories.nominees', 'images'])
    ->where('id', $awardId)
    ->first();
```

**Why**: Ensures single award view shows accurate status

---

## 🚀 Where Else It Can Be Used

### **Potential Locations**

#### 1. **AwardController (Public)**
```php
public function show(Request $request, Response $response, array $args): Response
{
    $awardId = $args['id'];
    
    // Update status before showing to public
    Award::autoUpdateCompletedStatuses();
    
    $award = Award::with(['categories.nominees'])
        ->where('id', $awardId)
        ->where('status', 'published')
        ->first();
    
    // ... rest of method
}
```

**Benefit**: Public award pages always show accurate status

---

#### 2. **Scheduled Job/Cron Task**
```php
// In app/Console/Commands/UpdateAwardStatuses.php
class UpdateAwardStatuses extends Command
{
    protected $signature = 'awards:update-statuses';
    protected $description = 'Update award statuses based on ceremony dates';

    public function handle()
    {
        $updatedCount = Award::autoUpdateCompletedStatuses();
        
        $this->info("Updated {$updatedCount} awards to completed status");
        
        return 0;
    }
}
```

**Benefit**: Run daily/hourly to keep all awards updated even if not viewed

---

#### 3. **Admin Dashboard**
```php
public function getAdminAwards(Request $request, Response $response): Response
{
    // Update all awards before admin views
    Award::autoUpdateCompletedStatuses();
    
    $awards = Award::with(['organizer', 'categories'])
        ->orderBy('ceremony_date', 'desc')
        ->get();
    
    // ... rest of method
}
```

**Benefit**: Admin sees accurate status across all awards

---

#### 4. **Before Sending Notifications**
```php
public function sendCeremonyReminders()
{
    // Update statuses first
    Award::autoUpdateCompletedStatuses();
    
    // Now fetch upcoming ceremonies (won't include past ones)
    $upcomingAwards = Award::where('status', 'published')
        ->where('ceremony_date', '>', Carbon::now())
        ->where('ceremony_date', '<', Carbon::now()->addWeek())
        ->get();
    
    foreach ($upcomingAwards as $award) {
        // Send reminder email
    }
}
```

**Benefit**: Don't send reminders for awards that should be completed

---

#### 5. **API Middleware**
```php
class EnsureAwardsUpToDate
{
    public function handle(Request $request, Closure $next)
    {
        // Auto-update awards before processing any award-related request
        if (str_contains($request->getUri()->getPath(), '/awards')) {
            Award::autoUpdateCompletedStatuses();
        }
        
        return $next($request);
    }
}
```

**Benefit**: Automatic updates on any award-related endpoint

---

## 📊 Comparison

### **Before (Inline Logic)**
```php
// Had to copy this everywhere:
foreach ($awards as $award) {
    if ($award->status === 'published' && 
        $award->ceremony_date && 
        Carbon::parse($award->ceremony_date)->isPast()) {
        $award->status = 'completed';
        $award->save();
    }
}
```

**Problems:**
- ❌ Code duplication
- ❌ Hard to maintain (changes need to be made in multiple places)
- ❌ Inconsistent logic across codebase
- ❌ Difficult to add logging/monitoring

---

### **After (Reusable Method)**
```php
// Simple one-liner:
Award::autoUpdateCompletedStatuses($organizerId);
```

**Benefits:**
- ✅ Single source of truth
- ✅ Easy to maintain (change in one place)
- ✅ Consistent behavior everywhere
- ✅ Easy to add logging
- ✅ Can track update count
- ✅ Can be used system-wide or per-organizer

---

## 🎯 Design Benefits

### **1. DRY Principle (Don't Repeat Yourself)**
- Logic defined once in the model
- Called from multiple places
- Changes made in one location

### **2. Single Responsibility**
- Award model handles award-related logic
- Controllers just call the method
- Separation of concerns

### **3. Testability**
```php
// Easy to unit test
public function test_auto_update_completed_statuses()
{
    // Create published award with past ceremony
    $award = Award::create([
        'status' => 'published',
        'ceremony_date' => Carbon::yesterday(),
        // ... other fields
    ]);
    
    $count = Award::autoUpdateCompletedStatuses();
    
    $this->assertEquals(1, $count);
    $this->assertEquals('completed', $award->fresh()->status);
}
```

### **4. Flexibility**
```php
// Per organizer
Award::autoUpdateCompletedStatuses($organizerId);

// System-wide
Award::autoUpdateCompletedStatuses();

// With response handling
$count = Award::autoUpdateCompletedStatuses($organizerId);
if ($count > 0) {
    // Do something
}
```

---

## 🔒 Safety & Performance

### **Safety Features**
1. ✅ **Type Safety**: Uses status constants
2. ✅ **Null Safety**: Checks ceremony_date not null
3. ✅ **Scope Limited**: Only affects published awards
4. ✅ **Idempotent**: Safe to run multiple times

### **Performance Optimization**
1. ✅ **Efficient Query**: WHERE clauses filter at database level
2. ✅ **Batch Processing**: Could be extended to use update() instead of save()
3. ✅ **Scoped Updates**: Can limit to specific organizer
4. ✅ **Return Value**: Tracks updates without extra queries

### **Potential Optimization:**
```php
// If needed for large datasets, could change to:
$updatedCount = self::where('status', self::STATUS_PUBLISHED)
    ->whereNotNull('ceremony_date')
    ->where('ceremony_date', '<', $now)
    ->when($organizerId, fn($q) => $q->where('organizer_id', $organizerId))
    ->update(['status' => self::STATUS_COMPLETED]);
```

---

## 📋 Implementation Checklist

### **Completed**
- [x] Created static method in Award model
- [x] Added PHPDoc documentation
- [x] Made organizerId optional parameter
- [x] Returns update count
- [x] Implemented in getDashboard()
- [x] Implemented in getAwards()
- [x] Implemented in getAwardDetails()
- [x] Used status constants
- [x] Added null safety

### **Recommended Next Steps**
- [ ] Add to public award endpoints
- [ ] Create scheduled job for automated updates
- [ ] Add logging for monitoring
- [ ] Add to admin endpoints
- [ ] Create unit tests
- [ ] Consider caching strategy
- [ ] Add to notification systems

---

## 🧪 Testing

### **Test Scenarios**

#### Test 1: Update Specific Organizer
```php
// Setup
$organizer1 = Organizer::factory()->create();
$organizer2 = Organizer::factory()->create();

Award::factory()->create([
    'organizer_id' => $organizer1->id,
    'status' => 'published',
    'ceremony_date' => Carbon::yesterday()
]);

Award::factory()->create([
    'organizer_id' => $organizer2->id,
    'status' => 'published',
    'ceremony_date' => Carbon::yesterday()
]);

// Test
$count = Award::autoUpdateCompletedStatuses($organizer1->id);

// Assert
$this->assertEquals(1, $count); // Only organizer1's award updated
```

#### Test 2: Update All Awards
```php
// Setup: Create 3 published awards with past ceremonies
Award::factory()->count(3)->create([
    'status' => 'published',
    'ceremony_date' => Carbon::yesterday()
]);

// Test
$count = Award::autoUpdateCompletedStatuses();

// Assert
$this->assertEquals(3, $count);
```

#### Test 3: No Update for Future Ceremonies
```php
Award::factory()->create([
    'status' => 'published',
    'ceremony_date' => Carbon::tomorrow()
]);

$count = Award::autoUpdateCompletedStatuses();

$this->assertEquals(0, $count);
```

---

## 📝 Summary

### **What Was Created**
✅ **Reusable static method** in Award model  
✅ **Flexible parameters** (organizerId optional)  
✅ **Return value** for monitoring  
✅ **Used in 3 controller methods**  

### **Key Features**
- Can update specific organizer or all awards
- Returns count of updates
- Efficient database queries
- Safe and null-protected
- Easy to use anywhere

### **Benefits**
- ✅ No code duplication
- ✅ Single source of truth
- ✅ Easy to maintain
- ✅ Consistent behavior
- ✅ Ready for expansion

---

**The auto-update feature is now reusable and can be called from anywhere!** 🚀
