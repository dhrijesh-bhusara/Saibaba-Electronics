import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, ShoppingCart, Heart, Search, Menu, X, Phone, MapPin, ChevronDown } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-bar-left">
            <span className="contact-item"><Phone size={14} /> +91 98765 43210</span>
            <span className="contact-item"><MapPin size={14} /> Find a Store</span>
          </div>
          <div className="top-bar-right">
            <span className="offer-text">🔥 Festival Sale: Up to 50% Off + No Cost EMI</span>
            <div className="top-bar-links">
              <Link to="/track">Track Order</Link>
              <Link to="/support">Support</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="main-navbar">
        <div className="container nav-content">
          {/* Logo */}
          <Link to="/" className="brand-logo">
            <span className="logo-sai">Sai Baba</span>
            <span className="logo-electronics">Electronics</span>
          </Link>

          {/* Search Bar */}
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search for TVs, Smartphones, Appliances..." 
              className="search-input"
            />
            <button className="search-btn">
              <Search size={20} />
            </button>
          </div>

          {/* Nav Actions */}
          <div className="nav-actions">
            <button onClick={toggleTheme} className="action-icon" aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>
            <Link to="/wishlist" className="action-icon with-badge">
              <Heart size={22} />
              <span className="badge-count">2</span>
            </Link>
            <Link to="/cart" className="action-icon with-badge">
              <ShoppingCart size={22} />
              <span className="badge-count">1</span>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Categories Bar */}
      <div className="categories-bar">
        <div className="container categories-content">
          <div className="category-item has-dropdown">
            Mobile & Accessories <ChevronDown size={14} />
          </div>
          <div className="category-item has-dropdown">
            Television <ChevronDown size={14} />
          </div>
          <div className="category-item has-dropdown">
            Home Appliances <ChevronDown size={14} />
          </div>
          <div className="category-item has-dropdown">
            Laptops & PCs <ChevronDown size={14} />
          </div>
          <div className="category-item">
            Audio & Sound
          </div>
          <div className="category-item">
            Smart Home
          </div>
          <div className="category-item highlight">
            Festival Offers %
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search">
            <input type="text" placeholder="Search products..." />
          </div>
          <div className="mobile-nav-links">
            <Link to="/mobiles">Mobile & Accessories</Link>
            <Link to="/tv">Television</Link>
            <Link to="/appliances">Home Appliances</Link>
            <Link to="/laptops">Laptops & PCs</Link>
            <Link to="/offers" className="highlight-text">Festival Offers</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
