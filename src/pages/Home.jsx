import { useEffect, useState } from 'react';
import { ShoppingCart, Star, ShieldCheck, Truck, Wrench, CreditCard, ChevronRight, Play, Heart } from 'lucide-react';
import './Home.css';
import heroImg from '../assets/hero_electronics.png';
import tvImg from '../assets/smart_tv.png';
import fridgeImg from '../assets/refrigerator.png';
import phoneImg from '../assets/smartphone.png';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const fallbackImages = [phoneImg, tvImg, fridgeImg, heroImg];
const getImage = (item, index) => item.image_url || item.image || fallbackImages[index % fallbackImages.length];

function LoadingCards() {
  return <div className="grid-4" aria-label="Loading products">{[1, 2, 3, 4].map((item) => <div className="product-card card loading-card" key={item} />)}</div>;
}

const Home = ({ selectedCategory, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategoryProducts, setLoadingCategoryProducts] = useState(false);
  const [dataError, setDataError] = useState('');
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const { user, openAuthModal } = useAuth();

  const handleAddToCart = (product) => {
    if (!user) {
      openAuthModal();
      return;
    }
    addToCart(product);
  };

  const handleWishlistToggle = (product) => {
    if (!user) {
      openAuthModal();
      return;
    }
    toggleWishlist(product);
  };

  useEffect(() => {
    let active = true;
    async function loadData() {
      if (!supabase) {
        setDataError('Store data is not configured yet.');
        setLoadingCategories(false);
        setLoadingProducts(false);
        return;
      }
      const [categoryResult, productResult] = await Promise.all([
        supabase.from('categories').select('*').order('name').limit(8),
        supabase.from('products').select('*').eq('is_trending', true).limit(8),
      ]);
      if (!active) return;
      if (categoryResult.error || productResult.error) setDataError('Some store data could not be loaded.');
      setCategories(categoryResult.data || []);
      setProducts(productResult.data || []);
      setLoadingCategories(false);
      setLoadingProducts(false);
    }
    loadData();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadCategoryResults() {
      if (!selectedCategory) {
        setCategoryProducts([]);
        setLoadingCategoryProducts(false);
        return;
      }

      if (!supabase) {
        setCategoryProducts([]);
        setLoadingCategoryProducts(false);
        return;
      }

      setLoadingCategoryProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_slug', selectedCategory)
        .order('created_at', { ascending: false });

      if (!active) return;
      if (error) {
        setDataError('Some category products could not be loaded.');
      }
      setCategoryProducts(data || []);
      setLoadingCategoryProducts(false);
    }

    loadCategoryResults();
    return () => { active = false; };
  }, [selectedCategory]);

  const isWishlisted = (product) => wishlist.some((item) => item.id === product.id || item.product_id === product.id);
  const activeCategory = categories.find((category) => (category.slug || category.id) === selectedCategory);
  const activeCategoryLabel = activeCategory?.name || selectedCategory?.replace(/-/g, ' ');

  if (selectedCategory) {
    return (
      <div className="home-page category-page-view">
        <section className="section category-filter-section">
          <div className="container">
            <div className="category-filter-header">
              <div>
                <span className="eyebrow">Collection</span>
                <h2>{activeCategoryLabel || 'Selected Category'}</h2>
              </div>
              <button type="button" className="btn btn-outline" onClick={() => onCategorySelect(selectedCategory)}>
                ✕ Clear Filter / View All
              </button>
            </div>

            {dataError && <p role="status">{dataError}</p>}
            {loadingCategoryProducts ? <LoadingCards /> : (
              <div className="grid-4">
                {categoryProducts.map((product, index) => {
                  const id = product.id || product.product_id;
                  const title = product.title || product.name || 'Electronics product';
                  const active = isWishlisted(product);

                  return (
                    <article className="product-card card" key={id}>
                      <button className={`wishlist-button ${active ? 'active' : ''}`} onClick={() => handleWishlistToggle(product)} aria-label={`${active ? 'Remove' : 'Add'} ${title} ${active ? 'from' : 'to'} wishlist`}><Heart size={20} fill={active ? 'currentColor' : 'none'} /></button>
                      {product.discount && <div className="product-badge">{product.discount}% OFF</div>}
                      <div className="product-img"><img src={getImage(product, index)} alt={title} /></div>
                      <div className="product-info">
                        <div className="rating"><Star size={14} className="star-filled" /> {product.rating || 'New'}</div>
                        <h3 className="product-title">{title}</h3>
                        <div className="price-row"><span className="price">₹{Number(product.price || 0).toLocaleString('en-IN')}</span>{product.original_price && <span className="mrp">₹{Number(product.original_price).toLocaleString('en-IN')}</span>}</div>
                        <button className="btn btn-primary w-100" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
            {!loadingCategoryProducts && categoryProducts.length === 0 && <p role="status">No products found in this category.</p>}
          </div>
        </section>
      </div>
    );
  }

  return <div className="home-page">
    <section className="hero-section"><div className="hero-bg"><img src={heroImg} alt="Premium Electronics Showroom" className="hero-img" /><div className="hero-overlay" /></div><div className="container hero-content"><div className="hero-text-content fade-in"><div className="hero-badges"><span className="badge">EMI Available</span><span className="badge badge-outline">Festival Offers</span></div><h1 className="hero-title">Upgrade Your Lifestyle With <span className="gradient-text">Premium Electronics</span></h1><p className="hero-subtitle">Explore top brands, smart appliances, latest gadgets, and unbeatable festival offers - all under one trusted roof.</p><div className="hero-actions"><button className="btn btn-primary btn-lg" onClick={() => document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' })}>Shop Now <ShoppingCart size={20} /></button><button className="btn btn-glass btn-lg">Visit Showroom <ChevronRight size={20} /></button></div><div className="hero-stats"><div className="stat-item"><h4>15k+</h4><p>Happy Customers</p></div><div className="stat-item"><h4>50+</h4><p>Top Brands</p></div><div className="stat-item"><h4>4.9/5</h4><p>Google Rating</p></div></div></div></div></section>
    <section className="trust-bar"><div className="container trust-grid">{[['Genuine Products', '100% Brand Warranty', ShieldCheck], ['Fast Delivery', 'Same day dispatch', Truck], ['Free Installation', 'Expert setup', Wrench], ['Easy EMI', 'No cost options', CreditCard]].map(([title, text, Icon]) => <div className="trust-item" key={title}><Icon className="trust-icon" /><div><h4>{title}</h4><p>{text}</p></div></div>)}</div></section>
    <section className="section categories-section"><div className="container"><div className="section-header"><div className="section-title"><h2>Shop by Category</h2><p>Discover our wide range of premium electronics across top categories.</p></div><button className="btn btn-outline" type="button" onClick={() => onCategorySelect(null)}>View All</button></div>{loadingCategories ? <LoadingCards /> : <div className="categories-grid">{categories.map((category, index) => { const slug = category.slug || category.id; const isActive = selectedCategory === slug; return <button type="button" className={`category-card ${isActive ? 'active' : ''}`} onClick={() => onCategorySelect(slug)} key={slug}><div className="cat-img-wrap"><img src={getImage(category, index)} alt={category.name || category.title} /></div><div className="cat-content"><h3>{category.name || category.title}</h3><p>{category.description || 'Explore our collection'}</p></div></button>; })}</div>}</div></section>
    <section className="offers-section section"><div className="container"><div className="offer-banner"><div className="offer-content"><h2>Grand Festival Sale</h2><p>Up to 50% off on Smart TVs and Home Appliances. Get an extra 10% instant discount with HDFC cards.</p><div className="countdown"><div className="time-box"><span>02</span><small>Days</small></div>:<div className="time-box"><span>14</span><small>Hours</small></div>:<div className="time-box"><span>45</span><small>Mins</small></div></div><button className="btn btn-accent mt-4">Grab Deal Now</button></div><div className="offer-image"><img src={tvImg} alt="Offer product" /></div></div></div></section>
    <section className="section products-section"><div className="container"><div className="section-title"><h2>Trending Now</h2><p>Our most popular electronics right now.</p></div>{dataError && <p role="status">{dataError}</p>}{loadingProducts ? <LoadingCards /> : <div className="grid-4">{products.map((product, index) => { const id = product.id || product.product_id; const title = product.title || product.name || 'Electronics product'; const active = isWishlisted(product); return <article className="product-card card" key={id}><button className={`wishlist-button ${active ? 'active' : ''}`} onClick={() => handleWishlistToggle(product)} aria-label={`${active ? 'Remove' : 'Add'} ${title} ${active ? 'from' : 'to'} wishlist`}><Heart size={20} fill={active ? 'currentColor' : 'none'} /></button>{product.discount && <div className="product-badge">{product.discount}% OFF</div>}<div className="product-img"><img src={getImage(product, index)} alt={title} /></div><div className="product-info"><div className="rating"><Star size={14} className="star-filled" /> {product.rating || 'New'}</div><h3 className="product-title">{title}</h3><div className="price-row"><span className="price">₹{Number(product.price || 0).toLocaleString('en-IN')}</span>{product.original_price && <span className="mrp">₹{Number(product.original_price).toLocaleString('en-IN')}</span>}</div><button className="btn btn-primary w-100" onClick={() => handleAddToCart(product)}>Add to Cart</button></div></article>; })}</div>}{!loadingProducts && products.length === 0 && <p role="status">No trending products are available right now.</p>}</div></section>
    <section className="about-section section"><div className="container about-grid"><div className="about-image card"><img src={heroImg} alt="Inside Sai Baba Electronics Showroom" /><div className="play-button"><Play fill="white" size={32} /></div></div><div className="about-content"><span className="badge badge-outline mb-2">About Us</span><h2>Your Trusted Electronics Partner</h2><p className="about-desc">At Sai Baba Electronics, we don't just sell products; we deliver experiences. With over a decade of trust, we provide personalized guidance to help you choose the best electronics for your home.</p><ul className="features-list"><li><ShieldCheck className="icon-primary" /> Multi-Brand Showroom with live demos</li><li><Truck className="icon-primary" /> Lightning fast delivery in your area</li><li><Wrench className="icon-primary" /> Dedicated post-purchase support</li></ul><button className="btn btn-primary mt-4">Learn More About Us</button></div></div></section>
  </div>;
};

export default Home;
