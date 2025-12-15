# Backend Integration Guide - Awards Dashboard

## 🎯 Overview

This guide provides the exact API structure needed for the Awards Dashboard frontend integration.

---

## 📍 Required Endpoints

### 1. Dashboard Data (Enhanced)
**Endpoint**: `GET /organizers/data/dashboard`  
**Authentication**: Required (Organizer only)  
**Purpose**: Return dashboard overview including upcoming award

#### Request
```http
GET /organizers/data/dashboard
Authorization: Bearer {token}
```

#### Response Structure
```json
{
  "success": true,
  "data": {
    "user": {
      "name": "John Organizer",
      "email": "john@example.com",
      "avatar": "https://..."
    },
    "stats": [
      // Existing event stats...
      {
        "label": "Total Events",
        "value": 12,
        "icon": "Calendar",
        "color": "#3b82f6"
      },
      // NEW: Award stats
      {
        "label": "Total Awards",
        "value": 5,
        "icon": "Trophy",
        "color": "#8b5cf6"
      },
      {
        "label": "Active Voting",
        "value": 2,
        "icon": "Award",
        "color": "#10b981"
      }
    ],
    // Existing fields...
    "ticketSalesData": [...],
    "weeklyRevenueData": [...],
    "monthlyRevenueData": [...],
    "activities": [...],
    "recentOrders": [...],
    "upcomingEvent": {...},
    "calendarEvents": [...],
    
    // NEW: Upcoming Award
    "upcomingAward": {
      "id": 1,
      "title": "Ghana Music Awards 2025",
      "description": "Celebrating excellence in Ghanaian music...",
      "banner_image": "https://example.com/images/gma-2025.jpg",
      "ceremony_date": "2025-03-15",
      "venue_name": "National Theatre",
      "total_votes": 1500,
      "revenue": 75000
    }
  }
}
```

#### Notes
- `upcomingAward` should be the **next** award ceremony (soonest ceremony_date in the future)
- Can be `null` if organizer has no upcoming awards
- Include awards where organizer is the creator

---

### 2. Awards Listing Page
**Endpoint**: `GET /organizers/data/awards`  
**Authentication**: Required (Organizer only)  
**Purpose**: Return awards list with statistics and filter tabs

#### Request
```http
GET /organizers/data/awards
Authorization: Bearer {token}
```

#### Response Structure
```json
{
  "success": true,
  "data": {
    "stats": [
      {
        "label": "Total Awards",
        "value": 10,
        "icon": "Trophy",
        "color": "#8b5cf6"
      },
      {
        "label": "Published",
        "value": 8,
        "icon": "Calendar",
        "color": "#10b981"
      },
      {
        "label": "Voting Open",
        "value": 5,
        "icon": "Award",
        "color": "#06b6d4"
      },
      {
        "label": "Completed",
        "value": 3,
        "icon": "TrendingUp",
        "color": "#f59e0b"
      }
    ],
    "tabs": [
      {
        "id": "all",
        "label": "All",
        "count": 10
      },
      {
        "id": "published",
        "label": "Published",
        "count": 8
      },
      {
        "id": "draft",
        "label": "Draft",
        "count": 2
      },
      {
        "id": "voting open",
        "label": "Voting Open",
        "count": 5
      },
      {
        "id": "completed",
        "label": "Completed",
        "count": 3
      }
    ],
    "awards": [
      {
        "id": 1,
        "title": "Ghana Music Awards 2025",
        "banner_image": "https://example.com/images/gma-2025.jpg",
        "status": "published",
        "voting_status": "Voting Open",
        "ceremony_date": "2025-03-15",
        "venue_name": "National Theatre",
        "categories_count": 12,
        "total_votes": 1500,
        "revenue": 75000
      },
      {
        "id": 2,
        "title": "Ghana Movie Awards 2025",
        "banner_image": "https://example.com/images/gmv-2025.jpg",
        "status": "draft",
        "voting_status": null,
        "ceremony_date": "2025-04-20",
        "venue_name": "Accra International Conference Centre",
        "categories_count": 8,
        "total_votes": 0,
        "revenue": 0
      }
      // ... more awards
    ]
  }
}
```

#### Field Descriptions

**stats**: Array of statistics cards
- `label`: Display text
- `value`: Numeric value to show
- `icon`: Icon name (from lucide-react)
- `color`: Hex color code for the icon/card

**tabs**: Filter tabs with counts
- `id`: Tab identifier (used for filtering) - should match status in lowercase
- `label`: Display text
- `count`: Number of awards matching this filter

