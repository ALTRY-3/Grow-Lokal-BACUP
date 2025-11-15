/**
 * Input Atom Component
 * Form input field element
 */

import React from "react";
import { InputProps } from "@/interfaces/atomic.interface";
import "./Input.css";

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  required = false,
  className = "",
  name,
  id,
  error,
  pattern,
}) => {
  return (
    <div className="atomic-input-wrapper">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        pattern={pattern}
        className={`
          atomic-input
          ${error ? "atomic-input--error" : ""}
          ${disabled ? "atomic-input--disabled" : ""}
          ${className}
        `.trim()}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className="atomic-input__error">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
