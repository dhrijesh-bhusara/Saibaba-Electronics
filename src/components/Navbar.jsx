import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, ShoppingCart, Heart, Search, Menu, X, Phone, MapPin, User, LogOut } from 'lucide-react';
import './Navbar.css';
import MegaMenu from './MegaMenu';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const defaultCategories = [
  { id: 'mobiles', slug: 'mobiles', name: 'Mobile & Accessories' },
  { id: 'televisions', slug: 'televisions', name: 'Televisions' },
  { id: 'appliances', slug: 'appliances', name: 'Home Appliances' },
  { id: 'laptops', slug: 'laptops', name: 'Laptops & PCs' },
  { id: 'audio', slug: 'audio', name: 'Audio & Sound' },
];

const Navbar = ({ theme, toggleTheme, onCartOpen, selectedCategory, onCategorySelect }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, wishlistCount } = useCart();
  const { user, isAdmin, signOut, openAuthModal } = useAuth();
  const menuRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const handleCategoryTabClick = (event, categorySlug) => {
    if (selectedCategory === categorySlug) {
      event.preventDefault();
      onCategorySelect?.(categorySlug);
      navigate('/');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    onCategorySelect?.(categorySlug);
  };

  const openMegaMenu = () => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
    }
    setMegaMenuOpen(true);
  };

  const closeMegaMenu = () => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = window.setTimeout(() => {
      setMegaMenuOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMegaMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMegaMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('categories').select('*').order('name').then(({ data }) => setCategories(data?.length ? data : defaultCategories));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (!supabase || search.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      const { data } = await supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${search.trim()}%,category_slug.ilike.%${search.trim()}%`)
        .limit(6);

      setSearchResults(data || []);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const categoryNames = categories.length ? categories : defaultCategories;

  const currentCategory = (() => {
    const match = location.pathname.match(/^\/category\/([^/?]+)/);
    return match ? match[1] : selectedCategory;
  })();

  return (
    <>
      <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
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

        <nav className="main-navbar">
          <div className="container nav-content">
            <Link to="/" className="brand-logo">
              <span className="logo-sai">Sai Baba</span>
              <span className="logo-electronics">Electronics</span>
            </Link>

            <div
              ref={menuRef}
              className="mega-menu-wrapper"
              onMouseEnter={openMegaMenu}
              onMouseLeave={closeMegaMenu}
            >
              <button
                type="button"
                className="menu-toggle"
                onClick={() => setMegaMenuOpen((prev) => !prev)}
                aria-expanded={megaMenuOpen}
              >
                <Menu size={18} />
                Menu / All Categories
              </button>

              <MegaMenu open={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
            </div>

            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search TVs, mobiles, appliances..."
                className="search-input"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((product) => (
                    <Link key={product.id} to={`/product/${product.slug || product.id}`} onClick={() => setSearch('')}>
                      <div className="search-result-thumb">
                        <img src={product.image_url || product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80'} alt={product.title || product.name} />
                      </div>
                      <div className="search-result-copy">
                        <span>{product.title || product.name}</span>
                        <small>{product.category_slug || 'Electronics'}</small>
                      </div>
                      <strong>₹{Number(product.price || 0).toLocaleString('en-IN')}</strong>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="nav-actions">
              <button onClick={toggleTheme} className="action-icon" aria-label="Toggle theme">
                {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
              </button>
              <Link to="/wishlist" className="action-icon with-badge" aria-label="Wishlist">
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
                {accountOpen && user && (
                  <div className="account-menu">
                    <strong>{user.user_metadata?.full_name || 'My Account'}</strong>
                    <span>{user.email}</span>
                    <Link to="/orders" onClick={() => setAccountOpen(false)}>My Orders</Link>
                    {isAdmin && <Link className="admin-link-btn" to="/admin" onClick={() => setAccountOpen(false)}>⚙️ Admin Portal</Link>}
                    <button type="button" onClick={signOut}><LogOut size={16} /> Sign out</button>
                  </div>
                )}
              </div>

              <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen((prev) => !prev)} aria-label="Toggle menu">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        <div className="categories-bar">
          <div className="container categories-content">
            {categoryNames.map((category) => {
              const slug = category.slug || category.id;
              const isActive = currentCategory === slug || selectedCategory === slug;

              return (
                <Link
                  key={slug}
                  to={`/category/${slug}`}
                  className={`category-item ${isActive ? 'active' : ''}`}
                  onClick={(event) => handleCategoryTabClick(event, slug)}
                >
                  {category.name || category.title}
                </Link>
              );
            })}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-search">
              <input type="text" placeholder="Search products..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <div className="mobile-nav-links">
              {categoryNames.map((category) => {
                const slug = category.slug || category.id;
                return (
                  <Link key={slug} to={`/category/${slug}`}>
                    {category.name || category.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