**awards**: Array of award objects
- `id`: Unique award identifier
- `title`: Award title/name
- `banner_image`: Award banner image URL (can fallback to `image` field)
- `status`: Award status - **must be one of**: `published`, `draft`, `voting open`, `completed`, `cancelled`
- `voting_status`: Optional display status for voting (e.g., "Voting Open", "Voting Closed", "Not Started")
- `ceremony_date`: Ceremony date (format: YYYY-MM-DD or formatted string)
- `venue_name`: Award venue/location name
- `categories_count`: Number of award categories (computed field)
- `total_votes`: Total votes received across all categories (computed field)
- `revenue`: Total revenue from votes (computed field)

#### Business Logic

**Status Determination**:
- `draft`: Award not yet published
- `published`: Award is published and visible
- `voting open`: Award is published AND current date is within voting period
- `completed`: Award ceremony has passed
- `cancelled`: Award was cancelled

**Tab Counts**:
- Count awards where `status` matches tab `id` (case-insensitive)
- "All" tab should count all awards

**Computed Fields**:
```sql
-- categories_count
SELECT COUNT(*) FROM award_categories WHERE award_id = ?

-- total_votes
SELECT COUNT(*) FROM award_votes 
JOIN award_nominees ON award_votes.nominee_id = award_nominees.id
JOIN award_categories ON award_nominees.category_id = award_categories.id
WHERE award_categories.award_id = ?

-- revenue
SELECT SUM(amount) FROM award_votes 
JOIN award_nominees ON award_votes.nominee_id = award_nominees.id
JOIN award_categories ON award_nominees.category_id = award_categories.id
WHERE award_categories.award_id = ?
```

---

### 3. Single Award Details (Future)
**Endpoint**: `GET /organizers/data/awards/{id}`  
**Authentication**: Required (Organizer only)  
**Purpose**: Return detailed award data for view page

#### Request
```http
GET /organizers/data/awards/1
Authorization: Bearer {token}
```

#### Response Structure (Placeholder)
```json
{
  "success": true,
  "data": {
    "award": {
      "id": 1,
      "title": "Ghana Music Awards 2025",
      "description": "Celebrating excellence...",
      "banner_image": "https://...",
      "ceremony_date": "2025-03-15",
      "ceremony_time": "18:00",
      "voting_start": "2025-01-01",
      "voting_end": "2025-03-01",
      "venue_name": "National Theatre",
      "address": "Liberation Road, Accra",
      "status": "published"
    },
    "stats": {
      "total_categories": 12,
      "total_nominees": 60,
      "total_votes": 1500,
      "revenue": 75000,
      "unique_voters": 850
    },
    "categories": [
      {
        "id": 1,
        "name": "Best Artist",
        "nominees_count": 5,
        "total_votes": 250,
        "revenue": 12500
      }
      // ... more categories
    ],
    "recent_votes": [
      // Recent voting activity
    ],
    "vote_analytics": {
      // Charts data
    }
  }
}
```

---

### 4. Award Statistics (Future)
**Endpoint**: `GET /organizers/data/awards/stats`  
**Authentication**: Required (Organizer only)  
**Purpose**: Return aggregated award statistics

#### Response Structure (Placeholder)
```json
{
  "success": true,
  "data": {
    "total_awards": 10,
    "published_awards": 8,
    "active_voting": 5,
    "total_revenue": 500000,
    "total_votes": 15000,
    "total_categories": 80,
    "total_nominees": 400
  }
}
```

---

## 🔒 Authorization

All endpoints must verify:
1. User is authenticated
2. User has organizer role
3. User can only access their own awards

### Example Check (Pseudo-code)
```php
// Get authenticated organizer
$organizer = auth()->user()->organizer;

if (!$organizer) {
    return response()->json(['error' => 'Unauthorized'], 403);
}

// When fetching specific award
$award = Award::find($id);
if ($award->organizer_id !== $organizer->id) {
    return response()->json(['error' => 'Unauthorized'], 403);
}
```

---

## 🗄️ Database Schema Reference

### Required Tables
```sql
-- awards table
CREATE TABLE awards (
    id INT PRIMARY KEY,
    organizer_id INT,
    title VARCHAR(255),
    description TEXT,
    banner_image VARCHAR(255),
    ceremony_date DATE,
    ceremony_time TIME,
    voting_start DATETIME,
    voting_end DATETIME,
    venue_name VARCHAR(255),
    address TEXT,
    status ENUM('draft', 'published', 'completed', 'cancelled'),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- award_categories table
CREATE TABLE award_categories (
    id INT PRIMARY KEY,
    award_id INT,
    name VARCHAR(255),
    description TEXT,
    -- ... other fields
);

-- award_nominees table
CREATE TABLE award_nominees (
    id INT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255),
    image VARCHAR(255),
    -- ... other fields
);

-- award_votes table
CREATE TABLE award_votes (
    id INT PRIMARY KEY,
    nominee_id INT,
    user_id INT,
    amount DECIMAL(10,2),
    payment_reference VARCHAR(255),
    created_at TIMESTAMP
);
```

