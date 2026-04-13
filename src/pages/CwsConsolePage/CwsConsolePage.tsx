import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell/AppShell';
import { TopBar } from '@/components/layout/TopBar/TopBar';
import { actions, fallbackBreeds, initialConsoleState, services } from '@/data/mockData';
import { ActionCenter } from '@/features/actions/ActionCenter/ActionCenter';
import { ViewerAuthModal } from '@/features/auth/ViewerAuthModal/ViewerAuthModal';
import { HeroOverview } from '@/features/hero/HeroOverview/HeroOverview';
import { HumanStatusCard } from '@/features/human/HumanStatusCard/HumanStatusCard';
import { IncidentFeed } from '@/features/incidents/IncidentFeed/IncidentFeed';
import { ViewerProfileModal } from '@/features/profile/ViewerProfileModal/ViewerProfileModal';
import { RecentlyViewedServices } from '@/features/recent/RecentlyViewedServices/RecentlyViewedServices';
import { ExecutiveReview } from '@/features/review/ExecutiveReview/ExecutiveReview';
import { ServiceDetailPanel } from '@/features/services/ServiceDetailPanel/ServiceDetailPanel';
import { ServiceGrid } from '@/features/services/ServiceGrid/ServiceGrid';
import { ClawedShell } from '@/features/terminal/ClawedShell/ClawedShell';
import { UsageSummary } from '@/features/usage/UsageSummary/UsageSummary';
import type { ServiceKey, ViewerAccount } from '@/types/cws';
import { fetchBreedAvatar } from '@/utils/catApi';
import { generateExecutiveReview, runAction } from '@/utils/cwsEngine';
import {
  clearViewerAccount,
  createViewerAccountNumber,
  loadViewerAccount,
  loadViewerAccounts,
  saveViewerAccount,
  signInViewerAccount
} from '@/utils/viewerAccount';
import styles from './CwsConsolePage.module.scss';

const initialReview = generateExecutiveReview(initialConsoleState);
const defaultRecentKeys: ServiceKey[] = ['catops', 'clawedwatch', 'iam'];

export const CwsConsolePage = () => {
  const [selectedServiceKey, setSelectedServiceKey] = useState<ServiceKey>('catops');
  const [consoleState, setConsoleState] = useState(initialConsoleState);
  const [review, setReview] = useState(initialReview);
  const [searchValue, setSearchValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [registrationSubmitting, setRegistrationSubmitting] = useState(false);
  const [viewerAccount, setViewerAccount] = useState<ViewerAccount | null>(null);
  const [savedAccounts, setSavedAccounts] = useState<ViewerAccount[]>([]);
  const [recentKeys, setRecentKeys] = useState<ServiceKey[]>(defaultRecentKeys);

  const refreshAccounts = () => {
    setViewerAccount(loadViewerAccount());
    setSavedAccounts(loadViewerAccounts());
  };

  const handleReturnHome = () => {
    setSelectedServiceKey('catops');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    refreshAccounts();
  }, []);

  useEffect(() => {
    setRecentKeys((currentKeys) =>
        [selectedServiceKey, ...currentKeys.filter((key) => key !== selectedServiceKey)].slice(0, 4)
    );
  }, [selectedServiceKey]);

  const filteredServices = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return services;
    }

    return services.filter((service) => {
      const haystack = `${service.shortName} ${service.name} ${service.description} ${service.category}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchValue]);

  const selectedService = useMemo(
      () =>
          filteredServices.find((service) => service.key === selectedServiceKey) ??
          services.find((service) => service.key === selectedServiceKey) ??
          services[0],
      [filteredServices, selectedServiceKey]
  );

  const handleAction = (actionKey: (typeof actions)[number]['key']) => {
    setConsoleState((currentState) => {
      const nextState = runAction(currentState, actionKey);
      setReview(generateExecutiveReview(nextState));
      return nextState;
    });
  };

  const handleGenerateReview = () => {
    setReview(generateExecutiveReview(consoleState));
  };

  const handleCopyAccountNumber = async () => {
    const value = viewerAccount?.id ?? 'CWS-418-000';

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const handleRegister = async (payload: { displayName: string; breedId: string; breedName: string }) => {
    setRegistrationSubmitting(true);

    const avatarUrl = await fetchBreedAvatar(payload.breedId);
    const nextAccount: ViewerAccount = {
      id: createViewerAccountNumber(),
      displayName: payload.displayName,
      breedId: payload.breedId,
      breedName: payload.breedName,
      avatarUrl,
      createdAt: new Date().toISOString()
    };

    saveViewerAccount(nextAccount);
    refreshAccounts();
    setRegistrationSubmitting(false);
    setAuthOpen(false);
  };

  const handleSignIn = (accountId: string) => {
    signInViewerAccount(accountId);
    refreshAccounts();
    setAuthOpen(false);
  };

  const handleLogout = () => {
    clearViewerAccount();
    refreshAccounts();
    setProfileOpen(false);
  };

  return (
      <AppShell
          topBar={
            <TopBar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                account={viewerAccount}
                onOpenAuth={() => setAuthOpen(true)}
                onOpenProfile={() => setProfileOpen(true)}
                onCopyAccountNumber={handleCopyAccountNumber}
                copied={copied}
                activeServiceKey={selectedService?.key ?? null}
                activeServiceName={selectedService?.name ?? null}
                onReturnHome={handleReturnHome}
            />
          }
          bottomDock={<ClawedShell account={viewerAccount} selectedServiceKey={selectedServiceKey} recentKeys={recentKeys} />}
      >
        <div className={styles.layout}>
          <HeroOverview selectedService={selectedService} account={viewerAccount} />

          <div className={styles.contentGrid}>
            <div className={styles.mainColumn}>
              <ServiceGrid services={filteredServices} activeKey={selectedServiceKey} onSelect={setSelectedServiceKey} />

              <div className={styles.twoUp}>
                <UsageSummary usageSummary={consoleState.usageSummary} />
                <RecentlyViewedServices
                    services={services}
                    activeKey={selectedServiceKey}
                    recentKeys={recentKeys}
                    onSelect={setSelectedServiceKey}
                />
              </div>

              <div className={styles.twoUp}>
                <ServiceDetailPanel service={selectedService} />
                <HumanStatusCard humanStatus={consoleState.humanStatus} />
              </div>
            </div>

            <div className={styles.sideColumn}>
              <ActionCenter actions={actions} onAction={handleAction} />
              <IncidentFeed incidents={consoleState.incidents} />
              <ExecutiveReview review={review} onGenerate={handleGenerateReview} />
            </div>
          </div>
        </div>

        <ViewerAuthModal
            open={authOpen}
            existingAccounts={savedAccounts}
            submitting={registrationSubmitting}
            onClose={() => setAuthOpen(false)}
            onRegister={handleRegister}
            onSignIn={handleSignIn}
            breeds={fallbackBreeds}
        />

        <ViewerProfileModal
            open={profileOpen}
            account={viewerAccount}
            onClose={() => setProfileOpen(false)}
            onLogout={handleLogout}
        />
      </AppShell>
  );
};