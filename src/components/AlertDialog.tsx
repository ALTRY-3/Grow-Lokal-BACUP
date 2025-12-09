"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import "./AlertDialog.css";

interface AlertDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: "info" | "warning" | "error" | "success";
  onClose: () => void;
  autoCloseDuration?: number; // in ms, 0 = no auto-close
}

export default function AlertDialog({
  isOpen,
  title,
  message,
  type = "info",
  onClose,
  autoCloseDuration = 3000,
}: AlertDialogProps) {
  useEffect(() => {
    if (!isOpen || autoCloseDuration === 0) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [isOpen, autoCloseDuration, onClose]);

  if (!isOpen) return null;

  const iconMap = {
    info: "ℹ️",
    warning: "⚠️",
    error: "❌",
    success: "✓",
  };

  return (
    <div className="alert-dialog-overlay" onClick={onClose}>
      <div
        className="alert-dialog-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`alert-dialog alert-${type}`}>
          <div className="alert-header">
            <div className="alert-icon">{iconMap[type]}</div>
            {title && <h3 className="alert-title">{title}</h3>}
            <button
              className="alert-close-btn"
              onClick={onClose}
              aria-label="Close alert"
            >
              <X size={20} />
            </button>
          </div>

          <div className="alert-content">
            <p className="alert-message">{message}</p>
          </div>

          <div className="alert-footer">
            <button className="alert-btn alert-btn-primary" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
