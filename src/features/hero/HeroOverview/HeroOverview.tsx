import { Panel } from '@/components/ui/Panel/Panel';
import { ServiceLogo } from '@/components/ui/ServiceLogo/ServiceLogo';
import type { ServiceDefinition, ViewerAccount } from '@/types/cws';
import styles from './HeroOverview.module.scss';

type HeroOverviewProps = {
  selectedService: ServiceDefinition;
  account: ViewerAccount | null;
};

const platformStats = [
  { label: 'Household regions', value: '03' },
  { label: 'Active paws', value: '09' },
  { label: 'Toy drift', value: 'Low' }
];

export const HeroOverview = ({ selectedService, account }: HeroOverviewProps) => {
  return (
      <Panel title="One panel for your pink, premium cat cloud.">
        <div className={styles.hero}>
          <div className={styles.copyColumn}>
            <p className={styles.lead}>
              Review household health, snack latency, and suspicious human behaviour from one very polished feline console.
            </p>

            <div className={styles.ribbonRow}>
              {platformStats.map((stat) => (
                  <div key={stat.label} className={styles.ribbonCard}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
              ))}
            </div>
          </div>

          <div className={styles.callout}>
            <ServiceLogo
                serviceKey={selectedService.key}
                serviceName={selectedService.name}
                size="lg"
            />
            <span className={styles.calloutLabel}>Focused service</span>
            <strong>{selectedService.name}</strong>
            <p>{selectedService.tagline}</p>
            <div className={styles.accountHint}>
              <span>{account ? `Viewer: ${account.displayName}` : 'Viewer: guest mode'}</span>
              <span>{account ? account.breedName : 'Sphynx sandbox'}</span>
            </div>
          </div>
        </div>
      </Panel>
  );
};