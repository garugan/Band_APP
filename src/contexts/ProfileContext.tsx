import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Profile } from '../data/types';
import { ProfileStorage } from '../data/storage';

const DEFAULT_PROFILE: Profile = {
  name: '',
  part: '',
  bandName: '',
};

interface ProfileContextType {
  profile: Profile;
  isLoading: boolean;
  updateProfile: (profile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await ProfileStorage.get();
        if (stored) {
          setProfile(stored);
        }
      } catch (e) {
        console.error('Failed to load profile:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const updateProfile = useCallback((next: Profile) => {
    setProfile(next);
    ProfileStorage.save(next).catch((e) =>
      console.error('Failed to save profile:', e)
    );
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, isLoading, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
