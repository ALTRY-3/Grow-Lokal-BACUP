/**
 * Badge Atom Component
 * Small label/tag element
 */

import React from "react";
import { BadgeProps } from "@/interfaces/atomic.interface";
import "./Badge.css";

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  size = "medium",
  className = "",
}) => {
  return (
    <span
      className={`
        atomic-badge
        atomic-badge--${variant}
        atomic-badge--${size}
        ${className}
      `.trim()}
    >
      {label}
    </span>
  );
};

export default Badge;
