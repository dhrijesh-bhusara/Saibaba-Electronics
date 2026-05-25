import React from 'react';
import { ShoppingCart, Star, ShieldCheck, Truck, Wrench, CreditCard, ChevronRight, Play } from 'lucide-react';
import './Home.css';

// We'll import these correctly based on where they are generated
import heroImg from '../assets/hero_electronics.png';
import tvImg from '../assets/smart_tv.png';
import fridgeImg from '../assets/refrigerator.png';
import phoneImg from '../assets/smartphone.png';

const Home = () => {
  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg">
          <img src={heroImg} alt="Premium Electronics Showroom" className="hero-img" />
          <div className="hero-overlay"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text-content fade-in">
            <div className="hero-badges">
              <span className="badge">EMI Available</span>
              <span className="badge badge-outline">Festival Offers</span>
            </div>
            <h1 className="hero-title">
              Upgrade Your Lifestyle With <span className="gradient-text">Premium Electronics</span>
            </h1>
            <p className="hero-subtitle">
              Explore top brands, smart appliances, latest gadgets, and unbeatable festival offers — all under one trusted roof.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg">Shop Now <ShoppingCart size={20} /></button>
              <button className="btn btn-glass btn-lg">Visit Showroom <ChevronRight size={20} /></button>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <h4>15k+</h4>
                <p>Happy Customers</p>
              </div>
              <div className="stat-item">
                <h4>50+</h4>
                <p>Top Brands</p>
              </div>
              <div className="stat-item">
                <h4>4.9/5</h4>
                <p>Google Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="trust-bar">
        <div className="container trust-grid">
          <div className="trust-item">
            <ShieldCheck className="trust-icon" />
            <div>
              <h4>Genuine Products</h4>
              <p>100% Brand Warranty</p>
            </div>
          </div>
          <div className="trust-item">
            <Truck className="trust-icon" />
            <div>
              <h4>Fast Delivery</h4>
              <p>Same day dispatch</p>
            </div>
          </div>
          <div className="trust-item">
            <Wrench className="trust-icon" />
            <div>
              <h4>Free Installation</h4>
              <p>Expert setup</p>
            </div>
          </div>
          <div className="trust-item">
            <CreditCard className="trust-icon" />
            <div>
              <h4>Easy EMI</h4>
              <p>No cost options</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <h2>Shop by Category</h2>
              <p>Discover our wide range of premium electronics across top categories.</p>
            </div>
            <button className="btn btn-outline">View All</button>
          </div>
          
          <div className="categories-grid">
            <div className="category-card">
              <div className="cat-img-wrap">
                <img src={phoneImg} alt="Smartphones" />
              </div>
              <div className="cat-content">
                <h3>Smartphones</h3>
                <p>Latest Flagships</p>
              </div>
            </div>
            <div className="category-card">
              <div className="cat-img-wrap">
                <img src={tvImg} alt="Smart TVs" />
              </div>
              <div className="cat-content">
                <h3>Smart TVs</h3>
                <p>4K & OLED Displays</p>
              </div>
            </div>
            <div className="category-card">
              <div className="cat-img-wrap">
                <img src={fridgeImg} alt="Refrigerators" />
              </div>
              <div className="cat-content">
                <h3>Home Appliances</h3>
                <p>Smart Living</p>
              </div>
            </div>
            <div className="category-card">
              <div className="cat-img-wrap">
                <div className="placeholder-cat">Laptops</div>
              </div>
              <div className="cat-content">
                <h3>Laptops</h3>
                <p>Work & Gaming</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FESTIVAL OFFERS */}
      <section className="offers-section section">
        <div className="container">
          <div className="offer-banner">
            <div className="offer-content">
              <h2>Grand Festival Sale</h2>
              <p>Up to 50% off on Smart TVs and Home Appliances. Get an extra 10% instant discount with HDFC cards.</p>
              <div className="countdown">
                <div className="time-box"><span>02</span><small>Days</small></div>:
                <div className="time-box"><span>14</span><small>Hours</small></div>:
                <div className="time-box"><span>45</span><small>Mins</small></div>
              </div>
              <button className="btn btn-accent mt-4">Grab Deal Now</button>
            </div>
            <div className="offer-image">
              <img src={tvImg} alt="Offer Product" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRODUCT SHOWCASE */}
      <section className="section products-section">
        <div className="container">
          <div className="section-title">
            <h2>Trending Now</h2>
            <p>Our most popular electronics right now.</p>
          </div>
          
          <div className="grid-4">
            {/* Product 1 */}
            <div className="product-card card">
              <div className="product-badge">20% OFF</div>
              <div className="product-img">
                <img src={phoneImg} alt="Premium Smartphone" />
              </div>
              <div className="product-info">
                <div className="rating"><Star size={14} className="star-filled" /> 4.9</div>
                <h3 className="product-title">Ultra Pro Max 5G Smartphone</h3>
                <div className="price-row">
                  <span className="price">₹1,24,999</span>
                  <span className="mrp">₹1,34,999</span>
                </div>
                <button className="btn btn-primary w-100">Add to Cart</button>
              </div>
            </div>

            {/* Product 2 */}
            <div className="product-card card">
              <div className="product-img">
                <img src={tvImg} alt="OLED TV" />
              </div>
              <div className="product-info">
                <div className="rating"><Star size={14} className="star-filled" /> 4.8</div>
                <h3 className="product-title">65" 4K OLED Smart TV</h3>
                <div className="price-row">
                  <span className="price">₹1,45,000</span>
                  <span className="mrp">₹1,65,000</span>
                </div>
                <button className="btn btn-primary w-100">Add to Cart</button>
              </div>
            </div>
            
            {/* Product 3 */}
            <div className="product-card card">
              <div className="product-badge">EMI</div>
              <div className="product-img">
                <img src={fridgeImg} alt="Smart Refrigerator" />
              </div>
              <div className="product-info">
                <div className="rating"><Star size={14} className="star-filled" /> 4.7</div>
                <h3 className="product-title">Multi-Door Smart Refrigerator</h3>
                <div className="price-row">
                  <span className="price">₹85,500</span>
                  <span className="mrp">₹95,000</span>
                </div>
                <button className="btn btn-primary w-100">Add to Cart</button>
              </div>
            </div>

            {/* Product 4 */}
            <div className="product-card card">
              <div className="product-img">
                <div className="placeholder-product">MacBook Pro</div>
              </div>
              <div className="product-info">
                <div className="rating"><Star size={14} className="star-filled" /> 4.9</div>
                <h3 className="product-title">M3 Pro 14" Laptop</h3>
                <div className="price-row">
                  <span className="price">₹1,99,900</span>
                  <span className="mrp">₹2,09,900</span>
                </div>
                <button className="btn btn-primary w-100">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US & ABOUT */}
      <section className="about-section section">
        <div className="container about-grid">
          <div className="about-image card">
            <img src={heroImg} alt="Inside Sai Baba Electronics Showroom" />
            <div className="play-button">
              <Play fill="white" size={32} />
            </div>
          </div>
          <div className="about-content">
            <span className="badge badge-outline mb-2">About Us</span>
            <h2>Your Trusted Electronics Partner</h2>
            <p className="about-desc">
              At Sai Baba Electronics, we don't just sell products; we deliver experiences. With over a decade of trust, we provide personalized guidance to help you choose the best electronics for your home.
            </p>
            <ul className="features-list">
              <li><ShieldCheck className="icon-primary" /> Multi-Brand Showroom with live demos</li>
              <li><Truck className="icon-primary" /> Lightning fast delivery in your area</li>
              <li><Wrench className="icon-primary" /> Dedicated post-purchase support</li>
            </ul>
            <button className="btn btn-primary mt-4">Learn More About Us</button>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
