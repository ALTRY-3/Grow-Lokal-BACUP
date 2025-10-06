"use client";

import { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import ImageCarousel from "@/components/ImageCarousel1";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductModal from "@/components/ProductModal";
import { useCartStore } from "@/store/cartStore";
import "./marketplace.css";

// API Product interface
interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  thumbnailUrl: string;
  artistName: string;
  artistId: string;
  averageRating: number;
  totalReviews: number;
  isAvailable: boolean;
  isFeatured: boolean;
}

// Legacy interface for ProductModal compatibility
interface LegacyProduct {
  img: string;
  hoverImg: string;
  name: string;
  artist: string;
  price: string;
  productId?: string;
  maxStock?: number;
}

export default function Marketplace() {
  const [selectedProduct, setSelectedProduct] = useState<LegacyProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  
  // Wishlist state
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  
  // Product state by category
  const [handicrafts, setHandicrafts] = useState<Product[]>([]);
  const [fashion, setFashion] = useState<Product[]>([]);
  const [home, setHome] = useState<Product[]>([]);
  const [food, setFood] = useState<Product[]>([]);
  const [beauty, setBeauty] = useState<Product[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(new Set(JSON.parse(savedWishlist)));
    }
  }, []);

  // Fetch products on mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Fetch suggestions and auto-search with debouncing
  useEffect(() => {
    const fetchSuggestionsAndSearch = async () => {
      const query = searchQuery.trim();
      
      // If empty, clear and reload all products
      if (query.length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
        if (searchActive) {
          setSearchActive(false);
          fetchAllProducts();
        }
        return;
      }

      // Show suggestions for short queries
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        // Fetch suggestions (first 5 for dropdown)
        const suggestionsResponse = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`);
        const suggestionsData = await suggestionsResponse.json();

        if (suggestionsData.success && suggestionsData.data.length > 0) {
          setSuggestions(suggestionsData.data);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }

        // Auto-search for all matching products
        setIsSearching(true);
        setSearchActive(true);
        const searchResponse = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=50`);
        const searchData = await searchResponse.json();

        if (searchData.success) {
          // Group results by category
          const grouped = searchData.data.reduce((acc: any, product: Product) => {
            if (!acc[product.category]) acc[product.category] = [];
            acc[product.category].push(product);
            return acc;
          }, {});

          setHandicrafts(grouped.handicrafts || []);
          setFashion(grouped.fashion || []);
          setHome(grouped.home || []);
          setFood(grouped.food || []);
          setBeauty(grouped.beauty || []);
        } else {
          // No results
          setHandicrafts([]);
          setFashion([]);
          setHome([]);
          setFood([]);
          setBeauty([]);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestionsAndSearch, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products for all categories
      const categories = ['handicrafts', 'fashion', 'home', 'food', 'beauty'];
      const promises = categories.map(category =>
        fetch(`/api/products?category=${category}&limit=8`)
          .then(res => res.json())
      );

      const results = await Promise.all(promises);

      // Check for errors
      results.forEach((result, index) => {
        if (!result.success) {
          throw new Error(`Failed to fetch ${categories[index]} products`);
        }
      });

      // Set products by category
      setHandicrafts(results[0].data || []);
      setFashion(results[1].data || []);
      setHome(results[2].data || []);
      setFood(results[3].data || []);
      setBeauty(results[4].data || []);

    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Toggle wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(Array.from(newWishlist)));
      return newWishlist;
    });
  };

  // Handle search (now mainly for Enter key to close suggestions)
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Close suggestions when user presses Enter
    setShowSuggestions(false);
    
    // The actual search is handled by the useEffect above
    // This just provides immediate feedback for Enter key
  };

  // Clear search and reload all products
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchActive(false);
    setSuggestions([]);
    setShowSuggestions(false);
    fetchAllProducts();
  };

  // Handle suggestion click - Open product modal
  const handleSuggestionClick = (product: Product) => {
    setShowSuggestions(false);
    setSuggestions([]);
    // Open the product modal directly
    handleProductClick(product);
  };

  // Convert API product to legacy format for ProductModal
  const convertToLegacyProduct = (product: Product): LegacyProduct => ({
    img: product.images[0] || product.thumbnailUrl,
    hoverImg: product.images[1] || product.images[0] || product.thumbnailUrl,
    name: product.name,
    artist: product.artistName,
    price: `₱${product.price.toFixed(2)}`,
    productId: product._id,
    maxStock: product.stock,
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(convertToLegacyProduct(product));
  };

  // Loading state with brown spinner
  if (loading && handicrafts.length === 0 && fashion.length === 0 && 
      home.length === 0 && food.length === 0 && beauty.length === 0) {
    return (
      <div className="marketplace-page">
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
          <div style={{ textAlign: 'center' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#AF7928' }}></i>
            <p style={{ marginTop: '20px', color: '#2e3f36', fontSize: '18px', fontWeight: '500' }}>Loading marketplace...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="marketplace-page">
        <Navbar />
        <div className="search-bar-container">
          <div className="search-bar">
            <i className="fas fa-search search-icon"></i>
            <input
              className="search-input"
              type="text"
              placeholder="Search for a product or artist"
            />
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ color: '#e74c3c', fontSize: '1.2rem' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <p>{error}</p>
            <button 
              onClick={fetchAllProducts}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 2rem',
                backgroundColor: '#AF7928',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="marketplace-page">
      <Navbar />

      <div className="search-bar-container">
        <form ref={searchRef} onSubmit={handleSearch} className="search-bar" style={{ position: 'relative' }}>
          {isSearching ? (
            <i className="fas fa-spinner fa-spin search-icon" style={{ color: '#AF7928' }}></i>
          ) : (
            <i className="fas fa-search search-icon"></i>
          )}
          <input
            className="search-input"
            type="text"
            placeholder="Search for a product or artist"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setShowSuggestions(false);
                handleSearch(e);
              }
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            disabled={isSearching}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              style={{
                position: 'absolute',
                right: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                color: '#999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                transition: 'color 0.2s',
                zIndex: 10
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#AF7928'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
            >
              <i className="fas fa-times"></i>
            </button>
          )}

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((product) => (
                <div
                  key={product._id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <img 
                    src={product.images[0] || product.thumbnailUrl} 
                    alt={product.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '4px',
                      objectFit: 'cover',
                      marginRight: '12px'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: 500, 
                      color: '#2E3F36',
                      fontSize: '0.9rem',
                      marginBottom: '2px'
                    }}>
                      {product.name}
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#999' 
                    }}>
                      {product.artistName} • ₱{product.price.toFixed(2)}
                    </div>
                  </div>
                  <i className="fas fa-arrow-right" style={{ color: '#AF7928', fontSize: '0.9rem' }}></i>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

      <div className="carousel-section">
        <ImageCarousel autoSlide={true} slideInterval={3000} />
        <div className="carousel-text">Discover local treasures.</div>
      </div>

      {handicrafts.length > 0 && (
        <div className="category-section">
          <Section
            title="HANDICRAFTS"
            products={handicrafts}
            onProductClick={handleProductClick}
          />
        </div>
      )}
      
      {fashion.length > 0 && (
        <div className="category-section">
          <Section
            title="FASHION"
            products={fashion}
            onProductClick={handleProductClick}
          />
        </div>
      )}
      
      {home.length > 0 && (
        <div className="category-section">
          <Section
            title="HOME"
            products={home}
            onProductClick={handleProductClick}
          />
        </div>
      )}
      
      {food.length > 0 && (
        <div className="category-section">
          <Section
            title="FOOD"
            products={food}
            onProductClick={handleProductClick}
          />
        </div>
      )}
      
      {beauty.length > 0 && (
        <div className="category-section">
          <Section
            title="BEAUTY & WELLNESS"
            products={beauty}
            onProductClick={handleProductClick}
          />
        </div>
      )}

      {/* Search results indicator */}
      {searchActive && !isSearching && (
        <div style={{ 
          textAlign: 'center', 
          padding: '1rem 0', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '0 2rem 1rem'
        }}>
          <p style={{ color: '#666', fontSize: '0.95rem', margin: 0 }}>
            {handicrafts.length + fashion.length + home.length + food.length + beauty.length > 0 ? (
              <>
                Showing {handicrafts.length + fashion.length + home.length + food.length + beauty.length} result(s) for "<b>{searchQuery}</b>"
              </>
            ) : null}
          </p>
        </div>
      )}

      {/* No results message */}
      {!loading && !isSearching && handicrafts.length === 0 && fashion.length === 0 && 
       home.length === 0 && food.length === 0 && beauty.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <i className="fas fa-search" style={{ fontSize: '3rem', color: '#999', marginBottom: '1rem', display: 'block' }}></i>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '0.5rem' }}>
            {searchActive ? `No products found for "${searchQuery}"` : 'No products available'}
          </p>
          {searchActive && (
            <>
              <p style={{ fontSize: '0.95rem', color: '#999', marginBottom: '1.5rem' }}>
                Try searching with different keywords or browse all products
              </p>
              <button 
                onClick={handleClearSearch}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#AF7928',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8D6020'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#AF7928'}
              >
                <i className="fas fa-redo" style={{ marginRight: '0.5rem' }}></i>
                Clear Search & Browse All
              </button>
            </>
          )}
        </div>
      )}

      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isInWishlist={selectedProduct.productId ? wishlist.has(selectedProduct.productId) : false}
          onToggleWishlist={
            selectedProduct.productId
              ? () => toggleWishlist(selectedProduct.productId!)
              : undefined
          }
        />
      )}
    </div>
  );
}

