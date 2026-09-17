import { useEffect, useState } from 'react';
import { BarChart3, Box, Package, Plus, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './AdminDashboard.css';

const statuses = ['processing', 'shipped', 'delivered'];
const emptyProduct = { title: '', price: '', discount: '', category_slug: '', stock: '', image_url: '', description: '' };

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
const displayDate = (value) => value ? new Date(value).toLocaleDateString('en-IN') : 'Date unavailable';

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [productSaving, setProductSaving] = useState(false);

  const loadData = async () => {
    if (!supabase) {
      setError('Supabase is not configured.');
      setLoading(false);
      return;
    }

    setLoading(true);
    const [ordersResult, productsResult, profilesResult] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, full_name, email'),
    ]);

    setOrders(ordersResult.data || []);
    setProducts(productsResult.data || []);
    setProfiles(Object.fromEntries((profilesResult.data || []).map((profile) => [profile.id, profile])));
    setError(ordersResult.error?.message || productsResult.error?.message || '');
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void loadData(); }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    setSavingId(orderId);
    const { error: updateError } = await supabase.from('orders').update({ order_status: newStatus }).eq('id', orderId);
    if (updateError) setError(updateError.message);
    else setOrders((current) => current.map((order) => order.id === orderId ? { ...order, order_status: newStatus, delivery_status: newStatus } : order));
    setSavingId(null);
  };

  const updateProduct = async (productId, changes) => {
    setSavingId(productId);
    const { data, error: updateError } = await supabase.from('products').update(changes).eq('id', productId).select().single();
    if (updateError) setError(updateError.message);
    else setProducts((current) => current.map((product) => product.id === productId ? (data || { ...product, ...changes }) : product));
    setSavingId(null);
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Delete this product permanently?')) return;
    const { error: deleteError } = await supabase.from('products').delete().eq('id', productId);
    if (deleteError) setError(deleteError.message);
    else setProducts((current) => current.filter((product) => product.id !== productId));
  };

  const addProduct = async (event) => {
    event.preventDefault();
    setProductSaving(true);
    const payload = {
      ...productForm,
      price: Number(productForm.price) || 0,
      discount: Number(productForm.discount) || 0,
      stock: Number(productForm.stock) || 0,
    };
    const { data, error: insertError } = await supabase.from('products').insert(payload).select().single();
    if (insertError) setError(insertError.message);
    else {
      setProducts((current) => [data, ...current]);
      setProductForm(emptyProduct);
      setModalOpen(false);
    }
    setProductSaving(false);
  };

  const revenue = orders.reduce((total, order) => total + Number(order.total_amount || order.total || 0), 0);
  const metrics = [
    { label: 'Total Revenue', value: money(revenue), icon: BarChart3 },
    { label: 'Total Orders', value: orders.length, icon: Package },
    { label: 'Total Products', value: products.length, icon: Box },
  ];

  return (
    <main className="admin-page container">
      <header className="admin-header">
        <div><span className="eyebrow">Operations</span><h1>Admin Dashboard</h1><p>Manage orders, inventory, and store performance.</p></div>
        <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}><Plus size={18} /> Add Product</button>
      </header>

      <nav className="admin-tabs" aria-label="Admin sections">
        {['overview', 'orders', 'inventory'].map((item) => <button type="button" key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}
      </nav>

      {error && <div className="admin-alert" role="alert">{error}</div>}
      {loading ? <div className="admin-loading">Loading dashboard data...</div> : <>
        {(tab === 'overview' || tab === 'orders') && <section className="admin-section">
          {tab === 'overview' && <div className="metrics-grid">{metrics.map(({ label, value, icon: Icon }) => <article className="metric-card" key={label}><div className="metric-icon"><Icon size={20} /></div><span>{label}</span><strong>{value}</strong></article>)}</div>}
          {tab === 'overview' && <div className="admin-section-heading"><div><span className="eyebrow">Latest activity</span><h2>Recent Orders</h2></div><button type="button" className="text-button" onClick={() => setTab('orders')}>View all orders</button></div>}
          {tab === 'orders' && <div className="admin-section-heading"><div><span className="eyebrow">Fulfilment</span><h2>Order Manager</h2></div></div>}
          <div className="orders-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>{orders.slice(0, tab === 'overview' ? 5 : undefined).map((order) => { const profile = profiles[order.user_id] || {}; const customer = order.customer_name || profile.full_name || order.customer_email || profile.email || 'Guest customer'; const items = Array.isArray(order.items) ? order.items : []; const status = order.order_status || order.delivery_status || 'processing'; return <tr key={order.id}><td><strong>#{order.id}</strong></td><td>{customer}<small>{order.customer_email || profile.email || ''}</small></td><td>{items.length || order.item_count || 0} item{items.length === 1 ? '' : 's'}<small>{items.slice(0, 2).map((item) => item.title || item.name).filter(Boolean).join(', ')}</small></td><td><strong>{money(order.total_amount || order.total)}</strong></td><td><select value={status} disabled={savingId === order.id} onChange={(event) => updateOrderStatus(order.id, event.target.value)}>{statuses.map((option) => <option key={option} value={option}>{option[0].toUpperCase() + option.slice(1)}</option>)}</select></td><td>{displayDate(order.created_at)}</td></tr>; })}</tbody></table>{orders.length === 0 && <div className="admin-empty">No orders found.</div>}</div>
        </section>}

          {tab === 'inventory' && <section className="admin-section"><div className="admin-section-heading"><div><span className="eyebrow">Stock control</span><h2>Inventory Manager</h2></div><button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}><Plus size={18} /> Add Product</button></div><div className="orders-table-wrap"><table className="admin-table inventory-table"><thead><tr><th>Product</th><th>Price</th><th>Discount</th><th>Category</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="product-cell"><img src={product.image_url || product.image} alt={product.title || product.name} /><strong>{product.title || product.name}</strong></div></td><td><input aria-label={`Price for ${product.title || product.name}`} type="number" defaultValue={product.price || 0} onBlur={(event) => updateProduct(product.id, { price: Number(event.target.value) || 0 })} /></td><td>{product.discount || 0}%</td><td>{product.category_slug || product.category || 'Uncategorised'}</td><td><input aria-label={`Stock for ${product.title || product.name}`} type="number" defaultValue={product.stock || 0} onBlur={(event) => updateProduct(product.id, { stock: Number(event.target.value) || 0 })} /></td><td><div className="table-actions"><button type="button" title="Delete product" aria-label="Delete product" onClick={() => deleteProduct(product.id)}><Trash2 size={17} /></button></div></td></tr>)}</tbody></table>{products.length === 0 && <div className="admin-empty">No products found.</div>}</div></section>}
      </>}

      {modalOpen && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setModalOpen(false)}><form className="admin-modal" onSubmit={addProduct}><div className="admin-modal-header"><div><span className="eyebrow">Inventory</span><h2>Add Product</h2></div><button type="button" className="icon-button" onClick={() => setModalOpen(false)} aria-label="Close add product dialog"><X size={20} /></button></div><div className="form-grid"><label>Title<input required value={productForm.title} onChange={(event) => setProductForm({ ...productForm, title: event.target.value })} /></label><label>Category slug<input required value={productForm.category_slug} onChange={(event) => setProductForm({ ...productForm, category_slug: event.target.value })} /></label><label>Price<input required min="0" type="number" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} /></label><label>Discount %<input min="0" type="number" value={productForm.discount} onChange={(event) => setProductForm({ ...productForm, discount: event.target.value })} /></label><label>Stock<input min="0" type="number" value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} /></label><label>Image URL<input type="url" value={productForm.image_url} onChange={(event) => setProductForm({ ...productForm, image_url: event.target.value })} /></label><label className="full-field">Description<textarea rows="4" value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} /></label></div><button className="btn btn-primary" type="submit" disabled={productSaving}>{productSaving ? 'Adding product...' : 'Add Product'}</button></form></div>}
    </main>
  );
}
