import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const steps = ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

const styles = `
  .track-shell {
    padding: 48px 0 72px;
  }
  .track-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .track-header {
    margin-bottom: 28px;
  }
  .track-header h1 {
    font-size: clamp(2.2rem, 4vw, 4rem);
    margin: 0 0 14px;
  }
  .track-header p {
    color: var(--text-muted);
    max-width: 760px;
    line-height: 1.8;
  }
  .search-bar {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 12px;
    margin: 18px 0 28px;
  }
  .search-bar input {
    width: 100%;
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
  .orders-grid {
    display: grid;
    gap: 22px;
  }
  .order-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 24px;
    box-shadow: var(--shadow-md);
  }
  .order-top {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 22px;
  }
  .progress-steps {
    display: grid;
    grid-template-columns: repeat(5, minmax(120px, 1fr));
    gap: 12px;
    margin: 18px 0 24px;
  }
  .progress-step {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 12px 10px;
    text-align: center;
    font-size: 0.82rem;
    color: var(--text-muted);
  }
  .progress-step.active {
    background: rgba(0, 51, 160, 0.08);
    border-color: rgba(0, 51, 160, 0.35);
    color: var(--primary);
    font-weight: 700;
  }
  .order-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-top: 10px;
  }
  .summary-box {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 16px;
  }
  .summary-box strong {
    display: block;
    margin-bottom: 6px;
  }
  .items-list {
    display: grid;
    gap: 10px;
    margin-top: 18px;
  }
  .item-row {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    color: var(--text-primary);
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  .empty-state {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 28px;
    text-align: center;
    color: var(--text-muted);
  }
  @media (max-width: 800px) {
    .search-bar {
      grid-template-columns: 1fr;
    }
    .progress-steps {
      grid-template-columns: repeat(2, minmax(140px, 1fr));
    }
  }
`;

function getStepIndex(status) {
  const normalized = (status || '').toLowerCase();
  const map = {
    'order placed': 0,
    placed: 0,
    confirmed: 1,
    shipped: 2,
    'out for delivery': 3,
    delivered: 4,
    processing: 0,
  };

  return map[normalized] ?? 0;
}

export default function TrackOrder() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      setLoading(true);
      try {
        if (!supabase) {
          setOrders([]);
          setError('Order service is unavailable.');
          setLoading(false);
          return;
        }

        if (user) {
          const { data, error: lookupError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!active) return;
          if (lookupError) throw lookupError;
          setOrders(data || []);
          setError('');
          setLoading(false);
          return;
        }

        const term = searchText.trim();
        if (!term) {
          setOrders([]);
          setError('');
          setLoading(false);
          return;
        }

        const isOrderId = term.length >= 8;
        const { data, error: lookupError } = isOrderId
          ? await supabase.from('orders').select('*').eq('id', term).limit(10)
          : await supabase.from('orders').select('*').ilike('user_email', `%${term}%`).limit(10);

        if (!active) return;
        if (lookupError) throw lookupError;
        setOrders(data || []);
        setError('');
      } catch (loadError) {
        if (!active) return;
        setOrders([]);
        setError(loadError?.message || 'Unable to load orders.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();
    return () => { active = false; };
  }, [user, searchText]);

  const filteredOrders = useMemo(() => {
    if (!query.trim()) return orders;
    return orders.filter((order) => {
      const id = String(order.id ?? '').toLowerCase();
      const email = String(order.user_email || '').toLowerCase();
      return id.includes(query.toLowerCase()) || email.includes(query.toLowerCase());
    });
  }, [orders, query]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchText(query);
  };

  return (
    <main className="track-shell">
      <style>{styles}</style>
      <div className="track-wrap">
        <header className="track-header">
          <span className="eyebrow">Track order</span>
          <h1>Monitor your delivery in real time.</h1>
          <p>
            {user
              ? 'Your recent orders are shown below. Use the search box to find a specific order by ID.'
              : 'Enter your order ID or email to check the latest delivery status.'}
          </p>
        </header>

        {!user && (
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by Order ID or Email"
              aria-label="Order ID or email search"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Enter your email or order number"
              aria-label="Order or email lookup"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        )}

        {user && (
          <div className="search-bar">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your orders by custom order ID"
              aria-label="Search your orders"
            />
            <div />
            <button className="btn btn-primary" onClick={() => setQuery('')}>Clear</button>
          </div>
        )}

        {loading && <div className="empty-state">Loading delivery details…</div>}
        {error && <div className="empty-state">{error}</div>}

        {!loading && !error && filteredOrders.length === 0 && (
          <div className="empty-state">
            {user ? 'No orders found for your account yet.' : 'No matching orders were found for that search.'}
          </div>
        )}

        <div className="orders-grid">
          {filteredOrders.map((order) => {
            const stepIndex = getStepIndex(order.delivery_status);
            const items = Array.isArray(order.items) ? order.items : [];

            return (
              <article className="order-card" key={order.id}>
                <div className="order-top">
                  <div>
                    <strong>Order #{order.id}</strong>
                    <div>{new Date(order.created_at || Date.now()).toLocaleDateString('en-IN')}</div>
                  </div>
                  <button className="btn btn-outline">Track Progress</button>
                </div>

                <div className="progress-steps" aria-label="Delivery progress">
                  {steps.map((step, index) => (
                    <div key={step} className={`progress-step ${index <= stepIndex ? 'active' : ''}`}>
                      {step}
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-box">
                    <strong>Status</strong>
                    <span>{order.delivery_status || 'Order Placed'}</span>
                  </div>
                  <div className="summary-box">
                    <strong>Total</strong>
                    <span>₹{Number(order.total_amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="summary-box">
                    <strong>Payment</strong>
                    <span>{order.payment_status || 'Paid'}</span>
                  </div>
                  <div className="summary-box">
                    <strong>Email</strong>
                    <span>{order.user_email || 'Not available'}</span>
                  </div>
                </div>

                <div className="items-list">
                  {items.map((item, index) => (
                    <div className="item-row" key={`${order.id}-${item.id || index}`}>
                      <span>{item.title || item.name || 'Product'} x {item.quantity || 1}</span>
                      <strong>₹{Number(item.price || 0).toLocaleString('en-IN')}</strong>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
