/**
 * Card Molecule Component
 * Reusable card container for displaying content
 */

import React from "react";
import { CardProps } from "@/interfaces/atomic.interface";
import "./Card.css";

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  image,
  children,
  onClick,
  className = "",
  footer,
  header,
}) => {
  return (
    <div
      className={`atomic-card ${
        onClick ? "atomic-card--clickable" : ""
      } ${className}`.trim()}
      onClick={onClick}
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : -1}
    >
      {header && <div className="atomic-card__header">{header}</div>}

      {image && (
        <img
          src={image}
          alt={title || "Card image"}
          className="atomic-card__image"
        />
      )}

      <div className="atomic-card__content">
        {title && <h3 className="atomic-card__title">{title}</h3>}
        {subtitle && <p className="atomic-card__subtitle">{subtitle}</p>}
        {children && <div className="atomic-card__body">{children}</div>}
      </div>

      {footer && <div className="atomic-card__footer">{footer}</div>}
    </div>
  );
};

export default Card;
