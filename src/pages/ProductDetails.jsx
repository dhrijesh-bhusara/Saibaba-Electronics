import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, Heart, ShoppingCart, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetails.css';

export default function ProductDetails() {
  const { slug } = useParams(); const navigate = useNavigate(); const { addToCart, toggleWishlist, wishlist } = useCart();
  const { user, openAuthModal } = useAuth();
  const [product, setProduct] = useState(null); const [selectedImage, setSelectedImage] = useState(0); const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  const handleAddToCart = (productItem) => {
    if (!user) {
      openAuthModal();
      return;
    }
    addToCart(productItem);
  };

  const handleWishlistToggle = (productItem) => {
    if (!user) {
      openAuthModal();
      return;
    }
    toggleWishlist(productItem);
  };
  useEffect(() => { let active = true; async function load() { if (!supabase) { setError('Product service is unavailable.'); setLoading(false); return; } const { data, error: resultError } = await supabase.from('products').select('*').eq('slug', slug).single(); if (active) { setProduct(data); setError(resultError?.message || (!data ? 'Product not found.' : '')); setLoading(false); } } load(); return () => { active = false; }; }, [slug]);
  if (loading) return <main className="product-page container product-loading">Loading product...</main>;
  if (!product) return <main className="product-page container"><h1>Product unavailable</h1><p>{error}</p></main>;
  const images = product.images || [product.image_url || product.image].filter(Boolean); const active = wishlist.some((item) => item.id === product.id); const specs = product.specs || product.specifications || {};
  return <main className="product-page container"><div className="product-detail-grid"><div className="gallery"><div className="gallery-main"><img src={images[selectedImage]} alt={product.title || product.name} /></div><div className="gallery-thumbs">{images.map((image, index) => <button className={selectedImage === index ? 'selected' : ''} onClick={() => setSelectedImage(index)} key={image}><img src={image} alt={`${product.title} view ${index + 1}`} /></button>)}</div></div><section className="product-copy"><span className="eyebrow">{product.brand || 'Sai Baba Electronics'}</span><h1>{product.title || product.name}</h1><div className="detail-rating"><Star size={18} className="star-filled" /> {product.rating || 'New'} {product.review_count ? `(${product.review_count} reviews)` : ''}</div><div className="detail-price">₹{Number(product.price || 0).toLocaleString('en-IN')}</div>{product.original_price && <span className="detail-mrp">₹{Number(product.original_price).toLocaleString('en-IN')}</span>}<p className={`stock ${product.stock === 0 ? 'out' : ''}`}><Check size={16} /> {product.stock === 0 ? 'Out of stock' : `${product.stock || 'In stock'} available`}</p><p className="product-description">{product.description || 'Premium electronics backed by genuine warranty and expert support.'}</p><div className="emi-badge">Easy EMI available on eligible cards</div><div className="detail-actions"><button className="btn btn-primary" disabled={product.stock === 0} onClick={() => handleAddToCart(product)}><ShoppingCart size={18} /> Add to Cart</button><button className="btn btn-accent" disabled={product.stock === 0} onClick={() => { if (!user) { openAuthModal(); return; } addToCart(product); navigate('/checkout'); }}>Buy Now</button><button className={`wishlist-button ${active ? 'active' : ''}`} onClick={() => handleWishlistToggle(product)} aria-label="Toggle wishlist"><Heart fill={active ? 'currentColor' : 'none'} /></button></div></section></div><section className="specs-section"><h2>Specifications</h2>{Object.keys(specs).length ? <table><tbody>{Object.entries(specs).map(([key, value]) => <tr key={key}><th>{key}</th><td>{String(value)}</td></tr>)}</tbody></table> : <p>Detailed specifications will be added soon.</p>}</section></main>;
}
