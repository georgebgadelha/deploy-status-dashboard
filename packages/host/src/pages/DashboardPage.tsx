import { lazy, Suspense } from 'react';
import { useProjects } from '../hooks/useProjects';
import ProjectList from '../components/projects/ProjectList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBoundary from '../components/common/ErrorBoundary';

const MetricsWidget = lazy(() => import('remoteMetrics/MetricsWidget'));

export default function DashboardPage() {
  const { data, loading, error } = useProjects();

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  const projects = data?.data || [];

  return (
    <div>
      <ErrorBoundary fallbackMessage="Metrics remote is unavailable. Make sure the remote-metrics app is running on port 3002.">
        <Suspense fallback={<LoadingSpinner />}>
          <MetricsWidget />
        </Suspense>
      </ErrorBoundary>

      <h2>Projects</h2>
      <ProjectList projects={projects} />
    </div>
  );
}
