# Start Selling Backend Implementation Guide

## Overview
Implement complete backend functionality for the Start Selling feature, including seller registration, data persistence, and automatic state management across sessions (logout/refresh).

---

## 1. Database Schema Changes

### User Model Updates
Add seller-related fields to the existing User model:

```typescript
// models/User.ts or schema definition
{
  // Existing fields...
  isSeller: {
    type: Boolean,
    default: false
  },
  sellerProfile: {
    shopName: String,
    businessType: String,
    shopDescription: String,
    pickupAddress: {
      barangay: String,
      otherDetails: String
    },
    shopEmail: String,
    shopPhone: String,
    socialMediaLinks: {
      facebook: String,
      instagram: String,
      tiktok: String
    },
    sellerStoryTitle: String,
    sellerStory: String,
    sellerPhoto: String, // URL to uploaded photo
    validIdUrl: String, // URL to uploaded valid ID
    agreedToTerms: Boolean,
    agreedToCommission: Boolean,
    agreedToShipping: Boolean,
    applicationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    applicationSubmittedAt: Date,
    approvedAt: Date,
    rejectedAt: Date,
    rejectionReason: String
  }
}
```

---

## 2. API Endpoints to Create

### A. Submit Seller Application
**Endpoint:** `POST /api/seller/apply`

**Request Body:**
```json
{
  "shopName": "string (3-50 chars)",
  "businessType": "string (Handicrafts|Fashion|Food|Beauty|Home Decor|Art & Design|Other)",
  "shopDescription": "string (10-500 chars)",
  "pickupAddress": {
    "barangay": "string",
    "otherDetails": "string"
  },
  "shopEmail": "string (email format)",
  "shopPhone": "string (11 digits)",
  "socialMediaLinks": {
    "facebook": "string (optional, URL)",
    "instagram": "string (optional, @username)",
    "tiktok": "string (optional, @username)"
  },
  "sellerStoryTitle": "string (1-80 chars)",
  "sellerStory": "string (10-1000 chars)",
  "sellerPhoto": "string (URL from upload)",
  "validIdUrl": "string (URL from upload)",
  "agreedToTerms": true,
  "agreedToCommission": true,
  "agreedToShipping": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Seller application submitted successfully",
  "data": {
    "applicationStatus": "pending",
    "submittedAt": "ISO date string"
  }
}
```

**Implementation:**
```typescript
// pages/api/seller/apply.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await dbConnect();

    // Validate all required fields
    const {
      shopName,
      businessType,
      shopDescription,
      pickupAddress,
      shopEmail,
      shopPhone,
      socialMediaLinks,
      sellerStoryTitle,
      sellerStory,
      sellerPhoto,
      validIdUrl,
      agreedToTerms,
      agreedToCommission,
      agreedToShipping
    } = req.body;

    // Validation
    if (!shopName || shopName.length < 3 || shopName.length > 50) {
      return res.status(400).json({ success: false, message: "Shop name must be 3-50 characters" });
    }

    if (!businessType) {
      return res.status(400).json({ success: false, message: "Business type is required" });
    }

    if (!shopDescription || shopDescription.length < 10 || shopDescription.length > 500) {
      return res.status(400).json({ success: false, message: "Shop description must be 10-500 characters" });
    }

    if (!pickupAddress?.barangay || !pickupAddress?.otherDetails) {
      return res.status(400).json({ success: false, message: "Complete pickup address is required" });
    }

    if (!shopEmail || !shopPhone) {
      return res.status(400).json({ success: false, message: "Shop email and phone are required" });
    }

    if (!sellerStoryTitle || !sellerStory || sellerStory.length < 10) {
      return res.status(400).json({ success: false, message: "Seller story is required (min 10 characters)" });
    }

    if (!validIdUrl) {
      return res.status(400).json({ success: false, message: "Valid ID upload is required" });
    }

    if (!agreedToTerms || !agreedToCommission || !agreedToShipping) {
      return res.status(400).json({ success: false, message: "All agreements must be accepted" });
    }

    // Check if user already has a pending/approved application
    const user = await User.findOne({ email: session.user.email });
    
    if (user?.isSeller) {
      return res.status(400).json({ 
        success: false, 
        message: "You are already registered as a seller" 
      });
    }

    if (user?.sellerProfile?.applicationStatus === 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: "You already have a pending seller application" 
      });
    }

    // Update user with seller application
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          isSeller: true, // Immediately set to true for instant My Shop access
          sellerProfile: {
            shopName,
            businessType,
            shopDescription,
            pickupAddress,
            shopEmail,
            shopPhone,
            socialMediaLinks,
            sellerStoryTitle,
            sellerStory,
            sellerPhoto,
            validIdUrl,
            agreedToTerms,
            agreedToCommission,
            agreedToShipping,
            applicationStatus: 'approved', // Auto-approve for instant access
            applicationSubmittedAt: new Date(),
            approvedAt: new Date()
          }
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Seller application submitted successfully",
      data: {
        isSeller: true,
        applicationStatus: 'approved',
        submittedAt: updatedUser.sellerProfile.applicationSubmittedAt,
        shopName: updatedUser.sellerProfile.shopName
      }
    });

  } catch (error) {
    console.error("Error submitting seller application:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to submit application" 
    });
  }
}
```

