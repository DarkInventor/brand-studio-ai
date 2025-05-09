import Link from "next/link"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  href?: string
  className?: string
}

export function BrandLogo({ size = "md", showText = true, href = "/", className }: BrandLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const LogoContent = () => (
    <div className={cn("flex items-center gap-2 ", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-lg bg-primary text-primary-foreground",
          sizeClasses[size],
        )}
      >
        <span className="font-black">B</span>
        <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
          AI
        </div>
      </div>

      {showText && (
        <span className={`${textSizeClasses[size]} font-bold tracking-tight`}>
          BrandStudio<span className="font-black text-primary">AI</span>
          <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">BETA</span>
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
