import { useMetricsOverview } from '../hooks/useMetrics';
import MetricCard from './MetricCard';
import StatusChart from './StatusChart';
import styles from './MetricsWidget.module.css';

const ENV_COLORS: Record<string, string> = {
  production: '#ef4444',
  staging: '#f59e0b',
  preview: '#3b82f6',
};

interface Props {
  projectId?: string;
  period?: string;
}

function MetricsWidget({ period = '30d' }: Props) {
  const { data, loading, error } = useMetricsOverview(period);

  if (loading) return <div className={styles.loading}>Loading metrics...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  const overview = data?.data;
  if (!overview) return null;

  return (
    <div className={styles.widget}>
      <div className={styles.kpi}>
        <MetricCard label="Total Deploys" value={overview.totalDeploys} />
        <MetricCard
          label="Success Rate"
          value={`${overview.successRate.toFixed(1)}%`}
        />
        <MetricCard
          label="Avg Build Time"
          value={`${overview.avgBuildTime.toFixed(1)}s`}
        />
        <MetricCard label="Deploys Today" value={overview.deploysToday} />
      </div>
      <div className={styles.charts}>
        <StatusChart title="Deploys by Status" data={overview.byStatus} />
        <StatusChart
          title="Deploys by Environment"
          data={overview.byEnvironment}
          colorMap={ENV_COLORS}
        />
      </div>
    </div>
  );
}

export default MetricsWidget;
