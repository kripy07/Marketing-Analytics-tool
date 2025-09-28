import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface UserRole {
  isAdmin: boolean;
  isViewer: boolean;
  canEdit: boolean;
  canView: boolean;
  organizationId: string | null;
}

export function useUserRole(): UserRole {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>({
    isAdmin: false,
    isViewer: false,
    canEdit: false,
    canView: false,
    organizationId: null,
  });

  useEffect(() => {
    if (user) {
      fetchUserRole();
    } else {
      setUserRole({
        isAdmin: false,
        isViewer: false,
        canEdit: false,
        canView: false,
        organizationId: null,
      });
    }
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, organization_id')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        const isAdmin = data.role === 'admin';
        const isViewer = data.role === 'viewer';
        
        setUserRole({
          isAdmin,
          isViewer,
          canEdit: isAdmin,
          canView: true,
          organizationId: data.organization_id,
        });
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  return userRole;
}