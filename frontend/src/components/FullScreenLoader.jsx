function FullScreenLoader({ label = 'Loading' }) {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        color: 'var(--color-muted)'
      }}
    >
      <div className="spinner" style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', animation: 'spin 1s linear infinite' }} />
      <p>{label}</p>
    </div>
  );
}

export default FullScreenLoader;
