"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Navbar from "@/components/Navbar";

// Default profile picture SVG as data URL
const DEFAULT_PROFILE_PICTURE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23e8d5b7;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23d4b896;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad)' width='200' height='200'/%3E%3Ccircle cx='100' cy='80' r='35' fill='%23af7928'/%3E%3Cpath d='M100 120 C70 120, 40 130, 30 160 L170 160 C160 130, 130 120, 100 120 Z' fill='%23af7928'/%3E%3C/svg%3E";
import Footer from "@/components/Footer";
import "./profile.css";
import {
  FaEdit,
  FaUser,
  FaShoppingCart,
  FaTags,
  FaSearch,
  FaImage,
  FaStore,
  FaBoxOpen,
  FaHeart,
  FaSave,
} from "react-icons/fa";

const regionProvinceCityData: Record<string, Record<string, string[]>> = {
  "NCR (Metro Manila)": {
    "Metro Manila": [
      "Manila",
      "Quezon City",
      "Makati",
      "Taguig",
      "Pasig",
      "Mandaluyong",
      "Parañaque",
      "Pasay",
      "Caloocan",
      "Las Piñas",
      "Malabon",
      "Marikina",
      "Muntinlupa",
      "Navotas",
      "San Juan",
      "Valenzuela",
      "Pateros",
    ],
  },
  "Central Luzon (Region III)": {
    Pampanga: [
      "Angeles",
      "San Fernando",
      "Mabalacat",
      "Apalit",
      "Arayat",
      "Bacolor",
      "Candaba",
      "Floridablanca",
      "Guagua",
      "Lubao",
      "Macabebe",
      "Magalang",
      "Masantol",
      "Mexico",
      "Minalin",
      "Porac",
      "San Luis",
      "San Simon",
      "Santa Ana",
      "Santa Rita",
      "Santo Tomas",
      "Sasmuan",
    ],
    Zambales: [
      "Olongapo",
      "Iba",
      "Subic",
      "San Antonio",
      "San Felipe",
      "San Marcelino",
      "San Narciso",
      "Castillejos",
      "Botolan",
      "Candelaria",
      "Masinloc",
      "Palauig",
      "Cabangan",
      "Sta. Cruz",
    ],
    Bataan: [
      "Balanga",
      "Abucay",
      "Bagac",
      "Dinalupihan",
      "Hermosa",
      "Limay",
      "Mariveles",
      "Morong",
      "Orani",
      "Orion",
      "Pilar",
      "Samal",
    ],
    Bulacan: [
      "Malolos",
      "Meycauayan",
      "San Jose del Monte",
      "Angat",
      "Balagtas",
      "Baliuag",
      "Bocaue",
      "Bulacan",
      "Bustos",
      "Calumpit",
      "Doña Remedios Trinidad",
      "Guiguinto",
      "Hagonoy",
      "Marilao",
      "Norzagaray",
      "Obando",
      "Pandi",
      "Plaridel",
      "Pulilan",
      "San Ildefonso",
      "San Miguel",
      "San Rafael",
      "Santa Maria",
    ],
  },
};

const regionList = [
  "Ilocos Region (Region I)",
  "Cagayan Valley (Region II)",
  "Central Luzon (Region III)",
  "CALABARZON (Region IV-A)",
  "MIMAROPA (Region IV-B)",
  "Bicol Region (Region V)",
  "Western Visayas (Region VI)",
  "Central Visayas (Region VII)",
  "Eastern Visayas (Region VIII)",
  "Zamboanga Peninsula (Region IX)",
  "Northern Mindanao (Region X)",
  "Davao Region (Region XI)",
  "SOCCSKSARGEN (Region XII)",
  "Caraga (Region XIII)",
  "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
  "Cordillera Administrative Region (CAR)",
  "National Capital Region (NCR)",
];

