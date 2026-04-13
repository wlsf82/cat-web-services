import { useMemo, useState } from 'react';
import { DEFAULT_AVATAR_PATH } from '@/config/cats';
import { AppButton } from '@/components/ui/AppButton/AppButton';
import type { ViewerAccount } from '@/types/cws';
import styles from './TopBar.module.scss';

type TopBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  account: ViewerAccount | null;
  onOpenRegistration: () => void;
  onCopyAccountNumber: () => void;
  copied: boolean;
};

export const TopBar = ({
  searchValue,
  onSearchChange,
  account,
  onOpenRegistration,
  onCopyAccountNumber,
  copied
}: TopBarProps) => {
  const [avatarErrored, setAvatarErrored] = useState(false);

  const avatarUrl = useMemo(() => {
    if (account?.avatarUrl) {
      return account.avatarUrl;
    }

    if (avatarErrored) {
      return '';
    }

    return DEFAULT_AVATAR_PATH;
  }, [account?.avatarUrl, avatarErrored]);

  return (
    <header className={styles.topBar}>
      <div className={styles.brandBlock}>
        <div className={styles.logoMark} aria-hidden="true">
          <span>🐾</span>
        </div>
        <div className={styles.brandText}>
          <p className={styles.product}>CWS</p>
          <strong className={styles.title}>Cat Web Services</strong>
          <span className={styles.subtitle}>Premium feline infrastructure</span>
        </div>
      </div>

      <label className={styles.searchField}>
        <span className={styles.searchIcon} aria-hidden="true">
          🔎
        </span>
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search services"
          aria-label="Search services"
        />
      </label>

      {account ? (
        <button type="button" className={styles.accountChip} onClick={onCopyAccountNumber}>
          <div className={styles.accountMeta}>
            <span className={styles.accountLabel}>Account number</span>
            <strong>{account.id}</strong>
          </div>
          <span className={styles.copyState}>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      ) : (
        <AppButton variant="secondary" onClick={onOpenRegistration}>
          Register account
        </AppButton>
      )}

      <button type="button" className={styles.profileChip} onClick={onOpenRegistration}>
        <div className={styles.avatarWrap}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={account ? `${account.displayName} avatar` : 'Sphynx cat avatar'}
              onError={() => setAvatarErrored(true)}
            />
          ) : (
            <span className={styles.avatarFallback}>🐱</span>
          )}
        </div>
        <div className={styles.profileText}>
          <span>{account ? account.displayName : 'Guest review mode'}</span>
          <strong>{account ? account.breedName : 'Odd-eyed Sphynx'}</strong>
        </div>
      </button>
    </header>
  );
};
