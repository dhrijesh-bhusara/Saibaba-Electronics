import { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import AiAssistant from './components/AiAssistant';
import MyOrders from './pages/MyOrders';
import TrackOrder from './pages/TrackOrder';
import About from './pages/About';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import StoreLocator from './pages/StoreLocator';
import EmiOptions from './pages/EmiOptions';
import Wishlist from './pages/Wishlist';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';

// Supabase

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError
      ? <div className="container" role="alert"><h2>Something went wrong.</h2><p>Please refresh and try again.</p></div>
      : this.props.children;
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function App() {
  const [theme, setTheme] = useState('light');
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleCategoryClick = (categorySlug) => {
    setSelectedCategory((prev) => {
      const nextValue = prev === categorySlug ? null : categorySlug;
      if (nextValue === null) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
      return nextValue;
    });
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <div className="app-container">
              <Navbar
                theme={theme}
                toggleTheme={toggleTheme}
                onCartOpen={() => setCartOpen(true)}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategoryClick}
              />
              <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
              <AuthModal />
              <AiAssistant />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home selectedCategory={selectedCategory} onCategorySelect={handleCategoryClick} />} />
                  <Route path="/category/:categorySlug" element={<CategoryPage />} />
                  <Route path="/product/:slug" element={<ProductDetails />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                  <Route path="/orders" element={<MyOrders />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Route>
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/store-locator" element={<StoreLocator />} />
                  <Route path="/emi-options" element={<EmiOptions />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;