/**
 * ProductCard Organism Component
 * Complex product display component for the marketplace
 */

"use client";

import React from "react";
import { Card } from "@/components/molecules";
import { Button, Badge } from "@/components/atoms";
import { ProductCardProps } from "@/interfaces/atomic.interface";
import "./ProductCard.css";

export const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  name,
  price,
  image,
  artist,
  craftType,
  category,
  rating,
  inStock = true,
  onAddToCart,
  onViewDetails,
  isInWishlist = false,
  onToggleWishlist,
}) => {
  return (
    <Card
      image={image}
      className="atomic-product-card"
      header={
        <div className="atomic-product-card__header">
          <Badge label={category} variant="primary" size="small" />
          {onToggleWishlist && (
            <button
              onClick={onToggleWishlist}
              className={`atomic-product-card__wishlist ${
                isInWishlist ? "atomic-product-card__wishlist--active" : ""
              }`.trim()}
              aria-label="Toggle wishlist"
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              ❤️
            </button>
          )}
        </div>
      }
    >
      <h3 className="atomic-product-card__name">{name}</h3>
      <p className="atomic-product-card__artist">{artist}</p>

      <div className="atomic-product-card__meta">
        {craftType && (
          <Badge label={craftType} variant="secondary" size="small" />
        )}
      </div>

      {rating && (
        <div className="atomic-product-card__rating">
          <span className="atomic-product-card__stars">
            {"⭐".repeat(Math.round(rating))}
          </span>
          <span className="atomic-product-card__rating-value">{rating}</span>
        </div>
      )}

      <div className="atomic-product-card__footer">
        <span className="atomic-product-card__price">{price}</span>
        <div className="atomic-product-card__actions">
          {onViewDetails && (
            <Button
              label="Details"
              variant="secondary"
              size="small"
              onClick={onViewDetails}
            />
          )}
          {onAddToCart && (
            <Button
              label={inStock ? "Add to Cart" : "Out of Stock"}
              variant={inStock ? "primary" : "secondary"}
              size="small"
              onClick={onAddToCart}
              disabled={!inStock}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