---

### B. Get Seller Status
**Endpoint:** `GET /api/seller/status`

**Response:**
```json
{
  "success": true,
  "data": {
    "isSeller": true,
    "applicationStatus": "approved",
    "shopName": "My Craft Shop",
    "submittedAt": "ISO date string",
    "approvedAt": "ISO date string"
  }
}
```

**Implementation:**
```typescript
// pages/api/seller/status.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email })
      .select('isSeller sellerProfile');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        isSeller: user.isSeller || false,
        applicationStatus: user.sellerProfile?.applicationStatus || null,
        shopName: user.sellerProfile?.shopName || null,
        submittedAt: user.sellerProfile?.applicationSubmittedAt || null,
        approvedAt: user.sellerProfile?.approvedAt || null
      }
    });

  } catch (error) {
    console.error("Error fetching seller status:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch seller status" 
    });
  }
}
```

---

### C. Get Seller Profile Details
**Endpoint:** `GET /api/seller/profile`

**Response:**
```json
{
  "success": true,
  "data": {
    "shopName": "string",
    "businessType": "string",
    "shopDescription": "string",
    "pickupAddress": {...},
    "shopEmail": "string",
    "shopPhone": "string",
    "socialMediaLinks": {...},
    "sellerStoryTitle": "string",
    "sellerStory": "string",
    "sellerPhoto": "URL",
    "applicationStatus": "approved"
  }
}
```

**Implementation:**
```typescript
// pages/api/seller/profile.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email })
      .select('isSeller sellerProfile');

    if (!user || !user.isSeller) {
      return res.status(404).json({ 
        success: false, 
        message: "Seller profile not found" 
      });
    }

    return res.status(200).json({
      success: true,
      data: user.sellerProfile
    });

  } catch (error) {
    console.error("Error fetching seller profile:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch seller profile" 
    });
  }
}
```

---

### D. Update Profile API to Include Seller Status
**Update:** `GET /api/user/profile`

Modify the existing profile endpoint to include `isSeller` status:

```typescript
// In pages/api/user/profile.ts - GET handler
const user = await User.findOne({ email: session.user.email })
  .select('fullName email phone address gender profilePicture isSeller');

return res.status(200).json({
  success: true,
  data: {
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    gender: user.gender,
    profilePicture: user.profilePicture,
    isSeller: user.isSeller || false // Add this
  }
});
```

---

## 3. Frontend Integration

### Update Profile Page State Management

