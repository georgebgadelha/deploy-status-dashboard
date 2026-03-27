import { useParams } from 'react-router-dom';
import { useProject } from '../hooks/useProjects';
import { useDeploys } from '../hooks/useDeploys';
import DeployHistory from '../components/deploys/DeployHistory';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: projectData, loading: pLoading } = useProject(id!);
  const { data: deploysData, loading: dLoading } = useDeploys(id!);

  if (pLoading || dLoading) return <LoadingSpinner />;

  const project = projectData?.data;
  const deploys = deploysData?.data || [];

  if (!project) return <p>Project not found</p>;

  return (
    <div>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <DeployHistory deploys={deploys} />
    </div>
  );
}
