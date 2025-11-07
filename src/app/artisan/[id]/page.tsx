"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "./artisan.css";

export default function ArtisanProfilePage() {
  // Example static data, replace with real fetch logic
  const artisan = {
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aba",
    shopName: "Aba's Weaving Shop",
    name: "Aba Dela Cruz",
    craftType: "Weaving",
    category: "Handicrafts",
    rating: 4.8,
    location: "Asinan",
    joined: "2025-11-07",
    storyImage: "/artist1.jpg",
    storyTitle: "Threads of Heritage",
    storyExcerpt:
      "I've been weaving traditional Filipino textiles for over 15 years, learning the craft from my grandmother. Each piece tells a story of our heritage and community. I specialize in indigenous patterns that have been passed down through generations.",
  };

  // Example products for this artisan (replace with real fetch)
  const products = [
    {
      _id: "1",
      name: "Handwoven Buri Bag",
      artistName: artisan.name,
      price: 799,
      images: ["/box7.png", "/box7-hover.png"],
      averageRating: 4.7,
      totalReviews: 12,
      isAvailable: true,
      stock: 5,
      isFeatured: true,
      craftType: artisan.craftType,
      category: artisan.category,
      thumbnailUrl: "/box7.png",
    },
    {
      _id: "2",
      name: "Traditional Table Runner",
      artistName: artisan.name,
      price: 499,
      images: ["/box8.png"],
      averageRating: 4.9,
      totalReviews: 8,
      isAvailable: true,
      stock: 3,
      isFeatured: false,
      craftType: artisan.craftType,
      category: artisan.category,
      thumbnailUrl: "/box8.png",
    },
    // ...add more products as needed
  ];

  // Format joined date
  const joinedDate = new Date(artisan.joined);
  const joinedText = joinedDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      <Navbar />
      <main className="artisan-profile-main">
        <section className="artisan-card">
          <div className="artisan-card-top">
            {/* Profile on the top left */}
            <img
              src={artisan.avatar}
              alt={artisan.name}
              className="artisan-avatar"
            />
            {/* Shop name and artisan name */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "baseline", gap: "18px" }}
              >
                <span
                  className="shop-name"
                  style={{
                    fontSize: "2rem",
                    fontWeight: 600,
                    color: "#2E3F36",
                  }}
                >
                  {artisan.shopName}
                </span>
                <span
                  className="artisan-name"
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 500,
                    color: "#888",
                  }}
                >
                  {artisan.name}
                </span>
              </div>
              {/* Category, craft type, rating */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "14px 0 0 0",
                  gap: "5px",
                }}
              >
                <span className="artisan-category-type">
                  {artisan.category}
                </span>
                <span className="artisan-craft-type">{artisan.craftType}</span>
                {/* Move shop rating right beside tags, not pushed to edge */}
                <span
                  style={{
                    color: "#AF7928",
                    fontWeight: 600,
                    fontSize: "1.08rem",
                    marginLeft: "10px",
                  }}
                >
                  ★ {artisan.rating}
                </span>
              </div>
              {/* Barangay location with icon */}
              <div
                style={{
                  margin: "12px 0 0 0",
                  color: "#888",
                  fontWeight: 400,
                  fontSize: "0.90rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  style={{ color: "#AF7928", fontSize: "1.1rem" }}
                />
                {artisan.location}
              </div>
              {/* Joined date */}
              <div
                style={{
                  margin: "10px 0 0 0",
                  color: "#888",
                  fontSize: "0.80rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faCalendar}
                  style={{ marginRight: "7px", color: "#AF7928" }}
                />
                Joined {joinedText}
              </div>
            </div>
          </div>
          {/* Line break */}
          <hr
            style={{
              margin: "22px 0 0 0",
              border: "none",
              borderTop: "2px solid #e0e0e0",
            }}
          />
          {/* About section */}
          <div
            className="artisan-about-section"
            style={{
              margin: "28px 0 0 0",
              display: "flex",
              alignItems: "flex-start",
              gap: "32px",
            }}
          >
            <img
              src={artisan.storyImage}
              alt={artisan.storyTitle}
              className="artisan-story-image"
              style={{
                width: "180px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "0",
                boxShadow: "0 2px 12px rgba(46,63,54,0.08)",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  marginBottom: "8px",
                  color: "#AF7928",
                }}
              >
                {artisan.storyTitle}
              </div>
              <div style={{ color: "#2e3f36c4", fontSize: "0.95rem" }}>
                {artisan.storyExcerpt}
              </div>
            </div>
          </div>
        </section>

        {/* Products by [Artist Name] */}
        <div style={{ margin: "2.5rem 0 0 0", width: "100%" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#2E3F36",
              margin: "0 0 1.5rem 2rem",
            }}
          >
            Products by {artisan.name}
          </h2>
          <div
            className="home-product-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.2rem", // LESS gap between cards
              justifyItems: "center",
              padding: "0 2rem",
              marginBottom: "1rem",
            }}
          >
            {products.map((product) => (
              <div
                className="home-product-card"
                key={product._id}
                style={{
                  position: "relative",
                  width: "312px",
                  height: "461px",
                  display: "flex",
                  borderRadius: "8px",
                  flexDirection: "column",
                  background: "#ffffff",
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                  opacity: 1,
                  transform: "none",
                  cursor: "pointer",
                }}
              >
                <div className="home-image-container">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="home-product-image"
                  />
                </div>
                <div className="home-product-info">
                  <div className="home-product-info-top">
                    <h3 className="home-product-name">{product.name}</h3>
                    <p className="home-product-artist">{product.artistName}</p>
                    <div
                      className="home-product-tags"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "8px",
                      }}
                    >
                      <span className="home-product-tag craft-type">
                        {product.craftType}
                      </span>
                      <span className="home-product-tag category">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="home-product-info-bottom">
                    <div className="home-product-price-wrapper">
                      <span className="home-product-price">
                        ₱{product.price}
                      </span>
                    </div>
                    {/* Ratings inside product card, below price */}
                    {product.averageRating > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          color: "#AF7928",
                          fontWeight: 600,
                          fontSize: "0.98rem",
                          marginTop: "6px",
                        }}
                      >
                        <i className="fas fa-star"></i>
                        {product.averageRating.toFixed(1)}
                        <span
                          style={{
                            color: "#888",
                            fontWeight: 400,
                            fontSize: "0.95rem",
                          }}
                        >
                          ({product.totalReviews})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
