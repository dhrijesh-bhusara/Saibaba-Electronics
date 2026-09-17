import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CategoryPage.css';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const { user, openAuthModal } = useAuth();
  const selectedBrand = searchParams.get('brand');

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

    async function load() {
      if (!supabase) return setLoading(false);

      const categoryResult = await supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .maybeSingle();

      let query = supabase.from('products').select('*');

      if (categoryResult.data?.id) query = query.eq('category_id', categoryResult.data.id);
      else query = query.eq('category_slug', categorySlug);

      const productResult = await query.order('created_at', { ascending: false });

      if (active) {
        setCategory(categoryResult.data);
        setProducts(productResult.data || []);
        setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [categorySlug]);

  const filteredProducts = useMemo(() => {
    const brandFiltered = selectedBrand
      ? products.filter((product) => {
          const brand = (product.brand || product.name || '').toLowerCase();
          return brand.includes(selectedBrand.toLowerCase());
        })
      : products;

    const sorted = [...brandFiltered];

    if (sortBy === 'low-to-high') {
      sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === 'high-to-low') {
      sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return sorted;
  }, [products, selectedBrand, sortBy]);

  const brandOptions = useMemo(() => {
    const unique = [...new Set(products.map((product) => product.brand || product.name || '').filter(Boolean))];
    return unique.slice(0, 8);
  }, [products]);

  return (
    <main className="catalog-page container">
      <div className="catalog-heading">
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/">Categories</Link>
          <span>›</span>
          <strong>{category?.name || categorySlug?.replaceAll('-', ' ')}</strong>
        </div>
        <span className="eyebrow">Collection</span>
        <h1>{category?.name || categorySlug?.replaceAll('-', ' ')}</h1>
        <p>Explore the latest products in this category.</p>
      </div>

      <div className="catalog-toolbar">
        <div className="filter-group">
          <label htmlFor="sortBy">Sort by</label>
          <select id="sortBy" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="brandFilter">Brand</label>
          <select
            id="brandFilter"
            value={selectedBrand || ''}
            onChange={(event) => {
              const nextBrand = event.target.value;
              setSearchParams(nextBrand ? { brand: nextBrand } : {});
            }}
          >
            <option value="">All brands</option>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="catalog-loading">Loading products...</div>
      ) : (
        <div className="catalog-grid">
          {filteredProducts.map((product) => {
            const id = product.id || product.product_id;
            const active = wishlist.some((item) => item.id === id);

            return (
              <article className="product-card card" key={id}>
                <button className={`wishlist-button ${active ? 'active' : ''}`} onClick={() => handleWishlistToggle(product)} aria-label="Toggle wishlist">
                  <Heart size={20} fill={active ? 'currentColor' : 'none'} />
                </button>
                <Link to={`/product/${product.slug || id}`}>
                  <div className="product-img">
                    <img src={product.image_url || product.image} alt={product.title || product.name} />
                  </div>
                  <div className="product-info">
                    <div className="rating"><Star size={14} className="star-filled" /> {product.rating || 'New'}</div>
                    <h2 className="product-title">{product.title || product.name}</h2>
                    <span className="price">₹{Number(product.price || 0).toLocaleString('en-IN')}</span>
                  </div>
                </Link>
                <button className="btn btn-primary w-100" onClick={() => handleAddToCart(product)}>
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              </article>
            );
          })}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <p className="empty-state">No products found in this category.</p>
      )}
    </main>
  );
}
