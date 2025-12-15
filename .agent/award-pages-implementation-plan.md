# Award Management Pages - Implementation Plan

## 🎯 Objective
Create three comprehensive award management pages with category and nominee management functionality.

---

## 📋 Pages to Create

### 1. **ViewAward.jsx** 
**Purpose**: View detailed award information, categories, nominees, and voting statistics

**Sections:**
- Award header (title, status, dates, actions)
- Overview stats (categories, nominees, votes, revenue)
- Award details (description, venue, contact info)
- Categories list with nominees
- Voting analytics chart
- Recent votes activity
- Actions (Edit, Delete, View Public Page)

**Data Source**: `awardService.getAwardDetails(awardId)`

---

### 2. **CreateAward.jsx**
**Purpose**: Create a new award with basic information

**Form Sections:**
- Basic Information (title, description)
- Dates & Timing (ceremony date, voting start/end)
- Venue & Location (venue name, address, map URL)
- Media (banner image, video URL)
- Contact & Social (phone, website, social links)
- Settings (featured, show results)

**Workflow:**
1. Fill form
2. Submit to create award
3. Redirect to award details or category creation

**Data Source**: `awardService.create(awardData)`

---

### 3. **EditAward.jsx**  
**Purpose**: Edit existing award information

**Same as CreateAward but:**
- Pre-filled with existing data
- Update instead of create
- Option to manage categories/nominees

**Data Source**: 
- GET: `awardService.getById(awardId)`
- PUT: `awardService.update(awardId, awardData)`

---

### 4. **Category & Nominee Management**
**Location**: Integrated into ViewAward.jsx

**Features:**
- Add/Edit/Delete Categories
- Add/Edit/Delete Nominees per category
- Set voting costs per category
- Reorder categories and nominees
- View vote counts per nominee

**Components:**
- CategoryManager component
- NomineeManager component  
- Modals for add/edit operations

---

## 🎨 Design Patterns

### Follow Events Pages Structure
- Use same layout and styling
- Maintain consistent UI/UX
- Adapt colors to purple theme (awards)
- Reuse existing components (Card, Button, Badge, etc.)

### Key Components to Reuse
- Card, CardContent, CardHeader
- Button, Badge
- Forms with validation
- Loading states
- Error handling

---

## 📊 Data Flow

### ViewAward
```
Load → awardService.getAwardDetails(id) → Display:
  - Award info
  - Categories with nominees
  - Statistics
  - Recent activity
```

### CreateAward
```
Form Input → Validate → awardService.create(data) → Redirect to ViewAward
```

### EditAward
```
Load → awardService.getById(id) → Populate Form → 
User Edits → Validate → awardService.update(id, data) → Redirect to ViewAward
```

### Category Management
```
Add: categoryService.create(awardId, data) → Refresh
Edit: categoryService.update(categoryId, data) → Refresh
Delete: categoryService.delete(categoryId) → Refresh
```

### Nominee Management  
```
Add: nomineeService.create(categoryId, data) → Refresh
Edit: nomineeService.update(nomineeId, data) → Refresh
Delete: nomineeService.delete(nomineeId) → Refresh
```

---

## 🔧 Implementation Order

### Phase 1: View Page ✅
1. Create ViewAward.jsx
2. Display award information
3. Show categories and nominees
4. Display statistics and charts

### Phase 2: Create Page ✅
1. Create CreateAward.jsx
2. Build form with all fields
3. Add validation
4. Implement submission

### Phase 3: Edit Page ✅
1. Create EditAward.jsx
2. Reuse CreateAward form logic
3. Pre-populate with existing data
4. Implement update functionality

### Phase 4: Category/Nominee Management ✅
1. Create CategoryManager component
2. Create NomineeManager component
3. Add modals for CRUD operations
4. Integrate into ViewAward

---

## 📁 File Structure

```
src/pages/organizer/
├── Awards.jsx (existing)
├── ViewAward.jsx (new)
├── CreateAward.jsx (new)
├── EditAward.jsx (new)

src/components/organizer/awards/ (new folder)
├── CategoryManager.jsx (new)
├── NomineeManager.jsx (new)
├── AddCategoryModal.jsx (new)
├── AddNomineeModal.jsx (new)
```

---

## 🎨 UI Features

### ViewAward
- Back button to Awards list
- Edit/Delete action buttons
- Share button (copy public link)
- Tabs for different sections
- Expandable categories
- Vote analytics chart
- Recent activity feed

### CreateAward / EditAward
- Multi-step or single-page form
- Image upload for banner
- Date pickers for dates
- Rich text editor for description
- Map URL input
- Social media inputs
- Preview before save

### Category Manager
- List of categories
- Add new category button
- Inline edit/delete
- Drag to reorder
- View nominees count
- Set cost per vote

### Nominee Manager
- List of nominees per category
- Add nominee button  
- Image upload for nominee
- Inline edit/delete
- Drag to reorder
- View vote count (if voting open)

---

## 🧪 Testing Checklist

### ViewAward
- [ ] Displays award information correctly
- [ ] Shows all categories and nominees
- [ ] Statistics are accurate
- [ ] Charts render properly
- [ ] Actions work (Edit, Delete, Share)
- [ ] Handles missing data gracefully

### CreateAward
- [ ] Form validates required fields
- [ ] Submits data correctly
- [ ] Redirects after creation
- [ ] Handles errors properly
- [ ] Image upload works
- [ ] Date pickers work

### EditAward
- [ ] Loads existing data
- [ ] Pre-fills form correctly
- [ ] Updates award successfully
- [ ] Redirects after update
- [ ] Handles errors

### Category/Nominee Management
- [ ] Can add categories
- [ ] Can edit categories
- [ ] Can delete categories
- [ ] Can add nominees
- [ ] Can edit nominees
- [ ] Can delete nominees
- [ ] Reordering works
- [ ] Vote counts display

---

## 🚀 Next Steps

1. Start with ViewAward.jsx (most important for viewing)
2. Then CreateAward.jsx (for adding new awards)
3. Then EditAward.jsx (reuse CreateAward form)
4. Finally add Category/Nominee management components

**Ready to begin implementation!** 🎉
