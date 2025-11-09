export default function SkeletonRow({ density = 'comfortable' }: { density?: 'compact' | 'comfortable' }) {
  const height = density === 'compact' ? 'h-12' : 'h-16';
  
  return (
    <div className={`${height} flex items-center gap-4 px-4 border-b border-border`} data-testid="skeleton-row">
      <div className="w-8 h-4 shimmer rounded" />
      <div className="flex items-center gap-2 flex-1">
        <div className="w-6 h-6 shimmer rounded-full" />
        <div className="w-24 h-4 shimmer rounded" />
      </div>
      <div className="w-20 h-4 shimmer rounded" />
      <div className="w-16 h-4 shimmer rounded" />
      <div className="w-16 h-4 shimmer rounded" />
      <div className="w-24 h-4 shimmer rounded" />
      <div className="w-24 h-4 shimmer rounded" />
      <div className="w-20 h-4 shimmer rounded" />
      <div className="w-8 h-4 shimmer rounded" />
    </div>
  );
}
