/**
 * FormField Molecule Component
 * Combines Label + Input atoms into a reusable form field
 */

import React from "react";
import { Label, Input } from "@/components/atoms";
import { FormFieldProps } from "@/interfaces/atomic.interface";
import "./FormField.css";

export const FormField: React.FC<FormFieldProps> = ({
  label,
  inputProps,
  required = false,
  error,
  helpText,
  className = "",
}) => {
  return (
    <div className={`atomic-form-field ${className}`.trim()}>
      <Label
        label={label}
        required={required}
        htmlFor={inputProps.id}
        className="atomic-form-field__label"
      />
      <Input
        {...inputProps}
        error={error}
        className="atomic-form-field__input"
      />
      {helpText && !error && (
        <span className="atomic-form-field__help">{helpText}</span>
      )}
    </div>
  );
};

export default FormField;
