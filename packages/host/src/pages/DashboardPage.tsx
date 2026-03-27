import { useProjects } from '../hooks/useProjects';
import ProjectList from '../components/projects/ProjectList';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DashboardPage() {
  const { data, loading, error } = useProjects();

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  const projects = data?.data || [];

  return (
    <div>
      <h2>Projects</h2>
      <ProjectList projects={projects} />
    </div>
  );
}
