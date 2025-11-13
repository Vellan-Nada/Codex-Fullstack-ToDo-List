import { Link } from 'react-router-dom';

function UpgradeCallout() {
  return (
    <div className="card" style={{ background: '#0f172a', color: 'white' }}>
      <h3>Need more headspace?</h3>
      <p style={{ color: '#cbd5f5' }}>
        Upgrade to premium and unlock twenty concurrent tasks, calendar sync, and automations powered by your Railway
        backend.
      </p>
      <Link to="/upgrade" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        Upgrade with Stripe
      </Link>
    </div>
  );
}

export default UpgradeCallout;
