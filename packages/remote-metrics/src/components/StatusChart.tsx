import styles from './StatusChart.module.css';

const STATUS_COLORS: Record<string, string> = {
  success: '#22c55e',
  failed: '#ef4444',
  in_progress: '#3b82f6',
  cancelled: '#a1a1aa',
};

interface Props {
  title: string;
  data: Record<string, number>;
  colorMap?: Record<string, string>;
}

export default function StatusChart({ title, data, colorMap = STATUS_COLORS }: Props) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className={styles.chart}>
      <p className={styles.title}>{title}</p>
      <div className={styles.bars}>
        {entries.map(([label, count]) => (
          <div key={label} className={styles.row}>
            <span className={styles.rowLabel}>{label.replace(/_/g, ' ')}</span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  width: `${(count / max) * 100}%`,
                  backgroundColor: colorMap[label] || '#94a3b8',
                }}
              />
            </div>
            <span className={styles.rowCount}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
