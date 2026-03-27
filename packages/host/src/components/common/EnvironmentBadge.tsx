import styles from './EnvironmentBadge.module.css';

interface Props {
  environment: string;
}

export default function EnvironmentBadge({ environment }: Props) {
  const cssClass = styles[environment] || styles.preview;

  return (
    <span className={`${styles.badge} ${cssClass}`}>
      {environment}
    </span>
  );
}
