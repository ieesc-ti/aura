'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  Deal,
  Contact,
  Task,
  Activity,
  DealStage,
  AppUser,
  TabKey,
  AccessProfile,
  Expense,
  MusicRegistration,
  ClientSubscription,
} from './types';
import {
  INITIAL_DEALS,
  INITIAL_CONTACTS,
  INITIAL_TASKS,
  INITIAL_ACTIVITIES,
  INITIAL_EXPENSES,
  INITIAL_REGISTRATIONS,
  INITIAL_SUBSCRIPTIONS,
} from './mock-data';
import { INITIAL_USERS, INITIAL_ACCESS_PROFILES, DEFAULT_ROLE_PERMISSIONS } from './user-presets';
import { SupabaseService } from './supabaseService';
import { getSupabaseConfig } from './supabase';

interface CRMContextType {
  deals: Deal[];
  contacts: Contact[];
  tasks: Task[];
  activities: Activity[];
  expenses: Expense[];
  musicRegistrations: MusicRegistration[];
  subscriptions: ClientSubscription[];
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  selectedDealId: string | null;
  setSelectedDealId: (id: string | null) => void;
  selectedDeal: Deal | null;
  currentView: 'app' | 'landing';
  setCurrentView: (view: 'app' | 'landing') => void;
  goToLandingPage: () => void;
  goToApp: () => void;
  isLoggedIn: boolean;
  logout: () => void;
  loginWithUser: (user: AppUser) => void;
  users: AppUser[];
  accessProfiles: AccessProfile[];
  currentUserId: string;
  currentUser: AppUser;
  switchUser: (userId: string) => void;
  saveUser: (user: Partial<AppUser>) => void;
  deleteUser: (userId: string) => void;
  saveAccessProfile: (profile: Partial<AccessProfile>) => void;
  deleteAccessProfile: (profileId: string) => void;
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => void;
  updateDealStage: (dealId: string, stage: DealStage) => void;
  deleteDeal: (dealId: string) => void;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  updateContact: (contact: Contact) => void;
  deleteContact: (contactId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (taskId: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  addMusicRegistration: (reg: Omit<MusicRegistration, 'id' | 'registrationDate'>) => void;
  updateMusicRegistration: (reg: MusicRegistration) => void;
  issueIsrc: (regId: string) => void;
  addSubscription: (sub: Omit<ClientSubscription, 'id'>) => void;
  isNewDealModalOpen: boolean;
  setIsNewDealModalOpen: (open: boolean) => void;
  isNewContactModalOpen: boolean;
  setIsNewContactModalOpen: (open: boolean) => void;
  isNewTaskModalOpen: boolean;
  setIsNewTaskModalOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  selectedCertificateReg: MusicRegistration | null;
  openCertificateModal: (reg: MusicRegistration) => void;
  closeCertificateModal: () => void;
  isCertificateModalOpen: boolean;
  isUserManagementOpen: boolean;
  setIsUserManagementOpen: (open: boolean) => void;
  isProfileManagementOpen: boolean;
  setIsProfileManagementOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const STORAGE_KEY = 'sonora_crm_state_v1';

export function CRMProvider({ children }: { children: ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [musicRegistrations, setMusicRegistrations] = useState<MusicRegistration[]>(INITIAL_REGISTRATIONS);
  const [subscriptions, setSubscriptions] = useState<ClientSubscription[]>(INITIAL_SUBSCRIPTIONS);
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'app' | 'landing'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Multi-user & profiles
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [accessProfiles, setAccessProfiles] = useState<AccessProfile[]>(INITIAL_ACCESS_PROFILES);
  const [currentUserId, setCurrentUserId] = useState<string>('user-1');

  // Modals state
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState(false);
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isProfileManagementOpen, setIsProfileManagementOpen] = useState(false);
  const [selectedCertificateReg, setSelectedCertificateReg] = useState<MusicRegistration | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from local storage and sync with Supabase
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.deals) setDeals(parsed.deals);
        if (parsed.contacts) setContacts(parsed.contacts);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.musicRegistrations) setMusicRegistrations(parsed.musicRegistrations);
        if (parsed.subscriptions) setSubscriptions(parsed.subscriptions);
      }
      const savedUserStr = localStorage.getItem('aura_current_user');
      if (savedUserStr) {
        try {
          const parsedUser = JSON.parse(savedUserStr);
          if (parsedUser && parsedUser.id) {
            setUsers((prev) => {
              if (prev.some((u) => u.id === parsedUser.id)) return prev;
              return [parsedUser, ...prev];
            });
            setCurrentUserId(parsedUser.id);
            setIsLoggedIn(true);
            setCurrentView('app');
          }
        } catch {}
      } else {
        const savedSession = localStorage.getItem('aura_user_session') || localStorage.getItem('sonora_user_session');
        if (savedSession) {
          setCurrentUserId(savedSession);
          setIsLoggedIn(true);
          setCurrentView('app');
        }
      }
    } catch {
      // ignore
    }

    const syncFromSupabase = async () => {
      const config = getSupabaseConfig();
      if (config.isConfigured) {
        try {
          const [
            remoteDeals,
            remoteContacts,
            remoteRegistrations,
            remoteExpenses,
            remoteUsers,
            remoteProfiles,
          ] = await Promise.all([
            SupabaseService.fetchDeals(),
            SupabaseService.fetchContacts(),
            SupabaseService.fetchMusicRegistrations(),
            SupabaseService.fetchExpenses(),
            SupabaseService.fetchUsers(),
            SupabaseService.fetchProfiles(),
          ]);

          if (remoteDeals && remoteDeals.length > 0) setDeals(remoteDeals);
          if (remoteContacts && remoteContacts.length > 0) setContacts(remoteContacts);
          if (remoteRegistrations && remoteRegistrations.length > 0)
            setMusicRegistrations(remoteRegistrations);
          if (remoteExpenses && remoteExpenses.length > 0) setExpenses(remoteExpenses);
          if (remoteUsers && remoteUsers.length > 0) setUsers(remoteUsers);
          if (remoteProfiles && remoteProfiles.length > 0) setAccessProfiles(remoteProfiles);
        } catch (err) {
          console.warn('[CRM] Supabase sync fallback to cache:', err);
        }
      }
    };
    syncFromSupabase();
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          deals,
          contacts,
          tasks,
          expenses,
          musicRegistrations,
          subscriptions,
        })
      );
    } catch {
      // ignore
    }
  }, [deals, contacts, tasks, expenses, musicRegistrations, subscriptions]);

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const selectedDeal = useMemo(() => {
    if (!selectedDealId) return null;
    return deals.find((d) => d.id === selectedDealId) || null;
  }, [deals, selectedDealId]);

  const goToLandingPage = () => {
    setCurrentView('landing');
  };

  const goToApp = () => {
    setIsLoggedIn(true);
    try {
      localStorage.setItem('aura_user_session', currentUserId);
    } catch {}
    setCurrentView('app');
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('aura_user_session');
      localStorage.removeItem('sonora_user_session');
    } catch {}
    setCurrentView('landing');
  };

  const loginWithUser = (user: AppUser) => {
    setUsers((prev) => {
      const idx = prev.findIndex(
        (u) => u.id === user.id || (u.email && u.email.toLowerCase() === user.email.toLowerCase())
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...user };
        return copy;
      }
      return [user, ...prev];
    });
    setCurrentUserId(user.id);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('aura_user_session', user.id);
      localStorage.setItem('aura_current_user', JSON.stringify(user));
    } catch {}
    if (user.permissions?.allowedTabs && !user.permissions.allowedTabs.includes(activeTab)) {
      setActiveTab(user.permissions.allowedTabs[0] || 'dashboard');
    }
    setCurrentView('app');
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
      setIsLoggedIn(true);
      try {
        localStorage.setItem('aura_user_session', userId);
        localStorage.setItem('aura_current_user', JSON.stringify(target));
      } catch {}
      if (!target.permissions.allowedTabs.includes(activeTab)) {
        setActiveTab(target.permissions.allowedTabs[0] || 'client-dashboard');
      }
    }
  };

  const saveUser = (user: Partial<AppUser>) => {
    let finalUser: AppUser;
    if (user.id) {
      finalUser = { ...user } as AppUser;
      setUsers((prev) => prev.map((u) => (u.id === user.id ? ({ ...u, ...user } as AppUser) : u)));
    } else {
      finalUser = {
        id: `usr-${Date.now()}`,
        name: user.name || 'Novo Usuário',
        email: user.email || '',
        role: user.role || 'producer',
        profileId: user.profileId || 'profile-producer',
        permissions: user.permissions || DEFAULT_ROLE_PERMISSIONS.producer,
        active: user.active !== false,
        password: user.password || '123',
      };
      setUsers((prev) => [...prev, finalUser]);
    }
    SupabaseService.saveUser(finalUser);
  };

  const deleteUser = (userId: string) => {
    if (users.length <= 1) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    SupabaseService.deleteUser(userId);
    if (currentUserId === userId) {
      const fallback = users.find((u) => u.id !== userId);
      if (fallback) {
        setCurrentUserId(fallback.id);
        try {
          localStorage.setItem('aura_user_session', fallback.id);
          localStorage.setItem('aura_current_user', JSON.stringify(fallback));
        } catch {}
      }
    }
  };

  const saveAccessProfile = (profile: Partial<AccessProfile>) => {
    let finalProfile: AccessProfile;
    if (profile.id) {
      finalProfile = { ...profile } as AccessProfile;
      setAccessProfiles((prev) =>
        prev.map((p) => (p.id === profile.id ? ({ ...p, ...profile } as AccessProfile) : p))
      );
    } else {
      finalProfile = {
        id: `prof-${Date.now()}`,
        name: profile.name || 'Novo Perfil',
        description: profile.description || '',
        role: profile.role || 'producer',
        permissions: profile.permissions || DEFAULT_ROLE_PERMISSIONS.producer,
      };
      setAccessProfiles((prev) => [...prev, finalProfile]);
    }
    SupabaseService.saveProfile(finalProfile);
  };

  const deleteAccessProfile = (profileId: string) => {
    setAccessProfiles((prev) => prev.filter((p) => p.id !== profileId));
    SupabaseService.deleteProfile(profileId);
  };

  const addDeal = (deal: Omit<Deal, 'id' | 'createdAt'>) => {
    const newDeal: Deal = {
      ...deal,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDeals((prev) => [newDeal, ...prev]);
    SupabaseService.saveDeal(newDeal);
  };

  const updateDealStage = (dealId: string, stage: DealStage) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          const updated = { ...d, stage };
          SupabaseService.saveDeal(updated);
          return updated;
        }
        return d;
      })
    );
  };

  const deleteDeal = (dealId: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    SupabaseService.deleteDeal(dealId);
  };

  const addContact = (contact: Omit<Contact, 'id' | 'createdAt'>) => {
    const newContact: Contact = {
      ...contact,
      id: `contact-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setContacts((prev) => [newContact, ...prev]);
    SupabaseService.saveContact(newContact);
  };

  const updateContact = (contact: Contact) => {
    setContacts((prev) => prev.map((c) => (c.id === contact.id ? contact : c)));
    SupabaseService.saveContact(contact);
  };

  const deleteContact = (contactId: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
  };

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    SupabaseService.saveExpense(newExpense);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const addMusicRegistration = (reg: Omit<MusicRegistration, 'id' | 'registrationDate'>) => {
    const year = new Date().getFullYear().toString().slice(-2);
    const rand = Math.floor(10000 + Math.random() * 90000);
    const isrc = `BR-SNR-${year}-${rand}`;
    const newReg: MusicRegistration = {
      ...reg,
      id: `reg-${Date.now()}`,
      isrcCode: isrc,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'ISRC Emitido',
    };
    setMusicRegistrations((prev) => [newReg, ...prev]);
    SupabaseService.saveMusicRegistration(newReg);
  };

  const updateMusicRegistration = (reg: MusicRegistration) => {
    setMusicRegistrations((prev) => prev.map((r) => (r.id === reg.id ? reg : r)));
    SupabaseService.saveMusicRegistration(reg);
  };

  const issueIsrc = (regId: string) => {
    const year = new Date().getFullYear().toString().slice(-2);
    const rand = Math.floor(10000 + Math.random() * 90000);
    const isrc = `BR-SNR-${year}-${rand}`;
    setMusicRegistrations((prev) =>
      prev.map((r) => {
        if (r.id === regId) {
          const updated: MusicRegistration = { ...r, isrcCode: isrc, status: 'Homologado ECAD' };
          SupabaseService.saveMusicRegistration(updated);
          return updated;
        }
        return r;
      })
    );
  };

  const addSubscription = (sub: Omit<ClientSubscription, 'id'>) => {
    const newSub: ClientSubscription = {
      ...sub,
      id: `sub-${Date.now()}`,
    };
    setSubscriptions((prev) => [newSub, ...prev]);
  };

  const openCertificateModal = (reg: MusicRegistration) => {
    setSelectedCertificateReg(reg);
  };

  const closeCertificateModal = () => {
    setSelectedCertificateReg(null);
  };

  const isCertificateModalOpen = Boolean(selectedCertificateReg);

  return (
    <CRMContext.Provider
      value={{
        deals,
        contacts,
        tasks,
        activities,
        expenses,
        musicRegistrations,
        subscriptions,
        activeTab,
        setActiveTab,
        selectedDealId,
        setSelectedDealId,
        selectedDeal,
        currentView,
        setCurrentView,
        goToLandingPage,
        goToApp,
        isLoggedIn,
        logout,
        loginWithUser,
        users,
        accessProfiles,
        currentUserId,
        currentUser,
        switchUser,
        saveUser,
        deleteUser,
        saveAccessProfile,
        deleteAccessProfile,
        addDeal,
        updateDealStage,
        deleteDeal,
        addContact,
        updateContact,
        deleteContact,
        addTask,
        toggleTask,
        addExpense,
        deleteExpense,
        addMusicRegistration,
        updateMusicRegistration,
        issueIsrc,
        addSubscription,
        isNewDealModalOpen,
        setIsNewDealModalOpen,
        isNewContactModalOpen,
        setIsNewContactModalOpen,
        isNewTaskModalOpen,
        setIsNewTaskModalOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        selectedCertificateReg,
        openCertificateModal,
        closeCertificateModal,
        isCertificateModalOpen,
        isUserManagementOpen,
        setIsUserManagementOpen,
        isProfileManagementOpen,
        setIsProfileManagementOpen,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}
