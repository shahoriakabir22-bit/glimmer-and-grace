import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '../types/settings';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SETTINGS_STORAGE_KEY = 'gg_site_settings_v1';

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  resetSettings: () => void;
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse local site settings:', e);
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync from remote (Supabase) if available on load
  useEffect(() => {
    async function loadRemoteSettings() {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('settings')
          .eq('id', 'global')
          .maybeSingle();

        if (!error && data && data.settings) {
          const merged = { ...DEFAULT_SITE_SETTINGS, ...data.settings };
          setSettings(merged);
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
        }
      } catch (err) {
        // Silently use local settings
      }
    }
    loadRemoteSettings();
  }, []);

  // Listen for storage events (e.g. cross-tab admin updates)
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === SETTINGS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings({ ...DEFAULT_SITE_SETTINGS, ...parsed });
        } catch {
          // Ignore
        }
      }
    }
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateSettings = async (partial: Partial<SiteSettings>): Promise<boolean> => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist settings locally:', e);
    }

    // Attempt remote save to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('site_settings')
          .upsert({ id: 'global', settings: updated, updated_at: new Date().toISOString() });
      } catch (e) {
        console.warn('Failed to persist settings to Supabase:', e);
      }
    }

    return true;
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SITE_SETTINGS);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
    } catch (e) {
      console.warn('Failed to reset settings locally:', e);
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, resetSettings, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
