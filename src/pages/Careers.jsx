import { useState } from 'react';

const roles = [
  {
    title: 'Sales Executive',
    location: 'Bengaluru Showroom',
    type: 'Full time',
    description: 'Guide customers to the right electronics purchases and deliver an exceptional showroom experience.',
  },
  {
    title: 'Service Technician',
    location: 'On-site support',
    type: 'Full time',
    description: 'Handle installation, diagnostics, and after-sales support for premium home electronics.',
  },
  {
    title: 'Store Manager',
    location: 'Main branch',
    type: 'Leadership',
    description: 'Lead team operations, sales growth, customer experience, and branch performance.',
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
  .hero {
    margin-bottom: 28px;
  }
  .hero h1 {
    font-size: clamp(2.2rem, 4vw, 4rem);
    margin: 0 0 12px;
  }
  .hero p {
    color: var(--text-muted);
    max-width: 760px;
    line-height: 1.8;
  }
  .roles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
  }
  .role-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 24px;
    box-shadow: var(--shadow-md);
  }
  .role-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
  .pill {
    display: inline-flex;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(0, 51, 160, 0.08);
    color: var(--primary);
    font-size: 0.72rem;
    font-weight: 700;
  }
  .role-card h3 {
    margin: 0 0 10px;
  }
  .role-card p {
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 18px;
  }
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.5);
    display: grid;
    place-items: center;
    padding: 20px;
    z-index: 50;
  }
  .modal {
    width: min(500px, 100%);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    box-shadow: var(--shadow-lg);
  }
  .modal h3 {
    margin-top: 0;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 24px;
  }
  @media (max-width: 640px) {
    .modal-actions {
      flex-direction: column;
    }
  }
`;

export default function Careers() {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <main className="page-shell">
      <style>{styles}</style>
      <div className="page-wrap">
        <section className="hero">
          <span className="eyebrow">Careers</span>
          <h1>Join the team behind the experience.</h1>
          <p>
            We are expanding our team across customer experience, sales, support, and operations to help us
            deliver a premium electronics journey at every touchpoint.
          </p>
        </section>

        <section className="roles-grid">
          {roles.map((role) => (
            <article className="role-card" key={role.title}>
              <div className="role-meta">
                <span className="pill">{role.type}</span>
                <span className="pill">{role.location}</span>
              </div>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
              <button className="btn btn-primary" onClick={() => setSelectedRole(role.title)}>Apply</button>
            </article>
          ))}
        </section>
      </div>

      {selectedRole && (
        <div className="modal-backdrop" onClick={() => setSelectedRole(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h3>Apply for {selectedRole}</h3>
            <p>
              We would love to hear from you. Send your resume to <strong>careers@saibabaelectronics.com</strong> or visit our showroom front desk.
            </p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setSelectedRole(null)}>Close</button>
              <a className="btn btn-primary" href="mailto:careers@saibabaelectronics.com?subject=Application%20for%20selectedRole">Send Email</a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
