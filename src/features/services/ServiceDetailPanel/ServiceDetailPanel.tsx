import { Panel } from '@/components/ui/Panel/Panel';
import { ServiceLogo } from '@/components/ui/ServiceLogo/ServiceLogo';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import type { ServiceDefinition } from '@/types/cws';
import styles from './ServiceDetailPanel.module.scss';

type ServiceDetailPanelProps = {
  service: ServiceDefinition;
};

const serviceConfig = {
  catops: {
    line1: 'Primary human remains below target for lap readiness and proactive tuna handling.',
    line2: 'Service owners should monitor kitchen drift and cuddle-call acknowledgement.',
    permissions: ['lap.reserve: delayed', 'blanket.allocate: partial', 'tuna.open: supervised']
  },
  iam: {
    line1: 'Least-privilege access control continues to protect nap-time assets and premium boxes.',
    line2: 'Humans keep requesting elevation without any shrimp-based business case.',
    permissions: ['petting.write: allowed', 'vacuum.execute: denied', 'drawer.open: temporary']
  },
  clawedwatch: {
    line1: 'Alerting remains intentionally dramatic because humans refuse to behave predictably in production.',
    line2: 'Recent spikes were caused by one empty kitchen visit and a suspicious closed door.',
    permissions: ['vacuum.detected: true', 'meow.ignored: true', 'toy.misplaced: true']
  },
  sns: {
    line1: 'Snack request propagation is healthy with acceptable retry behaviour under mild hunger pressure.',
    line2: 'Some endpoints still exhibit dangerous levels of selective hearing.',
    permissions: ['treat.notify: enabled', 'biscuit.fanout: active', 'ignore.meow: false']
  },
  s3: {
    line1: 'Cold storage for grudges and cardboard remains durable, fluffy, and aggressively retained.',
    line2: 'Lifecycle rules continue to favour hoarding over any destructive human intervention.',
    permissions: ['box.read: allowed', 'box.delete: denied', 'nap.archive: enabled']
  },
  route9: {
    line1: 'Cross-room traversal is stable, although midnight sprint traffic still produces hallway congestion.',
    line2: 'Closed-door failover remains the main blocker for low-latency zoomies.',
    permissions: ['hallway.route: optimal', 'stairs.route: warm', 'door.failover: degraded']
  }
} as const;

const toneMap = {
  healthy: 'healthy',
  degraded: 'warning',
  chaotic: 'critical'
} as const;

export const ServiceDetailPanel = ({ service }: ServiceDetailPanelProps) => {
  const content = serviceConfig[service.key];

  return (
      <Panel
          title={service.name}
          actions={
            <div className={styles.panelActions}>
              <ServiceLogo serviceKey={service.key} serviceName={service.name} size="sm" />
              <StatusBadge label={service.status} tone={toneMap[service.status]} />
            </div>
          }
      >
        <div className={styles.stack}>
          <p className={styles.copy}>{content.line1}</p>
          <p className={styles.copy}>{content.line2}</p>

          <div className={styles.metricBlock}>
            <span>{service.usageLabel}</span>
            <strong>{service.usageValue}</strong>
          </div>

          <ul className={styles.list}>
            {content.permissions.map((entry) => (
                <li key={entry}>{entry}</li>
            ))}
          </ul>
        </div>
      </Panel>
  );
};