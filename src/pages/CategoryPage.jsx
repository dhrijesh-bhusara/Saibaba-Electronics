import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CategoryPage.css';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
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
  useEffect(() => { let active = true; async function load() { if (!supabase) return setLoading(false); const categoryResult = await supabase.from('categories').select('*').eq('slug', categorySlug).maybeSingle(); let query = supabase.from('products').select('*'); if (categoryResult.data?.id) query = query.eq('category_id', categoryResult.data.id); else query = query.eq('category_slug', categorySlug); const productResult = await query.order('created_at', { ascending: false }); if (active) { setCategory(categoryResult.data); setProducts(productResult.data || []); setLoading(false); } } load(); return () => { active = false; }; }, [categorySlug]);
  return <main className="catalog-page container"><div className="catalog-heading"><span className="eyebrow">Collection</span><h1>{category?.name || categorySlug.replaceAll('-', ' ')}</h1><p>Explore the latest products in this category.</p></div>{loading ? <div className="catalog-loading">Loading products...</div> : <div className="catalog-grid">{products.map((product) => { const id = product.id || product.product_id; const active = wishlist.some((item) => item.id === id); return <article className="product-card card" key={id}><button className={`wishlist-button ${active ? 'active' : ''}`} onClick={() => handleWishlistToggle(product)} aria-label="Toggle wishlist"><Heart size={20} fill={active ? 'currentColor' : 'none'} /></button><Link to={`/product/${product.slug || id}`}><div className="product-img"><img src={product.image_url || product.image} alt={product.title || product.name} /></div><div className="product-info"><div className="rating"><Star size={14} className="star-filled" /> {product.rating || 'New'}</div><h2 className="product-title">{product.title || product.name}</h2><span className="price">₹{Number(product.price || 0).toLocaleString('en-IN')}</span></div></Link><button className="btn btn-primary w-100" onClick={() => handleAddToCart(product)}><ShoppingCart size={16} /> Add to Cart</button></article>; })}</div>}{!loading && products.length === 0 && <p className="empty-state">No products found in this category.</p>}</main>;
}