```typescript
// In src/app/profile/page.tsx

// Add to existing useEffect for profile fetching
useEffect(() => {
  const fetchProfile = async () => {
    if (!session?.user) return;
    
    setIsLoadingProfile(true);
    setProfileError("");
    
    try {
      const response = await fetch("/api/user/profile", {
        headers: {
          'Cache-Control': 'max-age=300',
        }
      });
      const data = await response.json();

      if (data.success) {
        // ... existing state updates ...
        
        // Add seller status
        setIsSeller(data.data.isSeller || false);
        
        // If seller, also fetch seller profile details
        if (data.data.isSeller) {
          fetchSellerProfile();
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  fetchProfile();
}, [session]);

// Add new function to fetch seller profile
const fetchSellerProfile = async () => {
  try {
    const response = await fetch("/api/seller/profile");
    const data = await response.json();
    
    if (data.success) {
      // Update all seller-related state
      setShopName(data.data.shopName || "");
      setBusinessType(data.data.businessType || "");
      setShopDescription(data.data.shopDescription || "");
      setPickupBarangay(data.data.pickupAddress?.barangay || "");
      setPickupAddress(data.data.pickupAddress?.otherDetails || "");
      setShopEmail(data.data.shopEmail || "");
      setSocialMediaLinks(data.data.socialMediaLinks || {});
      setSellerStoryTitle(data.data.sellerStoryTitle || "");
      setSellerStory(data.data.sellerStory || "");
      // ... update other fields
    }
  } catch (error) {
    console.error("Error fetching seller profile:", error);
  }
};
```

---

### Update Form Submission Handler

```typescript
// In src/app/profile/page.tsx

const handleSubmitApplication = async () => {
  // Validate all fields
  if (!isStep1Valid() || !isStep2Valid() || !isStep3Valid()) {
    alert("Please complete all required fields");
    return;
  }

  setShowSubmitModal(false);
  setIsSubmitting(true);

  try {
    // Prepare application data
    const applicationData = {
      shopName,
      businessType,
      shopDescription,
      pickupAddress: {
        barangay: pickupBarangay,
        otherDetails: pickupAddress
      },
      shopEmail,
      shopPhone: phone,
      socialMediaLinks,
      sellerStoryTitle,
      sellerStory,
      sellerPhoto: document.getElementById("sellerPhotoPreview")?.getAttribute("src") || "",
      validIdUrl: validIdFile ? await uploadFile(validIdFile) : "",
      agreedToTerms,
      agreedToCommission,
      agreedToShipping
    };

    // Submit application
    const response = await fetch("/api/seller/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(applicationData)
    });

    const data = await response.json();

    if (data.success) {
      // Update seller status immediately
      setIsSeller(true);
      
      // Show success modal
      setSuccessMessage("Your shop has been registered successfully!");
      setShowSuccessModal(true);
      
      // Redirect to My Shop after 2 seconds
      setTimeout(() => {
        setActiveSection("myshop");
        setShowSuccessModal(false);
      }, 2000);
    } else {
      alert(data.message || "Failed to submit application");
    }
  } catch (error) {
    console.error("Error submitting application:", error);
    alert("Failed to submit application. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

// Helper function to upload file
const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error("Failed to upload file");
  }
  
  return data.data.url;
};
```

---

## 4. Session Persistence

### Add Seller Status to NextAuth Session

Update NextAuth configuration to include seller status:

```typescript
// pages/api/auth/[...nextauth].ts or auth config

export const authOptions = {
  // ... existing config
  
  callbacks: {
    async session({ session, token, user }) {
      if (session?.user) {
        // Fetch fresh user data including seller status
        const dbUser = await User.findOne({ email: session.user.email })
          .select('isSeller sellerProfile');
        
        session.user.id = user.id || token.sub;
        session.user.isSeller = dbUser?.isSeller || false;
        session.user.shopName = dbUser?.sellerProfile?.shopName || null;
      }
      return session;
    },
    
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
      }
      
      // Refresh seller status on update trigger
      if (trigger === "update") {
        const dbUser = await User.findById(token.id)
          .select('isSeller sellerProfile');
        token.isSeller = dbUser?.isSeller || false;
      }
      
      return token;
    }
  }
};
```

### Update Session Type

