'use client';

import React, { useState } from 'react';
import { CRMProvider, useCRM } from '@/lib/crm-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { DashboardView } from '@/components/DashboardView';
import { PipelineView } from '@/components/PipelineView';
import { MusicRegistrationView } from '@/components/MusicRegistrationView';
import { ClientDashboardView } from '@/components/ClientDashboardView';
import { ContactsView } from '@/components/ContactsView';
import { DealDetailView } from '@/components/DealDetailView';
import { ExpensesView } from '@/components/ExpensesView';
import { SubscriptionsView } from '@/components/SubscriptionsView';
import { ReportsView } from '@/components/ReportsView';
import { SettingsView } from '@/components/SettingsView';
import { UsersManagementView } from '@/components/UsersManagementView';
import { ProfileManagementView } from '@/components/ProfileManagementView';
import { LandingPageAdminView } from '@/components/LandingPageAdminView';
import { MusicLandingPage } from '@/components/MusicLandingPage';

// Modals
import { NewDealModal } from '@/components/NewDealModal';
import { NewContactModal } from '@/components/NewContactModal';
import { NewTaskModal } from '@/components/NewTaskModal';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { AiDrawer } from '@/components/AiDrawer';
import { LoginModal } from '@/components/LoginModal';
import { CertificateModal } from '@/components/CertificateModal';
import { UserManagementModal } from '@/components/UserManagementModal';
import { ProfileManagementModal } from '@/components/ProfileManagementModal';
import { NewQuoteModal } from '@/components/NewQuoteModal';

function AppContent() {
  const { currentView, activeTab } = useCRM();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If in landing view, show public portal
  if (currentView === 'landing') {
    return (
      <>
        <MusicLandingPage />
        <LoginModal />
        <CertificateModal />
        <NewQuoteModal />
      </>
    );
  }

  // App Layout
  return (
    <div className="flex h-screen bg-[#f8f9ff] text-slate-800 overflow-hidden font-sans min-w-[320px] max-w-full">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto min-w-0">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'client-dashboard' && <ClientDashboardView />}
          {activeTab === 'music-registration' && <MusicRegistrationView />}
          {activeTab === 'pipeline' && <PipelineView />}
          {activeTab === 'contacts' && <ContactsView />}
          {activeTab === 'deal-details' && <DealDetailView />}
          {activeTab === 'expenses' && <ExpensesView />}
          {activeTab === 'subscriptions' && <SubscriptionsView />}
          {activeTab === 'users' && <UsersManagementView />}
          {activeTab === 'profiles' && <ProfileManagementView />}
          {activeTab === 'landing-admin' && <LandingPageAdminView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <NewDealModal />
      <NewContactModal />
      <NewTaskModal />
      <GlobalSearchModal />
      <AiDrawer />
      <LoginModal />
      <CertificateModal />
      <UserManagementModal />
      <ProfileManagementModal />
      <NewQuoteModal />
    </div>
  );
}

export default function Page() {
  return (
    <ErrorBoundary>
      <CRMProvider>
        <AppContent />
      </CRMProvider>
    </ErrorBoundary>
  );
}
