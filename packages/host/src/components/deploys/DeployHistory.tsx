import StatusIndicator from '../common/StatusIndicator';
import EnvironmentBadge from '../common/EnvironmentBadge';
import styles from './DeployHistory.module.css';

interface Deploy {
  _id: string;
  environment: string;
  status: string;
  branch: string;
  commitHash: string;
  duration: number | null;
  createdAt: string;
}

interface Props {
  deploys: Deploy[];
}

export default function DeployHistory({ deploys }: Props) {
  if (deploys.length === 0) {
    return <div className={styles.empty}>No deploys yet</div>;
  }

  return (
    <div className={styles.timeline}>
      {deploys.map((deploy) => (
        <div key={deploy._id} className={styles.item}>
          <StatusIndicator status={deploy.status} />
          <div className={styles.info}>
            <span className={styles.branch}>{deploy.branch}</span>
            <span className={styles.meta}>
              <EnvironmentBadge environment={deploy.environment} />
              <span>{deploy.commitHash}</span>
              {deploy.duration && <span>{deploy.duration}s</span>}
              <span>{new Date(deploy.createdAt).toLocaleString()}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
