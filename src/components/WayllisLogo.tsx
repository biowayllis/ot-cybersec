import { cn } from "@/lib/utils";

interface ICSCoreLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const ICSCoreLogo = ({ className, size = "md", showText = true }: ICSCoreLogoProps) => {
  const sizes = {
    sm: { icon: "h-6 w-6", text: "text-lg" },
    md: { icon: "h-10 w-10", text: "text-2xl" },
    lg: { icon: "h-14 w-14", text: "text-4xl" },
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Modern geometric shield logo */}
      <div className={cn("relative", sizes[size].icon)}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer shield shape with gradient */}
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
            </linearGradient>
            <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
          
          {/* Shield outline */}
          <path
            d="M24 4L6 12V22C6 33.1 13.9 43.4 24 46C34.1 43.4 42 33.1 42 22V12L24 4Z"
            fill="url(#shieldGradient)"
            fillOpacity="0.15"
            stroke="url(#innerGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Inner hexagonal pattern - represents network/connectivity */}
          <path
            d="M24 14L32 18.5V27.5L24 32L16 27.5V18.5L24 14Z"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Central node */}
          <circle
            cx="24"
            cy="23"
            r="3"
            fill="hsl(var(--primary))"
          />
          
          {/* Connection lines */}
          <line x1="24" y1="14" x2="24" y2="20" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          <line x1="32" y1="18.5" x2="27" y2="21" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          <line x1="32" y1="27.5" x2="27" y2="25" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          <line x1="24" y1="32" x2="24" y2="26" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          <line x1="16" y1="27.5" x2="21" y2="25" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          <line x1="16" y1="18.5" x2="21" y2="21" stroke="hsl(var(--primary))" strokeWidth="1.5" />
        </svg>
        
        {/* Glow effect */}
        <div className="absolute inset-0 blur-lg bg-primary/20 -z-10 animate-pulse" />
      </div>
      
      {showText && (
        <span className={cn(
          "font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent",
          sizes[size].text
        )}>
          ICSCore
        </span>
      )}
    </div>
  );
};
