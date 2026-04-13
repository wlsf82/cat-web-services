import { X } from 'lucide-react';
import type { ViewerAccount } from '@/types/cws';
import styles from './ViewerProfileModal.module.scss';

type ViewerProfileModalProps = {
    open: boolean;
    account: ViewerAccount | null;
    onClose: () => void;
    onLogout: () => void;
};

const formatCreatedDate = (value?: string) => {
    if (!value) {
        return 'Unknown';
    }

    try {
        return new Date(value).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } catch {
        return 'Unknown';
    }
};

const getSandboxMood = (breedName?: string) => {
    if (!breedName) {
        return 'Stable purring';
    }

    if (breedName.toLowerCase().includes('sphynx')) {
        return 'Thermally dramatic';
    }

    if (breedName.toLowerCase().includes('bengal')) {
        return 'High-velocity';
    }

    if (breedName.toLowerCase().includes('british')) {
        return 'Calm but judgmental';
    }

    return 'Operationally elegant';
};

export const ViewerProfileModal = ({
                                       open,
                                       account,
                                       onClose,
                                       onLogout
                                   }: ViewerProfileModalProps) => {
    if (!open || !account) {
        return null;
    }

    return (
        <div className={styles.overlay} role="presentation" onClick={onClose}>
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-label="Viewer profile"
                onClick={(event) => event.stopPropagation()}
            >
                <div className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>Viewer profile</span>
                        <h2 className={styles.title}>{account.displayName}</h2>
                    </div>

                    <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close profile">
                        <X size={16} strokeWidth={2.1} />
                    </button>
                </div>

                <div className={styles.identityCard}>
                    <div className={styles.avatarWrap}>
                        <img
                            className={styles.avatar}
                            src={account.avatarUrl || '/images/odd-eyed-sphynx-cat-in-gb.jpg'}
                            alt={account.displayName}
                        />
                    </div>

                    <div className={styles.identityMeta}>
                        <strong>{account.displayName}</strong>
                        <span>{account.breedName}</span>
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.infoCard}>
                        <span className={styles.label}>Account ID</span>
                        <strong>{account.id}</strong>
                    </div>

                    <div className={styles.infoCard}>
                        <span className={styles.label}>Breed</span>
                        <strong>{account.breedName}</strong>
                    </div>

                    <div className={styles.infoCard}>
                        <span className={styles.label}>Created</span>
                        <strong>{formatCreatedDate(account.createdAt)}</strong>
                    </div>

                    <div className={styles.infoCard}>
                        <span className={styles.label}>Sandbox mood</span>
                        <strong>{getSandboxMood(account.breedName)}</strong>
                    </div>
                </div>

                <div className={styles.note}>
                    <strong>Playground note</strong>
                    <p>
                        This viewer account lives in localStorage so judges can open the app, poke around, and still feel like
                        they have a “real” console identity.
                    </p>
                </div>

                <div className={styles.footer}>
                    <button type="button" className={styles.secondaryButton} onClick={onClose}>
                        Close
                    </button>

                    <button type="button" className={styles.dangerButton} onClick={onLogout}>
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
};