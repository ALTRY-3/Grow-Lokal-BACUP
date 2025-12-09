"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import "../styles/GrowLokalCarousel.css";

interface CarouselSlide {
  id: number;
  category: string;
  tagline: string;
  heroImage: string;
  thumbImage: string;
  description: string;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    category: "HANDICRAFTS",
    tagline: "Discover the Soul of Olongapo Through Handmade Creations.",
    heroImage: "hero_handicrafts.jpg",
    thumbImage: "handicrafts-categ.jpg",
    description:
      "Explore the vibrant craftsmanship of local makers—from delicate weaving and expressive pottery to expertly carved wooden art. Each piece is a celebration of culture, identity, and the artistry that defines Olongapo.",
  },
  {
    id: 2,
    category: "FASHION",
    tagline: "Experience Olongapo Through Every Stitch.",
    heroImage: "fashion_hero.jpg",
    thumbImage: "fashion-categ.jpg",
    description:
      "Discover artisanal embroidery, traditional wear, and modern fashion infused with local identity. Each piece showcases the rich cultural threads woven into Olongapo’s creative community.",
  },
  {
    id: 3,
    category: "FOOD",
    tagline: "Taste the Flavors Crafted in Our Community.",
    heroImage: "hero_food.jpg",
    thumbImage: "food-categ.jpg",
    description:
      "Enjoy signature local treats—from pure honey and fruity jams to handcrafted delicacies. A delicious way to experience the authentic flavors of Olongapo.",
  },
  {
    id: 4,
    category: "BEAUTY & WELLNESS",
    tagline: "Naturally Made Products for Everyday Wellness.",
    heroImage: "hero_beauty.png",
    thumbImage: "beauty-categ.jpg",
    description:
      "Discover locally crafted soaps, essential oils, balms, and natural beauty treats inspired by Olongapo’s culture and flora—perfect for self-care or souvenirs.",
  },
  {
    id: 5,
    category: "HOME",
    tagline: "Bring Cultural Artistry Into Your Home.",
    heroImage: "hero_home.jpg",
    thumbImage: "home-categ.jpg",
    description:
      "Discover locally made décor, wall art, woven homeware, and cultural pieces that let you bring a part of Olongapo’s craftsmanship into your living space.",
  },
];

const AUTO_SLIDE_INTERVAL = 7000; // 7 seconds

// Helper function to calculate position class for a thumbnail
const getPositionClass = (
  thumbnailIndex: number,
  currentSlideIndex: number,
  totalSlides: number
): number => {
  let offset = thumbnailIndex - currentSlideIndex;
  if (offset < 0) offset += totalSlides;
  if (offset >= 5) offset -= totalSlides;
  return Math.min(Math.max(offset, 1), 5);
};

export default function GrowLokalCarousel() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(true);
  const [progress, setProgress] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  // Handle next slide
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    setProgress(0);
    setAnimationKey((prev) => prev + 1);
  }, []);

  // Handle previous slide
  const goToPreviousSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1
    );
    setProgress(0);
    setAnimationKey((prev) => prev + 1);
  }, []);

  // Handle thumbnail click
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setProgress(0);
    setAnimationKey((prev) => prev + 1);
  }, []);

  // Handle explore button click
  const handleExplore = useCallback(() => {
    router.push("/marketplace");
  }, [router]);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlayActive) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNextSlide();
          return 0;
        }
        return prev + 100 / (AUTO_SLIDE_INTERVAL / 100);
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isAutoPlayActive, goToNextSlide]);

  const currentSlideData = CAROUSEL_SLIDES[currentSlide];

  return (
    <div className="carousel-wrapper">
      {/* Progress bar */}
      <div className="carousel-progress-bar">
        <div
          className="carousel-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main slides container */}
      <div className="carousel-slides-container">
        {CAROUSEL_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide ${
              index === currentSlide ? "carousel-slide-active" : ""
            }`}
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(46, 63, 54, 0.55) 0%, rgba(175, 121, 40, 0.4) 100%), url(${slide.heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          >
            {/* Gradient overlay for depth */}
            <div className="carousel-slide-overlay" />

            {/* Slide content */}
            <div
              className="carousel-slide-content"
              key={`content-${animationKey}`}
            >
              {/* Category title */}
              <h1 className="carousel-category-title">{slide.category}</h1>

              {/* Tagline */}
              <p className="carousel-category-tagline">{slide.tagline}</p>

              {/* Description */}
              <p className="carousel-category-description">
                {slide.description}
              </p>

              {/* CTA buttons */}
              <div className="carousel-cta-buttons">
                <button
                  className="carousel-btn carousel-btn-primary"
                  onClick={handleExplore}
                >
                  EXPLORE <ArrowRight size={20} style={{ marginLeft: "8px" }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        className="carousel-nav-btn carousel-nav-prev"
        onClick={goToPreviousSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        className="carousel-nav-btn carousel-nav-next"
        onClick={goToNextSlide}
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Thumbnail carousel with class-based positioning */}
      <div className="carousel-thumbnails-container">
        <div className="carousel-thumbnails-wrapper">
          {CAROUSEL_SLIDES.map((slide, index) => {
            // Get position class using helper function
            const positionClass = getPositionClass(
              index,
              currentSlide,
              CAROUSEL_SLIDES.length
            );
            const isActive = index === currentSlide;

            return (
              <button
                key={slide.id}
                className={`carousel-thumbnail position-${positionClass} ${
                  isActive ? "carousel-thumbnail-active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to ${slide.category} slide`}
                style={{
                  backgroundImage: `url(${slide.thumbImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <span className="carousel-thumbnail-label">
                  {slide.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Auto-play toggle */}
      {/* Removed pause/play button */}

      {/* Slide counter - Removed */}
    </div>
  );
}
