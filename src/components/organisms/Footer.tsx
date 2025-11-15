/**
 * Footer Organism Component
 * Application footer
 */

"use client";

import React from "react";
import Link from "next/link";
import { FooterProps } from "@/interfaces/atomic.interface";
import "./Footer.css";

export const Footer: React.FC<FooterProps> = ({
  companyName = "Grow Lokal",
  links,
  socialLinks,
  contactInfo,
  className = "",
}) => {
  return (
    <footer className={`atomic-footer ${className}`.trim()}>
      <div className="atomic-footer__container">
        {/* Company Info */}
        <div className="atomic-footer__section">
          <h3 className="atomic-footer__title">{companyName}</h3>
          {contactInfo && (
            <div className="atomic-footer__contact">
              {contactInfo.email && (
                <p className="atomic-footer__contact-item">
                  Email:{" "}
                  <a href={`mailto:${contactInfo.email}`}>
                    {contactInfo.email}
                  </a>
                </p>
              )}
              {contactInfo.phone && (
                <p className="atomic-footer__contact-item">
                  Phone:{" "}
                  <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                </p>
              )}
              {contactInfo.address && (
                <p className="atomic-footer__contact-item">
                  Address: {contactInfo.address}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Links */}
        {links && links.length > 0 && (
          <div className="atomic-footer__section">
            <h4 className="atomic-footer__section-title">Quick Links</h4>
            <nav className="atomic-footer__links">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="atomic-footer__link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Social Links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="atomic-footer__section">
            <h4 className="atomic-footer__section-title">Follow Us</h4>
            <div className="atomic-footer__socials">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="atomic-footer__social"
                  aria-label={social.platform}
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Copyright */}
      <div className="atomic-footer__copyright">
        <p>
          &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
