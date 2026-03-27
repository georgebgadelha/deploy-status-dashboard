import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useProject } from '../hooks/useProjects';
import { useDeploys } from '../hooks/useDeploys';
import DeployHistory from '../components/deploys/DeployHistory';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './ProjectDetailPage.module.css';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: projectData, loading: pLoading } = useProject(id!);
  const { data: deploysData, loading: dLoading } = useDeploys(id!);

  const referrer = (location.state as any)?.referrer || '/projects';

  if (pLoading || dLoading) return <LoadingSpinner />;

  const project = projectData?.data;
  const deploys = deploysData?.data || [];

  if (!project) return <p>Project not found</p>;

  return (
    <div>
      <button className={styles.backButton} onClick={() => navigate(referrer)} title="Go back" aria-label="Go back">
        ←
      </button>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <DeployHistory deploys={deploys} />
    </div>
  );
}
