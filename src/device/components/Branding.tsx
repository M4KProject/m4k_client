import { Css } from '@common/ui';
import logoSvg from '@/admin/assets/logo.svg';
import { addOverlay, removeOverlay } from '@common/ui/overlay';
import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { logger } from '@common/utils';
import { portal } from '@common/components';

const log = logger('Branding');

const c = Css('Branding', {
  '': {
    display: 'none',
  },
  Content: {
    position: 'fixed',
    r: 2,
    b: 2,
    fRow: ['center', 'center'],
    gap: 0.5,
    opacity: 0.7,
    zIndex: 9998,
    pointerEvents: 'none',
  },
  Logo: {
    h: 1.5,
    w: 'auto',
  },
});

export interface BrandingProps {}

const BrandingContent = ({}: BrandingProps) => {
  log.d('Content');
  return (
    <div class={c('Content')}>
      <img src={logoSvg} alt="Mediactil" class={c('Logo')} />
    </div>
  );
};

export const Branding = () => {
  log.d('Branding');
  useEffect(() => portal(<BrandingContent />), []);
  return <div class={c()} />;
};
