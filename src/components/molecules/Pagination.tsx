/**
 * Pagination Molecule Component
 * Navigation component for paginated content
 */

import React from "react";
import { PaginationProps } from "@/interfaces/atomic.interface";
import { Button } from "@/components/atoms";
import "./Pagination.css";

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const pages = [];
  const maxPagesToShow = 5;

  // Calculate range of pages to show
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  // Add first page and ellipsis if needed
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push("...");
    }
  }

  // Add page numbers
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add last page and ellipsis if needed
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push("...");
    }
    pages.push(totalPages);
  }

  return (
    <nav
      className={`atomic-pagination ${className}`.trim()}
      aria-label="Pagination"
    >
      <Button
        label="Previous"
        variant="secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="atomic-pagination__button"
      />

      <div className="atomic-pagination__pages">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="atomic-pagination__ellipsis"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`
                atomic-pagination__page
                ${page === currentPage ? "atomic-pagination__page--active" : ""}
              `.trim()}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      <Button
        label="Next"
        variant="secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="atomic-pagination__button"
      />
    </nav>
  );
};

export default Pagination;
