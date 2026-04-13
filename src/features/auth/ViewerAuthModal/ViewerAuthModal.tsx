import { useEffect, useState } from 'react';
import { LogIn, Plus, X } from 'lucide-react';
import type { ViewerAccount } from '@/types/cws';
import styles from './ViewerAuthModal.module.scss';

type AuthMode = 'signin' | 'register';

type ViewerAuthModalProps = {
    open: boolean;
    existingAccounts: ViewerAccount[];
    submitting: boolean;
    onClose: () => void;
    onRegister: (payload: { displayName: string; breedId: string; breedName: string }) => Promise<void>;
    onSignIn: (accountId: string) => void;
    breeds: Array<{ id: string; name: string }>;
};

export const ViewerAuthModal = ({
                                    open,
                                    existingAccounts,
                                    submitting,
                                    onClose,
                                    onRegister,
                                    onSignIn,
                                    breeds
                                }: ViewerAuthModalProps) => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [displayName, setDisplayName] = useState('');
    const [breedId, setBreedId] = useState('sphynx');

    useEffect(() => {
        if (!open) {
            return;
        }

        setMode(existingAccounts.length > 0 ? 'signin' : 'register');
    }, [open, existingAccounts.length]);

    useEffect(() => {
        if (!breeds.some((breed) => breed.id === breedId) && breeds[0]) {
            setBreedId(breeds[0].id);
        }
    }, [breeds, breedId]);

    if (!open) {
        return null;
    }

    const selectedBreed = breeds.find((breed) => breed.id === breedId) ?? breeds[0];

    const handleRegister = async () => {
        if (!displayName.trim() || !selectedBreed) {
            return;
        }

        await onRegister({
            displayName: displayName.trim(),
            breedId: selectedBreed.id,
            breedName: selectedBreed.name
        });

        setDisplayName('');
    };

    return (
        <div className={styles.overlay} role="presentation" onClick={onClose}>
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-label="Viewer authentication"
                onClick={(event) => event.stopPropagation()}
            >
                <div className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>Cat account access</span>
                        <h2 className={styles.title}>{mode === 'signin' ? 'Sign in to a viewer account' : 'Register a viewer account'}</h2>
                    </div>

                    <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
                        <X size={16} strokeWidth={2.1} />
                    </button>
                </div>

                <div className={styles.modeSwitcher}>
                    <button
                        type="button"
                        className={[styles.modeButton, mode === 'signin' ? styles.active : ''].join(' ')}
                        onClick={() => setMode('signin')}
                    >
                        <LogIn size={15} strokeWidth={2.1} />
                        Sign in
                    </button>

                    <button
                        type="button"
                        className={[styles.modeButton, mode === 'register' ? styles.active : ''].join(' ')}
                        onClick={() => setMode('register')}
                    >
                        <Plus size={15} strokeWidth={2.1} />
                        Register
                    </button>
                </div>

                {mode === 'signin' ? (
                    <div className={styles.stack}>
                        {existingAccounts.length > 0 ? (
                            <div className={styles.accountList}>
                                {existingAccounts.map((account) => (
                                    <button
                                        key={account.id}
                                        type="button"
                                        className={styles.accountCard}
                                        onClick={() => onSignIn(account.id)}
                                    >
                    <span className={styles.accountAvatarWrap}>
                      <img
                          className={styles.accountAvatar}
                          src={account.avatarUrl || '/images/odd-eyed-sphynx-cat-in-gb.jpg'}
                          alt={account.displayName}
                      />
                    </span>

                                        <span className={styles.accountMeta}>
                      <strong>{account.displayName}</strong>
                      <span>{account.breedName}</span>
                      <small>{account.id}</small>
                    </span>

                                        <span className={styles.accountAction}>Use account</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <strong>No saved demo accounts yet</strong>
                                <p>Create one first, then you’ll be able to sign back in after logging out.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.stack}>
                        <label className={styles.field}>
                            <span>Account display name</span>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(event) => setDisplayName(event.target.value)}
                                placeholder="Princess Pawsworth"
                            />
                        </label>

                        <label className={styles.field}>
                            <span>Captcha: I am a cat because I am a...</span>
                            <select value={breedId} onChange={(event) => setBreedId(event.target.value)}>
                                {breeds.map((breed) => (
                                    <option key={breed.id} value={breed.id}>
                                        {breed.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className={styles.note}>
                            <strong>Playground note</strong>
                            <p>This creates a local demo account, stores it in localStorage, and signs you in immediately.</p>
                        </div>

                        <div className={styles.footer}>
                            <button type="button" className={styles.secondaryButton} onClick={onClose}>
                                Cancel
                            </button>

                            <button
                                type="button"
                                className={styles.primaryButton}
                                onClick={handleRegister}
                                disabled={submitting || !displayName.trim()}
                            >
                                {submitting ? 'Creating...' : 'Create cat account'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};