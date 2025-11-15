/**
 * Label Atom Component
 * Form label element
 */

import React from "react";
import { LabelProps } from "@/interfaces/atomic.interface";
import "./Label.css";

export const Label: React.FC<LabelProps> = ({
  htmlFor,
  label,
  required = false,
  className = "",
  children,
}) => {
  return (
    <label htmlFor={htmlFor} className={`atomic-label ${className}`.trim()}>
      {label}
      {required && <span className="atomic-label__required">*</span>}
      {children}
    </label>
  );
};

export default Label;
