import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant } from '../types/index.js';

interface TenantContextType {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  isLoading: boolean;
  switchTenant: (tenantId: string) => void;
  updateBrandingLocally: (branding: Partial<Tenant['branding']>) => void;
  refreshTenantData: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType>({
  currentTenant: null,
  tenants: [],
  isLoading: true,
  switchTenant: () => {},
  updateBrandingLocally: () => {},
  refreshTenantData: async () => {},
});

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/v1/tenants');
      const data = await res.json();
      if (data.success && data.tenants?.length > 0) {
        setTenants(data.tenants);
        // Default to first tenant or existing selection
        if (!currentTenant) {
          const defaultTenant = data.tenants[0];
          setCurrentTenant(defaultTenant);
          applyBrandColors(defaultTenant.branding);
        } else {
          const fresh = data.tenants.find((t: Tenant) => t.id === currentTenant.id);
          if (fresh) {
            setCurrentTenant(fresh);
            applyBrandColors(fresh.branding);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load tenants:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyBrandColors = (branding: Tenant['branding']) => {
    if (!branding) return;
    document.documentElement.style.setProperty('--color-primary', branding.primaryColor || '#0f766e');
    document.documentElement.style.setProperty('--color-secondary', branding.secondaryColor || '#b45309');
    document.documentElement.style.setProperty('--color-accent', branding.accentColor || '#0284c7');
  };

  const switchTenant = (tenantId: string) => {
    const selected = tenants.find(t => t.id === tenantId || t.subdomain === tenantId);
    if (selected) {
      setCurrentTenant(selected);
      applyBrandColors(selected.branding);
      localStorage.setItem('schoolos_active_tenant', selected.id);
    }
  };

  const updateBrandingLocally = (branding: Partial<Tenant['branding']>) => {
    if (!currentTenant) return;
    const updated: Tenant = {
      ...currentTenant,
      branding: {
        ...currentTenant.branding,
        ...branding
      }
    };
    setCurrentTenant(updated);
    applyBrandColors(updated.branding);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  return (
    <TenantContext.Provider value={{
      currentTenant,
      tenants,
      isLoading,
      switchTenant,
      updateBrandingLocally,
      refreshTenantData: fetchTenants
    }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
