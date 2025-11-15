/**
 * SearchBar Molecule Component
 * Combines Input atom with search functionality
 */

import React from "react";
import { SearchBarProps } from "@/interfaces/atomic.interface";
import "./SearchBar.css";

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  className = "",
  disabled = false,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`atomic-searchbar ${className}`.trim()}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="atomic-searchbar__input"
      />
      {onSearch && (
        <button
          onClick={() => onSearch(value)}
          disabled={disabled}
          className="atomic-searchbar__button"
          aria-label="Search"
        >
          🔍
        </button>
      )}
    </div>
  );
};

export default SearchBar;
