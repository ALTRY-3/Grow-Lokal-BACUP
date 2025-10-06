# Start Selling UI & Information Collection Improvement Prompt

## Objective
Enhance the "Start Selling" / "Become a Seller" registration flow in the profile page to create a more intuitive, professional, and comprehensive onboarding experience for artisans and local sellers.

---

## Current Implementation
**File:** `src/app/profile/page.tsx`  
**Section:** "Start Selling" (selling section)

### Current Features:
- Multi-step wizard (Shop Info → Artist Story → Review)
- Basic form fields for shop details
- Photo upload for artist story
- Progress indicator
- Simple validation

### Current Information Collected:
1. **Shop Information:**
   - Shop Name
   - Pickup Barangay
   - Pickup Address
   - Shop Email
   - Contact Number
   - Valid ID Upload

2. **Artist Story:**
   - Story Title
   - Story Content (500 char max)
   - Photo Upload

3. **Review:** Summary of all entered information

---

## Suggested Improvements

### 1. Enhanced Form Fields & Validation

#### Shop Information (Step 1):
- [ ] **Shop Name**
  - Add character counter (3-50 characters)
  - Real-time validation for uniqueness
  - Show suggestions/availability indicator
  - Helper text: "Choose a memorable name that represents your brand"

- [ ] **Business Type** (NEW)
  - Dropdown: Handicrafts, Fashion, Food & Beverage, Beauty & Wellness, Home Decor, Art & Photography, Other
  - Helper text: "Select your primary product category"

- [ ] **Shop Description** (NEW)
  - Rich textarea (150-500 characters)
  - Character counter
  - Placeholder: "Describe what makes your products unique. What inspired you to start your business?"

- [ ] **Pickup Location**
  - Keep Region → Province → City → Barangay cascade
  - Add visual map preview (optional)
  - Add landmark field: "Nearby landmark or building"

- [ ] **Detailed Pickup Address**
  - More specific placeholder: "House/Unit No., Street Name, Subdivision/Building"
  - Add secondary line for complex addresses

- [ ] **Contact Information**
  - Split into Mobile Number (required) and Alternative Number (optional)
  - Add WhatsApp/Viber toggle if same as mobile
  - Email with verification badge if already verified

- [ ] **Business Hours** (NEW)
  - Days of operation checkboxes (Mon-Sun)
  - Time pickers for opening/closing hours
  - "Available by appointment" option

- [ ] **Valid ID & Business Documents**
  - Support multiple file uploads (max 3)
  - Accepted: Valid ID, Business Permit, DTI Registration (if applicable)
  - Add "Not yet registered?" link with info about DTI registration
  - File preview thumbnails
  - Drag-and-drop support

- [ ] **Social Media Links** (NEW - Optional)
  - Facebook Page URL
  - Instagram Handle
  - TikTok (optional)
  - Helper: "Help customers discover more about your brand"

---

#### Artist/Seller Story (Step 2):
- [ ] **Story Title**
  - Current: 80 char max
  - Add suggestions: "My Journey as a...", "The Story Behind...", "Crafting Dreams..."
  - Helper: "Create a compelling headline for your story"

- [ ] **Story Content**
  - Increase to 1000 characters (currently 500)
  - Add formatting toolbar: Bold, Italic, Line breaks
  - Guided prompts above textarea:
    - "Tell us about your inspiration"
    - "What materials/techniques do you use?"
    - "What makes your products special?"
    - "How did you get started?"
  - Real-time character counter
  - Save draft functionality

- [ ] **Photo Gallery** (Enhanced)
  - Upload multiple photos (up to 5)
  - First photo = profile/cover photo
  - Drag to reorder
  - Captions for each photo (optional)
  - Recommended dimensions displayed

- [ ] **Video Introduction** (NEW - Optional)
  - Upload short video (max 60 seconds, 50MB)
  - Or paste YouTube/Facebook video link
  - Preview player
  - Helper: "Show customers your workspace or craft in action"

- [ ] **Specializations/Skills** (NEW)
  - Tag input field
  - Examples: "Hand-weaving", "Natural dyes", "Custom orders", "Eco-friendly"
  - Max 10 tags

