/**
 * Layout Template Component
 * Main layout wrapper with header and footer
 */

"use client";

import React from "react";
import { Header, Footer } from "@/components/organisms";
import { LayoutProps } from "@/interfaces/atomic.interface";
import "./Layout.css";

export const Layout: React.FC<LayoutProps> = ({
  children,
  header,
  footer,
  sidebar,
  className = "",
}) => {
  return (
    <div className={`atomic-layout ${className}`.trim()}>
      {header && (
        <Header
          title={header.title}
          logo={header.logo}
          navigation={header.navigation}
          className="atomic-layout__header"
        />
      )}

      <div className="atomic-layout__main">
        {sidebar && <aside className="atomic-layout__sidebar">{sidebar}</aside>}

        <main className="atomic-layout__content">{children}</main>
      </div>

      {footer && (
        <Footer
          companyName={footer.companyName}
          links={footer.links}
          socialLinks={footer.socialLinks}
          contactInfo={footer.contactInfo}
          className="atomic-layout__footer"
        />
      )}
    </div>
  );
};

export default Layout;
