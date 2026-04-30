interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
}

export function VirtualList<T>({
  items,
  renderItem,
  keyExtractor,
  className,
}: VirtualListProps<T>) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <div
          className="dt-content-visibility-auto"
          key={keyExtractor(item, index)}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
