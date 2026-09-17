import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Wishlist.css';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const { user, openAuthModal } = useAuth();

  const handleAction = (action) => {
    if (!user) {
      openAuthModal();
      return;
    }
    action();
  };

  return (
    <main className="wishlist-page container">
      <div className="wishlist-heading">
        <span className="eyebrow">Saved for later</span>
        <h1>My Wishlist</h1>
        <p>{wishlist.length ? `${wishlist.length} product${wishlist.length === 1 ? '' : 's'} saved` : 'Save products here while you compare your options.'}</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <Heart size={34} />
          <h2>Your wishlist is empty</h2>
          <p>Browse our collections and tap the heart on anything you would like to revisit.</p>
          <Link to="/" className="btn btn-primary">Explore products</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => {
            const id = product.id || product.product_id;
            const title = product.title || product.name || 'Electronics product';
            const slug = product.slug || id;

            return (
              <article className="wishlist-card" key={id}>
                <Link to={`/product/${slug}`} className="wishlist-image">
                  <img src={product.image_url || product.image} alt={title} />
                </Link>
                <div className="wishlist-card-body">
                  <Link to={`/product/${slug}`} className="wishlist-title">{title}</Link>
                  <span className="wishlist-price">₹{Number(product.price || 0).toLocaleString('en-IN')}</span>
                  <div className="wishlist-actions">
                    <button type="button" className="btn btn-primary" onClick={() => handleAction(() => addToCart(product))}>
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                    <button type="button" className="wishlist-remove" onClick={() => handleAction(() => toggleWishlist(product))} aria-label={`Remove ${title} from wishlist`}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
