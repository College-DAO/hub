import { Outlet } from 'react-router-dom';

import { Card } from '../components/ui/Card/Card';

import styles from './Sidebar.module.scss';

interface SidebarProps {
  isVisible: boolean; 
}

function Sidebar({ isVisible }: SidebarProps) {

  return (
    <Card className={styles.container}>
      <Outlet />
    </Card>
  );
}

export { Sidebar };
