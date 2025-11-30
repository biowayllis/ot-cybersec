import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useSidebarShortcut } from "@/hooks/useSidebarShortcut";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";
import { PasswordExpiryDialog } from "@/components/PasswordExpiryDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Architecture from "./pages/Architecture";
import ITSecurity from "./pages/ITSecurity";
import OTSecurity from "./pages/OTSecurity";
import Assets from "./pages/Assets";
import Vulnerabilities from "./pages/Vulnerabilities";
import SIEMOperations from "./pages/SIEMOperations";
import Compliance from "./pages/Compliance";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Auth from "./pages/Auth";
import RoleManagement from "./pages/RoleManagement";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const SidebarShortcutHandler = () => {
  useSidebarShortcut();
  return null;
};

const AppContent = () => {
  const { passwordExpired, daysUntilExpiry, checkPasswordExpiry, user } = useAuth();
  const showPasswordDialog = passwordExpired || (daysUntilExpiry !== null && daysUntilExpiry <= 7);

  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <SidebarProvider defaultOpen={true}>
                  <SidebarShortcutHandler />
                  <div className="min-h-screen flex w-full">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-10">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarTrigger className="hover:bg-accent/50" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            Toggle sidebar ({navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+B)
                          </TooltipContent>
                        </Tooltip>
                        <div className="flex items-center gap-3">
                          <ThemeToggle />
                          <UserMenu />
                        </div>
                      </header>
                      <main className="flex-1 overflow-auto">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/assets" element={<Assets />} />
                          <Route path="/vulnerabilities" element={<Vulnerabilities />} />
                          <Route path="/compliance" element={<Compliance />} />
                          <Route path="/it-security" element={<ITSecurity />} />
                          <Route path="/ot-security" element={<OTSecurity />} />
                          <Route path="/siem-operations" element={<SIEMOperations />} />
                          <Route path="/alerts" element={<Alerts />} />
                          <Route path="/architecture" element={<Architecture />} />
                          <Route path="/role-management" element={<RoleManagement />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </TooltipProvider>
      
      {showPasswordDialog && (
        <PasswordExpiryDialog
          open={showPasswordDialog}
          isExpired={passwordExpired}
          daysUntilExpiry={daysUntilExpiry || 0}
          onPasswordChanged={checkPasswordExpiry}
        />
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
