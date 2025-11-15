/**
 * Header Organism Component
 * Application header/navbar
 */

"use client";

import React from "react";
import Link from "next/link";
import { HeaderProps } from "@/interfaces/atomic.interface";
import "./Header.css";

export const Header: React.FC<HeaderProps> = ({
  title,
  logo,
  navigation,
  className = "",
}) => {
  return (
    <header className={`atomic-header ${className}`.trim()}>
      <div className="atomic-header__container">
        {logo && (
          <div className="atomic-header__logo">
            <img src={logo} alt="Logo" className="atomic-header__logo-img" />
          </div>
        )}

        {title && <h1 className="atomic-header__title">{title}</h1>}

        {navigation && navigation.length > 0 && (
          <nav className="atomic-header__nav">
            {navigation.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="atomic-header__nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
