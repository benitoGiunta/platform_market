// Skeletons (animate-pulse) — structure stable, pas de layout shift.
const block = "animate-pulse rounded bg-light";

export function SkeletonInfoBlock() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[220px_1fr]">
      <div className={`${block} h-40`} />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`${block} h-5`} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonDonut() {
  return <div className={`${block} mx-auto h-48 w-48 !rounded-full`} />;
}

export function SkeletonWorkflow() {
  return (
    <div className="flex items-center justify-between">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`${block} h-10 w-10 !rounded-full`} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`${block} h-10`} />
      ))}
    </div>
  );
}