const cityBarangayData: Record<string, string[]> = {
  Olongapo: [
    "Asinan",
    "Banicain",
    "Barretto",
    "East Bajac-Bajac",
    "East Tapinac",
    "Gordon Heights",
    "Kalaklan",
    "Mabayuan",
    "New Cabalan",
    "New Ilalim",
    "New Kababae",
    "New Kalalake",
    "Old Cabalan",
    "Pag-asa",
    "Santa Rita",
    "West Bajac-Bajac",
    "West Tapinac",
  ],
  Iba: [
    "Balaybay",
    "Binocboc",
    "Boton",
    "Buhangin",
    "Canaan",
    "Calabasa",
    "Casupanan",
    "Gulod",
    "Masinloc",
    "Pantalan",
    "Poblacion",
    "San Vicente",
    "Sapang Uwak",
    "Tondo",
  ],
  Subic: [
    "Binictican",
    "Barangay 1",
    "Barangay 2",
    "Barangay 3",
    "Barangay 4",
    "Barangay 5",
    "Barangay 6",
    "Barangay 7",
    "Barangay 8",
    "Barangay 9",
    "Barangay 10",
    "Barangay 11",
    "Barangay 12",
    "Barangay 13",
    "Barangay 14",
    "Barangay 15",
    "Barangay 16",
    "Barangay 17",
    "Barangay 18",
  ],
  "San Antonio": [
    "Aplaya",
    "Bagbaguin",
    "Banban",
    "Camangyanan",
    "Labney",
    "Nagbacalan",
    "Poblacion I",
    "Poblacion II",
    "Poblacion III",
    "San Francisco",
    "San Gabriel",
    "San Jose",
    "San Rafael",
    "Santa Cruz",
  ],
  "San Felipe": [
    "Bagacay",
    "Balogo",
    "Bulo",
    "Camachin",
    "Canaynayan",
    "Dangcol",
    "La Paz",
    "Liwanag",
    "Mabanggot",
    "Poblacion I",
    "Poblacion II",
    "San Juan",
    "San Jose",
    "San Vicente",
  ],
  "San Marcelino": [
    "Alat",
    "Bagong Silang",
    "Banaybanay",
    "Banog",
    "Binabalian",
    "Buenavista",
    "Canomay",
    "Capayawan",
    "Concepcion",
    "Don Pedro",
    "Liwanag",
    "Loma de Gato",
    "Maloma",
    "Mambog",
    "Poblacion I",
    "Poblacion II",
    "San Miguel",
    "San Roque",
    "Santa Maria",
  ],
  "San Narciso": [
    "Aplaya",
    "Bagacayan",
    "Bagumbayan",
    "Balaybay",
    "Banaag",
    "Banot",
    "Bayabas",
    "Camachin",
    "Dila-dila",
    "Gugo",
    "Linao",
    "Poblacion",
    "San Juan",
    "San Pablo",
    "San Pedro",
    "Santa Rita",
  ],
  Castillejos: [
    "Alasasin",
    "Bagong Silang",
    "Bahay Bato",
    "Bamban",
    "Binabalian",
    "Cabatuhan",
    "Lamao",
    "Mabayo",
    "Maniboc",
    "Poblacion I",
    "Poblacion II",
    "San Juan",
    "San Jose",
    "San Pablo",
    "Santa Isabel",
  ],
  Botolan: [
    "Bamban",
    "Bani",
    "Binaliw",
    "Cabugao",
    "Casilagan",
    "Dacanlao",
    "Looc",
    "Maguisguis",
    "Malabon",
    "Poblacion",
    "San Isidro",
    "San Jose",
    "San Rafael",
    "Santa Fe",
    "Santa Maria",
  ],
  Candelaria: [
    "Bagumbayan",
    "Banban",
    "Baytan",
    "Calapacuan",
    "Camachin",
    "Caparangan",
    "Gugo",
    "Maniboc",
    "Poblacion",
    "San Antonio",
    "San Roque",
    "Santa Cruz",
  ],
  Masinloc: [
    "Apoongan",
    "Balog",
    "Banaban",
    "Baragay",
    "Binabalian",
    "Camangyanan",
    "Casanayan",
    "Daniw",
    "Doliman",
    "Hulo",
    "Iba",
    "Libato",
    "Lusong",
    "Mabini",
    "Mabilog",
    "Magahis",
    "Poblacion",
    "San Antonio",
    "San Juan",
    "San Roque",
  ],
  Palauig: [
    "Alili",
    "Anilao",
    "Bagong Silang",
    "Balogo",
    "Bani",
    "Binabalian",
    "Cabangahan",
    "Concepcion",
    "Malabon",
    "Poblacion",
    "San Roque",
    "Santa Cruz",
  ],
  Cabangan: [
    "Bagong Silang",
    "Bamban",
    "Banaybanay",
    "Calangcang",
    "Candelaria",
    "Concepcion",
    "Dila-dila",
    "Liwanag",
    "Malabon",
    "Poblacion",
    "San Agustin",
    "San Jose",
    "San Juan",
    "San Roque",
    "Santa Maria",
  ],
  "Sta. Cruz": [
    "Bagumbayan",
    "Baluti",
    "Bayto",
    "Binabalian",
    "Bulo",
    "Candelaria",
    "Carmen",
    "Concepcion",
    "Poblacion",
    "San Isidro",
    "San Juan",
    "San Miguel",
    "Santa Rita",
  ],
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const querySection = searchParams?.get("section") ?? "profile";

  // UI State
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "profile"
  );
  const [activeOrdersTab, setActiveOrdersTab] = useState("All");
  const [confirmedOrders, setConfirmedOrders] = useState<Set<string>>(
    new Set()
  );

  // Loading States
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Error States
  const [profileError, setProfileError] = useState("");
  const [ordersError, setOrdersError] = useState("");

  // Profile Data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postal, setPostal] = useState("");
  const [region, setRegion] = useState<string>("");
  const [barangay, setBarangay] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>(
    DEFAULT_PROFILE_PICTURE
  );
  const [isProfilePictureLoaded, setIsProfilePictureLoaded] = useState(false);
  const [isSeller, setIsSeller] = useState(false); // Track if user is a seller

  // Orders Data
  const [orders, setOrders] = useState<any[]>([]);

  // Load cached profile picture on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedPicture = localStorage.getItem("cached_profile_picture");
      if (cachedPicture) {
        setProfilePicture(cachedPicture);
      } else if (session?.user?.image) {
        setProfilePicture(session.user.image);
      }
    }
  }, [session?.user?.image]);

  // Auth check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (querySection) {
      // If user is a seller and tries to access "selling", redirect to "myshop"
      if (querySection === "selling" && isSeller) {
        setActiveSection("myshop");
      } else {
        setActiveSection(querySection);
      }

      if (querySection === "profile") setExpandedSection("profile");
      else setExpandedSection(null);
    }
  }, [querySection, isSeller]);

  const handleSelectSection = (section: string) => {
    // If user is a seller and tries to access "selling", redirect to "myshop"
    if (section === "selling" && isSeller) {
      setActiveSection("myshop");
    } else {
      setActiveSection(section);
    }

    if (section !== "profile") setExpandedSection(null);
    else setExpandedSection("profile");
  };

  const toggleExpanded = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const findRegionByProvince = (prov?: string) => {
    if (!prov) return "";
    for (const regionKey of Object.keys(regionProvinceCityData)) {
      const provinces = Object.keys(regionProvinceCityData[regionKey] || {});
      if (provinces.includes(prov)) return regionKey;
    }
    return "";
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;

      setIsLoadingProfile(true);
      setProfileError("");

      try {
        const response = await fetch("/api/user/profile", {
          // Add cache control for faster subsequent loads
          headers: {
            "Cache-Control": "max-age=300", // Cache for 5 minutes
          },
        });
        const data = await response.json();

        if (data.success) {
          setFullName(data.data.fullName || "");
          setEmail(data.data.email || "");
          setPhone(data.data.phone || "");
          setStreet(data.data.address.street || "");
          setBarangay(data.data.address.barangay || "");
          setCity(data.data.address.city || "");
          setProvince(data.data.address.province || "");
          setRegion(data.data.address.region || "");
          setPostal(data.data.address.postalCode || "");
          setSelectedGender(data.data.gender || "");

          // Only update profile picture if we have a new one
          const newProfilePicture =
            data.data.profilePicture || session?.user?.image || "";
          if (newProfilePicture && newProfilePicture !== profilePicture) {
            // Preload the image before setting it
            const img = document.createElement("img");
            img.onload = () => {
              setProfilePicture(newProfilePicture);
              // Cache in localStorage for instant load next time
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  "cached_profile_picture",
                  newProfilePicture
                );
              }
              setIsProfilePictureLoaded(true);
            };
            img.onerror = () => {
              setIsProfilePictureLoaded(true);
            };
            img.src = newProfilePicture;
          } else {
            setIsProfilePictureLoaded(true);
          }

          setIsSeller(data.data.isSeller || false);
        } else {
          setProfileError(data.message || "Failed to load profile");
          setIsProfilePictureLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileError("Failed to load profile");
        setIsProfilePictureLoaded(true);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [session]);

  // Fetch seller profile if user is a seller
  const fetchSellerProfile = async () => {
    try {
      console.log("Fetching seller profile...");
      const response = await fetch("/api/seller/profile");
      const data = await response.json();

      console.log("Seller profile response:", data);

      if (data.success && data.data) {
        console.log("Setting seller profile state:", {
          shopName: data.data.shopName,
          sellerStoryTitle: data.data.sellerStoryTitle,
          sellerStory: data.data.sellerStory?.substring(0, 50),
        });

        // Update all seller-related state
        setShopName(data.data.shopName || "");
        setBusinessType(data.data.businessType || "");
        setShopDescription(data.data.shopDescription || "");
        setPickupBarangay(data.data.pickupAddress?.barangay || "");
        setPickupAddress(data.data.pickupAddress?.otherDetails || "");
        setShopEmail(data.data.shopEmail || "");
        setShopPhone(data.data.shopPhone || "");
        setSocialMediaLinks(data.data.socialMediaLinks || {});
        setSellerStoryTitle(data.data.sellerStoryTitle || "");
        setSellerStory(data.data.sellerStory || "");

        // Set seller photo preview if available
        if (data.data.sellerPhoto) {
          const previewEl = document.getElementById(
            "sellerPhotoPreview"
          ) as HTMLImageElement;
          if (previewEl) {
            previewEl.src = data.data.sellerPhoto;
          }
        }
      } else {
        console.log("Failed to fetch seller profile:", data.message);
      }
    } catch (error) {
      console.error("Error fetching seller profile:", error);
    }
  };

  // Fetch seller profile when isSeller is true or when activeSection is myshop
  useEffect(() => {
    if (isSeller && session?.user) {
      fetchSellerProfile();
    }
  }, [isSeller, session?.user]);

  // Also fetch when navigating to myshop section
  useEffect(() => {
    if (activeSection === "myshop" && isSeller && session?.user) {
      fetchSellerProfile();
    }
  }, [activeSection]);

  // Submit seller application
  const handleSubmitSellerApplication = async () => {
    try {
      // Upload valid ID first if not already uploaded
      let validIdFileUrl = "";
      if (validIdFile) {
        const formData = new FormData();
        formData.append("file", validIdFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (!uploadData.success) {
          alert("Failed to upload valid ID");
          return;
        }
        validIdFileUrl = uploadData.data.url;
      }

      // Get seller photo URL
      const sellerPhotoEl = document.getElementById(
        "sellerPhotoPreview"
      ) as HTMLImageElement;
      const sellerPhotoUrl = sellerPhotoEl?.src || "";

      // Prepare application data
      const applicationData = {
        shopName,
        category: businessType, // Rename to category in the data
        craftType, // Add craft type
        shopDescription: "", // Empty string since field was removed
        pickupAddress: {
          barangay: pickupBarangay,
          otherDetails: pickupAddress,
        },
        shopEmail,
        shopPhone,
        socialMediaLinks,
        sellerStoryTitle,
        sellerStory,
        sellerPhoto: sellerPhotoUrl,
        validIdUrl: validIdFileUrl,
        agreedToTerms,
        agreedToCommission,
        agreedToShipping,
      };

      // Submit application
      const response = await fetch("/api/seller/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();

      if (data.success) {
        // Update seller status immediately
        setIsSeller(true);

        // Show success modal
        setShowSubmitModal(true);

        // Reload the page to update all UI elements
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Wait 1.5 seconds to let user see success modal

        return true;
      } else {
        alert(data.message || "Failed to submit application");
        return false;
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
      return false;
    }
  };

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user || activeSection !== "orders") return;

      setIsLoadingOrders(true);
      setOrdersError("");

      try {
        const statusParam =
          activeOrdersTab === "All" ? "all" : activeOrdersTab.toLowerCase();
        const response = await fetch(`/api/user/orders?status=${statusParam}`);
        const data = await response.json();

        if (data.success) {
          setOrders(data.data || []);
        } else {
          setOrdersError(data.message || "Failed to load orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrdersError("Failed to load orders");
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [session, activeSection, activeOrdersTab]);

  // Validation Functions
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^(09|\+639)\d{9}$/;
    return re.test(phone);
  };

  const validatePostalCode = (code: string) => {
    return /^\d{4}$/.test(code);
  };

  const validateProfileForm = () => {
    const errors = [];

    if (!fullName.trim()) errors.push("Full name is required");
    if (!email.trim()) errors.push("Email is required");
    if (!validateEmail(email)) errors.push("Invalid email format");
    if (phone && !validatePhone(phone))
      errors.push("Invalid phone format (09XXXXXXXXX)");
    if (postal && !validatePostalCode(postal))
      errors.push("Invalid postal code (4 digits)");
    if (!region) errors.push("Region is required");
    if (!province) errors.push("Province is required");
    if (!city) errors.push("City is required");

    return errors;
  };

  // Save Profile Handler
  const handleSaveProfile = async () => {
    const errors = validateProfileForm();

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    setIsSaving(true);
    setProfileError("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          address: {
            street,
            barangay,
            city,
            province,
            region,
            postalCode: postal,
          },
          gender: selectedGender,
          profilePicture,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state with saved data
        if (data.data) {
          setFullName(data.data.fullName || "");
          setPhone(data.data.phone || "");
          setStreet(data.data.address?.street || "");
          setBarangay(data.data.address?.barangay || "");
          setCity(data.data.address?.city || "");
          setProvince(data.data.address?.province || "");
          setRegion(data.data.address?.region || "");
          setPostal(data.data.address?.postalCode || "");
          setSelectedGender(data.data.gender || "");
          if (data.data.profilePicture) {
            setProfilePicture(data.data.profilePicture);
          }
        }
        setShowSaveModal(true);
        setTimeout(() => setShowSaveModal(false), 2000);
      } else {
        setShowSaveError(true);
        setProfileError(data.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("Save error:", error);
      setShowSaveError(true);
      setProfileError("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Profile Picture Upload Handler
  const handleProfilePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Maximum size is 5MB");
      return;
    }

    try {
      // Upload the image first
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.success) {
        const newProfilePicture = uploadData.data.url;

        // Update user profile with new picture AND all other fields
        const updateResponse = await fetch("/api/user/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            phone,
            address: {
              street,
              barangay,
              city,
              province,
              region,
              postalCode: postal,
            },
            gender: selectedGender,
            profilePicture: newProfilePicture,
          }),
        });

        const updateData = await updateResponse.json();

        if (updateData.success) {
          // Update local state
          setProfilePicture(newProfilePicture);
          // Update cache
          if (typeof window !== "undefined") {
            localStorage.setItem("cached_profile_picture", newProfilePicture);
          }
          alert("Profile picture updated successfully!");
        } else {
          alert(updateData.message || "Failed to update profile picture");
        }
      } else {
        alert(uploadData.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    }
  };

  // Confirm Order Receipt Handler
  const handleConfirmReceiptAPI = async (orderId: string) => {
    try {
      const response = await fetch(`/api/user/orders/${orderId}/confirm`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setConfirmedOrders((prev) => new Set(prev).add(orderId));
        setActiveOrdersTab("Completed");
        setSuccessMessage("Order confirmed as received!");
        setShowSuccessModal(true);

        // Refresh orders
        const statusParam =
          activeOrdersTab === "All" ? "all" : activeOrdersTab.toLowerCase();
        const ordersResponse = await fetch(
          `/api/user/orders?status=${statusParam}`
        );
        const ordersData = await ordersResponse.json();
        if (ordersData.success) {
          setOrders(ordersData.data || []);
        }
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order");
    }
  };

  // Rate Order Handler
  const handleRateOrderAPI = async (orderId: string, rating: number) => {
    try {
      const response = await fetch(`/api/user/orders/${orderId}/rate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderRatings((prev) => ({ ...prev, [orderId]: rating }));
        setSuccessMessage("Thank you for rating!");
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 1500);
      }
    } catch (error) {
      console.error("Error rating order:", error);
      alert("Failed to rate order");
    }
  };

  const [highlightRegion, setHighlightRegion] = useState(false);
  const regionRef = useRef<HTMLSelectElement | null>(null);
  const [regionTooltip, setRegionTooltip] = useState("");
  const [highlightProvince, setHighlightProvince] = useState(false);
  const [provinceTooltip, setProvinceTooltip] = useState("");
  const provinceRef = useRef<HTMLSelectElement | null>(null);
  const [highlightCity, setHighlightCity] = useState(false);
  const [cityTooltip, setCityTooltip] = useState("");
  const cityRef = useRef<HTMLSelectElement | null>(null);
  const [highlightBarangay, setHighlightBarangay] = useState(false);
  const [barangayTooltip, setBarangayTooltip] = useState("");
  const barangayRef = useRef<HTMLSelectElement | null>(null);

  function emphasizeField(
    setHighlight: (v: boolean) => void,
    setTooltip: (v: string) => void,
    ref: React.RefObject<any>,
    tooltipMsg: string,
    duration = 2000
  ) {
    setHighlight(true);
    setTooltip(tooltipMsg);
    setTimeout(
      () =>
        ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
      50
    );
    ref.current?.focus?.();
    setTimeout(() => {
      setHighlight(false);
      setTooltip("");
    }, duration);
  }

  const provincesForRegion = region
    ? Object.keys(regionProvinceCityData[region] || {})
    : [];
  const citiesForProvince =
    region && province ? regionProvinceCityData[region]?.[province] ?? [] : [];

  const emphasizeRegion = (duration = 2000) => {
    setHighlightRegion(true);
    setTimeout(
      () =>
        regionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      50
    );
    regionRef.current?.focus?.();
    window.setTimeout(() => setHighlightRegion(false), duration);
  };

  const [orderRatings, setOrderRatings] = useState<Record<string, number>>({});
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [orderRating, setOrderRating] = useState<number | null>(5);

  const handleConfirmReceipt = (orderId: string) => {
    setPendingOrderId(orderId);
    setShowConfirmModal(true);
  };

  const confirmReceipt = async () => {
    if (!pendingOrderId) return;

    setShowConfirmModal(false);
    setLoadingConfirm(true);

    await handleConfirmReceiptAPI(pendingOrderId);
    setLoadingConfirm(false);
    setPendingOrderId(null);
  };

  const cancelConfirmReceipt = () => {
    setShowConfirmModal(false);
    setPendingOrderId(null);
  };

  const handleRateOrder = async (orderId: string, rating: number) => {
    await handleRateOrderAPI(orderId, rating);
  };

  const [activeStep, setActiveStep] = useState(0);
  const [shopName, setShopName] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupOther, setPickupOther] = useState("");
  const [shopEmail, setShopEmail] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [sellerStory, setSellerStory] = useState("");

  const [pickupBarangay, setPickupBarangay] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [validIdFile, setValidIdFile] = useState<File | null>(null);

  const [sellerStoryTitle, setSellerStoryTitle] = useState("");

  // New enhanced fields
  const [businessType, setBusinessType] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [businessHours, setBusinessHours] = useState({
    monday: { open: "09:00", close: "17:00", enabled: true },
    tuesday: { open: "09:00", close: "17:00", enabled: true },
    wednesday: { open: "09:00", close: "17:00", enabled: true },
    thursday: { open: "09:00", close: "17:00", enabled: true },
    friday: { open: "09:00", close: "17:00", enabled: true },
    saturday: { open: "09:00", close: "17:00", enabled: false },
    sunday: { open: "09:00", close: "17:00", enabled: false },
  });
  const [byAppointment, setByAppointment] = useState(false);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebook: "",
    instagram: "",
    tiktok: "",
  });
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [productionCapacity, setProductionCapacity] = useState("");
  const [shippingOptions, setShippingOptions] = useState({
    pickupOnly: true,
    localDelivery: false,
    nationwide: false,
    international: false,
  });
  const [deliveryRadius, setDeliveryRadius] = useState("");
  const [sellerPhotos, setSellerPhotos] = useState<File[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToCommission, setAgreedToCommission] = useState(false);
  const [agreedToShipping, setAgreedToShipping] = useState(false);
  const [craftType, setCraftType] = useState<string>("");

  // Validation functions for each step
  const isStep1Valid = () => {
    const validations = {
      shopName: shopName.trim().length >= 3 && shopName.trim().length <= 50,
      businessType: businessType.trim() !== "", // Keep this for now since it's used in many places
      craftType: craftType.trim() !== "",
      pickupBarangay: pickupBarangay.trim() !== "",
      pickupAddress: pickupAddress.trim() !== "",
      shopEmail:
        shopEmail.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shopEmail),
      shopPhone: shopPhone.trim().length === 11 && /^[0-9]+$/.test(shopPhone),
      validIdFile: validIdFile !== null,
    };

    const isValid = Object.values(validations).every((v) => v === true);

    if (!isValid) {
      console.log("Step 1 Validation Status:", validations);
      console.log("Current values:", {
        shopName: shopName,
        businessType: businessType,
        shopPhone: shopPhone,
        shopEmail: shopEmail,
        pickupBarangay: pickupBarangay,
        pickupAddress: pickupAddress,
        validIdFile: validIdFile?.name,
      });
    }

    return isValid;
  };

  const isStep2Valid = () => {
    return (
      sellerStoryTitle.trim() !== "" &&
      sellerStory.trim().length >= 10 &&
      sellerStory.trim().length <= 1000
    );
  };

  const isStep3Valid = () => {
    return agreedToTerms && agreedToCommission && agreedToShipping;
  };

  const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalBoxStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "12px",
    padding: "30px 40px",
    width: "360px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    animation: "fadeIn 0.2s ease-in-out",
  };

  const modalTitleStyle: React.CSSProperties = {
    color: "#AF7928",
    marginBottom: "12px",
    fontSize: "1.2rem",
    fontWeight: 600,
  };

  const modalTextStyle: React.CSSProperties = {
    color: "#555",
    fontSize: "14px",
    marginBottom: "20px",
  };

  // Check if shop info is complete for saving
  const isShopInfoComplete = () => {
    const complete =
      shopName.trim().length >= 3 &&
      shopName.trim().length <= 50 &&
      businessType.trim() !== "" && // Still using businessType in checks
      craftType.trim() !== "" && // Add craft type check
      pickupBarangay.trim() !== "" &&
      pickupAddress.trim() !== "" &&
      shopEmail.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shopEmail) &&
      shopPhone.trim().length === 11 &&
      /^[0-9]+$/.test(shopPhone) &&
      validIdFile !== null;

    if (!complete) {
      console.log("Shop info incomplete. Current state:", {
        shopName: `${shopName.length} chars (need 3-50)`,
        category: businessType || "EMPTY",
        craftType: craftType || "EMPTY",
        pickupBarangay: pickupBarangay || "EMPTY",
        pickupAddress: pickupAddress || "EMPTY",
        shopEmail: shopEmail || "EMPTY",
        shopPhone: `${shopPhone} (${shopPhone.length} digits, need 11)`,
        validIdFile: validIdFile?.name || "NO FILE",
      });
    }

    return complete;
  };

  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper">
        <div className="profile-container">
          {isLoadingProfile ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              Loading profile...
            </div>
          ) : (
            <>
              <div className="profile-picture">
                <img
                  src={
                    profilePicture ||
                    session?.user?.image ||
                    DEFAULT_PROFILE_PICTURE
                  }
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    transition: "opacity 0.3s ease",
                  }}
                  loading="eager"
                  fetchPriority="high"
                  onLoad={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_PROFILE_PICTURE;
                  }}
                />
                <input
                  id="profile-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="profile-upload-input"
                />
              </div>
              <div className="profile-name">
                {fullName || session?.user?.name || "User"}
              </div>
            </>
          )}
          <div className="edit-profile-row">
            <FaEdit className="edit-icon" />
            Edit profile
          </div>
          <hr className="profile-divider" />

          {/* My Profile */}
          <div className="profile-section">
            <div
              className="profile-section-row"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0,
                cursor: "pointer",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
                onClick={() => toggleExpanded("profile")}
              >
                <FaUser className="profile-section-icon" />
                <span className="profile-section-title">My Profile</span>
              </div>

              {expandedSection === "profile" && (
                <span
                  className={`profile-section-label ${
                    activeSection === "profile" ? "active" : ""
                  }`}
                  onClick={() => handleSelectSection("profile")}
                  tabIndex={0}
                  style={{
                    marginLeft: "37px",
                    marginTop: "16px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  Profile
                </span>
              )}
            </div>
          </div>

          {/* My Orders */}
          <div className="profile-section">
            <div
              className={`profile-section-row ${
                activeSection === "orders" ? "active" : ""
              }`}
              onClick={() => handleSelectSection("orders")}
              tabIndex={0}
            >
              <FaShoppingCart className="profile-section-icon" />
              <span className="profile-section-title">My Orders</span>
            </div>
          </div>

          {/* Wishlist */}
          <div className="profile-section">
            <div
              className={`profile-section-row ${
                activeSection === "wishlist" ? "active" : ""
              }`}
              onClick={() => handleSelectSection("wishlist")}
              tabIndex={0}
            >
              <FaHeart className="profile-section-icon" />
              <span className="profile-section-title">My Wishlist</span>
            </div>
          </div>

          {/* Start Selling / My Shop toggle in sidebar */}
          {!isLoadingProfile && (
            <div className="profile-section">
              <div
                // when user is a seller, this nav item becomes "myshop"
                className={`profile-section-row ${
                  activeSection === (isSeller ? "myshop" : "selling")
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleSelectSection(isSeller ? "myshop" : "selling")
                }
                tabIndex={0}
              >
                {isSeller ? (
                  <FaStore className="profile-section-icon" />
                ) : (
                  <FaTags className="profile-section-icon" />
                )}
                <span className="profile-section-title">
                  {isSeller ? "My Shop" : "Start Selling"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="profile-details-box">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <>
              <div className="profile-details-title">
                <FaUser
                  className="profile-section-icon"
                  style={{
                    color: "#FFC46B",
                    fontSize: "2rem",
                    marginRight: "16px",
                    verticalAlign: "middle",
                  }}
                />
                My Profile
                <hr className="profile-details-divider" />
              </div>

              <div className="profile-details-inner-box">
                <div className="profile-upload-section">
                  <img
                    src={
                      profilePicture ||
                      session?.user?.image ||
                      DEFAULT_PROFILE_PICTURE
                    }
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PROFILE_PICTURE;
                    }}
                    alt="User"
                    className="profile-upload-image"
                    id="profilePreview"
                  />
                  <input
                    type="file"
                    id="profileUpload"
                    accept="image/*"
                    className="profile-upload-input"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // Validate file type
                      if (!file.type.startsWith("image/")) {
                        alert("Please select an image file");
                        return;
                      }

                      // Validate file size (1MB = 1048576 bytes)
                      if (file.size > 1048576) {
                        alert("Image too large. Maximum size is 1MB");
                        return;
                      }

                      try {
                        // Show preview immediately
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const img = document.getElementById(
                            "profilePreview"
                          ) as HTMLImageElement;
                          if (img && event.target?.result) {
                            img.src = event.target.result as string;
                          }
                        };
                        reader.readAsDataURL(file);

                        // Upload the image to server
                        const formData = new FormData();
                        formData.append("file", file);

                        const uploadResponse = await fetch("/api/upload", {
                          method: "POST",
                          body: formData,
                        });

                        const uploadData = await uploadResponse.json();

                        if (uploadData.success) {
                          const newProfilePicture = uploadData.data.url;

                          // Update user profile with new picture AND all other fields
                          const updateResponse = await fetch(
                            "/api/user/profile",
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                fullName,
                                phone,
                                address: {
                                  street,
                                  barangay,
                                  city,
                                  province,
                                  region,
                                  postalCode: postal,
                                },
                                gender: selectedGender,
                                profilePicture: newProfilePicture,
                              }),
                            }
                          );

                          const updateData = await updateResponse.json();

                          if (updateData.success) {
                            // Update local state
                            setProfilePicture(newProfilePicture);
                            alert("Profile picture updated successfully!");
                          } else {
                            alert(
                              updateData.message ||
                                "Failed to update profile picture"
                            );
                          }
                        } else {
                          alert(uploadData.message || "Failed to upload image");
                        }
                      } catch (error) {
                        console.error("Upload error:", error);
                        alert("Failed to upload image");
                      }
                    }}
                  />
                  <label htmlFor="profileUpload" className="profile-upload-btn">
                    Select Image
                  </label>
                  <p className="profile-upload-hint">
                    File size: maximum 1 MB <br />
                    File extension: .JPEG, .PNG
                  </p>
                </div>

                <hr className="profile-inner-divider" />

                <form className="profile-form">
                  {/* Full Name */}
                  <div className="form-row">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  {/* Email */}
                  <div className="form-row">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Phone */}
                  <div className="form-row">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  {/**DOUBLE ROWS START */}
                  {/* Date of Birth (left)  —  Gender (right) */}
                  <div className="form-row double-row">
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-input" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <div
                        className="gender-options"
                        style={{ alignItems: "center" }}
                      >
                        <label className="gender-option">
                          <input type="radio" name="gender" value="male" />
                          <span className="custom-radio" />
                          Male
                        </label>
                        <label className="gender-option">
                          <input type="radio" name="gender" value="female" />
                          <span className="custom-radio" />
                          Female
                        </label>
                        <label className="gender-option">
                          <input type="radio" name="gender" value="other" />
                          <span className="custom-radio" />
                          Other
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Street (left)  —  Barangay (right) */}
                  <div className="form-row double-row">
                    <div className="form-group">
                      <label className="form-label">Street</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter street address"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Barangay</label>
                      <select
                        ref={barangayRef}
                        className={`form-input${
                          highlightBarangay ? " highlight" : ""
                        }`}
                        value={barangay}
                        onChange={(e) => setBarangay(e.target.value)}
                        disabled={!city}
                        onMouseDown={(e) => {
                          if (!city) {
                            e.preventDefault();
                            emphasizeField(
                              setHighlightCity,
                              setCityTooltip,
                              cityRef,
                              "Please select a city first."
                            );
                          }
                        }}
                        onFocus={() => {
                          if (!city)
                            emphasizeField(
                              setHighlightCity,
                              setCityTooltip,
                              cityRef,
                              "Please select a city first."
                            );
                        }}
                      >
                        <option value="">Select barangay</option>
                        {city &&
                          cityBarangayData[city]?.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* City (left)  —  Province (right) */}
                  <div className="form-row double-row">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <select
                        ref={cityRef}
                        className={`form-input${
                          highlightCity ? " highlight" : ""
                        }`}
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          setBarangay("");
                        }}
                        required
                        onMouseDown={(e) => {
                          if (!province) {
                            e.preventDefault();
                            emphasizeField(
                              setHighlightProvince,
                              setProvinceTooltip,
                              provinceRef,
                              "Please select a province first."
                            );
                          }
                        }}
                        onFocus={() => {
                          if (!province)
                            emphasizeField(
                              setHighlightProvince,
                              setProvinceTooltip,
                              provinceRef,
                              "Please select a province first."
                            );
                        }}
                        disabled={!province}
                      >
                        <option value="">Select city</option>
                        {citiesForProvince.map((cityName) => (
                          <option key={cityName} value={cityName}>
                            {cityName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Province</label>
                      <select
                        ref={provinceRef}
                        className={`form-input${
                          highlightProvince ? " highlight" : ""
                        }`}
                        value={province}
                        onChange={(e) => {
                          setProvince(e.target.value);
                          setCity("");
                          setBarangay("");
                          if (!region) {
                            const inferred = findRegionByProvince(
                              e.target.value
                            );
                            if (inferred) setRegion(inferred);
                          }
                        }}
                        required
                        onMouseDown={(e) => {
                          if (!region) {
                            e.preventDefault();
                            emphasizeField(
                              setHighlightRegion,
                              setRegionTooltip,
                              regionRef,
                              "Please select a region first."
                            );
                          }
                        }}
                        onFocus={() => {
                          if (!region)
                            emphasizeField(
                              setHighlightRegion,
                              setRegionTooltip,
                              regionRef,
                              "Please select a region first."
                            );
                        }}
                        disabled={!region && provincesForRegion.length > 0}
                      >
                        <option value="">Select province</option>
                        {provincesForRegion.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={`form-row double-row`}>
                    <div
                      className={`form-group ${
                        highlightRegion ? "highlight" : ""
                      }`}
                    >
                      <label className="form-label">Region</label>
                      <select
                        ref={regionRef}
                        className={`form-input short-input${
                          highlightRegion ? " highlight" : ""
                        }`}
                        value={region}
                        onChange={(e) => {
                          setRegion(e.target.value);
                          setProvince("");
                          setCity("");
                          setBarangay("");
                          setHighlightRegion(false);
                          setRegionTooltip("");
                        }}
                        required
                      >
                        <option value="">Select region</option>
                        {regionList.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input
                        type="text"
                        className="form-input short-input"
                        placeholder="Enter postal code"
                        value={postal}
                        onChange={(e) => setPostal(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Save */}
                  <div
                    className="form-row"
                    style={{ justifyContent: "flex-end" }}
                  >
                    <div className="form-button-wrapper">
                      <button
                        className="save-btn"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "SAVE"}
                      </button>
                    </div>
                  </div>

                  {/* Profile Error */}
                  {profileError && (
                    <div
                      style={{
                        color: "red",
                        textAlign: "center",
                        marginTop: "10px",
                      }}
                    >
                      {profileError}
                    </div>
                  )}
                </form>
              </div>
            </>
          )}

          {/* Orders Section */}
          {activeSection === "orders" && (
            <>
              <div className="profile-details-title">
                <FaShoppingCart
                  className="profile-section-icon"
                  style={{
                    color: "#FFC46B",
                    fontSize: "2rem",
                    marginRight: "16px",
                    verticalAlign: "middle",
                  }}
                />
                My Orders
                <hr className="profile-details-divider" />
              </div>

              <div className="profile-details-inner-box">
                <div className="orders-nav">
                  {[
                    "All",
                    "To Pay",
                    "To Ship",
                    "To Receive",
                    "Completed",
                    "Cancelled",
                  ].map((tab) => (
                    <div
                      key={tab}
                      className={`orders-tab ${
                        activeOrdersTab === tab ? "active" : ""
                      }`}
                      onClick={() => setActiveOrdersTab(tab)}
                    >
                      {tab}
                    </div>
                  ))}
                </div>
                <div className="orders-search">
                  <FaSearch className="orders-search-icon" />
                  <input
                    type="text"
                    placeholder="Search Seller Name or Product"
                    className="orders-search-input"
                  />
                </div>

                {/* Loading State */}
                {isLoadingOrders && (
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    Loading orders...
                  </div>
                )}

                {/* Error State */}
                {ordersError && (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "red",
                    }}
                  >
                    {ordersError}
                  </div>
                )}

                {/* Empty State */}
                {!isLoadingOrders && !ordersError && orders.length === 0 && (
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    No orders found
                  </div>
                )}

                {/* Orders will be dynamically rendered from API */}
                <div className="orders-content">
                  {/* Orders from database will appear here */}
                </div>
              </div>
            </>
          )}

          {/* Wishlist Section */}
          {activeSection === "wishlist" && (
            <>
              <div className="profile-details-title">
                <FaHeart
                  className="profile-section-icon"
                  style={{
                    color: "#FFC46B",
                    fontSize: "2rem",
                    marginRight: "16px",
                    verticalAlign: "middle",
                  }}
                />
                My Wishlist
                <hr className="profile-details-divider" />
              </div>

              <div className="profile-details-inner-box">
                <WishlistContent />
              </div>
            </>
          )}

          {/* Selling Section */}
          {activeSection === "selling" && !isSeller && (
            <>
              <div className="profile-details-title">
                <FaTags
                  className="profile-section-icon"
                  style={{
                    color: "#FFC46B",
                    fontSize: "2rem",
                    marginRight: "16px",
                    verticalAlign: "middle",
                  }}
                />
                Start Selling
                <hr className="profile-details-divider" />
              </div>

              <div className="profile-details-inner-box">
                {/* Progress Steps */}
                <div className="selling-progress">
                  {["Shop Information", "Seller Story", "Submit"].map(
                    (label, i) => {
                      const isActive = i === activeStep;
                      const isCompleted = i < activeStep;
                      return (
                        <React.Fragment key={label}>
                          <div
                            className="progress-step"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div
                              className="circle"
                              style={{
                                backgroundColor: isCompleted
                                  ? "#4caf50"
                                  : isActive
                                  ? "#AF7928"
                                  : "rgba(0,0,0,0.15)",
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: "16px",
                                transition: "all 0.3s ease",
                                animation: isActive
                                  ? "pulse 2s infinite"
                                  : "none",
                                boxShadow: isActive
                                  ? "0 0 0 4px rgba(175, 121, 40, 0.2)"
                                  : "none",
                              }}
                            >
                              {isCompleted ? "✓" : i + 1}
                            </div>
                            <span
                              className="label"
                              style={{
                                color:
                                  isCompleted || isActive
                                    ? "#333"
                                    : "rgba(0,0,0,0.4)",
                                fontWeight: isActive ? "600" : "400",
                                fontSize: "13px",
                                textAlign: "center",
                                maxWidth: "100px",
                              }}
                            >
                              {label}
                            </span>
                          </div>
                          {i < 2 && (
                            <div
                              className="progress-line"
                              style={{
                                backgroundColor: isCompleted
                                  ? "#4caf50"
                                  : "rgba(0,0,0,0.15)",
                                height: "2px",
                                flex: "1",
                                marginTop: "-20px",
                                transition: "all 0.3s ease",
                              }}
                            ></div>
                          )}
                        </React.Fragment>
                      );
                    }
                  )}
                </div>

                {/* Add keyframes for pulse animation */}
                <style>{`
                  @keyframes pulse {
                    0%, 100% {
                      transform: scale(1);
                    }
                    50% {
                      transform: scale(1.05);
                    }
                  }
                `}</style>

                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                    margin: "24px 0",
                  }}
                />

                {/* Step Contents */}
                {activeStep === 0 && (
                  <div className="selling-step-content">
                    <div className="form-row">
                      <label className="form-label">
                        Shop Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter your Shop Name (3-50 characters)"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        minLength={3}
                        maxLength={50}
                        required
                      />
                      {shopName && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#666",
                            marginLeft: "8px",
                          }}
                        >
                          {shopName.length}/50
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    <div className="form-row">
                      <label className="form-label">
                        Category <span style={{ color: "red" }}>*</span>
                      </label>
                      <select
                        className="form-input"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        required
                      >
                        <option value="">Select your primary category</option>
                        <option value="Handicrafts">Handicrafts</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home">Home</option>
                        <option value="Beauty">Beauty & Wellness</option>
                        <option value="Food">Food</option>
                      </select>
                    </div>

                    {/* Craft Type */}
                    <div className="form-row">
                      <label className="form-label">
                        Craft Type <span style={{ color: "#af7928" }}>*</span>
                      </label>
                      <select
                        className="form-input"
                        value={craftType}
                        onChange={(e) => setCraftType(e.target.value)}
                        required
                      >
                        <option value="">Select your primary craft type</option>
                        <option value="Weaving">Weaving</option>
                        <option value="Woodwork">Woodwork</option>
                        <option value="Pottery">Pottery</option>
                        <option value="Embroidery">Embroidery</option>
                        <option value="Basketry">Basketry</option>
                        <option value="Cooking">Cooking</option>
                        <option value="Textile">Textile</option>
                        <option value="Jewelry Making">Jewelry Making</option>
                        <option value="Leatherwork">Leatherwork</option>
                        <option value="Cosmetics">Cosmetics</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <label className="form-label">
                        Pickup Address <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="form-input-group">
                        <select
                          className="form-input"
                          value={pickupBarangay}
                          onChange={(e) => setPickupBarangay(e.target.value)}
                          required
                        >
                          <option value="">Select Barangay</option>
                          <option value="Asinan">Asinan</option>
                          <option value="Banicain">Banicain</option>
                          <option value="Barretto">Barretto</option>
                          <option value="East Bajac-Bajac">
                            East Bajac-Bajac
                          </option>
                          <option value="Gordon Heights">Gordon Heights</option>
                          <option value="Kalaklan">Kalaklan</option>
                          <option value="Mabayuan">Mabayuan</option>
                          <option value="New Cabalan">New Cabalan</option>
                          <option value="Old Cabalan">Old Cabalan</option>
                          <option value="Pag-asa">Pag-asa</option>
                          <option value="Sta. Rita">Sta. Rita</option>
                          <option value="West Bajac-Bajac">
                            West Bajac-Bajac
                          </option>
                        </select>

                        <input
                          type="text"
                          className="form-input"
                          placeholder="Other Details"
                          value={pickupAddress}
                          onChange={(e) => setPickupAddress(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <label className="form-label">
                        Email <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="Enter Shop Email"
                        value={shopEmail}
                        onChange={(e) => setShopEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <label className="form-label">
                        Phone <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="Enter Shop Phone (e.g., 09171234567)"
                        value={shopPhone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
                          if (value.length <= 11) {
                            setShopPhone(value);
                          }
                        }}
                        maxLength={11}
                        required
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          color:
                            shopPhone.length === 11
                              ? "#4caf50"
                              : shopPhone.length > 0
                              ? "#e74c3c"
                              : "#666",
                          marginLeft: "8px",
                        }}
                      >
                        {shopPhone.length}/11 digits{" "}
                        {shopPhone.length === 11 && "✓"}
                      </span>
                    </div>

                    {/* Social Media Links (Optional) */}
                    <div style={{ marginTop: "24px", marginBottom: "16px" }}>
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#AF7928",
                          marginBottom: "12px",
                        }}
                      >
                        Social Media (Optional)
                      </h4>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#666",
                          marginBottom: "16px",
                        }}
                      >
                        Help customers discover more about your brand
                      </p>

                      <div className="form-row">
                        <label className="form-label">Facebook Page</label>
                        <input
                          type="url"
                          className="form-input"
                          placeholder="https://facebook.com/yourpage"
                          value={socialMediaLinks.facebook}
                          onChange={(e) =>
                            setSocialMediaLinks({
                              ...socialMediaLinks,
                              facebook: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-row">
                        <label className="form-label">Instagram</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="@yourusername"
                          value={socialMediaLinks.instagram}
                          onChange={(e) =>
                            setSocialMediaLinks({
                              ...socialMediaLinks,
                              instagram: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-row">
                        <label className="form-label">TikTok</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="@yourusername"
                          value={socialMediaLinks.tiktok}
                          onChange={(e) =>
                            setSocialMediaLinks({
                              ...socialMediaLinks,
                              tiktok: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <label className="form-label">
                        Valid ID <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="form-input"
                        onChange={(e) =>
                          setValidIdFile(e.target.files?.[0] || null)
                        }
                        required
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#888",
                          marginLeft: "12px",
                        }}
                      >
                        Upload a clear photo or scan of your valid ID.
                      </span>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div
                    className="selling-step-content"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "28px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "32px",
                      }}
                    >
                      <div style={{ flex: "0 0 200px" }}>
                        <span style={{ color: "red" }}>*</span>
                        <label className="form-label">Upload Photo</label>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                          Upload a photo of you or your artwork.
                        </p>
                      </div>

                      <div
                        style={{
                          width: "520px",
                          height: "123px",
                          border: "1px dashed rgba(175, 121, 40, 0.5)",
                          borderRadius: "6px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          backgroundColor: "#fffdf8",
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          id="sellerPhoto"
                          style={{
                            position: "absolute",
                            opacity: 0,
                            width: "100%",
                            height: "100%",
                            cursor: "pointer",
                            zIndex: 2,
                          }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const preview = document.getElementById(
                                  "sellerPhotoPreview"
                                ) as HTMLImageElement;
                                const icon =
                                  document.getElementById("uploadIcon");
                                const message =
                                  document.getElementById("uploadMessage");

                                if (preview && event.target?.result) {
                                  preview.src = event.target.result as string;
                                  preview.style.display = "block";
                                }
                                if (icon) icon.style.display = "none";
                                if (message) message.style.display = "none";
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />

                        <img
                          id="sellerPhotoPreview"
                          alt="Preview"
                          style={{
                            display: "none",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "6px",
                            zIndex: 1,
                          }}
                        />

                        <FaImage
                          id="uploadIcon"
                          style={{
                            fontSize: "32px",
                            color: "rgba(175, 121, 40, 0.6)",
                            zIndex: 0,
                          }}
                        />
                        <p
                          id="uploadMessage"
                          style={{
                            fontSize: "12px",
                            color: "rgba(0,0,0,0.5)",
                            marginTop: "8px",
                            zIndex: 0,
                          }}
                        >
                          Click to upload • Max size 2MB (JPG/PNG)
                        </p>
                      </div>
                    </div>

                    {/* Story Title Field */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "32px",
                      }}
                    >
                      <div style={{ flex: "0 0 200px" }}>
                        <span style={{ color: "red" }}>*</span>
                        <label className="form-label">Story Title</label>
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: "32.5rem" }}
                        placeholder="Enter story title"
                        value={sellerStoryTitle}
                        onChange={(e) => setSellerStoryTitle(e.target.value)}
                        maxLength={80}
                        required
                      />
                    </div>

                    {/* Artist Story Section */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "32px",
                      }}
                    >
                      <div style={{ flex: "0  0 200px" }}>
                        <span style={{ color: "red" }}>*</span>
                        <label className="form-label">Artist Story</label>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                          Share your journey, inspiration, and your craft
                        </p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <textarea
                          className="form-input"
                          style={{
                            width: "32.5rem",
                            minHeight: "10rem",
                            maxHeight: "25rem",
                            border: "1px solid rgba(175, 121, 40, 0.5)",
                            borderRadius: "8px",
                            resize: "none",
                            padding: "12px",
                            fontSize: "14px",
                            color: "#333",
                            lineHeight: "1.5",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                            overflow: "hidden",
                          }}
                          placeholder="Write your artist story here... Share your journey, what inspires you, how you got started, and what makes your work unique."
                          minLength={10}
                          maxLength={1000}
                          value={sellerStory}
                          onChange={(e) => {
                            setSellerStory(e.target.value);
                            e.target.style.height = "auto";
                            e.target.style.height =
                              e.target.scrollHeight + "px";
                          }}
                          required
                        />
                        <span
                          style={{
                            fontSize: "12px",
                            color:
                              sellerStory.length >= 1000
                                ? "red"
                                : sellerStory.length >= 10
                                ? "#4caf50"
                                : "#888",
                            alignSelf: "flex-end",
                            marginTop: "6px",
                          }}
                        >
                          {sellerStory.length}/1000{" "}
                          {sellerStory.length >= 10 &&
                            sellerStory.length < 1000 &&
                            "✓"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="selling-step-content">
                    <p style={{ fontSize: "15px", marginBottom: "20px" }}>
                      Review your details before submitting your shop for
                      approval.
                    </p>

                    {/* What Happens Next Timeline */}
                    <div
                      style={{
                        backgroundColor: "#fff9f0",
                        borderRadius: "8px",
                        padding: "16px 20px",
                        border: "1px solid rgba(175, 121, 40, 0.3)",
                        marginBottom: "24px",
                      }}
                    >
                      <h4
                        style={{
                          marginBottom: "12px",
                          color: "#af7928",
                          fontSize: "15px",
                        }}
                      >
                        📋 What Happens Next?
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          fontSize: "13px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{ fontWeight: "600", marginBottom: "4px" }}
                          >
                            1. Review
                          </div>
                          <div style={{ color: "#666" }}>
                            We&apos;ll verify your details within 1-3 business
                            days
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{ fontWeight: "600", marginBottom: "4px" }}
                          >
                            2. Approval
                          </div>
                          <div style={{ color: "#666" }}>
                            You&apos;ll receive an email notification with next
                            steps
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{ fontWeight: "600", marginBottom: "4px" }}
                          >
                            3. Start Selling
                          </div>
                          <div style={{ color: "#666" }}>
                            Add products and start reaching customers!
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shop Information Card */}
                    <div
                      style={{
                        marginBottom: "16px",
                        backgroundColor: "#faf8f5",
                        borderRadius: "8px",
                        padding: "16px 20px",
                        border: "1px solid rgba(175,121,40,0.2)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <h4 style={{ margin: 0, fontSize: "16px" }}>
                          Shop Information
                        </h4>
                      </div>

                      <div style={{ marginBottom: "10px" }}>
                        <strong>Shop Name:</strong>
                        <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                          {shopName}
                        </p>
                      </div>

                      {businessType && (
                        <div style={{ marginBottom: "10px" }}>
                          <strong>Category:</strong>
                          <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                            {businessType}
                          </p>
                        </div>
                      )}

                      {craftType && (
                        <div style={{ marginBottom: "10px" }}>
                          <strong>Craft Type:</strong>
                          <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                            {craftType}
                          </p>
                        </div>
                      )}

                      <div style={{ marginBottom: "10px" }}>
                        <strong>Pickup Address:</strong>
                        <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                          {pickupBarangay && pickupAddress
                            ? `${pickupBarangay}, ${pickupAddress}`
                            : pickupBarangay || pickupAddress || "Not provided"}
                        </p>
                      </div>

                      <div style={{ marginBottom: "10px" }}>
                        <strong>Contact Information:</strong>
                        <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                          Email: {shopEmail || "Not provided"}
                          <br />
                          Phone: {shopPhone || "Not provided"}
                        </p>
                      </div>

                      {(socialMediaLinks.facebook ||
                        socialMediaLinks.instagram ||
                        socialMediaLinks.tiktok) && (
                        <div style={{ marginBottom: "10px" }}>
                          <strong>Social Media:</strong>
                          {socialMediaLinks.facebook && (
                            <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                              Facebook: {socialMediaLinks.facebook}
                            </p>
                          )}
                          {socialMediaLinks.instagram && (
                            <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                              Instagram: {socialMediaLinks.instagram}
                            </p>
                          )}
                          {socialMediaLinks.tiktok && (
                            <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                              TikTok: {socialMediaLinks.tiktok}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Seller Story Card */}
                    <div
                      style={{
                        marginBottom: "16px",
                        backgroundColor: "#faf8f5",
                        borderRadius: "8px",
                        padding: "16px 20px",
                        border: "1px solid rgba(175,121,40,0.2)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <h4 style={{ margin: 0, fontSize: "15px" }}>
                          ✨ Your Story
                        </h4>
                        <button
                          type="button"
                          onClick={() => setActiveStep(1)}
                          style={{
                            background: "none",
                            border: "1px solid rgba(175, 121, 40, 0.5)",
                            borderRadius: "4px",
                            padding: "4px 12px",
                            fontSize: "12px",
                            cursor: "pointer",
                            color: "#af7928",
                          }}
                        >
                          Edit
                        </button>
                      </div>

                      {sellerStoryTitle && (
                        <div style={{ marginBottom: "10px" }}>
                          <strong>Story Title:</strong>
                          <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                            {sellerStoryTitle}
                          </p>
                        </div>
                      )}

                      <div style={{ marginBottom: "10px" }}>
                        <strong>Your Story:</strong>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            color: "#333",
                            whiteSpace: "pre-line",
                          }}
                        >
                          {sellerStory || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Seller Agreements */}
                    <div
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        padding: "16px 20px",
                        border: "1px solid rgba(175,121,40,0.3)",
                        marginTop: "20px",
                      }}
                    >
                      <h4 style={{ marginBottom: "16px", fontSize: "15px" }}>
                        📝 Seller Agreements
                      </h4>

                      <label
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          marginBottom: "12px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          style={{
                            marginTop: "3px",
                            marginRight: "10px",
                            cursor: "pointer",
                          }}
                          required
                        />
                        <span style={{ fontSize: "14px", lineHeight: "1.5" }}>
                          I agree to the <strong>Terms and Conditions</strong>{" "}
                          for selling on GrowLokal, including product quality
                          standards and customer service requirements.
                        </span>
                      </label>

                      <label
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          marginBottom: "12px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={agreedToCommission}
                          onChange={(e) =>
                            setAgreedToCommission(e.target.checked)
                          }
                          style={{
                            marginTop: "3px",
                            marginRight: "10px",
                            cursor: "pointer",
                          }}
                          required
                        />
                        <span style={{ fontSize: "14px", lineHeight: "1.5" }}>
                          I understand and accept the{" "}
                          <strong>commission structure</strong> (platform fee
                          applies to each sale).
                        </span>
                      </label>

                      <label
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={agreedToShipping}
                          onChange={(e) =>
                            setAgreedToShipping(e.target.checked)
                          }
                          style={{
                            marginTop: "3px",
                            marginRight: "10px",
                            cursor: "pointer",
                          }}
                          required
                        />
                        <span style={{ fontSize: "14px", lineHeight: "1.5" }}>
                          I commit to <strong>timely order fulfillment</strong>{" "}
                          and will communicate shipping/pickup details clearly
                          to customers.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                    margin: "24px 0",
                  }}
                />

                {/* Field Completion Status Helper */}
                {activeStep === 0 && !isShopInfoComplete() && (
                  <div
                    style={{
                      background: "#fff3cd",
                      border: "1px solid #ffc107",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      marginBottom: "16px",
                      fontSize: "13px",
                      color: "#856404",
                    }}
                  >
                    <strong>⚠️ Please complete all required fields:</strong>
                    <ul style={{ margin: "8px 0 0 20px", lineHeight: "1.8" }}>
                      {shopName.trim().length < 3 && (
                        <li>Shop Name (at least 3 characters)</li>
                      )}
                      {!businessType && <li>Category</li>}
                      {!craftType && <li>Craft Type</li>}
                      {!pickupBarangay && <li>Pickup Barangay</li>}
                      {!pickupAddress.trim() && <li>Pickup Address Details</li>}
                      {(!shopEmail.trim() ||
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shopEmail)) && (
                        <li>Valid Shop Email</li>
                      )}
                      {(shopPhone.trim().length !== 11 ||
                        !/^[0-9]+$/.test(shopPhone)) && (
                        <li>Shop Phone (exactly 11 digits)</li>
                      )}
                      {!validIdFile && <li>Valid ID Upload</li>}
                    </ul>
                  </div>
                )}

                <div className="selling-buttons" style={{ marginTop: "24px" }}>
                  <button
                    className="order-btn"
                    onClick={() => {
                      if (!isShopInfoComplete()) {
                        setShowSaveError(true);
                        return;
                      }
                      setIsSaved(true);
                      setShowSaveError(false);
                      setShowSaveModal(true);
                    }}
                    disabled={!isShopInfoComplete()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "50px",
                      padding: "10px 16px",
                      opacity: !isShopInfoComplete() ? 0.5 : 1,
                      cursor: !isShopInfoComplete() ? "not-allowed" : "pointer",
                    }}
                    title="Save Progress"
                  >
                    <FaSave style={{ fontSize: "18px" }} />
                  </button>

                  <button
                    className="order-btn primary"
                    onClick={async () => {
                      if (!isSaved) {
                        setShowSaveError(true);
                        return;
                      }
                      setShowSaveError(false);

                      if (activeStep < 2) {
                        setActiveStep(activeStep + 1);
                        setIsSaved(false);
                      } else {
                        // Submit the application
                        await handleSubmitSellerApplication();
                      }
                    }}
                    disabled={
                      !isSaved ||
                      (activeStep === 0 && !isStep1Valid()) ||
                      (activeStep === 1 && !isStep2Valid()) ||
                      (activeStep === 2 && !isStep3Valid())
                    }
                  >
                    {activeStep < 2 ? "Next" : "Submit"}
                  </button>

                  {activeStep > 0 && (
                    <button
                      className="order-btn secondary"
                      style={{ marginLeft: "8px" }}
                      onClick={() => setActiveStep(activeStep - 1)}
                    >
                      Back
                    </button>
                  )}
                </div>

                {showSaveError && (
                  <p
                    style={{ color: "red", fontSize: "13px", marginTop: "8px" }}
                  >
                    Please click “Save” first before proceeding.
                  </p>
                )}

                {showSaveModal && (
                  <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                      <h3 style={modalTitleStyle}>Progress Saved</h3>
                      <p style={modalTextStyle}>
                        Your progress for this step has been successfully saved.
                      </p>
                      <button
                        className="order-btn primary"
                        onClick={() => setShowSaveModal(false)}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )}

                {showProgressModal && (
                  <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                      <h3 style={modalTitleStyle}>Step Completed</h3>
                      <p style={modalTextStyle}>
                        You have successfully saved your details. Proceed to the
                        next step.
                      </p>
                      <button
                        className="order-btn primary"
                        onClick={() => setShowProgressModal(false)}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {showSubmitModal && (
                  <div
                    style={modalOverlayStyle}
                    onClick={(e) => {
                      if (e.target === e.currentTarget) {
                        setShowSubmitModal(false);
                        setIsSeller(true);
                        setActiveSection("myshop");
                      }
                    }}
                  >
                    <div style={{ ...modalBoxStyle, position: "relative" }}>
                      <button
                        aria-label="Close"
                        onClick={() => {
                          setShowSubmitModal(false);
                          setIsSeller(true);
                          setActiveSection("myshop");
                        }}
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          background: "transparent",
                          border: "none",
                          fontSize: 20,
                          color: "#2e3f36",
                          cursor: "pointer",
                          padding: 6,
                        }}
                      >
                        ×
                      </button>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 16,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#28af53",
                            borderRadius: "50%",
                            width: 48,
                            height: 48,
                            color: "#fff",
                            fontSize: "2rem",
                          }}
                        >
                          ✓
                        </span>
                      </div>

                      <h3 style={modalTitleStyle}>Shop Registered</h3>
                      <p style={modalTextStyle}>
                        Your shop is registered. View it under My Shop in your
                        profile.
                      </p>

                      <button
                        className="order-btn primary"
                        onClick={() => {
                          setShowSubmitModal(false);
                          setIsSeller(true);
                          setActiveSection("myshop");
                        }}
                        style={{ marginBottom: 10 }}
                      >
                        Proceed to My Shop
                      </button>
                    </div>
                  </div>
                )}

                {showSuccessModal && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h3>Success</h3>
                      <p>{successMessage}</p>
                      <div className="modal-actions">
                        <button
                          className="order-btn primary"
                          onClick={() => setShowSuccessModal(false)}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/******** MY SHOP (visible after registering) ********/}

          {isSeller && activeSection === "myshop" && (
            <div
              className="myshop-dashboard"
              style={{ display: "flex", gap: "32px" }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {/* Shop Card (shop picture + shop name) */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    padding: "5px 32px",
                    display: "flex",
                    alignItems: "center",
                    gap: "32px",
                  }}
                >
                  <img
                    src={
                      document
                        .getElementById("sellerPhotoPreview")
                        ?.getAttribute("src") ||
                      profilePicture ||
                      "/default-profile.jpg"
                    }
                    alt="Shop Image"
                    style={{
                      width: 65,
                      height: 65,
                      borderRadius: "12px",
                      objectFit: "cover",
                      background: "#faf8f5",
                      marginRight: 24,
                    }}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PROFILE_PICTURE;
                    }}
                  />
                  <span
                    style={{
                      fontSize: "25px",
                      fontWeight: 700,
                      color: "#af7928",
                      letterSpacing: "1px",
                    }}
                  >
                    {shopName || "My Shop"}
                  </span>
                </div>

                {/* Order Status Card */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    padding: "24px 32px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 18,
                      color: "#2e3f36",
                      marginBottom: 18,
                    }}
                  >
                    Order Status
                  </div>
                  <div style={{ display: "flex", gap: "32px" }}>
                    {[
                      { label: "To Ship", value: 0, color: "#af7928" },
                      { label: "Cancelled", value: 0, color: "#e74c3c" },
                      { label: "Return", value: 0, color: "#888" },
                      { label: "Review", value: 0, color: "#45956a" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        style={{
                          flex: 1,
                          background: "#faf8f5",
                          borderRadius: 8,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: "18px 0",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: stat.color,
                            marginBottom: 4,
                          }}
                        >
                          {stat.value}
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            color: "#2e3f36",
                            fontWeight: 500,
                          }}
                        >
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Links Card */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    padding: "24px 32px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 18,
                      color: "#2e3f36",
                      marginBottom: 18,
                    }}
                  >
                    Quick Links
                  </div>
                  <div style={{ display: "flex", gap: "32px" }}>
                    {/* My Products */}
                    <div
                      className="quick-link-card"
                      style={{
                        flex: 1,
                        background: "#e74c3c",
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "24px 0",
                        cursor: "pointer",
                        position: "relative",
                      }}
                      onClick={() => (window.location.href = "/product")}
                      tabIndex={0}
                      role="button"
                      aria-label="Go to My Products"
                    >
                      <FaBoxOpen
                        style={{
                          fontSize: 30,
                          color: "#fff",
                          marginBottom: 8,
                        }}
                      />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: "#fff",
                        }}
                      >
                        My Products
                      </span>
                    </div>
                    {/* Shop Performance */}
                    <div
                      className="quick-link-card"
                      style={{
                        flex: 1,
                        background: "#888",
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "24px 0",
                        cursor: "pointer",
                        position: "relative",
                      }}
                      onClick={() => (window.location.href = "/analytics")}
                      tabIndex={0}
                      role="button"
                      aria-label="Go to Shop Performance"
                    >
                      <FaStore
                        style={{
                          fontSize: 30,
                          color: "#fff",
                          marginBottom: 8,
                        }}
                      />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: "#fff",
                        }}
                      >
                        Shop Performance
                      </span>
                    </div>
                    {/* FAQ */}
                    <div
                      className="quick-link-card"
                      style={{
                        flex: 1,
                        background: "#45956a",
                        borderRadius: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "10px 0",
                        cursor: "pointer",
                        position: "relative",
                      }}
                      onClick={() => (window.location.href = "/faq")}
                      tabIndex={0}
                      role="button"
                      aria-label="Go to FAQ"
                    >
                      <span
                        style={{
                          fontSize: 30,
                          color: "#fff",
                          marginBottom: 8,
                        }}
                      >
                        ?
                      </span>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: "#fff",
                        }}
                      >
                        FAQ
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: "#fff",
                    borderRadius: 5,
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
                    padding: "0.5rem 2rem",
                    display: "flex",
                    alignItems: "center",
                    minHeight: 120,
                    cursor: "pointer",
                    transition: "box-shadow 0.3s ease",
                    position: "relative",
                  }}
                  onClick={() =>
                    (window.location.href = `/artiststory/${encodeURIComponent(
                      fullName
                    )}`)
                  }
                  tabIndex={0}
                  role="button"
                  aria-label="View Artist Story"
                  onMouseEnter={(e) => {
                    const arrow = e.currentTarget.querySelector(
                      ".artist-arrow"
                    ) as HTMLElement | null;
                    if (arrow) arrow.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    const arrow = e.currentTarget.querySelector(
                      ".artist-arrow"
                    ) as HTMLElement | null;
                    if (arrow) arrow.style.opacity = "0";
                  }}
                >
                  <img
                    src={
                      document
                        .getElementById("sellerPhotoPreview")
                        ?.getAttribute("src") ||
                      profilePicture ||
                      "/default-profile.jpg"
                    }
                    alt="Artist"
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 5,
                      border: "2px solid #af7928",
                      objectFit: "cover",
                      marginRight: 24,
                      background: "#faf8f5",
                    }}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PROFILE_PICTURE;
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#2e3f36",
                        marginBottom: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {sellerStoryTitle || "Artist Story"}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#af7928",
                        marginBottom: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {fullName}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#222",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 400,
                      }}
                      title={sellerStory}
                    >
                      {sellerStory.length > 80
                        ? sellerStory.slice(0, 80) + "..."
                        : sellerStory || "No story provided yet."}
                    </div>
                  </div>
                  <span
                    className="artist-arrow"
                    style={{
                      fontSize: "2rem",
                      color: "#af7928",
                      marginLeft: 24,
                      flexShrink: 0,
                      opacity: 0,
                      transition: "opacity 0.2s",
                      position: "absolute",
                      right: 32,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <i
                      className="fa-solid fa-chevron-right"
                      style={{ fontSize: "2rem", color: "#af7928" }}
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

// Wishlist Content Component
function WishlistContent() {
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      try {
        // Get wishlist from localStorage
        const savedWishlist = localStorage.getItem("wishlist");
        const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];

        if (wishlistIds.length === 0) {
          setWishlistProducts([]);
          setLoading(false);
          return;
        }

        // Fetch product details for each wishlist item
        const productPromises = wishlistIds.map((id: string) =>
          fetch(`/api/products/${id}`).then((res) => res.json())
        );

        const results = await Promise.all(productPromises);
        const products = results
          .filter((result) => result.success)
          .map((result) => result.data);

        setWishlistProducts(products);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const removeFromWishlist = (productId: string) => {
    // Remove from localStorage
    const savedWishlist = localStorage.getItem("wishlist");
    const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];
    const updated = wishlistIds.filter((id: string) => id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(updated));

    // Update state
    setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <i
          className="fas fa-spinner fa-spin"
          style={{ fontSize: "48px", color: "#AF7928" }}
        ></i>
        <p style={{ marginTop: "20px", color: "#666" }}>
          Loading your wishlist...
        </p>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div style={{ padding: "60px 40px", textAlign: "center" }}>
        <FaHeart
          style={{ fontSize: "64px", color: "#d4a664", marginBottom: "20px" }}
        />
        <h3
          style={{ fontSize: "1.5rem", color: "#2E3F36", marginBottom: "12px" }}
        >
          Your wishlist is empty
        </h3>
        <p style={{ color: "#666", fontSize: "1rem" }}>
          Start adding products you love to your wishlist!
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "24px",
        }}
      >
        {wishlistProducts.map((product) => (
          <div
            key={product._id}
            style={{
              background: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={product.images?.[0] || product.thumbnailUrl}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(product._id);
                }}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e74c3c";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.95)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <FaHeart style={{ color: "#e74c3c", fontSize: "18px" }} />
              </button>
            </div>
            <div style={{ padding: "16px" }}>
              <h4
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#2E3F36",
                  marginBottom: "8px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {product.name}
              </h4>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#666",
                  marginBottom: "12px",
                }}
              >
                {product.artistName}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    color: "#AF7928",
                  }}
                >
                  ₱{product.price?.toFixed(2)}
                </span>
                {product.averageRating > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.85rem",
                      color: "#FFC46B",
                    }}
                  >
                    <i className="fas fa-star"></i>
                    <span>{product.averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
