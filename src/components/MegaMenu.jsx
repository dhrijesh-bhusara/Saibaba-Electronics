import { Link } from 'react-router-dom';
import './MegaMenu.css';

const categoryGroups = [
  {
    name: 'Mobile & Accessories',
    slug: 'mobiles',
    intro: 'Latest smartphones, wearables, audio and charging essentials.',
    items: [
      { label: 'Android Phones', brand: 'samsung' },
      { label: 'iPhones', brand: 'apple' },
      { label: 'Smart Watches', brand: 'noise' },
      { label: 'Power Banks', brand: 'mi' },
    ],
  },
  {
    name: 'Televisions',
    slug: 'televisions',
    intro: 'Big-screen entertainment with cinematic picture quality.',
    items: [
      { label: '4K OLED', brand: 'sony' },
      { label: 'QLED', brand: 'samsung' },
      { label: 'Smart TVs', brand: 'mi' },
      { label: 'Budget LED', brand: 'realme' },
    ],
  },
  {
    name: 'Home Appliances',
    slug: 'appliances',
    intro: 'Smart home upgrades built for everyday comfort.',
    items: [
      { label: 'Washing Machines', brand: 'lg' },
      { label: 'Refrigerators', brand: 'whirlpool' },
      { label: 'Air Conditioners', brand: 'daikin' },
      { label: 'Microwaves', brand: 'philips' },
    ],
  },
  {
    name: 'Laptops & PCs',
    slug: 'laptops',
    intro: 'Productivity powerhouses and creator-grade machines.',
    items: [
      { label: 'Gaming Laptops', brand: 'asus' },
      { label: 'Ultrabooks', brand: 'lenovo' },
      { label: 'Office PCs', brand: 'dell' },
      { label: 'Workstations', brand: 'hp' },
    ],
  },
];

export default function MegaMenu({ open, onClose }) {
  if (!open) return null;

  const handleLinkClick = () => {
    onClose?.();
  };

  return (
    <div className="mega-menu-backdrop" onClick={onClose}>
      <div className="mega-menu" onClick={(event) => event.stopPropagation()}>
        <div className="mega-menu-header">
          <div>
            <span className="eyebrow">Browse categories</span>
            <h3>Shop by department</h3>
          </div>
          <button type="button" className="mega-menu-close" onClick={onClose}>Close</button>
        </div>

        <div className="mega-menu-grid">
          {categoryGroups.map((group) => (
            <div className="mega-column" key={group.slug}>
              <Link to={`/category/${group.slug}`} className="mega-title" onClick={handleLinkClick}>
                {group.name}
              </Link>
              <p>{group.intro}</p>
              <div className="mega-links">
                {group.items.map((item) => (
                  <Link
                    key={`${group.slug}-${item.label}`}
                    to={`/category/${group.slug}?brand=${encodeURIComponent(item.brand)}`}
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
