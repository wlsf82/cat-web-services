import type { PropsWithChildren, ReactNode } from 'react';
import styles from './AppShell.module.scss';

type AppShellProps = PropsWithChildren<{
  topBar: ReactNode;
  bottomDock?: ReactNode;
}>;

export const AppShell = ({ topBar, bottomDock, children }: AppShellProps) => {
  return (
    <div className={styles.shell}>
      <div className={styles.inner}>
        <div className={styles.topBar}>{topBar}</div>
        <main className={styles.content}>{children}</main>
      </div>
      {bottomDock ? <div className={styles.bottomDock}>{bottomDock}</div> : null}
    </div>
  );
};
