import { lazy, Suspense } from 'react';
import { useProjects } from '../hooks/useProjects';
import { loadRemoteModule } from '../utils/module-federation';
import { CONFIG } from '../config/constants';
import ProjectList from '../components/projects/ProjectList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBoundary from '../components/common/ErrorBoundary';

const MetricsWidget = lazy(() =>
  loadRemoteModule(
    CONFIG.MODULE_FEDERATION.REMOTE_METRICS_URL,
    CONFIG.MODULE_FEDERATION.SCOPE,
    CONFIG.MODULE_FEDERATION.MODULE
  )
);

export default function DashboardPage() {
  const { data, loading, error } = useProjects();

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  const projects = data?.data || [];

  return (
    <div>
      <ErrorBoundary fallbackMessage="Metrics remote is unavailable.">
        <Suspense fallback={<LoadingSpinner />}>
          <MetricsWidget />
        </Suspense>
      </ErrorBoundary>

      <h2>Projects</h2>
      <ProjectList projects={projects} referrer="/" />
    </div>
  );
}
