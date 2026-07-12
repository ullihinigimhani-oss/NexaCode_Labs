import defaultLogoUrl from '../../assets/logo/nexacode-logo-full.svg';
import lightLogoUrl from '../../assets/logo/nexacode-logo-light.svg';
import markLogoUrl from '../../assets/logo/nexacode-mark.svg';

function Logo({ variant = 'default', showText = true, className = '' }) {
  const source = showText
    ? variant === 'light'
      ? lightLogoUrl
      : defaultLogoUrl
    : markLogoUrl;

  return (
    <img
      src={source}
      alt={showText ? 'NexaCode Labs logo' : 'NexaCode Labs mark'}
      className={`block h-auto max-w-full ${className}`.trim()}
    />
  );
}

export default Logo;
