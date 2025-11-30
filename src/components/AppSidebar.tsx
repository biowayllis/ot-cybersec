import { 
  Home, 
  Network, 
  Shield, 
  Server, 
  Database, 
  Bug, 
  AlertTriangle, 
  ClipboardCheck,
  BarChart3,
  Bell,
  Users,
  UserCircle
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useUserRole } from "@/hooks/useUserRole";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ICSCoreLogo } from "@/components/WayllisLogo";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { open } = useSidebar();
  const { isCISO } = useUserRole();

  const items = [
    { title: "Executive Overview", url: "/", icon: Home },
    { title: "Platform Architecture", url: "/architecture", icon: Network },
    { title: "IT Security", url: "/it-security", icon: Shield },
    { title: "OT/ICS Security", url: "/ot-security", icon: Server },
    { title: "Asset Management", url: "/assets", icon: Database },
    { title: "Vulnerability & Patch", url: "/vulnerabilities", icon: Bug },
    { title: "SIEM + XDR Operations", url: "/siem-operations", icon: AlertTriangle },
    { title: "Compliance & GRC", url: "/compliance", icon: ClipboardCheck },
    { title: "Analytics & Reporting", url: "/analytics", icon: BarChart3 },
    { title: "Alert Management", url: "/alerts", icon: Bell },
    { title: "Profile & Security", url: "/profile", icon: UserCircle },
    ...(isCISO ? [{ title: "Role Management", url: "/role-management", icon: Users }] : []),
  ];

  return (
    <Sidebar className={open ? "w-64" : "w-14"}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        {open ? (
          <div className="flex flex-col gap-1">
            <ICSCoreLogo size="sm" />
            <p className="text-xs text-sidebar-foreground/70 mt-1">Cyber Defense Platform</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <ICSCoreLogo size="sm" showText={false} />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {open ? (
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end={item.url === "/"} 
                        className="hover:bg-sidebar-accent/50 transition-colors"
                        activeClassName="bg-sidebar-accent text-primary font-medium"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <NavLink 
                            to={item.url} 
                            end={item.url === "/"} 
                            className="hover:bg-sidebar-accent/50 transition-colors justify-center"
                            activeClassName="bg-sidebar-accent text-primary font-medium"
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                          </NavLink>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
