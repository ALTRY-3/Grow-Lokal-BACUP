"use client";
import React, { useState } from "react";
import { FaTimes, FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

interface Product {
  img: string;
  hoverImg: string;
  name: string;
  artist: string;
  price: string;
  productId?: string; // Optional: for add to cart functionality
  maxStock?: number; // Optional: for stock limit
}

export default function ProductModal({
  product,
  onClose,
  isInWishlist = false,
  onToggleWishlist,
}: {
  product: Product;
  onClose: () => void;
  isInWishlist?: boolean;
  onToggleWishlist?: () => void;
}) {
  const [mainImage, setMainImage] = useState(product.img);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviews, setReviews] = useState(0);

  const { addItem } = useCartStore();

  const handleRating = (rate: number) => {
    setRating(rate);
    setReviews(reviews + 1);
  };

  const handleAddToCart = async () => {
    if (!product.productId) {
      alert('Cannot add this product to cart');
      return;
    }

    setAdding(true);
    try {
      await addItem(product.productId, quantity);
      setAddSuccess(true);
      
      // Show success for 2 seconds
      setTimeout(() => {
        setAddSuccess(false);
        onClose(); // Close modal after adding
      }, 1500);
    } catch (error: any) {
      alert(error.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const maxStock = product.maxStock || 99;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-content">
          <div className="modal-left">
            <div className="modal-thumbs">
              <img
                src={product.img}
                alt={product.name}
                className={mainImage === product.img ? "active" : ""}
                onClick={() => setMainImage(product.img)}
              />
              <img
                src={product.hoverImg}
                alt={product.name}
                className={mainImage === product.hoverImg ? "active" : ""}
                onClick={() => setMainImage(product.hoverImg)}
              />
            </div>
            <div className="modal-main">
              <img src={mainImage} alt={product.name} />
            </div>
          </div>

          <div className="modal-right">
            <h2 className="modal-artist">{product.artist}</h2>
            <Link href="/stories" className="artist-story-btn">
              <i>Artist Story Available</i>
            </Link>
            <h3 className="modal-product-name">{product.name}</h3>
            <p className="modal-price">{product.price}</p>
            <div className="modal-divider"></div>

            <p className="modal-quantity-label">QUANTITY</p>
            <div className="modal-quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                disabled={quantity >= maxStock}
              >
                +
              </button>
            </div>

            <p className="modal-review-title">CUSTOMER REVIEWS</p>
            <div className="reviews-section">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={24}
                    style={{ cursor: "pointer" }}
                    color={star <= (hover || rating) ? "#FFD700" : "#e4e5e9"}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(rating)}
                  />
                ))}
              </div>
              <p>{reviews > 0 ? `${reviews} review(s)` : "No reviews yet"}</p>
            </div>

            {/* Action buttons container */}
            <div className="modal-action-buttons">
              {/* Wishlist button */}
              {onToggleWishlist && (
                <button 
                  className="modal-wishlist-btn-inline"
                  onClick={onToggleWishlist}
                  aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isInWishlist ? (
                    <FaHeart style={{ color: '#e74c3c' }} />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              )}

              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={adding || !product.productId || addSuccess}
                style={{
                  backgroundColor: addSuccess ? '#10b981' : undefined,
                  cursor: (adding || !product.productId) ? 'not-allowed' : 'pointer',
                  opacity: (adding || !product.productId) ? 0.6 : 1
                }}
              >
                {adding ? 'Adding...' : addSuccess ? '✓ Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM: ABOUT SECTION */}
        <div className="modal-about">
          <h3 className="about-title">About the Product</h3>
          <div className="modal-divider-about"></div>

          <div className="about-box">
            <p>
              Numbered from the edition of 295, with the accompanying
              certificate of authenticity, on Hahnemühle 350gsm Museum Etching
              wove paper, with full margins, sheet 700 x 560mm (27 1/2 x 22in)
              (unframed).
              <br />
              Images are not representative of the actual work or condition; for
              full information on the condition of this work, request a
              condition report by emailing <b>specialist@artsy.net</b>.
            </p>
          </div>

          <div className="about-box">
            <p>
              <b>Materials:</b> Hahnemühle 350gsm Museum Etching paper
            </p>
            <p>
              <b>Size:</b> 27 3/5 × 22 in | 70 × 56 cm
            </p>
            <p>
              <b>Medium:</b> Digital pigment print in colours
            </p>
            <p>
              <b>Type:</b> Print
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
