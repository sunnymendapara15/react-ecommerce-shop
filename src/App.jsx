import { useMemo, useState } from 'react';

const productCatalog = [
  {
    id: 1,
    name: 'Aurora Drop Sneakers',
    price: 128,
    tagline: 'Featherweight cushioning with a gradient sheen.',
    color: '#fbd7ff',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    name: 'Pacific Ride Jacket',
    price: 178,
    tagline: 'Streamlined shell with bonded seams for all-weather flow.',
    color: '#d7fdfd',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    name: 'Nomad Utility Tote',
    price: 94,
    tagline: 'Structured silhouette with soft-touch suede lining.',
    color: '#fff2d0',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    name: 'Solar Rhythm Tee',
    price: 56,
    tagline: 'Breathable modal knit printed with reflective ink.',
    color: '#fef0c7',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
  }
];

const highlights = [
  {
    title: 'Next-day prep',
    detail: 'Orders placed before midnight ship from the studio the following morning.'
  },
  {
    title: 'Flexible delivery',
    detail: 'Choose doorstep drop-off, secure locker pick-up, or same-day concierge delivery.'
  },
  {
    title: 'Secure checkout',
    detail: 'Stripe handles cards + wallets and streams a confirmation email instantly.'
  }
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);

export default function App() {
  const [cart, setCart] = useState({});
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [orderStatus, setOrderStatus] = useState('');

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev[product.id];
      return {
        ...prev,
        [product.id]: existing
          ? { ...existing, qty: existing.qty + 1 }
          : { ...product, qty: 1 }
      };
    });
    setOrderStatus('');
  };

  const updateQty = (id, delta) => {
    setCart((prev) => {
      const item = prev[id];
      if (!item) return prev;
      const qty = item.qty + delta;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return {
        ...prev,
        [id]: { ...item, qty }
      };
    });
    setOrderStatus('');
  };

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems]
  );
  const shipping = subtotal ? 9.0 : 0;
  const tax = +(subtotal * 0.07).toFixed(2);
  const orderTotal = +(subtotal + shipping + tax).toFixed(2);

  const handleCheckout = (event) => {
    event.preventDefault();
    if (!cartItems.length) {
      setOrderStatus('Add at least one item to begin checkout.');
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.address.trim()) {
      setOrderStatus('Please fill in your name, email, and shipping address.');
      return;
    }
    setOrderStatus(
      `Thanks ${form.name.split(' ')[0] || 'friend'}! Your ${cartItems.length} item$${
        cartItems.length > 1 ? 's' : ''
      } are reserved. A confirmation landed in ${form.email.trim()}.`
    );
    setForm({ name: '', email: '', address: '' });
    setCart({});
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <div className="app">
      <header className="hero">
        <p className="tagline">Limited drop · Summer 2026</p>
        <h1>Designed to move fast, look radiant, and checkout in seconds.</h1>
        <p className="hero-subtitle">
          A capsule of everyday essentials built for energy. Shop curated silhouettes paired with a
          frictionless checkout experience that keeps you in the flow.
        </p>
        <div className="hero-cta">
          <button type="button" className="primary">
            Start shopping
          </button>
          <button type="button" className="ghost">
            See how it works
          </button>
        </div>
        <div className="highlight-grid">
          {highlights.map((item) => (
            <article key={item.title} className="highlight-card">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </header>

      <section className="products">
        <div className="section-heading">
          <h2>Shop the collection</h2>
          <p>Each piece ships with eco-friendly packaging, soft-touch tags, and live tracking updates.</p>
        </div>
        <div className="product-grid">
          {productCatalog.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div
                className="product-palette"
                style={{ background: `linear-gradient(120deg, ${product.color}, transparent)` }}
              />
              <div className="product-info">
                <div>
                  <p className="product-name">{product.name}</p>
                  <p className="product-tagline">{product.tagline}</p>
                </div>
                <div className="price-row">
                  <span className="price">{formatCurrency(product.price)}</span>
                  <button type="button" onClick={() => addToCart(product)}>
                    Add to cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="checkout-section">
        <div className="cart-panel">
          <div className="section-heading">
            <h2>Your cart</h2>
            <p>Keep it flexible. Quantity updates process instantly.</p>
          </div>

          {cartItems.length ? (
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div>
                    <p className="product-name">{item.name}</p>
                    <p className="product-tagline">{item.qty} × {formatCurrency(item.price)}</p>
                  </div>
                  <div className="qty-controls">
                    <button type="button" onClick={() => updateQty(item.id, -1)} aria-label="Decrease quantity">
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => updateQty(item.id, 1)} aria-label="Increase quantity">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-cart">Your cart is empty. Add a drop to see the checkout summaries.</p>
          )}

          <div className="summary-card">
            <div>
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div>
              <span>Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <div>
              <span>Tax (7%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="total-row">
              <strong>Order total</strong>
              <strong>{formatCurrency(orderTotal)}</strong>
            </div>
          </div>

          {orderStatus && <p className="order-status">{orderStatus}</p>}
        </div>

        <form className="checkout-panel" onSubmit={handleCheckout}>
          <div className="section-heading">
            <h2>Checkout</h2>
            <p>Fill in your details and we’ll handle the rest with secure billing & fast delivery.</p>
          </div>

          <label>
            <span>Full name</span>
            <input value={form.name} onChange={handleChange('name')} placeholder="Jordan Rivera" />
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="you@email.com"
            />
          </label>

          <label>
            <span>Shipping address</span>
            <textarea
              value={form.address}
              onChange={handleChange('address')}
              rows="3"
              placeholder="121 Trade Street, Suite 5, San Diego, CA"
            />
          </label>

          <button type="submit" className="primary" disabled={!cartItems.length}>
            Place order
          </button>

          <p className="secure-badge">
            <span>Secure checkout</span> · All payments processed via Stripe · Live order tracking
          </p>
        </form>
      </section>
    </div>
  );
}
