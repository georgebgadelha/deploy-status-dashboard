import { useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const titleMap: Record<string, string> = {
  '/': 'Dashboard',
  '/projects': 'Projects',
};

export default function Header() {
  const location = useLocation();
  const title = titleMap[location.pathname] || 'Zephyr Deploy';

  return (
    <header className={styles.header}>
      <span className={styles.title}>{title}</span>
      <span className={styles.badge}>v1.0.0</span>
    </header>
  );
}
