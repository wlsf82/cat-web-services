import type { ChangeEvent } from 'react';
import styles from './TopBar.module.scss';

type ViewerAccountLike = {
  name?: string;
  accountNumber?: string;
  avatarUrl?: string | null;
};

export type TopBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  account: ViewerAccountLike | null;
  onOpenRegistration: () => void;
  onCopyAccountNumber: () => void | Promise<void>;
  copied: boolean;
};

export function TopBar({
                         searchValue,
                         onSearchChange,
                         account,
                         onOpenRegistration,
                         onCopyAccountNumber,
                         copied
                       }: TopBarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const accountNumber = account?.accountNumber ?? 'CWS-418-000';
  const avatarUrl = account?.avatarUrl || '/images/odd-eyed-sphynx-cat-in-gb.jpg';
  const viewerName = account?.name ?? 'Guest cat';

  return (
      <header className={styles.topBar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>CWS</div>
          <div className={styles.brandText}>
            <strong>Cat Web Services</strong>
            <span>Premium pink feline cloud</span>
          </div>
        </div>

        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⌕</span>
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
            <span className={styles.accountLabel}>Account</span>
            <strong>{accountNumber}</strong>
            <span className={styles.copyState}>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button type="button" className={styles.profileChip} onClick={onOpenRegistration}>
            <img className={styles.avatar} src={avatarUrl} alt={viewerName} />
            <span className={styles.profileMeta}>
            <strong>{viewerName}</strong>
            <span>{account ? 'Viewer sandbox' : 'Register account'}</span>
          </span>
          </button>
        </div>
      </header>
  );
}