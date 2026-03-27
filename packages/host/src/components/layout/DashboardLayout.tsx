import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import QuickDeploy from '../common/QuickDeploy';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      <QuickDeploy />
    </div>
  );
}
