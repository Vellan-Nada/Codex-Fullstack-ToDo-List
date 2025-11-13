function PlanProgress({ used, limit, plan }) {
  const value = limit ? Math.min((used / limit) * 100, 100) : 0;
  const label = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Free';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Usage</h3>
        <span className="chip">{label}</span>
      </div>
      <p style={{ color: 'var(--color-muted)', margin: 0 }}>
        {used} / {limit} active tasks
      </p>
      <div style={{ height: 10, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, background: value > 90 ? 'var(--color-danger)' : 'var(--color-primary)', height: '100%' }} />
      </div>
    </div>
  );
}

export default PlanProgress;
