"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
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

const mockUser = {
  name: "Venti Batumbakal",
  email: "venti@gmail.com",
  phone: "09171234567",
  street: "14 Harris St",
  barangay: "East Bajac-Bajac",
  province: "Zambales",
  city: "Olongapo",
  postal: "2200",
};

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
  const [expandedSection, setExpandedSection] = useState<string | null>("profile");
  const [activeOrdersTab, setActiveOrdersTab] = useState("All");
  const [confirmedOrders, setConfirmedOrders] = useState<Set<string>>(new Set());

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
  const [profilePicture, setProfilePicture] = useState<string>("/default-profile.jpg");

  // Orders Data
  const [orders, setOrders] = useState<any[]>([]);

  // Auth check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (querySection) {
      setActiveSection(querySection);
      if (querySection === "profile") setExpandedSection("profile");
      else setExpandedSection(null);
    }
  }, [querySection]);

  const handleSelectSection = (section: string) => {
    setActiveSection(section);
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
        const response = await fetch("/api/user/profile");
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
          setProfilePicture(data.data.profilePicture || "/default-profile.jpg");
          setIsSeller(data.data.isSeller || false);
        } else {
          setProfileError(data.message || "Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileError("Failed to load profile");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [session]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user || activeSection !== "orders") return;

      setIsLoadingOrders(true);
      setOrdersError("");

      try {
        const statusParam = activeOrdersTab === "All" ? "all" : activeOrdersTab.toLowerCase();
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
    if (phone && !validatePhone(phone)) errors.push("Invalid phone format (09XXXXXXXXX)");
    if (postal && !validatePostalCode(postal)) errors.push("Invalid postal code (4 digits)");
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
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const statusParam = activeOrdersTab === "All" ? "all" : activeOrdersTab.toLowerCase();
        const ordersResponse = await fetch(`/api/user/orders?status=${statusParam}`);
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
  const [sellerStory, setSellerStory] = useState("");

  const [pickupBarangay, setPickupBarangay] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [validIdFile, setValidIdFile] = useState<File | null>(null);
  const [isSeller, setIsSeller] = useState(false); // Track if user is now a seller

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

  const isShopInfoComplete =
    shopName.trim() &&
    pickupBarangay.trim() &&
    pickupAddress.trim() &&
    shopEmail.trim() &&
    phone.trim() &&
    validIdFile;

  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper">
        <div className="profile-container">
          {isLoadingProfile ? (
            <div style={{ padding: "40px", textAlign: "center" }}>Loading profile...</div>
          ) : (
            <>
              <div className="profile-picture">
                <img
                  src={profilePicture}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
                <label className="profile-upload-label" htmlFor="profile-upload-input">
                  <FaEdit style={{ fontSize: "16px", color: "#af7928" }} />
                </label>
                <input
                  id="profile-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="profile-upload-input"
                />
              </div>
              <div className="profile-name">{fullName || session?.user?.name || "User"}</div>
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

          {/* Start Selling / My Shop toggle in sidebar */}
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
                    src={profilePicture}
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
                    <div style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
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
                  <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
                    {ordersError}
                  </div>
                )}

                {/* Empty State */}
                {!isLoadingOrders && !ordersError && orders.length === 0 && (
                  <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                    No orders found
                  </div>
                )}

                <div className="orders-content">
                  <div className="order-card">
                    <div className="order-header">
                      <div className="order-shop">
                        <button
                          type="button"
                          className="view-store-btn"
                          onClick={() => {
                            alert("Go to store");
                          }}
                        >
                          <i className="fas fa-store"></i>
                          View Store
                        </button>
                      </div>

                      <div className="order-status-wrapper">
                        {activeOrdersTab === "To Ship" && (
                          <span className="order-status-msg left">
                            <i className="fas fa-box-open"></i> Seller is
                            preparing your order...
                          </span>
                        )}
                        {activeOrdersTab === "To Receive" && (
                          <span className="order-status-msg left">
                            <i className="fas fa-truck-fast"></i> You order is
                            on the way...
                          </span>
                        )}
                        {activeOrdersTab === "Completed" && (
                          <span className="order-status-msg left delivered">
                            <i className="fas fa-truck"></i> Parcel has been
                            delivered
                          </span>
                        )}

                        <span className="order-status">{activeOrdersTab}</span>
                      </div>
                    </div>

                    <div className="order-body">
                      <img
                        src="/box1.png"
                        alt="Acacia Wood Deep Round Plate"
                        className="order-product-img"
                      />
                      <div className="order-details">
                        <p className="order-artist">RICHEL MARIBE</p>
                        <p className="order-product-name">
                          Acacia Wood Deep Round Plate
                        </p>
                        <p className="order-product-qty">Qty: 1</p>

                        {activeOrdersTab === "Completed" && (
                          <div className="order-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`star${
                                  star <= (orderRatings["order-123"] || 0)
                                    ? " filled"
                                    : ""
                                }`}
                                onClick={() =>
                                  setOrderRatings((prev) => ({
                                    ...prev,
                                    ["order-123"]: star,
                                  }))
                                }
                                style={{
                                  cursor: "pointer",
                                  fontSize: "18px",
                                  color:
                                    star <= (orderRatings["order-123"] || 0)
                                      ? "#FFC46B"
                                      : "#ccc",
                                  transition: "color 0.2s",
                                }}
                                title={`Rate ${star} star${
                                  star > 1 ? "s" : ""
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="order-price">
                        {activeOrdersTab === "To Pay"
                          ? "Amount Payable: ₱1211"
                          : activeOrdersTab === "Completed"
                          ? "Order Total: ₱149.00"
                          : "₱149.00"}
                      </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="order-footer">
                      {activeOrdersTab === "To Pay" && (
                        <>
                          <button className="order-btn-pending">Pending</button>
                          <button className="order-btn primary">
                            Cancel Order
                          </button>
                        </>
                      )}

                      {activeOrdersTab === "To Ship" && (
                        <button className="order-btn">View Details</button>
                      )}

                      {activeOrdersTab === "To Receive" && (
                        <button
                          className="order-btn primary"
                          onClick={() => handleConfirmReceipt("order-123")}
                          disabled={loadingConfirm}
                        >
                          {loadingConfirm ? "Confirming..." : "Confirm Receipt"}
                        </button>
                      )}

                      {activeOrdersTab === "Completed" && (
                        <>
                          <button className="order-btn">Buy Again</button>

                          {!orderRatings["order-123"] &&
                          confirmedOrders.has("order-123") ? (
                            <button
                              className="order-btn primary"
                              onClick={() =>
                                setOrderRatings((prev) => ({
                                  ...prev,
                                  ["order-123"]: 0,
                                }))
                              }
                            >
                              Rate Order
                            </button>
                          ) : null}
                        </>
                      )}

                      {activeOrdersTab === "Cancelled" && (
                        <button className="order-btn primary">Buy Again</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Selling Section */}
          {activeSection === "selling" && (
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
                      return (
                        <React.Fragment key={label}>
                          <div className="progress-step">
                            <div
                              className="circle"
                              style={{
                                backgroundColor: isActive
                                  ? "#AF7928"
                                  : "rgba(0,0,0,0.25)",
                              }}
                            ></div>
                            <span
                              className="label"
                              style={{
                                color: isActive
                                  ? "#AF7928"
                                  : "rgba(0,0,0,0.25)",
                              }}
                            >
                              {label}
                            </span>
                          </div>
                          {i < 2 && (
                            <div
                              className="progress-line"
                              style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
                            ></div>
                          )}
                        </React.Fragment>
                      );
                    }
                  )}
                </div>

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
                        placeholder="Enter your Shop Name"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        required
                      />
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
                        placeholder="Enter Shop Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
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

                    {/* Artist Story Section */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "32px",
                      }}
                    >
                      <div style={{ flex: "0 0 200px" }}>
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
                          placeholder="Write your artist story here..."
                          maxLength={500}
                          value={sellerStory}
                          onChange={(e) => {
                            setSellerStory(e.target.value);
                            e.target.style.height = "auto";
                            e.target.style.height =
                              e.target.scrollHeight + "px";
                          }}
                        />
                        <span
                          style={{
                            fontSize: "12px",
                            color: sellerStory.length >= 500 ? "red" : "#888",
                            alignSelf: "flex-end",
                            marginTop: "6px",
                          }}
                        >
                          {sellerStory.length}/500
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="selling-step-content">
                    <p>
                      Review your details before submitting your shop for
                      approval.
                    </p>

                    <div
                      style={{
                        marginTop: "16px",
                        backgroundColor: "#faf8f5",
                        borderRadius: "8px",
                        padding: "16px 20px",
                        border: "1px solid rgba(175,121,40,0.2)",
                      }}
                    >
                      <div style={{ marginBottom: "10px" }}>
                        <strong>Shop Name:</strong>
                        <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                          {shopName || "—"}
                        </p>
                      </div>

                      <div style={{ marginBottom: "10px" }}>
                        <strong>Barangay:</strong>
                        <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                          {pickupBarangay || "—"}
                        </p>
                      </div>

                      <div style={{ marginBottom: "10px" }}>
                        <strong>Other Details:</strong>
                        <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                          {pickupOther || "—"}
                        </p>
                      </div>

                      <div style={{ marginBottom: "10px" }}>
                        <strong>Email:</strong>
                        <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                          {shopEmail || "—"}
                        </p>
                      </div>

                      {/* Add Phone here */}
                      <div style={{ marginBottom: "10px" }}>
                        <strong>Phone:</strong>
                        <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                          {phone || "—"}
                        </p>
                      </div>

                      <div style={{ marginBottom: "10px" }}>
                        <strong>Valid ID:</strong>
                        <p style={{ margin: "4px 0 0 0", color: "#333" }}>
                          {validIdFile ? validIdFile.name : "—"}
                        </p>
                        <span style={{ fontSize: "12px", color: "#888" }}>
                          (Must be a clear photo or scan)
                        </span>
                      </div>

                      <div>
                        <strong>Seller Story:</strong>
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
                  </div>
                )}

                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                    margin: "24px 0",
                  }}
                />

                <div className="selling-buttons" style={{ marginTop: "24px" }}>
                  <button
                    className="order-btn"
                    onClick={() => {
                      if (!isShopInfoComplete) {
                        setShowSaveError(true);
                        return;
                      }
                      setIsSaved(true);
                      setShowSaveError(false);
                      setShowSaveModal(true);
                    }}
                    disabled={!isShopInfoComplete}
                  >
                    Save
                  </button>

                  <button
                    className="order-btn primary"
                    onClick={() => {
                      if (!isSaved) {
                        setShowSaveError(true);
                        return;
                      }
                      setShowSaveError(false);

                      if (activeStep < 2) {
                        setActiveStep(activeStep + 1);
                        setIsSaved(false);
                      } else {
                        setShowSubmitModal(true);
                      }
                    }}
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
              {/* Seller Profile Sidebar */}
              <div
                className="myshop-profile-sidebar"
                style={{
                  minWidth: 220,
                  maxWidth: 260,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  padding: "32px 16px",
                  height: "fit-content",
                }}
              >
                <img
                  src="/default-profile.jpg"
                  alt="Seller profile"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: 16,
                  }}
                />
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 18,
                    color: "#2e3f36",
                    marginBottom: 4,
                  }}
                >
                  {fullName}
                </div>
                <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>
                  {shopEmail}
                </div>
                <div style={{ fontSize: 14, color: "#888" }}>{phone}</div>
              </div>

              {/* Main Shop Content */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {/* Shop Name */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    padding: "24px 32px",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#af7928",
                    marginBottom: 0,
                  }}
                >
                  {shopName || "My Shop"}
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
                      { label: "To Ship", value: 2, color: "#af7928" },
                      { label: "Cancelled", value: 0, color: "#e74c3c" },
                      { label: "Return", value: 0, color: "#888" },
                      { label: "Review", value: 1, color: "#45956a" },
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
                            fontSize: 32,
                            fontWeight: 700,
                            color: stat.color,
                            marginBottom: 4,
                          }}
                        >
                          {stat.value}
                        </span>
                        <span
                          style={{
                            fontSize: 15,
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
                <div>
                  <div style={{ display: "flex", gap: "24px" }}>
                    {/* My Products */}
                    <div
                      style={{
                        flex: 1,
                        background: "#fff",
                        borderRadius: 8,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "24px 0",
                        cursor: "pointer",
                        transition: "box-shadow 0.2s",
                      }}
                    >
                      <FaBoxOpen
                        style={{
                          fontSize: 36,
                          color: "#af7928",
                          marginBottom: 8,
                        }}
                      />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          color: "#2e3f36",
                        }}
                      >
                        My Products
                      </span>
                    </div>
                    {/* Shop Performance */}
                    <div
                      style={{
                        flex: 1,
                        background: "#fff",
                        borderRadius: 8,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "24px 0",
                        cursor: "pointer",
                        transition: "box-shadow 0.2s",
                      }}
                    >
                      <FaStore
                        style={{
                          fontSize: 32,
                          color: "#af7928",
                          marginBottom: 8,
                        }}
                      />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          color: "#2e3f36",
                        }}
                      >
                        Shop Performance
                      </span>
                    </div>
                    {/* FAQ */}
                    <div
                      style={{
                        flex: 1,
                        background: "#fff",
                        borderRadius: 8,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "24px 0",
                        cursor: "pointer",
                        transition: "box-shadow 0.2s",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 32,
                          color: "#af7928",
                          marginBottom: 8,
                        }}
                      >
                        ?
                      </span>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          color: "#2e3f36",
                        }}
                      >
                        FAQ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Artist Story Card */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    padding: "32px",
                    display: "flex",
                    alignItems: "center",
                    gap: "32px",
                  }}
                >
                  <img
                    src={
                      document
                        .getElementById("sellerPhotoPreview")
                        ?.getAttribute("src") || "/default-profile.jpg"
                    }
                    alt="Artist"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      objectFit: "cover",
                      background: "#faf8f5",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 18,
                        color: "#af7928",
                        marginBottom: 8,
                      }}
                    >
                      Artist Story
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        color: "#2e3f36",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {sellerStory || "No story provided yet."}
                    </div>
                  </div>
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


