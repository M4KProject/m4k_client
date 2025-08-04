import { addResponsiveListener, router } from '@common/helpers';
import './app';

addResponsiveListener();

// router.add('/cvc', () => import('./cvc'));
// router.add('/cvc/:page', () => import('./cvc'));
// router.add('/cvc/:page/:doc', () => import('./cvc'));

router.add('', () => import('./admin'));

router.forceRefresh();