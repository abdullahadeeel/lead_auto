export function ProductSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 p-1 animate-pulse">
          <div className="aspect-square bg-gray-50 mb-4" />
          <div className="px-4 pb-4 space-y-3">
            <div className="h-2 bg-gray-50 rounded w-1/4" />
            <div className="h-4 bg-gray-50 rounded w-3/4" />
            <div className="h-3 bg-gray-50 rounded w-full" />
            <div className="flex justify-between items-center pt-4">
              <div className="h-6 bg-gray-50 rounded w-1/3" />
              <div className="h-4 bg-gray-50 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
