"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FaBell, 
  FaShoppingCart, 
  FaUserCircle, 
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaSignOutAlt,
  FaChevronRight,
  FaTrash
} from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import ConfirmDialog from "./ConfirmDialog";
import "./Navbar.css";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'all' | 'orders' | 'messages'>('all');
  const [userProfilePic, setUserProfilePic] = useState<string>('/default-profile.jpg');

  const { data: session } = useSession();
  const router = useRouter();
  const { items, subtotal, itemCount, fetchCart, removeItem, clearLocalCart } = useCartStore();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  // Fetch cart on mount and when session changes
  useEffect(() => {
    if (session?.user) {
      // User is logged in, fetch their cart
      fetchCart();
    } else {
      // User is logged out, clear local cart only (don't touch database)
      clearLocalCart();
    }
  }, [session?.user, fetchCart, clearLocalCart]);

  // Fetch user profile picture
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const data = await response.json();
            if (data.data?.profilePicture) {
              setUserProfilePic(data.data.profilePicture);
            } else if (session.user.image) {
              setUserProfilePic(session.user.image);
            }
          } else if (session.user.image) {
            setUserProfilePic(session.user.image);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          if (session.user.image) {
            setUserProfilePic(session.user.image);
          }
        }
      } else {
        setUserProfilePic('/default-profile.jpg');
      }
    };

    fetchUserProfile();
  }, [session?.user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCart(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setShowProfile(false);
    setShowLogoutDialog(true);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Sign out using NextAuth
      await signOut({ 
        redirect: true,
        callbackUrl: '/login'
      });
      
      // Clear any local storage items
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <div className="marketplace-page">
      <header className="navbar">
        <div className="left-content">
          <div className="logo-section">
            <div className="logo-icon">
              <img
                src="/logo.svg"
                alt="GrowLokal Logo"
                className="logo-image"
              />
            </div>
            <span className="logo-text">GROWLOKAL</span>
          </div>
        </div>

        <div className="right-content">
          <div className="icon-wrapper" ref={notifRef}>
            <FaBell
              className="nav-icon"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {showNotifications && (
              <div className="dropdown dropdown-notifications">
                <div className="notification-header">
                  <h3 className="notification-title">Notifications</h3>
                  <button className="mark-all-read-btn">Mark all as read</button>
                </div>
                <div className="notification-tabs">
                  <button 
                    className={`tab ${notificationTab === 'all' ? 'active' : ''}`}
                    onClick={() => setNotificationTab('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`tab ${notificationTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setNotificationTab('orders')}
                  >
                    Orders
                  </button>
                  <button 
                    className={`tab ${notificationTab === 'messages' ? 'active' : ''}`}
                    onClick={() => setNotificationTab('messages')}
                  >
                    Messages
                  </button>
                </div>
                <div className="notification-list">
                  <div className="notification-empty">
                    <div className="empty-icon">
                      <FaBell />
                    </div>
                    <p className="empty-title">No notifications yet</p>
                    <p className="empty-subtitle">We'll notify you when something arrives</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="icon-wrapper" ref={cartRef}>
            <FaShoppingCart
              className="nav-icon"
              onClick={() => setShowCart(!showCart)}
            />
            {itemCount > 0 && (
              <span className="cart-badge">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
            {showCart && (
              <div className="dropdown dropdown-cart">
                <div className="cart-header">
                  <h3 className="cart-title">Shopping Cart</h3>
                  <span className="cart-count">{itemCount} items</span>
                </div>

                {items.length === 0 ? (
                  <div className="empty-cart-container">
                    <div className="empty-cart-icon">
                      <FaShoppingCart />
                    </div>
                    <p className="empty-cart-title">Your cart is empty</p>
                    <p className="empty-cart-subtitle">Add items to get started</p>
                    <button 
                      className="btn-browse"
                      onClick={() => {
                        setShowCart(false);
                        router.push('/marketplace');
                      }}
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="cart-items-list">
                      {items.map((item) => (
                        <div key={item.productId} className="cart-item-card">
                          <div className="cart-item-image-wrapper">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="cart-item-image"
                            />
                            <span className="cart-item-quantity-badge">{item.quantity}</span>
                          </div>
                          <div className="cart-item-details">
                            <p className="cart-item-name">{item.name}</p>
                            <div className="cart-item-meta">
                              <span className="cart-item-price">₱{item.price.toFixed(2)}</span>
                              <span className="cart-item-separator">×</span>
                              <span className="cart-item-qty">{item.quantity}</span>
                            </div>
                            <p className="cart-item-total">₱{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="cart-item-remove-btn"
                            title="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="cart-summary">
                      <div className="summary-row">
                        <span className="summary-label">Subtotal</span>
                        <span className="summary-value">₱{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Shipping</span>
                        <span className="summary-value text-free">FREE</span>
                      </div>
                      <div className="summary-row summary-total">
                        <span className="summary-label">Total</span>
                        <span className="summary-value">₱{subtotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="cart-actions">
                      <button 
                        className="btn-secondary"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowCart(false);
                          router.push('/cart');
                        }}
                      >
                        View Full Cart
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowCart(false);
                          setTimeout(() => {
                            router.push('/checkout');
                          }, 100);
                        }}
                      >
                        Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="icon-wrapper" ref={profileRef}>
            <FaUserCircle
              className="nav-icon"
              onClick={() => setShowProfile(!showProfile)}
            />
            {showProfile && (
              <div className="dropdown dropdown-profile">
                <div className="profile-user-section">
                  <div className="profile-avatar">
                    <img 
                      src={userProfilePic} 
                      alt="Profile"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-profile.jpg';
                      }}
                    />
                  </div>
                  <div className="profile-user-info">
                    <p className="profile-user-name">{session?.user?.name || 'User'}</p>
                    <p className="profile-user-email">{session?.user?.email || ''}</p>
                  </div>
                </div>
                
                <nav className="profile-menu-nav">
                  <button 
                    className="profile-menu-item"
                    onClick={() => {
                      setShowProfile(false);
                      router.push('/profile');
                    }}
                  >
                    <FaUser className="menu-icon" />
                    <span className="menu-text">My Account</span>
                    <FaChevronRight className="menu-arrow" />
                  </button>
                  
                  <button 
                    className="profile-menu-item"
                    onClick={() => {
                      setShowProfile(false);
                      router.push('/orders');
                    }}
                  >
                    <FaShoppingBag className="menu-icon" />
                    <span className="menu-text">My Orders</span>
                    <FaChevronRight className="menu-arrow" />
                  </button>
                  
                  <button 
                    className="profile-menu-item"
                    onClick={() => {
                      setShowProfile(false);
                      router.push('/wishlist');
                    }}
                  >
                    <FaHeart className="menu-icon" />
                    <span className="menu-text">Wishlist</span>
                    <FaChevronRight className="menu-arrow" />
                  </button>
                </nav>
                
                <div className="profile-logout-section">
                  <button 
                    className="profile-logout-btn"
                    onClick={handleLogoutClick}
                  >
                    <FaSignOutAlt className="logout-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="sub-navbar">
        <ul className="sub-nav-links">
          <li>
            <Link href="/marketplace">Marketplace</Link>
          </li>
          <li>
            <Link href="/stories">Stories</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
          <li>
            <Link href="/map">Map</Link>
          </li>
        </ul>
      </nav>

      <div className="nav-strip">
        <img
          src="/left-panel.svg"
          alt="Decorative strip"
          className="nav-strip-image"
        />
      </div>

      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will be redirected to the login page."
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
