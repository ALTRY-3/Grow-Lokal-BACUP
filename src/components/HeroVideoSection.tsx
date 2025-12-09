"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "../styles/HeroVideoSection.css";

export default function HeroVideoSection() {
  const router = useRouter();
  const { status } = useSession();

  const handleShopLocal = () => {
    // Scroll to featured products or navigate
    const element = document.getElementById("whats-popular");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrimaryCta = () => {
    if (status === "authenticated") {
      router.push("/profile?section=profile");
    } else {
      router.push("/signup");
    }
  };

  return (
    <div className="hero-video-wrapper">
      {/* Background video */}
      <video
        className="hero-video-background"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      {/* Gradient overlay */}
      <div className="hero-video-overlay" />

      {/* Content */}
      <div className="hero-video-content">
        {/* Eyebrow text */}
        <div className="hero-eyebrow">DISCOVER OLONGAPO'S LOCAL TREASURES</div>

        {/* Main title */}
        <h1 className="hero-video-title">
          Experience the Heart of Olongapo — Handmade by Local Artisans.
        </h1>

        {/* Subtext */}
        <p className="hero-video-subtext">
          Every product carries a story. Every artisan carries a legacy.
        </p>

        {/* CTA Buttons */}
        <div className="hero-video-buttons">
          <button
            className="hero-btn hero-btn-primary"
            onClick={handleShopLocal}
          >
            {" "}
            <i className="fa-solid fa-bag-shopping"></i>
            SHOP LOCAL
          </button>
          <button
            className="hero-btn hero-btn-secondary"
            onClick={handlePrimaryCta}
          >
            {status === "authenticated" ? "START SELLING" : "GET STARTED"}
          </button>
        </div>
      </div>
    </div>
  );
}
