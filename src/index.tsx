import { addResponsiveListener, router } from '@common/helpers';
import './app';

addResponsiveListener();

// router.add('/cvc', () => import('./cvc'));
// router.add('/cvc/:page', () => import('./cvc'));
// router.add('/cvc/:page/:doc', () => import('./cvc'));

router.add('/admin', () => import('./admin'));
router.add('/device', () => import('./device'));
router.add('/:contentKey', () => import('./contents'));

// Check if we're on root path and redirect to admin
const checkRootRedirect = () => {
  const path = window.location.pathname;
  if (path === '/' || path === '') {
    const isDevice = localStorage.getItem('isDevice');
    router.push(isDevice ? '/device/' : '/admin/');
  }
};

// Check on initial load
checkRootRedirect();

router.forceRefresh();
