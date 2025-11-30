import { Link, LinkProps, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps extends LinkProps {
  activeClassName?: string;
  end?: boolean;
}

export const NavLink = ({ 
  to, 
  children, 
  className, 
  activeClassName = "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
  end = false,
  ...props 
}: NavLinkProps) => {
  const location = useLocation();
  const isActive = end 
    ? location.pathname === to 
    : location.pathname.startsWith(to as string);

  return (
    <Link
      to={to}
      className={cn(
        className,
        isActive && activeClassName
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
