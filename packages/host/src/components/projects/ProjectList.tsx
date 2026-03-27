import ProjectCard from './ProjectCard';
import styles from './ProjectList.module.css';

interface Project {
  _id: string;
  name: string;
  description: string;
  repository: string;
  status: string;
  lastDeployAt: string | null;
}

interface Props {
  projects: Project[];
}

export default function ProjectList({ projects }: Props) {
  if (projects.length === 0) {
    return <div className={styles.empty}>No projects found</div>;
  }

  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
