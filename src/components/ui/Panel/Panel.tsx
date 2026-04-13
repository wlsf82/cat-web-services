import type { ReactNode } from 'react';
import styles from './Panel.module.scss';

type PanelProps = {
    title: string;
    eyebrow?: string;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
};

export const Panel = ({ title, eyebrow, actions, children, className }: PanelProps) => {
    return (
        <section className={[styles.panel, className ?? ''].filter(Boolean).join(' ')}>
            <header className={styles.header}>
                <div className={styles.heading}>
                    {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
                    <h2 className={styles.title}>{title}</h2>
                </div>

                {actions ? <div className={styles.actions}>{actions}</div> : null}
            </header>

            <div className={styles.body}>{children}</div>
        </section>
    );
};