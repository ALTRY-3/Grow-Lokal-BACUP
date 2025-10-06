# PRODUCT ADDING FUNCTIONALITY - IMPLEMENTATION PROMPT

## CURRENT STATE ANALYSIS

### Existing Files:
✅ **Frontend**: `/src/app/add-product/page.tsx` - Basic form UI is complete
✅ **Model**: `/src/models/Product.ts` - Product schema exists 
✅ **API**: `/src/app/api/products/route.ts` - Basic products API exists
✅ **Upload**: `/src/app/api/upload/route.ts` - File upload functionality exists

### Missing Functionality:
❌ **Product Creation API** - POST endpoint for adding new products
❌ **Form Submission Handler** - Frontend integration with backend
❌ **Seller Authentication** - Ensure only sellers can add products
❌ **Image Upload Integration** - Connect photo uploads to product creation
❌ **Product Management** - Edit, delete, view seller's products
❌ **Draft/Publish System** - Save as draft vs publish functionality
❌ **Navigation Integration** - Connect to seller dashboard

## IMPLEMENTATION REQUIREMENTS

### 1. BACKEND API ENDPOINTS NEEDED

#### A. Create Product API
**File**: `/src/app/api/products/create/route.ts`
```typescript
// POST /api/products/create
// Purpose: Create a new product for authenticated sellers
// Auth: Require seller status (isSeller: true)
// Validation: All required fields, price > 0, stock >= 0
// Response: Created product with ID
```

#### B. Seller Products API
**File**: `/src/app/api/seller/products/route.ts`
```typescript
// GET /api/seller/products - List seller's products
// POST /api/seller/products - Create product (alternative endpoint)
// Purpose: Manage seller's own products
```

#### C. Product Management API
**File**: `/src/app/api/products/[id]/route.ts` (extend existing)
```typescript
// PUT /api/products/[id] - Update product
// DELETE /api/products/[id] - Delete product
// PATCH /api/products/[id]/publish - Publish/unpublish
```

### 2. DATABASE SCHEMA UPDATES

#### Product Model Enhancements:
```typescript
// Add seller-specific fields to existing Product model:
export interface IProduct extends Document {
  // Existing fields...
  
  // Seller Management
  sellerId: mongoose.Types.ObjectId; // Reference to User._id
  sellerName: string;
  sellerEmail: string;
  
  // Product Status
  status: 'draft' | 'published' | 'inactive' | 'out_of_stock';
  publishedAt?: Date;
  
  // Business Logic
  minimumOrderQuantity: number;
  processingTime?: string; // e.g., "3-5 business days"
  customizationAvailable: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. FRONTEND FUNCTIONALITY

#### A. Form Submission Handler
```typescript
// In add-product/page.tsx - Add these functions:
const handleSaveAsDraft = async () => {
  // Upload images first
  // Submit with status: 'draft'
  // Show success message
  // Redirect to product management
};

const handlePublish = async () => {
  // Upload images first  
  // Submit with status: 'published'
  // Show success message
  // Redirect to product management or marketplace
};

