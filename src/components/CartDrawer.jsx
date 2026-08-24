import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const tax = cartTotal * 0.18;
  const delivery = cartTotal > 0 ? 99 : 0;
  const grandTotal = cartTotal + tax + delivery;

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return <div className="drawer-backdrop" onClick={onClose}>
    <aside className="cart-drawer" onClick={(event) => event.stopPropagation()} aria-label="Shopping cart">
      <div className="drawer-header"><div><h2>Your Cart</h2><span>{cart.length} item{cart.length === 1 ? '' : 's'}</span></div><button className="drawer-close" onClick={onClose} aria-label="Close cart"><X /></button></div>
      <div className="drawer-items">{cart.length === 0 ? <div className="empty-cart"><p>Your cart is empty.</p><Link to="/" onClick={onClose} className="btn btn-primary">Continue shopping</Link></div> : cart.map((item) => { const id = item.id ?? item.product_id; return <div className="drawer-item" key={id}><img src={item.image_url || item.image} alt={item.title || item.name} /><div className="drawer-item-info"><strong>{item.title || item.name || 'Product'}</strong><span>₹{Number(item.price || 0).toLocaleString('en-IN')}</span><div className="quantity-controls"><button onClick={() => updateQuantity(id, (item.quantity || 1) - 1)} aria-label="Decrease quantity"><Minus size={14} /></button><span>{item.quantity || 1}</span><button onClick={() => updateQuantity(id, (item.quantity || 1) + 1)} aria-label="Increase quantity"><Plus size={14} /></button><button className="remove-item" onClick={() => removeFromCart(id)} aria-label="Remove item"><Trash2 size={16} /></button></div></div></div>; })}</div>
      {cart.length > 0 && <div className="drawer-summary"><div><span>Subtotal</span><strong>₹{cartTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong></div><div><span>Tax (18%)</span><strong>₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong></div><div><span>Delivery</span><strong>₹{delivery.toLocaleString('en-IN')}</strong></div><div className="drawer-total"><span>Total</span><strong>₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong></div><button className="btn btn-primary checkout-button" onClick={() => { onClose(); navigate('/checkout'); }}>Proceed to Checkout</button></div>}
    </aside>
  </div>;
}
