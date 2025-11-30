import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = 'soc_analyst' | 'ot_engineer' | 'ciso' | 'compliance_officer';

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: roles, isLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(r => r.role as AppRole);
    },
    enabled: !!user,
  });

  const hasRole = (role: AppRole) => {
    return roles?.includes(role) ?? false;
  };

  const hasAnyRole = (roleList: AppRole[]) => {
    return roleList.some(role => hasRole(role));
  };

  const isCISO = hasRole('ciso');
  const isSOCAnalyst = hasRole('soc_analyst');
  const isOTEngineer = hasRole('ot_engineer');
  const isComplianceOfficer = hasRole('compliance_officer');

  return {
    roles: roles ?? [],
    hasRole,
    hasAnyRole,
    isCISO,
    isSOCAnalyst,
    isOTEngineer,
    isComplianceOfficer,
    isLoading,
  };
};
