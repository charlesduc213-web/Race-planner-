import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  variant?: "full" | "compact" | "icon"
  animated?: boolean
}

export function Logo({ className = "", size = "md", variant = "full", animated = false }: LogoProps) {
  const sizeConfig = {
    xs: { width: 80, height: 20, class: "h-5" },
    sm: { width: 120, height: 30, class: "h-7" },
    md: { width: 180, height: 45, class: "h-11" },
    lg: { width: 240, height: 60, class: "h-15" },
    xl: { width: 320, height: 80, class: "h-20" },
  }

  const config = sizeConfig[size]

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        animated && "transition-all duration-300 hover:scale-105",
        className,
      )}
    >
      <Image
        src="/images/race-planner-logo.png"
        alt="Race Planner - Planificateur de courses cyclistes"
        width={config.width}
        height={config.height}
        className={cn(
          config.class,
          "w-auto object-contain",
          variant === "compact" && "max-w-[120px]",
          variant === "icon" && "max-w-[40px]",
        )}
        priority
        quality={95}
      />
    </div>
  )
}

// Version compacte pour la navigation
export function LogoCompact({ className }: { className?: string }) {
  return <Logo size="sm" variant="compact" className={className} animated />
}

// Version icône pour les espaces restreints
export function LogoIcon({ className }: { className?: string }) {
  return <Logo size="xs" variant="icon" className={className} />
}
