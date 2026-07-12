import defaultLogoUrl from '../../assets/logo/vertex-logo-full.svg';
import lightLogoUrl from '../../assets/logo/vertex-logo-light.svg';
import markLogoUrl from '../../assets/logo/vertex-mark.svg';

function Logo({ variant = 'default', showText = true, className = '' }) {
  const source = showText
    ? variant === 'light'
      ? lightLogoUrl
      : defaultLogoUrl
    : markLogoUrl;

  return (
    <img
      src={source}
      alt={showText ? 'Vertex Solutions logo' : 'Vertex Solutions mark'}
      className={`block h-auto max-w-full ${className}`.trim()}
    />
  );
}

export default Logo;
