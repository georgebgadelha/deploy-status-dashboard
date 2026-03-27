import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ProjectsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export default function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.link} ${isActive ? styles.active : ''}`;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>⚡ Zephyr</div>
      <nav className={styles.nav}>
        <NavLink to="/" className={linkClass} end>
          <DashboardIcon /> Dashboard
        </NavLink>
        <NavLink to="/projects" className={linkClass}>
          <ProjectsIcon /> Projects
        </NavLink>
      </nav>
    </aside>
  );
}
