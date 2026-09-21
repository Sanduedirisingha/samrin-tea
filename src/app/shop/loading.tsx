import { Skeleton, ProductGridSkeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="container-page pt-14 pb-10 sm:pt-20">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-5 h-12 w-full max-w-xl" />
      <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
      <div className="mt-14">
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}
