/**
 * Stats Grid Component
 * Displays grid of stat cards
 */

import StatsCard from './StatsCard';
import { STATS_CONFIG } from '@/lib/constants/dashboard.constants';

interface Stats {
  totalClients: number;
  pendingPartner: number;
  pendingResidence: number;
  pendingEquivalence: number;
  validatedClients: number;
}

interface StatsGridProps {
  stats: Stats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <StatsCard
        label={STATS_CONFIG.PENDING_PARTNER.label}
        value={stats.pendingPartner}
        colorClass={STATS_CONFIG.PENDING_PARTNER.color}
      />
      <StatsCard
        label={STATS_CONFIG.PENDING_RESIDENCE.label}
        value={stats.pendingResidence}
        colorClass={STATS_CONFIG.PENDING_RESIDENCE.color}
      />
      <StatsCard
        label={STATS_CONFIG.PENDING_EQUIVALENCE.label}
        value={stats.pendingEquivalence}
        colorClass={STATS_CONFIG.PENDING_EQUIVALENCE.color}
      />
      <StatsCard
        label={STATS_CONFIG.VALIDATED.label}
        value={stats.validatedClients}
        colorClass={STATS_CONFIG.VALIDATED.color}
      />
      <StatsCard
        label={STATS_CONFIG.ALL_CLIENTS.label}
        value={stats.totalClients}
        colorClass={STATS_CONFIG.ALL_CLIENTS.color}
      />
    </div>
  );
}
