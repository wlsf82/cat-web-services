import type { ChangeEvent } from 'react';
import { Check, ChevronRight, Copy, Search, UserRound } from 'lucide-react';
import { ServiceLogo } from '@/components/ui/ServiceLogo/ServiceLogo';
import styles from './TopBar.module.scss';

type ViewerAccountLike = {
    id?: string;
    displayName?: string;
    breedName?: string;
    avatarUrl?: string | null;
};

export type TopBarProps = {
    searchValue: string;
    onSearchChange: (value: string) => void;
    account: ViewerAccountLike | null;
    onOpenAuth: () => void;
    onOpenProfile: () => void;
    onCopyAccountNumber: () => void | Promise<void>;
    copied: boolean;
    activeServiceKey?: string | null;
    activeServiceName?: string | null;
    onReturnHome: () => void;
};

export function TopBar({
                           searchValue,
                           onSearchChange,
                           account,
                           onOpenAuth,
                           onOpenProfile,
                           onCopyAccountNumber,
                           copied,
                           activeServiceKey,
                           activeServiceName,
                           onReturnHome
                       }: TopBarProps) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    const accountNumber = account?.id ?? 'CWS-418-000';
    const avatarUrl = account?.avatarUrl || '/images/odd-eyed-sphynx-cat-in-gb.jpg';
    const viewerName = account?.displayName ?? 'Guest cat';
    const serviceTitle = activeServiceName ?? 'Console Overview';
    const handleProfileClick = account ? onOpenProfile : onOpenAuth;

    return (
        <header className={styles.topBar}>
            <button type="button" className={styles.brandButton} onClick={onReturnHome} aria-label="Return to CWS home">
                <ServiceLogo
                    serviceKey={activeServiceKey ?? 'home'}
                    serviceName={activeServiceName ?? 'CWS Console'}
                    size="md"
                />

                <span className={styles.brandMeta}>
          <span className={styles.brandLine}>
            <span className={styles.brandRoot}>CWS</span>
              {activeServiceKey ? <ChevronRight size={12} strokeWidth={2.2} /> : null}
              <span className={styles.brandSection}>{serviceTitle}</span>
          </span>
        </span>
            </button>

            <div className={styles.searchWrap}>
                <Search size={15} strokeWidth={2.1} className={styles.searchIcon} />
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search services"
                    value={searchValue}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.actions}>
                <button type="button" className={styles.accountChip} onClick={onCopyAccountNumber}>
                    <span className={styles.accountHead}>Account</span>
                    <strong className={styles.accountNumber}>{accountNumber}</strong>
                    <span className={styles.copyState}>
            {copied ? <Check size={13} strokeWidth={2.2} /> : <Copy size={13} strokeWidth={2.2} />}
                        {copied ? 'Copied' : 'Copy'}
          </span>
                </button>

                <button type="button" className={styles.profileChip} onClick={handleProfileClick}>
          <span className={styles.avatarWrap}>
            <img className={styles.avatar} src={avatarUrl} alt={viewerName} />
          </span>

                    <span className={styles.profileMeta}>
            <strong>{viewerName}</strong>
            <span>{account ? account.breedName ?? 'Viewer sandbox' : 'Sign in or register'}</span>
          </span>

                    <span className={styles.profileIcon}>
            <UserRound size={14} strokeWidth={2.1} />
          </span>
                </button>
            </div>
        </header>
    );
}