const uploadImages = async (files: File[]) => {
  // Use existing /api/upload endpoint
  // Return array of uploaded URLs
};
```

#### B. Form Validation
```typescript
const validateForm = () => {
  const errors = [];
  
  if (!productName.trim()) errors.push("Product name is required");
  if (productName.length > 100) errors.push("Product name too long");
  if (!productDesc.trim()) errors.push("Description is required");
  if (!category) errors.push("Category is required");
  if (!price || parseFloat(price) <= 0) errors.push("Valid price required");
  if (!stock || parseInt(stock) < 0) errors.push("Valid stock required");
  if (!minQty || parseInt(minQty) < 1) errors.push("Minimum quantity must be at least 1");
  if (photos.length === 0) errors.push("At least one photo is required");
  
  return errors;
};
```

### 4. SELLER AUTHENTICATION & AUTHORIZATION

#### A. Route Protection
```typescript
// Middleware to check if user is a seller
export const requireSeller = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const user = await User.findOne({ email: session.user.email });
  
  if (!user?.isSeller) {
    return NextResponse.json({ error: "Seller access required" }, { status: 403 });
  }
  
  return { user, session };
};
```

#### B. Frontend Seller Check
```typescript
// In add-product/page.tsx - Add authentication check
useEffect(() => {
  const checkSellerStatus = async () => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    
    // Check if user is a seller
    const response = await fetch('/api/seller/status');
    const data = await response.json();
    
    if (!data.data?.isSeller) {
      router.push('/profile?section=selling');
      return;
    }
  };
  
  checkSellerStatus();
}, [session]);
```

### 5. PRODUCT MANAGEMENT DASHBOARD

#### A. Seller Products Page
**File**: `/src/app/seller/products/page.tsx`
```typescript
// Features needed:
// - List all seller's products (draft + published)
// - Filter by status (draft/published/inactive)
// - Search products
// - Quick actions (edit, delete, publish/unpublish)
// - Product performance metrics (views, sales)
// - Bulk actions
```

#### B. Product Edit Page
**File**: `/src/app/seller/products/[id]/edit/page.tsx`
```typescript
// Pre-populate form with existing product data
// Same validation as add-product
// Support updating images (add/remove)
// Version history/audit trail
```

### 6. INTEGRATION WITH EXISTING SYSTEMS

#### A. My Shop Dashboard Integration
```typescript
// In profile/page.tsx - Add to My Shop section:
// - "Add Product" button → /add-product
// - "Manage Products" button → /seller/products  
// - Product count and recent products widget
// - Quick stats (total products, published, draft)
```

#### B. Marketplace Integration
```typescript
// Ensure new products appear in:
// - /marketplace (if published)
// - Category pages
// - Search results
// - Related products
```

### 7. ERROR HANDLING & UX

#### A. Upload Progress
```typescript
const [uploadProgress, setUploadProgress] = useState(0);
const [isUploading, setIsUploading] = useState(false);

