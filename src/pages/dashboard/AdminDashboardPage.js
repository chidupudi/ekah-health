// src/pages/dashboard/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Button, Typography, Space, Avatar, Tabs, Badge, Alert, Statistic, Table } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  TeamOutlined,
  MessageOutlined,
  CalendarOutlined,
  DashboardOutlined,
  SettingOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UsergroupAddOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../services/firebase/config';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalConsultations: 0,
    pendingSetups: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentSubscriptions, setRecentSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    if (!currentUser) return;

    const fetchDashboardData = async () => {
      try {
        console.log('📊 Fetching admin dashboard data...');

        // Fetch all users
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Fetch all subscriptions
        const subscriptionsQuery = query(collection(db, 'subscriptions'));
        const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
        const subscriptions = subscriptionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch consultation rooms
        const roomsQuery = query(collection(db, 'consultation_rooms'));
        const roomsSnapshot = await getDocs(roomsQuery);
        const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Calculate stats
        const totalUsers = users.length;
        const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
        const totalConsultations = rooms.length;
        const pendingSetups = subscriptions.filter(sub => sub.status === 'pending_setup').length;

        setStats({
          totalUsers,
          activeSubscriptions,
          totalConsultations,
          pendingSetups
        });

        // Get recent users (last 10)
        const recentUsersList = users
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        setRecentUsers(recentUsersList);

        // Get recent subscriptions (last 10)
        const recentSubscriptionsList = subscriptions
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        setRecentSubscriptions(recentSubscriptionsList);

        console.log('✅ Dashboard data loaded');
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userColumns = [
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          {text || `${record.firstName} ${record.lastName}`}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Badge 
          color={role === 'admin' ? 'red' : role === 'practitioner' ? 'blue' : 'green'} 
          text={role?.toUpperCase() || 'CLIENT'} 
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Badge 
          color={isActive ? 'green' : 'red'} 
          text={isActive ? 'Active' : 'Inactive'} 
        />
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const subscriptionColumns = [
    {
      title: 'Plan',
      dataIndex: 'planTitle',
      key: 'planTitle',
    },
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId) => {
        const user = recentUsers.find(u => u.id === userId);
        return user ? user.displayName || user.email : userId;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusColors = {
          'active': 'green',
          'pending_setup': 'orange',
          'cancelled': 'red',
          'expired': 'default'
        };
        return <Badge color={statusColors[status]} text={status?.replace('_', ' ').toUpperCase()} />;
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}/month`,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (!userProfile || userProfile.role !== 'admin') {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Alert
            message="Access Denied"
            description="You don't have permission to access the admin dashboard."
            type="error"
            showIcon
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Title level={3} style={{ margin: 0, color: '#1976d2' }}>
            EKAH Health - Admin
          </Title>
          <Badge color="red" text="ADMIN" />
        </Box>
        
        <Space size="middle">
          <BellOutlined style={{ fontSize: 18, color: '#666' }} />
          <Avatar 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#dc004e' }}
          />
          <Text strong>{userProfile.displayName}</Text>
          <Button 
            type="text" 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      </Header>

      {/* Main Content */}
      <Content style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        {/* Welcome Section */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={16}>
              <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
                Admin Dashboard 👋
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                Welcome to the EKAH Health administration panel. Monitor users, subscriptions, and system health.
              </Text>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              <Alert
                message="🔐 Administrator Access"
                description="You have full system privileges"
                type="success"
                showIcon
              />
            </Col>
          </Row>
        </Card>

        {/* Main Dashboard Tabs */}
        <Card style={{ borderRadius: 12 }}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            size="large"
            type="card"
          >
            {/* Overview Tab */}
            <TabPane 
              tab={
                <Space>
                  <DashboardOutlined />
                  Overview
                </Space>
              } 
              key="overview"
            >
              <Box sx={{ mb: 4 }}>
                <Title level={3}>System Overview</Title>
                
                {/* Stats Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col xs={12} md={6}>
                    <Card>
                      <Statistic
                        title="Total Users"
                        value={stats.totalUsers}
                        prefix={<TeamOutlined />}
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} md={6}>
                    <Card>
                      <Statistic
                        title="Active Subscriptions"
                        value={stats.activeSubscriptions}
                        prefix={<HeartOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} md={6}>
                    <Card>
                      <Statistic
                        title="Consultation Rooms"
                        value={stats.totalConsultations}
                        prefix={<MessageOutlined />}
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} md={6}>
                    <Card>
                      <Statistic
                        title="Pending Setups"
                        value={stats.pendingSetups}
                        prefix={<ClockCircleOutlined />}
                        valueStyle={{ color: stats.pendingSetups > 0 ? '#fa8c16' : '#3f8600' }}
                      />
                    </Card>
                  </Col>
                </Row>

                {/* Alerts */}
                {stats.pendingSetups > 0 && (
                  <Alert
                    message={`${stats.pendingSetups} subscription${stats.pendingSetups > 1 ? 's' : ''} need setup completion`}
                    description="Users with pending setups can't access their consultation rooms yet."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}

                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="Recent Users" size="small">
                      <Table
                        dataSource={recentUsers.slice(0, 5)}
                        columns={userColumns.slice(0, 3)}
                        pagination={false}
                        size="small"
                        rowKey="id"
                      />
                      <Button 
                        type="link" 
                        onClick={() => setActiveTab('users')}
                        style={{ marginTop: 8 }}
                      >
                        View All Users →
                      </Button>
                    </Card>
                  </Col>
                  
                  <Col xs={24} lg={12}>
                    <Card title="Recent Subscriptions" size="small">
                      <Table
                        dataSource={recentSubscriptions.slice(0, 5)}
                        columns={subscriptionColumns.slice(0, 3)}
                        pagination={false}
                        size="small"
                        rowKey="id"
                      />
                      <Button 
                        type="link" 
                        onClick={() => setActiveTab('subscriptions')}
                        style={{ marginTop: 8 }}
                      >
                        View All Subscriptions →
                      </Button>
                    </Card>
                  </Col>
                </Row>
              </Box>
            </TabPane>

            {/* Users Management Tab */}
            <TabPane 
              tab={
                <Space>
                  <TeamOutlined />
                  Users
                  <Badge count={stats.totalUsers} size="small" />
                </Space>
              } 
              key="users"
            >
              <Box>
                <Title level={3}>User Management</Title>
                <Table
                  dataSource={recentUsers}
                  columns={userColumns}
                  loading={loading}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                />
              </Box>
            </TabPane>

            {/* Subscriptions Tab */}
            <TabPane 
              tab={
                <Space>
                  <HeartOutlined />
                  Subscriptions
                  <Badge count={stats.activeSubscriptions} size="small" />
                </Space>
              } 
              key="subscriptions"
            >
              <Box>
                <Title level={3}>Subscription Management</Title>
                <Table
                  dataSource={recentSubscriptions}
                  columns={subscriptionColumns}
                  loading={loading}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                />
              </Box>
            </TabPane>

            {/* Consultations Tab */}
            <TabPane 
              tab={
                <Space>
                  <MessageOutlined />
                  Consultations
                </Space>
              } 
              key="consultations"
            >
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <MessageOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                <Title level={3} type="secondary">Consultation Management Coming Soon</Title>
                <Text type="secondary">
                  Monitor and manage consultation rooms, messages, and practitioner assignments.
                </Text>
              </Box>
            </TabPane>

            {/* System Settings Tab */}
            <TabPane 
              tab={
                <Space>
                  <SettingOutlined />
                  Settings
                </Space>
              } 
              key="settings"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card title="System Information" style={{ borderRadius: 12 }}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <div>
                        <Text strong>Application Version:</Text>
                        <br />
                        <Text>1.0.0</Text>
                      </div>
                      <div>
                        <Text strong>Database Status:</Text>
                        <br />
                        <Badge status="processing" text="Connected" />
                      </div>
                      <div>
                        <Text strong>Authentication:</Text>
                        <br />
                        <Badge status="success" text="Firebase Auth Active" />
                      </div>
                      <div>
                        <Text strong>Admin Account:</Text>
                        <br />
                        <Text>ekahhealth@gmail.com</Text>
                        <Badge color="gold" text="DEFAULT ADMIN" style={{ marginLeft: 8 }} />
                      </div>
                    </Space>
                  </Card>
                </Col>
                
                <Col xs={24} lg={12}>
                  <Card title="Admin Actions" style={{ borderRadius: 12 }}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Button type="default" disabled>
                        Export User Data (Coming Soon)
                      </Button>
                      <Button type="default" disabled>
                        System Backup (Coming Soon)
                      </Button>
                      <Button type="default" disabled>
                        Email Templates (Coming Soon)
                      </Button>
                      <Button type="default" disabled>
                        Analytics Dashboard (Coming Soon)
                      </Button>
                      <Button 
                        danger 
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.resetAdminSetup) {
                            window.resetAdminSetup();
                          }
                        }}
                      >
                        Reset Admin Setup
                      </Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </Content>
    </Layout>
  );
};

export default AdminDashboardPage;