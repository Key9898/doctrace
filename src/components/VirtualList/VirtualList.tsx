interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  ariaLabel?: string;
}

export function VirtualList<T>({
  items,
  renderItem,
  keyExtractor,
  className,
  ariaLabel,
}: VirtualListProps<T>) {
  return (
    <div aria-label={ariaLabel} className={className} role="list">
      {items.map((item, index) => (
        <div
          className="dt-content-visibility-auto"
          key={keyExtractor(item, index)}
          role="listitem"
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
