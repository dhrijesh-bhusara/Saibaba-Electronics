import { useMemo, useState } from 'react';

const banks = ['HDFC', 'ICICI', 'Bajaj Finserv', 'SBI'];

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
    font-size: clamp(2.3rem, 4vw, 4rem);
    margin: 0 0 12px;
  }
  .hero p {
    color: var(--text-muted);
    line-height: 1.8;
    max-width: 760px;
  }
  .bank-grid, .calc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-top: 26px;
  }
  .bank-card, .calc-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 22px;
    padding: 24px;
    box-shadow: var(--shadow-md);
  }
  .bank-card h3 {
    margin-top: 0;
    margin-bottom: 8px;
  }
  .bank-card p {
    color: var(--text-muted);
    margin: 0;
    line-height: 1.7;
  }
  .calc-card h2 {
    margin-top: 0;
  }
  .calc-form {
    display: grid;
    gap: 14px;
  }
  .calc-form label {
    display: grid;
    gap: 6px;
    font-weight: 600;
  }
  .calc-form input {
    width: 100%;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
  .emi-result {
    background: rgba(0, 51, 160, 0.06);
    border: 1px solid rgba(0, 51, 160, 0.25);
    border-radius: 16px;
    padding: 18px;
    margin-top: 16px;
  }
  .emi-result strong {
    font-size: 2rem;
    display: block;
    margin-top: 6px;
  }
`;

function calculateEmi(principal, months, annualRate) {
  if (!principal || !months || principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / (12 * 100);
  if (monthlyRate === 0) return principal / months;
  const factor = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * factor) / (factor - 1);
}

export default function EmiOptions() {
  const [principal, setPrincipal] = useState(30000);
  const [months, setMonths] = useState(12);
  const [annualRate, setAnnualRate] = useState(0);

  const emi = useMemo(() => calculateEmi(principal, months, annualRate), [principal, months, annualRate]);

  return (
    <main className="page-shell">
      <style>{styles}</style>
      <div className="page-wrap">
        <section className="hero">
          <span className="eyebrow">EMI options</span>
          <h1>Flexible financing for your next upgrade.</h1>
          <p>
            Enjoy easy monthly repayment plans with partner banks and no-cost EMI options on eligible
            products across electronics and appliances.
          </p>
        </section>

        <section className="bank-grid">
          {banks.map((bank) => (
            <article className="bank-card" key={bank}>
              <h3>{bank}</h3>
              <p>Partner financing available on selected premium electronics and appliances.</p>
            </article>
          ))}
        </section>

        <section className="calc-grid">
          <div className="calc-card">
            <h2>EMI calculator</h2>
            <div className="calc-form">
              <label>
                Purchase amount
                <input type="number" value={principal} min="0" onChange={(event) => setPrincipal(Number(event.target.value) || 0)} />
              </label>
              <label>
                Tenure (months)
                <input type="number" value={months} min="1" onChange={(event) => setMonths(Number(event.target.value) || 1)} />
              </label>
              <label>
                Interest rate (% p.a.)
                <input type="number" value={annualRate} min="0" step="0.1" onChange={(event) => setAnnualRate(Number(event.target.value) || 0)} />
              </label>
            </div>
          </div>

          <div className="calc-card">
            <h2>Estimated EMI</h2>
            <div className="emi-result">
              <span>Monthly installment</span>
              <strong>₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
