/**
 * Icon Atom Component
 * Icon element
 */

import React from "react";
import { IconProps } from "@/interfaces/atomic.interface";
import "./Icon.css";

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  onClick,
}) => {
  return (
    <span
      className={`atomic-icon ${className}`.trim()}
      style={{
        width: size,
        height: size,
        color: color,
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
      role={onClick ? "button" : "img"}
      aria-label={name}
    >
      {/* Icon content would be rendered here */}
      {name}
    </span>
  );
};

export default Icon;