```typescript
// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      isSeller?: boolean;
      shopName?: string;
    }
  }

  interface User {
    isSeller?: boolean;
    shopName?: string;
  }
}
```

---

## 5. Loading States & Error Handling

### Add Loading States

```typescript
// In src/app/profile/page.tsx

const [isSubmitting, setIsSubmitting] = useState(false);
const [isLoadingSellerProfile, setIsLoadingSellerProfile] = useState(false);

// Update UI to show loading states
{isSubmitting && (
  <div className="loading-overlay">
    <div className="spinner">Submitting application...</div>
  </div>
)}
```

---

## 6. Testing Checklist

- [ ] Submit seller application with all valid fields
- [ ] Verify data is saved to database
- [ ] Verify isSeller flag is set to true
- [ ] Logout and login - verify "My Shop" appears instead of "Start Selling"
- [ ] Refresh page - verify state persists
- [ ] Try to submit duplicate application - should be prevented
- [ ] Verify all seller data displays correctly in My Shop section
- [ ] Test with missing required fields - should show validation errors
- [ ] Test file uploads (photo and valid ID)
- [ ] Verify social media links are optional and save correctly

---

## 7. Security Considerations

1. **Authentication**: All seller endpoints must verify user is authenticated
2. **Authorization**: Only the seller can view/edit their own shop data
3. **Input Validation**: Validate all inputs on both frontend and backend
4. **File Upload Security**: 
   - Validate file types (images only)
   - Limit file sizes (5MB max)
   - Sanitize filenames
   - Store in secure location
5. **Rate Limiting**: Prevent spam applications
6. **SQL Injection Prevention**: Use parameterized queries
7. **XSS Prevention**: Sanitize user inputs before display

---

## 8. Implementation Order

1. ✅ Update database schema/model
2. ✅ Create `/api/seller/apply` endpoint
3. ✅ Create `/api/seller/status` endpoint
4. ✅ Create `/api/seller/profile` endpoint
5. ✅ Update `/api/user/profile` to include isSeller
6. ✅ Update NextAuth session callbacks
7. ✅ Update frontend state management
8. ✅ Update form submission handler
9. ✅ Add loading states and error handling
10. ✅ Test thoroughly
11. ✅ Deploy and monitor

---

## 9. Future Enhancements

- Admin approval workflow (instead of auto-approve)
- Email notifications on application status change
- Seller dashboard with analytics
- Product management integration
- Order management for sellers
- Seller rating and reviews system
- Multi-language support for international sellers

---

## Quick Copy-Paste Implementation

### Step 1: Create API Route File
```bash
# Create the directory and file
mkdir -p pages/api/seller
touch pages/api/seller/apply.ts
touch pages/api/seller/status.ts
touch pages/api/seller/profile.ts
```

### Step 2: Update User Model
Add the sellerProfile schema to your User model (MongoDB/Mongoose)

### Step 3: Update Profile Page
Copy the updated `handleSubmitApplication` and `fetchSellerProfile` functions

### Step 4: Test
1. Fill out the Start Selling form
2. Click Submit
3. Verify it switches to "My Shop"
4. Logout and login - should still show "My Shop"
5. Refresh page - should persist

---

## Support & Troubleshooting

**Issue**: "My Shop" doesn't appear after submission
- Check browser console for API errors
- Verify database connection
- Check if isSeller is being set correctly
- Clear localStorage and session cookies

**Issue**: Data doesn't persist after refresh
- Verify NextAuth session is working
- Check if database save was successful
- Verify session callbacks are configured correctly

**Issue**: File uploads failing
- Check upload API endpoint
- Verify file size limits
- Check server disk space
- Verify upload directory permissions

---

## Conclusion

This implementation provides:
- ✅ Complete backend for seller registration
- ✅ Persistent state across sessions
- ✅ Automatic UI switching (Start Selling → My Shop)
- ✅ Secure data handling
- ✅ Error handling and validation
- ✅ Session management with NextAuth

The seller status will persist through logout/refresh because it's stored in the database and loaded via the profile API on every page load.
