import { Css } from 'fluxio';
import logoSvg from '@/assets/logo.svg';
import { useEffect } from 'preact/hooks';
import { logger } from 'fluxio';
import { portal } from '@/components/common/Portal';

const log = logger('Branding');

const c = Css('Branding', {
  '': {
    display: 'none',
  },
  Content: {
    position: 'fixed',
    r: 2,
    b: 2,
    center: 1,
    gap: 0.5,
    opacity: 0.7,
    zIndex: 9998,
    pointerEvents: 'none',
  },
  Logo: {
    h: 12,
    w: 'auto',
  },
});

export interface BrandingProps {}

const BrandingContent = (_props: BrandingProps) => {
  log.d('Content');
  return (
    <div {...c('Content')}>
      <img src={logoSvg} alt="Mediactil" {...c('Logo')} />
    </div>
  );
};

export const Branding = () => {
  log.d('Branding');
  useEffect(() => portal(<BrandingContent />), []);
  return <div {...c('')} />;
};
