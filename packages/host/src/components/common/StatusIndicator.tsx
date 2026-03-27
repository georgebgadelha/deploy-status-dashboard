import styles from './StatusIndicator.module.css';

interface Props {
  status: string;
}

const labels: Record<string, string> = {
  success: 'Success',
  failed: 'Failed',
  in_progress: 'In Progress',
  cancelled: 'Cancelled',
};

export default function StatusIndicator({ status }: Props) {
  const cssClass = styles[status] || styles.cancelled;

  return (
    <span className={`${styles.indicator} ${cssClass}`}>
      <span className={styles.dot} />
      {labels[status] || status}
    </span>
  );
}
