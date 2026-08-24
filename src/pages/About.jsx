const styles = `
  .page-shell {
    padding: 48px 0 72px;
    background: linear-gradient(180deg, rgba(0,51,160,0.03), transparent 180px);
  }
  .page-hero {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 32px;
    align-items: center;
    margin: 0 auto 32px;
    max-width: 1200px;
    padding: 0 24px;
  }
  .eyebrow {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--accent);
    font-weight: 800;
    display: inline-block;
    margin-bottom: 12px;
  }
  .page-hero h1 {
    font-size: clamp(2.2rem, 4vw, 4rem);
    margin: 0 0 16px;
  }
  .page-hero p {
    color: var(--text-muted);
    font-size: 1.08rem;
    line-height: 1.8;
    margin-bottom: 20px;
  }
  .brand-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 24px;
    box-shadow: var(--shadow-lg);
  }
  .brand-panel img {
    width: 100%;
    aspect-ratio: 1.2;
    object-fit: cover;
    border-radius: 18px;
    margin-bottom: 18px;
  }
  .stat-grid, .value-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 18px;
    margin-top: 24px;
  }
  .stat-card, .value-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 22px 18px;
    text-align: center;
  }
  .stat-card strong {
    display: block;
    font-size: 2rem;
    color: var(--primary);
    margin-bottom: 8px;
  }
  .value-card h3 {
    margin-bottom: 6px;
    font-size: 1.15rem;
  }
  .content-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 28px;
  }
  .story-card, .promise-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 28px;
    box-shadow: var(--shadow-md);
  }
  .story-card p, .promise-card p {
    color: var(--text-muted);
    line-height: 1.8;
  }
  .promise-list {
    list-style: none;
    padding: 0;
    margin: 20px 0 0;
    display: grid;
    gap: 12px;
  }
  .promise-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-primary);
    font-weight: 600;
  }
  @media (max-width: 860px) {
    .page-hero, .content-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default function About() {
  return (
    <main className="page-shell">
      <style>{styles}</style>
      <section className="page-hero">
        <div>
          <span className="eyebrow">About Sai Baba Electronics</span>
          <h1>Trusted by families for smarter living.</h1>
          <p>
            For more than a decade, Sai Baba Electronics has helped households upgrade their homes with
            reliable technology, trusted service, and honest guidance. What began as a local appliance
            showroom has grown into a destination for premium electronics, practical smart living, and
            expert after-sales support.
          </p>
          <div className="stat-grid">
            <div className="stat-card">
              <strong>15k+</strong>
              <span>Happy customers</span>
            </div>
            <div className="stat-card">
              <strong>50+</strong>
              <span>Top brands</span>
            </div>
            <div className="stat-card">
              <strong>10Y</strong>
              <span>Service legacy</span>
            </div>
          </div>
        </div>

        <div className="brand-panel">
          <img
            src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80"
            alt="Sai Baba Electronics showroom"
          />
          <div className="value-grid">
            <div className="value-card">
              <h3>Genuine</h3>
              <p>100% authentic products</p>
            </div>
            <div className="value-card">
              <h3>Warrantied</h3>
              <p>Trusted brand support</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="story-card">
          <span className="eyebrow">Our story</span>
          <h2>Built on trust, service, and value.</h2>
          <p>
            We believe great electronics should feel effortless to choose and easy to live with. That is why
            our team focuses on practical recommendations, transparent pricing, and well-informed support from
            product selection to installation and after-sale care.
          </p>
          <p>
            From smartphones and smart TVs to premium home appliances, we curate products that improve daily
            life without compromising quality or affordability. Every purchase is backed by product expertise,
            customer support, and a showroom experience that is personal and dependable.
          </p>
        </div>

        <div className="promise-card">
          <span className="eyebrow">Our promise</span>
          <h2>Why customers return to us</h2>
          <ul className="promise-list">
            <li>✔ Authentic products with manufacturer warranty</li>
            <li>✔ Personalized buying guidance</li>
            <li>✔ Transparent EMI and finance options</li>
            <li>✔ Trusted onsite support and installation</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
