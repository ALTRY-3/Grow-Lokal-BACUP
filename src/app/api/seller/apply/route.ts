import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
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
    } = body;

    // Validation
    if (!shopName || shopName.length < 3 || shopName.length > 50) {
      return NextResponse.json(
        { success: false, message: "Shop name must be 3-50 characters" },
        { status: 400 }
      );
    }

    if (!businessType) {
      return NextResponse.json(
        { success: false, message: "Business type is required" },
        { status: 400 }
      );
    }

    // Shop description is now optional
    if (shopDescription && (shopDescription.length < 10 || shopDescription.length > 500)) {
      return NextResponse.json(
        { success: false, message: "Shop description must be 10-500 characters if provided" },
        { status: 400 }
      );
    }

    if (!pickupAddress?.barangay || !pickupAddress?.otherDetails) {
      return NextResponse.json(
        { success: false, message: "Complete pickup address is required" },
        { status: 400 }
      );
    }

    if (!shopEmail || !shopPhone) {
      return NextResponse.json(
        { success: false, message: "Shop email and phone are required" },
        { status: 400 }
      );
    }

    if (!sellerStoryTitle || !sellerStory || sellerStory.length < 10) {
      return NextResponse.json(
        { success: false, message: "Seller story is required (min 10 characters)" },
        { status: 400 }
      );
    }

    if (!validIdUrl) {
      return NextResponse.json(
        { success: false, message: "Valid ID upload is required" },
        { status: 400 }
      );
    }

    if (!agreedToTerms || !agreedToCommission || !agreedToShipping) {
      return NextResponse.json(
        { success: false, message: "All agreements must be accepted" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const user = await User.findOne({ email: session.user.email });
    
    console.log("Existing user status:", {
      email: session.user.email,
      userExists: !!user,
      isSeller: user?.isSeller,
      applicationStatus: user?.sellerProfile?.applicationStatus,
      hasSellerProfile: !!user?.sellerProfile
    });
    
    if (!user) {
      console.error("User not found for email:", session.user.email);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    if (user?.isSeller && user?.sellerProfile?.applicationStatus === 'approved') {
      return NextResponse.json(
        { success: false, message: "You are already registered as a seller. Use the profile section to update your information." },
        { status: 400 }
      );
    }

    // Allow resubmission if previous application was rejected or incomplete

    // Create timestamps
    const now = new Date();
    
    // Log the data being saved
    console.log("Saving seller profile:", {
      shopName,
      businessType,
      shopDescription,
      pickupAddress,
      shopEmail,
      shopPhone,
      sellerStoryTitle,
      sellerStory
    });
    
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
            socialMediaLinks: socialMediaLinks || {},
            sellerStoryTitle,
            sellerStory,
            sellerPhoto: sellerPhoto || "",
            validIdUrl,
            agreedToTerms,
            agreedToCommission,
            agreedToShipping,
            applicationStatus: 'approved', // Auto-approve for instant access
            applicationSubmittedAt: now,
            approvedAt: now
          }
        }
      },
      { new: true }
    );
    
    console.log("Database update result:", {
      success: !!updatedUser,
      userId: updatedUser?._id,
      isSeller: updatedUser?.isSeller,
      applicationStatus: updatedUser?.sellerProfile?.applicationStatus,
      shopName: updatedUser?.sellerProfile?.shopName
    });

    if (!updatedUser) {
      console.error("Failed to update user in database");
      return NextResponse.json(
        { success: false, message: "Failed to update user" },
        { status: 500 }
      );
    }

    // Verify the update was successful by re-querying
    const verifyUser = await User.findOne({ email: session.user.email })
      .select('isSeller sellerProfile.applicationStatus sellerProfile.shopName');
    
    console.log("Verification query result:", {
      isSeller: verifyUser?.isSeller,
      applicationStatus: verifyUser?.sellerProfile?.applicationStatus,
      shopName: verifyUser?.sellerProfile?.shopName
    });

    return NextResponse.json({
      success: true,
      message: "Seller application submitted successfully",
      data: {
        isSeller: true,
        applicationStatus: 'approved',
        submittedAt: now,
        shopName: shopName
      }
    });

  } catch (error) {
    console.error("Error submitting seller application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit application" },
      { status: 500 }
    );
  }
}
