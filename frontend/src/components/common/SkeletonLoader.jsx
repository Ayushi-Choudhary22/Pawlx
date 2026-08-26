const SkeletonLoader = ({ className = 'h-4 w-full', rounded = 'rounded-md' }) => {
  return <div className={`bg-border/70 animate-pulse ${rounded} ${className}`} />;
};

export const SkeletonCard = () => (
  <div className="card p-4 space-y-3">
    <SkeletonLoader className="h-36 w-full" rounded="rounded-lg" />
    <SkeletonLoader className="h-4 w-3/4" />
    <SkeletonLoader className="h-4 w-1/2" />
  </div>
);

export default SkeletonLoader;
