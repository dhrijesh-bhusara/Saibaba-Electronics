import { useState } from 'react';

const styles = `
  .page-shell {
    padding: 48px 0 72px;
  }
  .contact-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 28px;
  }
  .contact-card, .info-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 28px;
    box-shadow: var(--shadow-md);
  }
  .contact-card h1, .info-card h2 {
    margin: 0 0 12px;
    font-size: clamp(2rem, 3vw, 3rem);
  }
  .contact-card p, .info-card p {
    color: var(--text-muted);
    line-height: 1.8;
  }
  .contact-form {
    display: grid;
    gap: 18px;
    margin-top: 20px;
  }
  .field {
    display: grid;
    gap: 8px;
  }
  .field label {
    font-weight: 700;
  }
  .field input, .field textarea {
    width: 100%;
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
  .field textarea {
    min-height: 150px;
    resize: vertical;
  }
  .info-stack {
    display: grid;
    gap: 18px;
  }
  .info-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 16px 18px;
    background: var(--bg-secondary);
    border-radius: 14px;
    border: 1px solid var(--border);
  }
  .info-item strong {
    display: block;
    margin-bottom: 4px;
  }
  .map-frame {
    margin-top: 18px;
    border: 0;
    width: 100%;
    min-height: 250px;
    border-radius: 18px;
    overflow: hidden;
  }
  .success-box {
    margin-top: 18px;
    padding: 12px 14px;
    border-radius: 12px;
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #0e8e5a;
    font-weight: 600;
  }
  @media (max-width: 900px) {
    .contact-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSent(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <main className="page-shell">
      <style>{styles}</style>
      <div className="contact-grid">
        <section className="contact-card">
          <span className="eyebrow">Contact us</span>
          <h1>Let’s help you find the right upgrade.</h1>
          <p>
            Whether you need product advice, service support, or help with finance options, our showroom
            team is ready to assist.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us how we can help" required />
            </div>
            <button type="submit" className="btn btn-primary">Send message</button>
            {sent && <div className="success-box">Thanks! Our team will reach out shortly.</div>}
          </form>
        </section>

        <aside className="info-card">
          <h2>Visit our showroom</h2>
          <div className="info-stack">
            <div className="info-item">
              <span>📍</span>
              <div>
                <strong>Address</strong>
                <p>123 Electronics Hub, Tech Avenue, Main Market, Bengaluru, Karnataka 560001</p>
              </div>
            </div>
            <div className="info-item">
              <span>📞</span>
              <div>
                <strong>Phone</strong>
                <p><a href="tel:+919876543210">+91 98765 43210</a></p>
              </div>
            </div>
            <div className="info-item">
              <span>🕒</span>
              <div>
                <strong>Working hours</strong>
                <p>Mon - Sun: 9:30 AM - 9:30 PM</p>
              </div>
            </div>
          </div>

          <iframe
            className="map-frame"
            title="Sai Baba Electronics location"
            src="https://www.google.com/maps?q=Bengaluru%20Main%20Market&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </aside>
      </div>
    </main>
  );
}
