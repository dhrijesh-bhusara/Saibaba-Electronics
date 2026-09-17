import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <div className="container newsletter-content">
          <div className="newsletter-text">
            <h3>Subscribe to our Newsletter</h3>
            <p>Get the latest updates on festival offers, new launches, and exclusive EMI deals.</p>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button className="btn btn-accent">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="container grid-4">
          <div className="footer-col">
            <div className="footer-brand">
              <span className="logo-sai">Sai Baba</span>
              <span className="logo-electronics">Electronics</span>
            </div>
            <p className="footer-desc">
              Your trusted electronics partner for every home upgrade. We offer the best brands with premium showroom experience and expert guidance.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Twitter">TW</a>
              <a href="https://www.instagram.com/saibabaelec" aria-label="Instagram">IG</a>
              <a href="#" aria-label="Youtube">YT</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/store-locator">Store Locator</Link></li>
              <li><Link to="/emi-options">EMI Options</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><Link to="/smartphones">Smartphones</Link></li>
              <li><Link to="/tv">Smart TVs</Link></li>
              <li><Link to="/ac">Air Conditioners</Link></li>
              <li><Link to="/refrigerators">Refrigerators</Link></li>
              <li><Link to="/laptops">Laptops</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>123 Electronics Hub, Tech Avenue, Main Market</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+91 98765 43210</span>
              </li>
              <li>
                <Mail size={18} />
                <span>support@saibabaelectronics.com</span>
              </li>
              <li>
                <Clock size={18} />
                <span>9:30 AM – 9:30 PM (All Days)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} Sai Baba Electronics. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