- [ ] **Years of Experience** (NEW)
  - Dropdown: < 1 year, 1-3 years, 3-5 years, 5-10 years, 10+ years

- [ ] **Production Capacity** (NEW)
  - Dropdown: Made-to-order only, Small batches (1-10/week), Medium batches (10-50/week), Large scale (50+/week)

- [ ] **Shipping Options** (NEW)
  - Checkboxes: Pickup only, Local delivery, Nationwide shipping, International shipping
  - If delivery selected, add "Delivery Radius" field

---

#### Review & Terms (Step 3):
- [ ] **Summary Cards**
  - Display all info in organized, editable cards
  - "Edit" button for each section jumps back to that step
  - Visual preview of uploaded images

- [ ] **Seller Agreement** (NEW)
  - Checkbox: "I agree to GrowLokal's Seller Terms and Conditions"
  - Link to terms modal/page
  - Checkbox: "I understand the commission structure (X% per sale)"
  - Checkbox: "I commit to shipping orders within X business days"

- [ ] **Expected Approval Time**
  - Message: "Your application will be reviewed within 1-3 business days"
  - Email notification confirmation

- [ ] **What Happens Next** (NEW)
  - Visual timeline:
    1. Application Submitted ✓
    2. Under Review (1-3 days)
    3. Approved/Revision Needed
    4. Start Selling!

---

### 2. UI/UX Enhancements

#### Progress Indicator:
- [ ] Replace simple circles with:
  - Step numbers inside circles
  - Step titles below circles
  - Completed steps: green checkmark
  - Current step: pulsing animation
  - Future steps: gray/disabled

#### Form Layout:
- [ ] Add icons next to each section title
- [ ] Group related fields in subtle card containers
- [ ] Add collapsible "Why we need this" info tooltips
- [ ] Consistent spacing (use CSS grid)

#### Validation & Feedback:
- [ ] Real-time inline validation (green checkmark for valid fields)
- [ ] Clear error messages below invalid fields
- [ ] Disable "Next" button until required fields are filled
- [ ] Show completion percentage (e.g., "Step 1: 75% complete")

#### Mobile Responsiveness:
- [ ] Stack form fields vertically on mobile
- [ ] Larger touch targets for buttons
- [ ] Collapsible sections to save space
- [ ] Fixed bottom bar with "Back" and "Next" buttons

#### Save & Resume:
- [ ] Auto-save draft every 30 seconds
- [ ] "Save and Continue Later" button
- [ ] Load draft on return with visual indicator

---

### 3. Seller Dashboard Preview (After Approval)

#### "My Shop" Section:
- [ ] **Shop Analytics Card**
  - Total Views
  - Total Sales
  - Active Products
  - Pending Orders

- [ ] **Quick Actions**
  - Add New Product (large CTA button)
  - View Orders
  - Edit Shop Info
  - Manage Inventory

- [ ] **Shop Performance**
  - Average Rating
  - Response Time
  - Fulfillment Rate

- [ ] **Recent Activity Feed**
  - Latest orders
  - Customer messages
  - Low stock alerts

---

### 4. Content Guidelines & Help

#### Add Help Section/Modal:
- [ ] **"Tips for Success"**
  - High-quality photos increase sales by X%
  - Respond to inquiries within 24 hours
  - Accurate descriptions reduce returns

- [ ] **"What to Sell"**
  - Handmade items
  - Local crafts
  - Artisan products
  - Custom/personalized items

- [ ] **"Prohibited Items"**
  - Counterfeit goods
  - Illegal items
  - Items violating intellectual property

- [ ] **FAQ Section**
  - How much does it cost to sell?
  - When do I get paid?
  - Can I cancel an order?
  - How do I handle returns?

---

### 5. Visual Design Improvements

