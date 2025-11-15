/**
 * Button Atom Component
 * Smallest reusable UI element - a clickable button
 */

import React from "react";
import { ButtonProps } from "@/interfaces/atomic.interface";
import "./Button.css";

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  type = "button",
  className = "",
  children,
  icon,
  fullWidth = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        atomic-button
        atomic-button--${variant}
        atomic-button--${size}
        ${fullWidth ? "atomic-button--fullwidth" : ""}
        ${disabled ? "atomic-button--disabled" : ""}
        ${className}
      `.trim()}
      aria-label={label}
    >
      {icon && <span className="atomic-button__icon">{icon}</span>}
      {children || label}
    </button>
  );
};

export default Button;
