import React from 'react';

/**
 * Custom hooks for accessibility features
 */

/**
 * Hook for managing focus trap within a modal or popup
 */
export const useFocusTrap = (isActive = true) => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element when trap becomes active
    firstElement?.focus();

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
};

/**
 * Hook for keyboard navigation
 */
export const useKeyboardNavigation = (options: any = {}) => {
  const {
    onEnter = () => { },
    onEscape = () => { },
    onArrowUp = () => { },
    onArrowDown = () => { },
    onArrowLeft = () => { },
    onArrowRight = () => { },
    enabled = true
  } = options;

  const elementRef = React.useRef(null);

  React.useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          onEnter(e);
          break;
        case 'Escape':
          e.preventDefault();
          onEscape(e);
          break;
        case 'ArrowUp':
          e.preventDefault();
          onArrowUp(e);
          break;
        case 'ArrowDown':
          e.preventDefault();
          onArrowDown(e);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onArrowLeft(e);
          break;
        case 'ArrowRight':
          e.preventDefault();
          onArrowRight(e);
          break;
      }
    };

    const element = elementRef.current;
    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]);

  return elementRef;
};

/**
 * Hook for managing ARIA announcements
 */
export const useAnnouncer = () => {
  const announcerRef = React.useRef(null);

  React.useEffect(() => {
    // Create hidden announcer element if it doesn't exist
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      if (announcerRef.current) {
        document.body.removeChild(announcerRef.current);
        announcerRef.current = null;
      }
    };
  }, []);

  const announce = React.useCallback((message, priority = 'polite') => {
    if (announcerRef.current) {
      announcerRef.current.setAttribute('aria-live', priority);
      announcerRef.current.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce };
};

/**
 * Hook for managing reduced motion preferences
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook for managing high contrast preferences
 */
export const useHighContrast = () => {
  const [prefersHighContrast, setPrefersHighContrast] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersHighContrast;
};

/**
 * Hook for managing skip links
 */
export const useSkipLinks = () => {
  const skipLinksRef = React.useRef([]);

  const addSkipLink = React.useCallback((id, label) => {
    skipLinksRef.current.push({ id, label });
  }, []);

  const removeSkipLink = React.useCallback((id) => {
    skipLinksRef.current = skipLinksRef.current.filter(link => link.id !== id);
  }, []);

  const renderSkipLinks = React.useCallback(() => {
    return skipLinksRef.current.map(({ id, label }: any) => (
      <a
        key={id}
        href={`#${id}`}
        className="z-50 p-2 text-white bg-blue-600 sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0"
        onFocus={(e: any) => e.target.scrollIntoView()}
      >
        {label}
      </a>
    ));
  }, []);

  return { addSkipLink, removeSkipLink, renderSkipLinks };
};

/**
 * Hook for managing ARIA expanded state
 */
export const useExpanded = (initialState = false) => {
  const [isExpanded, setIsExpanded] = React.useState(initialState);

  const toggle = React.useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const expand = React.useCallback(() => {
    setIsExpanded(true);
  }, []);

  const collapse = React.useCallback(() => {
    setIsExpanded(false);
  }, []);

  const ariaProps = React.useMemo(() => ({
    'aria-expanded': isExpanded,
    'aria-controls': undefined // Should be set by the component using this hook
  }), [isExpanded]);

  return {
    isExpanded,
    toggle,
    expand,
    collapse,
    ariaProps
  };
};

/**
 * Hook for managing live regions
 */
export const useLiveRegion = (politeness = 'polite') => {
  const [message, setMessage] = React.useState('');
  const timeoutRef = React.useRef(null);

  const announce = React.useCallback((newMessage, clearDelay = 1000) => {
    setMessage(newMessage);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setMessage('');
    }, clearDelay);
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const LiveRegion = React.useCallback(({ className = '' }: any) => (
    <div
      aria-live={politeness as any}
      aria-atomic="true"
      className={`sr-only ${className}`}
    >
      {message}
    </div>
  ), [message, politeness]);

  return { announce, LiveRegion };
};

export default {
  useFocusTrap,
  useKeyboardNavigation,
  useAnnouncer,
  useReducedMotion,
  useHighContrast,
  useSkipLinks,
  useExpanded,
  useLiveRegion
};
