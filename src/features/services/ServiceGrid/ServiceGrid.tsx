import { Panel } from '@/components/ui/Panel/Panel';
import { ServiceLogo } from '@/components/ui/ServiceLogo/ServiceLogo';
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge';
import type { ServiceDefinition, ServiceKey } from '@/types/cws';
import styles from './ServiceGrid.module.scss';

type ServiceGridProps = {
  services: ServiceDefinition[];
  activeKey: ServiceKey;
  onSelect: (serviceKey: ServiceKey) => void;
};

const toneMap = {
  healthy: 'healthy',
  degraded: 'warning',
  chaotic: 'critical'
} as const;

export const ServiceGrid = ({ services, activeKey, onSelect }: ServiceGridProps) => {
  return (
      <Panel title="Browse managed feline services">
          <div className={styles.grid}>
          {services.map((service) => {
            const active = service.key === activeKey;
            const maxValue = Math.max(...service.sparkline);

            return (
                <button
                    key={service.key}
                    type="button"
                    className={[styles.card, active ? styles.active : ''].filter(Boolean).join(' ')}
                    onClick={() => onSelect(service.key)}
                >
                  <div className={styles.headerRow}>
                    <div className={styles.serviceIdentity}>
                      <ServiceLogo
                          serviceKey={service.key}
                          serviceName={service.name}
                          size="md"
                      />
                      <div>
                        <span className={styles.category}>{service.category}</span>
                        <h3>{service.shortName}</h3>
                      </div>
                    </div>
                    <StatusBadge label={service.status} tone={toneMap[service.status]} />
                  </div>

                  <p className={styles.tagline}>{service.tagline}</p>
                  <p className={styles.description}>{service.description}</p>

                  <div className={styles.metricRow}>
                    <span>{service.usageLabel}</span>
                    <strong>{service.usageValue}</strong>
                  </div>

                  <div className={styles.sparkline} aria-hidden="true">
                    {service.sparkline.map((point, index) => (
                        <span
                            key={`${service.key}-${index}`}
                            style={{ height: `${Math.max(20, (point / maxValue) * 100)}%` }}
                        />
                    ))}
                  </div>
                </button>
            );
          })}
        </div>
      </Panel>
  );
};