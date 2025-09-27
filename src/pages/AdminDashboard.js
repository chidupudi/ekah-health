// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Typography, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button,
  Avatar,
  Dropdown,
  Space,
  Badge,
  Alert
} from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  CalendarOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import ServicesManagement from '../components/admin/ServicesManagement';
import BookingsManagement from '../components/admin/BookingsManagement';
import UsersManagement from '../components/admin/UsersManagement';
import PaymentsManagement from '../components/admin/PaymentsManagement';
import ProfessionalCalendarSidebar from '../components/admin/ProfessionalCalendarSidebar';
import { bookingsDB } from '../services/firebase/database';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const { currentAdmin, adminLogout, hasPermission } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin/login');
    }
  }, [currentAdmin, navigate]);

  const handleLogout = async () => {
    try {
      await adminLogout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: 'Profile',
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: 'Settings',
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Logout',
          onClick: handleLogout,
        },
      ]}
    />
  );

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'calendar',
      icon: <CalendarOutlined />,
      label: 'Calendar',
      disabled: !hasPermission('view_bookings'),
    },
    {
      key: 'bookings',
      icon: <BellOutlined />,
      label: 'Bookings',
      disabled: !hasPermission('view_bookings'),
    },
    {
      key: 'services',
      icon: <ShoppingOutlined />,
      label: 'Services',
      disabled: !hasPermission('view_services'),
    },
    {
      key: 'payments',
      icon: <CreditCardOutlined />,
      label: 'Payments',
      disabled: !hasPermission('manage_payments'),
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: 'Users',
      disabled: !hasPermission('view_users'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      disabled: !hasPermission('manage_settings'),
    },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'calendar':
        return <ProfessionalCalendarSidebar />;
      case 'bookings':
        return <BookingsManagement />;
      case 'services':
        return <ServicesManagement />;
      case 'payments':
        return <PaymentsManagement />;
      case 'users':
        return <UsersManagement />;
      case 'settings':
        return (
          <Card>
            <Title level={3}>System Settings</Title>
            <Text type="secondary">Basic system settings coming soon...</Text>
          </Card>
        );
      default:
        return (
          <div>
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col span={24}>
                <Alert
                  message="Admin Dashboard"
                  description="Welcome to the Ekah Health administration panel. Manage services, users, and system settings from here."
                  type="info"
                  showIcon
                  style={{ borderRadius: '8px' }}
                />
              </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} lg={6}>
                <Card style={{ borderRadius: '12px' }}>
                  <Statistic
                    title="Total Services"
                    value={10}
                    prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card style={{ borderRadius: '12px' }}>
                  <Statistic
                    title="Active Users"
                    value={128}
                    prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card style={{ borderRadius: '12px' }}>
                  <Statistic
                    title="Total Bookings"
                    value={342}
                    prefix={<EyeOutlined style={{ color: '#faad14' }} />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card style={{ borderRadius: '12px' }}>
                  <Statistic
                    title="Revenue (₹)"
                    value={25680}
                    prefix={<span style={{ color: '#f5222d' }}>₹</span>}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card 
                  title="Quick Actions"
                  style={{ borderRadius: '12px' }}
                  extra={<Button type="link">View All</Button>}
                >
                  <Space wrap>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => setSelectedMenu('services')}
                    >
                      Add Service
                    </Button>
                    <Button 
                      icon={<EditOutlined />}
                      onClick={() => setSelectedMenu('services')}
                    >
                      Manage Services
                    </Button>
                    <Button 
                      icon={<TeamOutlined />}
                      onClick={() => setSelectedMenu('users')}
                    >
                      View Users
                    </Button>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card 
                  title="System Status"
                  style={{ borderRadius: '12px' }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Badge status="success" text="All systems operational" />
                    <div style={{ marginTop: '16px' }}>
                      <Text type="secondary">Last updated: Just now</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        );
    }
  };

  if (!currentAdmin) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)'
        }}
      >
        <div style={{ 
          height: '64px', 
          margin: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{ 
            color: '#fff', 
            fontWeight: 'bold',
            fontSize: collapsed ? '12px' : '16px'
          }}>
            {collapsed ? 'EH' : 'Ekah Health'}
          </Text>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onClick={({ key }) => setSelectedMenu(key)}
          style={{ border: 'none' }}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          boxShadow: '0 2px 8px 0 rgba(29,35,41,.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {selectedMenu.charAt(0).toUpperCase() + selectedMenu.slice(1)}
            </Title>
          </div>
          
          <Space>
            <Button type="text" icon={<BellOutlined />} />
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Button type="text">
                <Space>
                  <Avatar 
                    style={{ 
                      backgroundColor: '#667eea',
                      verticalAlign: 'middle' 
                    }} 
                    size="small"
                  >
                    {currentAdmin?.name?.charAt(0) || 'A'}
                  </Avatar>
                  {currentAdmin?.name}
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ 
          margin: '24px', 
          minHeight: 280,
          background: '#f0f2f5',
          display: 'flex',
          gap: '16px'
        }}>
          {/* Main Content */}
          <div style={{ 
            flex: 1,
            padding: '24px',
            background: '#fff',
            borderRadius: '12px',
            minHeight: '100%'
          }}>
            {renderContent()}
          </div>
          
          {/* Calendar Sidebar */}
          {selectedMenu !== 'calendar' && (
            <div style={{
              width: '350px',
              background: '#fff',
              borderRadius: '12px',
              minHeight: '100%'
            }}>
              <ProfessionalCalendarSidebar />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;