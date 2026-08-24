import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './MyOrders.css';

export default function MyOrders() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { let active = true; async function load() { if (authLoading) return; if (!user) { setLoading(false); return; } if (!supabase) { setError('Order service is unavailable.'); setLoading(false); return; } const { data, error: resultError } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }); if (active) { setOrders(data || []); setError(resultError?.message || ''); setLoading(false); } } load(); return () => { active = false; }; }, [user, authLoading]);
  if (authLoading || loading) return <main className="orders-page container orders-loading">Loading your orders...</main>;
  if (!user) return <main className="orders-page container orders-empty"><PackageOpen size={56} /><h1>Sign in to view your orders</h1><p>Your completed purchases will appear here.</p><button className="btn btn-primary" onClick={openAuthModal}>Sign In</button></main>;
  return <main className="orders-page container"><div className="orders-heading"><span className="eyebrow">Account</span><h1>My Orders</h1><p>{orders.length} past order{orders.length === 1 ? '' : 's'}</p></div>{error && <p className="checkout-error">{error}</p>}{orders.length === 0 ? <div className="orders-empty"><PackageOpen size={48} /><h2>No orders yet</h2><Link className="btn btn-primary" to="/">Start shopping</Link></div> : <div className="orders-list">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-card-head"><div><strong>Order #{order.id}</strong><time>{order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : 'Date unavailable'}</time></div><span className={`status-badge ${order.delivery_status || 'processing'}`}>{order.delivery_status || 'Processing'}</span></div><div className="order-products">{(order.items || []).map((item, index) => <img key={`${order.id}-${item.id || index}`} src={item.image_url || item.image} alt={item.title || item.name || 'Ordered product'} />)}</div><div className="order-card-foot"><span>Total <strong>₹{Number(order.total_amount || 0).toLocaleString('en-IN')}</strong></span><span>Payment ID: {order.payment_id || 'Unavailable'}</span></div></article>)}</div>}</main>;
}
