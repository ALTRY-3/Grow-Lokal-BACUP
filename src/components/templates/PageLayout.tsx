/**
 * PageLayout Template Component
 * Layout for individual pages with breadcrumbs and title
 */

"use client";

import React from "react";
import { PageLayoutProps } from "@/interfaces/atomic.interface";
import "./PageLayout.css";

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  children,
  breadcrumbs,
  sidebar,
  className = "",
}) => {
  return (
    <div className={`atomic-page-layout ${className}`.trim()}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          className="atomic-page-layout__breadcrumbs"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {crumb.href ? (
                <a href={crumb.href} className="atomic-page-layout__breadcrumb">
                  {crumb.label}
                </a>
              ) : (
                <span className="atomic-page-layout__breadcrumb atomic-page-layout__breadcrumb--current">
                  {crumb.label}
                </span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="atomic-page-layout__breadcrumb-separator">
                  /
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header */}
      <div className="atomic-page-layout__header">
        <h1 className="atomic-page-layout__title">{title}</h1>
        {subtitle && <p className="atomic-page-layout__subtitle">{subtitle}</p>}
      </div>

      {/* Content */}
      <div className="atomic-page-layout__container">
        {sidebar && (
          <aside className="atomic-page-layout__sidebar">{sidebar}</aside>
        )}

        <main className="atomic-page-layout__content">{children}</main>
      </div>
    </div>
  );
};

export default PageLayout;
