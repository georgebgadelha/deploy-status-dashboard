import styles from './MetricCard.module.css';

interface Props {
  label: string;
  value: string | number;
  sub?: string;
}

export default function MetricCard({ label, value, sub }: Props) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  );
}
