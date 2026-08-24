const stores = [
  {
    name: 'Bengaluru Main Showroom',
    address: '123 Electronics Hub, Tech Avenue, Main Market, Bengaluru, Karnataka',
    timings: 'Mon-Sun: 9:30 AM - 9:30 PM',
    phone: '+91 98765 43210',
    directions: 'https://maps.google.com/?q=Bengaluru+Main+Market',
  },
  {
    name: 'Hitech City Branch',
    address: '45 Gachibowli Road, Hitech City, Hyderabad, Telangana',
    timings: 'Mon-Sun: 10:00 AM - 9:00 PM',
    phone: '+91 98765 43211',
    directions: 'https://maps.google.com/?q=Hitech+City+Hyderabad',
  },
  {
    name: 'Mysore Experience Center',
    address: '9 Market Street, Devaraja Mohalla, Mysuru, Karnataka',
    timings: 'Mon-Sun: 10:00 AM - 8:30 PM',
    phone: '+91 98765 43212',
    directions: 'https://maps.google.com/?q=Mysuru+Devaraja+Mohalla',
  },
];

const styles = `
  .page-shell {
    padding: 48px 0 72px;
  }
  .page-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .hero h1 {
    font-size: clamp(2.3rem, 4.6vw, 4rem);
    margin: 0 0 12px;
  }
  .hero p {
    color: var(--text-muted);
    line-height: 1.8;
    max-width: 760px;
  }
  .stores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-top: 32px;
  }
  .store-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 24px;
    box-shadow: var(--shadow-md);
  }
  .store-card h3 {
    margin-top: 0;
    margin-bottom: 10px;
  }
  .store-card p {
    color: var(--text-muted);
    line-height: 1.8;
  }
  .store-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 18px;
  }
  .store-actions a {
    text-decoration: none;
  }
`;

export default function StoreLocator() {
  return (
    <main className="page-shell">
      <style>{styles}</style>
      <div className="page-wrap">
        <section className="hero">
          <span className="eyebrow">Store locator</span>
          <h1>Visit a Sai Baba Electronics showroom near you.</h1>
          <p>
            Experience our product demos, expert guidance, and after-sales support in person at one of our
            trusted branches across major cities.
          </p>
        </section>

        <section className="stores-grid">
          {stores.map((store) => (
            <article className="store-card" key={store.name}>
              <h3>{store.name}</h3>
              <p>{store.address}</p>
              <p><strong>Timings:</strong> {store.timings}</p>
              <p><strong>Call:</strong> {store.phone}</p>
              <div className="store-actions">
                <a className="btn btn-primary" href={`tel:${store.phone.replace(/\s+/g, '')}`}>Call</a>
                <a className="btn btn-outline" href={store.directions} target="_blank" rel="noreferrer">Get Directions</a>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