function Section({
  title,
  products,
  onProductClick,
}: {
  title: string;
  products: Product[];
  onProductClick: (product: Product) => void;
}) {
  const { addItem } = useCartStore();
  const [addingProduct, setAddingProduct] = useState<string | null>(null);
  const [successProduct, setSuccessProduct] = useState<string | null>(null);
  const [errorProduct, setErrorProduct] = useState<string | null>(null);

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!product.isAvailable || product.stock === 0) return;
    if (addingProduct === product._id) return; // Prevent double-click
    
    try {
      setAddingProduct(product._id);
      
      await addItem(product._id, 1);
      
      setAddingProduct(null);
      setSuccessProduct(product._id);
      
      setTimeout(() => {
        setSuccessProduct(null);
      }, 1000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setAddingProduct(null);
      setErrorProduct(product._id);
      
      setTimeout(() => {
        setErrorProduct(null);
      }, 2000);
    }
  };

  return (
    <>
      <div className="section-header">
        <div className="section-title">{title}</div>
        <div className="section-subtitle">Discover unique {title.toLowerCase()} from local artisans</div>
      </div>
      <div className="product-grid">
        {products.map((product) => (
            <div className="product-card" key={product._id}>
              <div className="image-container">
              <img
                src={product.images[0] || product.thumbnailUrl}
                alt={product.name}
                className="product-image default"
              />
              <img
                src={product.images[1] || product.images[0] || product.thumbnailUrl}
                alt={product.name}
                className="product-image hover"
              />
              
              {/* Add to cart icon */}
              <button
                className={`add-to-cart-icon ${
                  addingProduct === product._id ? 'loading' : ''
                } ${successProduct === product._id ? 'success' : ''} ${
                  errorProduct === product._id ? 'error' : ''
                }`}
                onClick={(e) => handleAddToCart(product, e)}
                disabled={!product.isAvailable || product.stock === 0 || addingProduct === product._id}
                aria-label="Add to cart"
              >
                {addingProduct === product._id ? (
                  <FaSpinner className="loading-spinner" />
                ) : successProduct === product._id ? (
                  <FaCheck />
                ) : errorProduct === product._id ? (
                  <FaTimes />
                ) : (
                  <FaShoppingCart />
                )}
              </button>
              
              {/* Out of stock overlay */}
              {!product.isAvailable || product.stock === 0 ? (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}>
                  OUT OF STOCK
                </div>
              ) : (
                <button
                  className="view-button"
                  onClick={() => onProductClick(product)}
                >
                  View
                </button>
              )}
              
              {/* Featured badge */}
              {product.isFeatured && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#AF7928',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}>
                  FEATURED
                </div>
              )}
            </div>
            <div className="product-info">
              <div className="product-info-top">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-artist">{product.artistName}</p>
              </div>
              <div className="product-info-bottom">
                <div className="product-price-wrapper">
                  <span className="product-price">₱{product.price.toFixed(2)}</span>
                </div>
                {product.averageRating > 0 && (
                  <div className="product-rating">
                    <i className="fas fa-star"></i>
                    <span className="rating-text">
                      {product.averageRating.toFixed(1)} ({product.totalReviews})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
        }
      </div>
    </>
  );
}