#### Color Scheme:
- Use existing brand colors (#AF7928 gold, #2E3F36 dark green)
- Add success green (#10b981) for completed steps
- Add warning amber for incomplete/attention needed

#### Typography:
- Clear hierarchy with section titles (1.5rem, bold)
- Helper text (0.875rem, gray)
- Labels (1rem, semibold)

#### Imagery:
- Add illustrations for empty states
- Success animation when application is submitted
- Icon set for different business types

#### Micro-interactions:
- Smooth transitions between steps
- Button hover effects
- Input focus animations
- File upload progress bars

---

## Implementation Checklist

### Phase 1: Core Improvements (High Priority)
- [ ] Add Business Type field
- [ ] Add Shop Description
- [ ] Enhance photo upload (multiple photos, drag-drop)
- [ ] Add Seller Agreement checkboxes
- [ ] Improve progress indicator
- [ ] Real-time validation
- [ ] Mobile responsiveness fixes

### Phase 2: Enhanced Features (Medium Priority)
- [ ] Business hours selector
- [ ] Social media links
- [ ] Specializations tags
- [ ] Save draft functionality
- [ ] Video introduction upload
- [ ] Expected approval timeline display

### Phase 3: Advanced Features (Low Priority)
- [ ] Map preview for pickup location
- [ ] Rich text editor for story
- [ ] Analytics dashboard preview
- [ ] Help modal/FAQ integration
- [ ] Email verification integration

---

## Technical Considerations

### State Management:
- Add new state variables for all new fields
- Use `useReducer` for complex form state (consider refactoring)
- Local storage for draft saving

### Validation:
- Use validation library (Zod, Yup, or React Hook Form)
- Server-side validation in API routes
- Regex for phone numbers, emails, URLs

### File Uploads:
- Use FormData for multi-file uploads
- Add file size/type validation client-side
- Compress images before upload
- Store in cloud storage (AWS S3, Cloudinary)

### API Integration:
- Create `/api/seller/register` endpoint
- Create `/api/seller/draft` for saving drafts
- Add `/api/seller/check-shop-name` for availability

### Database Schema:
- Extend User model with seller-specific fields
- Create Shop/Seller model with all collected info
- Add enum types for dropdowns (business type, experience, etc.)

---

## Example Enhanced Flow

```
Step 1: Shop Information
┌─────────────────────────────────────────┐
│ Tell us about your business             │
├─────────────────────────────────────────┤
│ Shop Name: [________________] ✓         │
│ Business Type: [Dropdown ▼] ✓          │
│ Shop Description:                       │
│ [_________________________________]     │
│ [_________________________________]     │
│ Characters: 245/500                     │
│                                         │
│ Location & Pickup Details               │
│ Region: [Dropdown ▼]                    │
│ Province: [Dropdown ▼]                  │
│ ...                                     │
└─────────────────────────────────────────┘

Step 2: Your Story
┌─────────────────────────────────────────┐
│ Share your journey                      │
├─────────────────────────────────────────┤
│ Story Title: [________________]         │
│                                         │
│ Your Story: (Guided prompts shown)      │
│ [_________________________________]     │
│ [_________________________________]     │
│                                         │
│ Photo Gallery: [+ Upload] (3/5)        │
│ [img] [img] [img] [empty] [empty]      │
│                                         │
│ Skills & Specializations:               │
│ [Hand-weaving ×] [Natural dyes ×]      │
│ [+ Add tag]                            │
└─────────────────────────────────────────┘

Step 3: Review & Submit
┌─────────────────────────────────────────┐
│ Review Your Application                 │
├─────────────────────────────────────────┤
│ ✓ Shop Information    [Edit]           │
│   Shop Name: Lola's Weaves              │
│   Business Type: Handicrafts            │
│   Location: Olongapo, Zambales          │
│                                         │
│ ✓ Your Story          [Edit]           │
│   "My Journey as a Weaver"              │
│   5 photos uploaded                     │
│                                         │
│ ☐ I agree to Terms and Conditions      │
│ ☐ I understand the commission (10%)    │
│                                         │
│ [Submit Application →]                  │
└─────────────────────────────────────────┘
```

---

## Success Metrics

After implementation, track:
- Completion rate of seller applications
- Time to complete registration
- Application approval rate
- Seller satisfaction with onboarding process
- Reduction in incomplete/abandoned applications

---

## References

- Current file: `src/app/profile/page.tsx`
- Styles: `src/app/profile/profile.css`
- Related components: `src/components/Navbar.tsx`, `src/components/Footer.tsx`

---

**Next Steps:**
1. Review this prompt with the team
2. Prioritize features based on user feedback
3. Create UI mockups for new fields
4. Implement Phase 1 improvements
5. Test with beta sellers
6. Iterate based on feedback
