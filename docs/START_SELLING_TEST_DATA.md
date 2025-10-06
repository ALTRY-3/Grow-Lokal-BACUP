# Start Selling - Test Data Guide

## Step 1: Shop Information

### Sample Data to Fill In:

1. **Shop Name**: `Tessy's Handmade Crafts`
   - Requirements: 3-50 characters
   - Example alternatives: `Maria's Art Studio`, `Juan's Pottery`

2. **Business Type**: Select `Handicrafts` from dropdown
   - Other options: Fashion, Food, Beauty, Home, Art, Other

3. **Shop Description**: 
   ```
   I create beautiful handmade crafts inspired by Filipino culture. Each piece is carefully crafted with love and attention to detail, making every item unique and special.
   ```
   - Requirements: 10-500 characters
   - Current length: ~150 characters ✓

4. **Pickup Address**:
   - **Barangay**: Select `Barretto` from dropdown
   - **Other Details**: `123 Sampaguita Street, Near Public Market`
   - Example alternatives: `456 Main Road, Building A Unit 2B`

5. **Email**: `tessycraft@gmail.com`
   - Must be valid email format
   - Example alternatives: `myshop@email.com`, `seller123@gmail.com`

6. **Phone**: `09171234567`
   - Requirements: Exactly 11 digits, numbers only
   - Example alternatives: `09123456789`, `09998887777`

7. **Social Media (Optional)**:
   - **Facebook**: `https://facebook.com/tessyhandmade`
   - **Instagram**: `@tessyhandmade`
   - **TikTok**: `@tessycrafts`

8. **Valid ID**: Upload any image file (jpg, png) or PDF
   - Example: Driver's license, Government ID, etc.

---

## Step 2: Seller Story

### Sample Data to Fill In:

1. **Artist Story Title**: `From Hobby to Business`
   - Example alternatives: `My Creative Journey`, `Passion for Crafts`

2. **Artist Story** (10-1000 characters):
   ```
   I started making handcrafted items as a hobby during the pandemic. What began as a way to pass time quickly turned into a passion. Friends and family loved my creations and encouraged me to sell them. Now, I'm excited to share my work with more people and support local artistry. Each piece I create tells a story and I hope it brings joy to those who receive them.
   ```
   - Requirements: 10-1000 characters
   - Current length: ~390 characters ✓

---

## Step 3: Submit

### Agreements to Check:

1. ☑ **Terms and Conditions**: I agree to follow GrowLokal's seller guidelines
2. ☑ **Commission Agreement**: I understand the platform fee structure
3. ☑ **Shipping Policy**: I agree to handle shipping responsibly

---

## Testing Workflow

### 1. Fill Step 1 (Shop Information)
1. Enter all the sample data above
2. Upload a valid ID file
3. **Click the SAVE button (💾 disk icon)** - This is REQUIRED!
4. You should see "Progress saved!" modal
5. Click "Close" on the modal
6. Now the "Next" button should be enabled
7. Click "Next"

### 2. Fill Step 2 (Seller Story)
1. Enter Artist Story Title
2. Enter Artist Story
3. **Click the SAVE button (💾 disk icon)** again
4. You should see "Progress saved!" modal
5. Click "Close" on the modal
6. Click "Next"

### 3. Complete Step 3 (Submit)
1. Check all three checkboxes
2. **Click the SAVE button (💾 disk icon)** one more time
3. Click "Submit"
4. You should see success modal
5. Page will reload after 1.5 seconds
6. You should now see "My Shop" instead of "Start Selling"

---

## Debug Checklist

If the Save or Next button is disabled, open browser console (F12) and check:

1. **Console Logs** - Look for "Step 1 Validation Status:" showing which fields are failing
2. **Current Values** - Shows what data is actually in the state

### Common Issues:

- ❌ **Phone must be exactly 11 digits**: `09171234567` (not `917-123-4567`)
- ❌ **Email must be valid format**: `name@domain.com` (not `name@domain`)
- ❌ **Shop Description min 10 chars**: At least 10 characters required
- ❌ **Valid ID required**: Must upload a file
- ❌ **Must click SAVE first**: The disk icon button must be clicked before Next works

---

## Quick Copy-Paste Test Data

```
Shop Name: Tessy's Handmade Crafts
Business Type: Handicrafts
Shop Description: I create beautiful handmade crafts inspired by Filipino culture. Each piece is carefully crafted with love and attention to detail, making every item unique and special.
Barangay: Barretto
Address Details: 123 Sampaguita Street, Near Public Market
Email: tessycraft@gmail.com
Phone: 09171234567
Story Title: From Hobby to Business
Story: I started making handcrafted items as a hobby during the pandemic. What began as a way to pass time quickly turned into a passion. Friends and family loved my creations and encouraged me to sell them. Now, I'm excited to share my work with more people and support local artistry. Each piece I create tells a story and I hope it brings joy to those who receive them.
```

---

## After Submission

### Expected Behavior:
1. Success modal appears
2. Page reloads after 1.5 seconds
3. Navigation changes from "Start Selling" to "My Shop"
4. Click "My Shop" to see your dashboard
5. Your shop name should display: **Tessy's Handmade Crafts**
6. Your artist story should be visible

### Check Your Data:
1. Go to "My Shop" section
2. Verify shop name appears correctly
3. Scroll down to see your Artist Story card
4. All information should match what you entered

---

## Troubleshooting

### If data is not showing in My Shop:

1. Check browser console for logs:
   - "Fetching seller profile..."
   - "Seller profile response:"
   - "Setting seller profile state:"

2. Check server logs (terminal running npm run dev):
   - "Saving seller profile:"
   - "User updated successfully"
   - "Fetched seller profile:"

3. Refresh the page manually (F5)

4. Try navigating away and back to "My Shop"

### If you need to test again:

1. You can only submit once per account
2. To test again, you'll need to:
   - Use a different email account, OR
   - Clear the database entry for your user

---

## Expected Console Output

When filling the form, you should see:
```
Step 1 Validation Status: {shopName: true, businessType: true, ...}
```

When all fields are valid, the console log will stop appearing and buttons will enable.

After clicking Submit:
```
Fetching seller profile...
Seller profile response: {success: true, data: {...}}
Setting seller profile state: {shopName: "Tessy's Handmade Crafts", ...}
```
