import { useEffect, useRef } from 'react';
import { UI_CONSTANTS } from '@utils/constants';

/**
 * Hook to auto-scroll chat container to bottom when messages change
 */
export const useAutoScroll = <T,>(dependency: T) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: UI_CONSTANTS.SCROLL_BEHAVIOR
      });
    }
  }, [dependency]);

  return scrollRef;
};
