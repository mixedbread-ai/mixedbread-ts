import { useCallback, useRef, useState } from 'react';

export function useMeasure<T extends HTMLElement>() {
  const [dimensions, setDimensions] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  const previousObserver = useRef<ResizeObserver | null>(null);

  const customRef = useCallback((node: T | null) => {
    if (previousObserver.current) {
      previousObserver.current.disconnect();
      previousObserver.current = null;
    }

    if (node?.nodeType === Node.ELEMENT_NODE) {
      const observer = new ResizeObserver(([entry]) => {
        if (entry?.borderBoxSize?.[0]) {
          const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0];

          setDimensions({ width, height });
        }
      });

      observer.observe(node);
      previousObserver.current = observer;
    }
  }, []);

  return [customRef, dimensions] as const;
}
