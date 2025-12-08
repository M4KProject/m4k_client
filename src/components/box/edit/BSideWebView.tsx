import { Css } from 'fluxio';
import { useBEditController } from './useBEditController';
import { BSideContent } from './BSideContent';

const c = Css('BSideWebView', {});

export const BSideWebView = () => {
  const controller = useBEditController()!;
  return <BSideContent {...c('')}>BSideWebView</BSideContent>;
};
