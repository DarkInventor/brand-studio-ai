import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted rounded-md animate-pulse skeleton-shimmer",
        className
      )}
      {...props}
    />
  )
}

// Add shimmer effect via global CSS
// You can add this to your global CSS if not already present:
// .skeleton-shimmer::after {
//   content: "";
//   position: absolute;
//   top: 0;
//   left: -150%;
//   height: 100%;
//   width: 150%;
//   background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
//   animation: shimmer 1.2s infinite;
// }
// @keyframes shimmer {
//   100% { left: 100%; }
// }

export { Skeleton }
