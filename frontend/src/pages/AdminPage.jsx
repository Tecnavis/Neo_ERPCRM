// pages/AdminPage.js
import { Card, Tabs } from 'antd';
import useLanguage from '@/locale/useLanguage';
import UserManagement from './admin/UserManagement';
import SystemSettings from './admin/SystemSettings';

export default function AdminPage() {
  const translate = useLanguage();
  
  const items = [
    {
      key: 'users',
      label: translate('User Management'),
      children: <UserManagement />,
    },
    {
      key: 'settings',
      label: translate('System Settings'),
      children: <SystemSettings />,
    },
  ];
  
  return (
    <Card title={translate('Admin Panel')}>
      <Tabs defaultActiveKey="users" items={items} />
    </Card>
  );
}