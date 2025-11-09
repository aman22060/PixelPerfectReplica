import SkeletonRow from '../table/SkeletonRow';

export default function SkeletonRowExample() {
  return (
    <div className="w-full border border-border rounded-md">
      <SkeletonRow density="comfortable" />
      <SkeletonRow density="compact" />
    </div>
  );
}