// Show progress bar during image upload
// Handle upload failures gracefully
// Allow retry on failed uploads
```

#### B. Form State Management
```typescript
// Auto-save draft every 30 seconds
// Warn before leaving with unsaved changes
// Restore form data from localStorage on page refresh
```

### 8. VALIDATION & BUSINESS RULES

#### A. Server-Side Validation
```typescript
// Product creation rules:
// - Seller must be verified/approved
// - Maximum 3 images per product
// - Price must be positive
// - Stock cannot be negative
// - Category must be valid
// - Product name must be unique per seller
// - Image files must be valid formats (jpg, png, webp)
// - Maximum file size: 5MB per image
```

#### B. Client-Side Validation
```typescript
// Real-time validation feedback
// Character counts for text fields
// Price formatting (₱ symbol, decimal places)
// Image size/format validation before upload
// Required field indicators
```

## IMPLEMENTATION PRIORITY

### Phase 1: Core Functionality (HIGH PRIORITY)
1. ✅ Create product creation API (`/api/products/create`)
2. ✅ Implement form submission handlers
3. ✅ Integrate image upload system
4. ✅ Add seller authentication checks
5. ✅ Test end-to-end product creation flow

### Phase 2: Product Management (MEDIUM PRIORITY)  
1. ✅ Create seller products dashboard
2. ✅ Implement product editing
3. ✅ Add draft/publish system
4. ✅ Integrate with My Shop section

### Phase 3: Enhanced Features (LOW PRIORITY)
1. ✅ Auto-save functionality
2. ✅ Bulk product operations
3. ✅ Product analytics/metrics
4. ✅ Advanced validation

## TESTING REQUIREMENTS

### Test Cases Needed:
1. **Authentication**: Non-sellers cannot access add-product page
2. **Validation**: All form validation works correctly
3. **Image Upload**: Multiple images upload successfully
4. **Draft Save**: Products save as draft without publishing
5. **Publish**: Products appear in marketplace when published
6. **Error Handling**: Network failures handled gracefully
7. **Mobile Responsive**: Form works on mobile devices

### Sample Test Data:
```javascript
const testProduct = {
  name: "Handwoven Basket",
  description: "Beautiful traditional basket made from native materials...",
  category: "Handicrafts", 
  price: "299.99",
  stock: "10",
  minimumOrderQuantity: "1",
  photos: [/* File objects */]
};
```

## SECURITY CONSIDERATIONS

1. **File Upload Security**: Validate image types, scan for malware
2. **Input Sanitization**: Prevent XSS in product descriptions
3. **Rate Limiting**: Limit product creation frequency
4. **Authorization**: Ensure sellers can only edit their own products
5. **Data Validation**: Server-side validation for all fields

## PERFORMANCE OPTIMIZATIONS

1. **Image Optimization**: Resize/compress uploaded images
2. **Lazy Loading**: Load product lists incrementally
3. **Caching**: Cache seller product counts and stats
4. **CDN**: Store product images on CDN for fast loading

---

## READY-TO-USE CODE SNIPPETS

### 1. Product Creation API
```typescript
// /src/app/api/products/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Check if user is a seller
    const user = await User.findOne({ email: session.user.email });
    if (!user?.isSeller) {
      return NextResponse.json({ error: "Seller access required" }, { status: 403 });
    }

    const data = await req.json();
    
    // Validation
    const errors = [];
    if (!data.name?.trim()) errors.push("Product name is required");
    if (!data.description?.trim()) errors.push("Description is required");
    if (!data.category) errors.push("Category is required");
    if (!data.price || parseFloat(data.price) <= 0) errors.push("Valid price required");
    if (data.stock === undefined || parseInt(data.stock) < 0) errors.push("Valid stock required");
    if (!data.images || data.images.length === 0) errors.push("At least one image required");
    
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    // Create product
    const product = await Product.create({
      name: data.name,
      description: data.description,
      category: data.category.toLowerCase(),
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      minimumOrderQuantity: parseInt(data.minimumOrderQuantity) || 1,
      images: data.images,
      thumbnailUrl: data.images[0],
      sellerId: user._id,
      sellerName: user.name || user.email,
      sellerEmail: user.email,
      status: data.status || 'draft',
      artistId: user._id,
      artistName: user.name || user.email,
      sku: `${user._id}-${Date.now()}`,
      currency: 'PHP',
      isAvailable: data.status === 'published',
      tags: [],
      searchKeywords: data.name.split(' '),
      averageRating: 0,
      totalReviews: 0
    });

    return NextResponse.json({ 
      success: true, 
      product: {
        id: product._id,
        name: product.name,
        status: product.status
      }
    });

  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
```

### 2. Form Submission Handler
```typescript
// Add to add-product/page.tsx
const handleSubmit = async (status: 'draft' | 'published') => {
  try {
    setIsUploading(true);
    
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join("\\n"));
      return;
    }

    // Upload images first
    const imageUrls = await uploadImages(photos);
    
    // Prepare product data
    const productData = {
      name: productName,
      description: productDesc,
      category: category,
      price: price,
      stock: stock,
      minimumOrderQuantity: minQty,
      images: imageUrls,
      status: status
    };

    // Submit to API
    const response = await fetch('/api/products/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    const result = await response.json();

    if (result.success) {
      alert(`Product ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
      // Redirect to product management or marketplace
      router.push('/seller/products');
    } else {
      alert(result.error || 'Failed to save product');
    }

  } catch (error) {
    console.error('Error submitting product:', error);
    alert('Failed to save product. Please try again.');
  } finally {
    setIsUploading(false);
  }
};

const uploadImages = async (files: File[]) => {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    return result.data.url;
  });

  return Promise.all(uploadPromises);
};
```

---

## NEXT STEPS

1. **Start with Phase 1**: Implement product creation API and form submission
2. **Test thoroughly**: Ensure basic flow works end-to-end  
3. **Add authentication**: Protect routes and validate seller status
4. **Implement management**: Build seller dashboard for product management
5. **Polish UX**: Add loading states, error handling, validation feedback

This implementation will provide a complete product adding system integrated with your existing seller registration and marketplace functionality.