import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * ScrollToTop component - Professional ecommerce navigation handler.
 * 
 * - Ensures new pages open at the top.
 * - Preserves native scroll position on Back/Forward navigation.
 * - Resolves "double back" and "bottom jump" issues in React Router.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  // useLayoutEffect runs synchronously after all DOM mutations but before the browser paints.
  // This is essential to prevent the "scroll jump" or "flicker" on navigation.
  useLayoutEffect(() => {
    // Only scroll to top on PUSH (new page) or REPLACE (redirect).
    // Professional back navigation (POP) should let the browser or app 
    // handle the scroll position (preserving UX).
    if (navType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
};

export default ScrollToTop;
