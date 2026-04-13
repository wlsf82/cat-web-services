import { useEffect, useMemo, useRef, useState } from 'react';
import type { ServiceKey, ShellLine, ViewerAccount } from '@/types/cws';
import styles from './ClawedShell.module.scss';

type ClawedShellProps = {
  account: ViewerAccount | null;
  selectedServiceKey: ServiceKey;
  recentKeys: ServiceKey[];
};

const collapsedHeight = 64;
const expandedHeight = 312;
const minHeight = 64;
const maxHeight = 420;

const seedLines = (account: ViewerAccount | null): ShellLine[] => [
  { id: 'line-1', type: 'output', value: 'Welcome to ClawedShell v0.418' },
  {
    id: 'line-2',
    type: 'output',
    value: account ? `Authenticated as ${account.displayName} (${account.breedName})` : 'Guest mode active. Register a cat account for profile persistence.'
  },
  { id: 'line-3', type: 'output', value: 'Try: help, status, recent, whoami, purrr, clear' }
];

export const ClawedShell = ({ account, selectedServiceKey, recentKeys }: ClawedShellProps) => {
  const [command, setCommand] = useState('');
  const [lines, setLines] = useState<ShellLine[]>(() => seedLines(account));
  const [height, setHeight] = useState(collapsedHeight);
  const dragStateRef = useRef<{ startY: number; startHeight: number } | null>(null);

  useEffect(() => {
    setLines(seedLines(account));
  }, [account]);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      if (!dragStateRef.current) {
        return;
      }

      const nextHeight = dragStateRef.current.startHeight + (dragStateRef.current.startY - event.clientY);
      setHeight(Math.max(minHeight, Math.min(maxHeight, nextHeight)));
    };

    const handleUp = () => {
      dragStateRef.current = null;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  const isExpanded = height > collapsedHeight + 20;
  const promptLabel = useMemo(() => `${account?.displayName ?? 'guest'}@cws:~$`, [account?.displayName]);

  const runCommand = (rawCommand: string) => {
    const value = rawCommand.trim().toLowerCase();

    if (!value) {
      return;
    }

    if (value === 'clear') {
      setLines(seedLines(account));
      setCommand('');
      return;
    }

    const nextLines: ShellLine[] = [{ id: `input-${Date.now()}`, type: 'input', value: `${promptLabel} ${rawCommand}` }];

    switch (value) {
      case 'help':
        nextLines.push({ id: `out-${Date.now()}-1`, type: 'output', value: 'Commands: help, status, recent, whoami, purrr, clear' });
        break;
      case 'status':
        nextLines.push({ id: `out-${Date.now()}-2`, type: 'output', value: `Focused workload: ${selectedServiceKey}. Household health: mildly dramatic.` });
        break;
      case 'recent':
        nextLines.push({ id: `out-${Date.now()}-3`, type: 'output', value: `Recently viewed: ${recentKeys.join(', ')}` });
        break;
      case 'whoami':
        nextLines.push({
          id: `out-${Date.now()}-4`,
          type: 'output',
          value: account ? `${account.displayName} (${account.breedName}) with account ${account.id}` : 'guest-human without a cat account'
        });
        break;
      case 'purrr':
        nextLines.push({ id: `out-${Date.now()}-5`, type: 'output', value: 'prrrrrrrrrrrrrrrr' });
        break;
      default:
        nextLines.push({ id: `err-${Date.now()}`, type: 'error', value: `Unknown command: ${rawCommand}` });
        break;
    }

    setLines((currentLines) => [...currentLines, ...nextLines].slice(-14));
    setCommand('');
  };

  return (
    <section className={styles.dock} style={{ height }}>
      <button
        type="button"
        className={styles.dragHandle}
        onMouseDown={(event) => {
          dragStateRef.current = { startY: event.clientY, startHeight: height };
        }}
        onDoubleClick={() => setHeight((current) => (current > collapsedHeight + 20 ? collapsedHeight : expandedHeight))}
      >
        <span className={styles.dragBar} />
        <div className={styles.dragMeta}>
          <strong>ClawedShell</strong>
          <span>{isExpanded ? 'drag to resize' : 'double click to expand'}</span>
        </div>
        <span className={styles.promptBadge}>{promptLabel}</span>
      </button>

      <div className={styles.surface} data-expanded={isExpanded}>
        <div className={styles.terminalOutput}>
          {lines.map((line) => (
            <p key={line.id} className={[styles.line, styles[line.type]].join(' ')}>
              {line.value}
            </p>
          ))}
        </div>

        <form
          className={styles.inputRow}
          onSubmit={(event) => {
            event.preventDefault();
            runCommand(command);
          }}
        >
          <span className={styles.prompt}>{promptLabel}</span>
          <input value={command} onChange={(event) => setCommand(event.target.value)} placeholder="type a command" />
        </form>
      </div>
    </section>
  );
};
