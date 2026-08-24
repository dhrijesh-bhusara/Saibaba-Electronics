import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, ShoppingCart, Heart, Search, Menu, X, Phone, MapPin, ChevronDown, User, LogOut } from 'lucide-react';
import './Navbar.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Navbar = ({ theme, toggleTheme, onCartOpen, selectedCategory, onCategorySelect }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const { cartCount, wishlistCount } = useCart();
  const { user, signOut, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('categories').select('*').order('name').then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (!supabase || search.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      const { data } = await supabase.from('products').select('*').ilike('title', `%${search.trim()}%`).limit(6);
      setSearchResults(data || []);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const categoryNames = categories.length ? categories : [
    { id: 'mobiles', slug: 'mobiles', name: 'Mobile & Accessories' },
    { id: 'televisions', slug: 'televisions', name: 'Televisions' },
    { id: 'appliances', slug: 'appliances', name: 'Home Appliances' },
    { id: 'laptops', slug: 'laptops', name: 'Laptops & PCs' },
    { id: 'audio', slug: 'audio', name: 'Audio & Sound' },
  ];

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-bar-left">
            <span className="contact-item"><Phone size={14} /> +91 98765 43210</span>
            <Link to="/store-locator" className="contact-item"><MapPin size={14} /> Find a Store</Link>
          </div>
          <div className="top-bar-right">
            <div className="top-bar-links">
              <Link to="/track-order">Track Order</Link>
              <Link to="/contact">Support</Link>
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
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button className="search-btn">
              <Search size={20} />
            </button>
            {searchResults.length > 0 && <div className="search-results">
              {searchResults.map((product) => <Link key={product.id} to={`/product/${product.slug || product.id}`} onClick={() => setSearch('')}>
                <span>{product.title}</span><strong>₹{Number(product.price || 0).toLocaleString('en-IN')}</strong>
              </Link>)}
            </div>}
          </div>

          {/* Nav Actions */}
          <div className="nav-actions">
            <button onClick={toggleTheme} className="action-icon" aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>
            <Link to="/wishlist" className="action-icon with-badge">
              <Heart size={22} />
              {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
            </Link>
            <button onClick={onCartOpen} className="action-icon with-badge" aria-label="Open cart">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </button>
            <div className="account-control">
              <button className="action-icon account-button" aria-label={user ? 'Account menu' : 'Sign in'} onClick={() => user ? setAccountOpen(!accountOpen) : openAuthModal()}>
                {user ? <span className="user-avatar">{(user.user_metadata?.full_name || user.email || 'U').slice(0, 1).toUpperCase()}</span> : <><User size={22} /><span className="account-label">Sign In</span></>}
              </button>
              {accountOpen && user && <div className="account-menu"><strong>{user.user_metadata?.full_name || 'My Account'}</strong><span>{user.email}</span><Link to="/orders" onClick={() => setAccountOpen(false)}>My Orders</Link><button onClick={signOut}><LogOut size={16} /> Sign out</button></div>}
            </div>
            
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
          {categoryNames.map((category) => {
            const slug = category.slug || category.id;
            const isActive = selectedCategory === slug;

            return (
              <button
                key={slug}
                type="button"
                className={`category-item has-dropdown ${isActive ? 'active' : ''}`}
                onClick={() => onCategorySelect(slug)}
                aria-pressed={isActive}
              >
                {category.name || category.title} <ChevronDown size={14} />
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search">
            <input type="text" placeholder="Search products..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className="mobile-nav-links">
            <Link to="/mobiles">Mobile & Accessories</Link>
            <Link to="/tv">Television</Link>
            <Link to="/appliances">Home Appliances</Link>
            <Link to="/laptops">Laptops & PCs</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
