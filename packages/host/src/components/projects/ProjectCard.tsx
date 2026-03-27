import { useNavigate } from 'react-router-dom';
import StatusIndicator from '../common/StatusIndicator';
import styles from './ProjectCard.module.css';

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  lastDeployAt: string | null;
}

interface Props {
  project: Project;
  referrer?: string;
}

export default function ProjectCard({ project, referrer = '/projects' }: Props) {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/projects/${project._id}`, { state: { referrer } });
  };

  return (
    <div
      className={styles.card}
      onClick={goToDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && goToDetail()}
    >
      <h3 className={styles.name}>{project.name}</h3>
      <p className={styles.desc}>{project.description}</p>
      <div className={styles.footer}>
        <StatusIndicator status={project.status} />
        {project.lastDeployAt && (
          <span>{new Date(project.lastDeployAt).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}
