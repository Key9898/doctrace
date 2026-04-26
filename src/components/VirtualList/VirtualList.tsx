import { useEffect, useRef, useState, useCallback } from "react";

interface VirtualListProps<T> {
  items: T[];
  estimatedItemHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  maxHeight?: number;
}

export function VirtualList<T>({
  items,
  estimatedItemHeight,
  overscan = 5,
  renderItem,
  keyExtractor,
  className,
  maxHeight = 600,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(maxHeight);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      setScrollTop(container.scrollTop);
    }
  }, []);

  const totalHeight = items.length * estimatedItemHeight;
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / estimatedItemHeight) - overscan,
  );
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / estimatedItemHeight) + overscan,
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  // For small lists, render everything directly without virtualization
  if (items.length <= 50) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={keyExtractor(item, index)}>{renderItem(item, index)}</div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      onScroll={handleScroll}
      style={{ maxHeight, overflowY: "auto" }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((item, localIndex) => {
          const globalIndex = startIndex + localIndex;
          return (
            <div
              key={keyExtractor(item, globalIndex)}
              style={{
                position: "absolute",
                top: globalIndex * estimatedItemHeight,
                left: 0,
                right: 0,
                minHeight: estimatedItemHeight,
              }}
            >
              {renderItem(item, globalIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