---

## 🧪 Testing Examples

### Test Data for Dashboard
```json
{
  "upcomingAward": {
    "id": 1,
    "title": "Ghana Music Awards 2025",
    "description": "Annual celebration of Ghanaian music excellence",
    "banner_image": "https://placehold.co/800x450/8b5cf6/white?text=GMA+2025",
    "ceremony_date": "2025-03-15",
    "venue_name": "National Theatre",
    "total_votes": 1500,
    "revenue": 75000
  }
}
```

### Test Data for Awards List
```json
{
  "stats": [
    {"label": "Total Awards", "value": 3, "icon": "Trophy", "color": "#8b5cf6"},
    {"label": "Published", "value": 2, "icon": "Calendar", "color": "#10b981"},
    {"label": "Voting Open", "value": 1, "icon": "Award", "color": "#06b6d4"},
    {"label": "Completed", "value": 1, "icon": "TrendingUp", "color": "#f59e0b"}
  ],
  "tabs": [
    {"id": "all", "label": "All", "count": 3},
    {"id": "published", "label": "Published", "count": 2},
    {"id": "draft", "label": "Draft", "count": 1},
    {"id": "voting open", "label": "Voting Open", "count": 1},
    {"id": "completed", "label": "Completed", "count": 1}
  ],
  "awards": [
    {
      "id": 1,
      "title": "Ghana Music Awards 2025",
      "banner_image": "https://placehold.co/800x450/8b5cf6/white?text=GMA+2025",
      "status": "published",
      "voting_status": "Voting Open",
      "ceremony_date": "March 15, 2025",
      "venue_name": "National Theatre",
      "categories_count": 12,
      "total_votes": 1500,
      "revenue": 75000
    },
    {
      "id": 2,
      "title": "Ghana Movie Awards 2025",
      "banner_image": "https://placehold.co/800x450/7c3aed/white?text=GMV+2025",
      "status": "draft",
      "voting_status": null,
      "ceremony_date": "April 20, 2025",
      "venue_name": "Accra International Conference Centre",
      "categories_count": 8,
      "total_votes": 0,
      "revenue": 0
    },
    {
      "id": 3,
      "title": "Ghana Music Awards 2024",
      "banner_image": "https://placehold.co/800x450/6d28d9/white?text=GMA+2024",
      "status": "completed",
      "voting_status": "Voting Closed",
      "ceremony_date": "March 15, 2024",
      "venue_name": "National Theatre",
      "categories_count": 10,
      "total_votes": 2500,
      "revenue": 125000
    }
  ]
}
```

---

## 🐛 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "errors": {
    "field": ["Error details"]
  }
}
```

### HTTP Status Codes
- `200` - Success
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized to access resource)
- `404` - Award not found
- `422` - Validation error
- `500` - Server error

---

## ✅ Implementation Checklist

### Phase 1: Dashboard Enhancement
- [ ] Add `upcomingAward` field to `/organizers/data/dashboard`
- [ ] Implement logic to find next upcoming award ceremony
- [ ] Add award-related stats to dashboard stats array
- [ ] Test with organizers who have/don't have awards

### Phase 2: Awards Listing
- [ ] Create `/organizers/data/awards` endpoint
- [ ] Implement stats calculation (total, published, voting open, completed)
- [ ] Implement tabs with counts
- [ ] Add computed fields to awards query:
  - [ ] `categories_count`
  - [ ] `total_votes`
  - [ ] `revenue`
- [ ] Implement status logic (especially "voting open")
- [ ] Add proper authorization checks
- [ ] Test with different award statuses

### Phase 3: Testing
- [ ] Test with no awards (empty state)
- [ ] Test with awards in different statuses
- [ ] Test authorization (organizers can't see other's awards)
- [ ] Test date calculations (voting period, ceremony date)
- [ ] Verify computed fields are accurate
- [ ] Performance test with many awards/votes

---

## 📞 Frontend Contact Points

If backend needs clarification, the frontend expects:

**Awards.jsx** (Line 52-63):
```javascript
const response = await awardService.getAwardsData();
// Expects: { success: true, data: { stats, tabs, awards } }
```

**Dashboard.jsx** (Line 39-53):
```javascript
const response = await organizerService.getDashboard();
// Expects upcomingAward in response.data
```

---

## 🎯 Success Criteria

The backend integration is complete when:
1. ✅ Dashboard shows award stats and upcoming award card
2. ✅ Awards page loads with statistics
3. ✅ Tab filtering works (counts are accurate)
4. ✅ Awards display in both grid and list views
5. ✅ Search functionality works (by title and venue)
6. ✅ Only organizer's own awards are shown
7. ✅ All computed fields are accurate
8. ✅ Loading and error states work properly

---

Ready to implement! 🚀
