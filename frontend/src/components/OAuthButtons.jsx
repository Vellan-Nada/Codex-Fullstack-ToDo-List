import { OAUTH_PROVIDERS } from '../lib/constants.js';

function OAuthButtons({ onSelect, disabled }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {OAUTH_PROVIDERS.map((provider) => (
        <button
          key={provider.provider}
          type="button"
          className="btn btn-outline"
          disabled={disabled}
          onClick={() => onSelect(provider.provider)}
        >
          Continue with {provider.label}
        </button>
      ))}
    </div>
  );
}

export default OAuthButtons;
