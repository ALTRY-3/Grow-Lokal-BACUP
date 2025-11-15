/**
 * Form Organism Component
 * Complex form combining FormField molecules with submission logic
 */

"use client";

import React, { useState } from "react";
import { FormField, Card } from "@/components/molecules";
import { Button } from "@/components/atoms";
import { FormProps, FormFieldData } from "@/interfaces/atomic.interface";
import "./Form.css";

export const Form: React.FC<FormProps> = ({
  title,
  fields,
  onSubmit,
  submitButtonLabel = "Submit",
  className = "",
  loading = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: FormFieldData, value: any): string => {
    if (field.validation?.required && !value) {
      return "This field is required";
    }

    if (
      field.validation?.minLength &&
      value.length < field.validation.minLength
    ) {
      return `Minimum length is ${field.validation.minLength}`;
    }

    if (
      field.validation?.maxLength &&
      value.length > field.validation.maxLength
    ) {
      return `Maximum length is ${field.validation.maxLength}`;
    }

    if (field.validation?.pattern && !field.validation.pattern.test(value)) {
      return "Invalid format";
    }

    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <Card className={`atomic-form ${className}`.trim()}>
      {title && <h2 className="atomic-form__title">{title}</h2>}

      <form onSubmit={handleSubmit} className="atomic-form__content">
        {fields.map((field) => (
          <FormField
            key={field.name}
            label={field.label}
            required={field.validation?.required}
            error={errors[field.name]}
            inputProps={{
              id: field.name,
              name: field.name,
              type: field.type,
              value: formData[field.name],
              onChange: handleChange,
              placeholder: field.placeholder,
            }}
          />
        ))}

        <Button
          label={submitButtonLabel}
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
          className="atomic-form__submit"
        >
          {loading ? "Loading..." : submitButtonLabel}
        </Button>
      </form>
    </Card>
  );
};

export default Form;
