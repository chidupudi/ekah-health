// src/pages/dashboard/ClientDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Button, Typography, Space, Avatar, Tabs, Badge, Alert } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  ShoppingOutlined,
  MessageOutlined,
  CalendarOutlined,
  HeartOutlined,
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons';
import { Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase/config';

// Import our new components
import ServicesCatalog from '../../components/services/ServicesCatalog/ServicesCatalog';
import SubscriptionManager from '../../components/subscriptions/SubscriptionsManager/SubscriptionManager';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ClientDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [consultationRooms, setConsultationRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch user subscriptions and consultation rooms
  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      try {
        console.log('📊 Fetching user subscriptions and rooms...');

        // Fetch subscriptions
        const subscriptionsQuery = query(
          collection(db, 'subscriptions'),
          where('userId', '==', currentUser.uid)
        );
        const subscriptionsSnapshot = await getDocs(subscriptionsQuery);
        const subscriptions = subscriptionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log('✅ Subscriptions loaded:', subscriptions.length);
        setUserSubscriptions(subscriptions);

        // Fetch consultation rooms
        const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active' && sub.roomId);
        const roomPromises = activeSubscriptions.map(async (sub) => {
          const roomsQuery = query(
            collection(db, 'consultation_rooms'),
            where('subscriptionId', '==', sub.id)
          );
          const roomsSnapshot = await getDocs(roomsQuery);
          return roomsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            subscriptionInfo: sub
          }));
        });

        const roomsArrays = await Promise.all(roomPromises);
        const rooms = roomsArrays.flat();
        
        console.log('✅ Consultation rooms loaded:', rooms.length);
        setConsultationRooms(rooms);

        // Set default tab based on user status
        if (subscriptions.length === 0) {
          setActiveTab('browse'); // New users see plans first
        } else if (subscriptions.some(sub => sub.status === 'pending_setup')) {
          setActiveTab('subscriptions'); // Users with pending setup
        } else if (rooms.length > 0) {
          setActiveTab('consultations'); // Users with active rooms
        }

      } catch (error) {
        console.error('❌ Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Listen for real-time updates on consultation rooms
  useEffect(() => {
    if (!currentUser || consultationRooms.length === 0) return;

    const unsubscribes = consultationRooms.map(room => {
      return onSnapshot(
        collection(db, 'messages'),
        (snapshot) => {
          // Count unread messages
          let unreadCount = 0;
          snapshot.docs.forEach(doc => {
            const message = doc.data();
            if (message.roomId === room.id && 
                message.sender !== currentUser.uid && 
                !message.read) {
              unreadCount++;
            }
          });
          setUnreadMessages(prev => prev + unreadCount);
        }
      );
    });

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [currentUser, consultationRooms]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSubscribe = async (planData) => {
    console.log('🔄 Starting subscription process for:', planData.title);
    // This will be handled by SubscriptionManager component
    return new Promise((resolve) => {
      // Switch to subscriptions tab to handle the subscription
      setActiveTab('subscriptions');
      resolve();
    });
  };

  const handleSubscriptionUpdate = (updatedSubscriptions) => {
    if (updatedSubscriptions) {
      setUserSubscriptions(updatedSubscriptions);
    } else {
      // Refresh data
      window.location.reload();
    }
  };

  if (!userProfile) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
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
            EKAH Health
          </Title>
        </Box>
        
        <Space size="middle">
          <Badge count={unreadMessages} size="small">
            <BellOutlined style={{ fontSize: 18, color: '#666' }} />
          </Badge>
          <Avatar 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#1976d2' }}
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
                Welcome back, {userProfile.firstName}! 👋
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                {userSubscriptions.length === 0 
                  ? "Ready to start your wellness journey? Browse our plans below."
                  : consultationRooms.length > 0
                  ? "Your consultation rooms are ready. Connect with your practitioners anytime."
                  : "Complete your subscription setup to activate your consultation rooms."
                }
              </Text>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              {!currentUser?.emailVerified && (
                <Alert
                  message="📧 Please verify your email"
                  type="warning"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}
              
              {userSubscriptions.length > 0 && (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: '#f6ffed', 
                  borderRadius: 2, 
                  border: '1px solid #b7eb8f' 
                }}>
                  <Text type="success" strong>
                    🎉 You have {userSubscriptions.length} active plan{userSubscriptions.length > 1 ? 's' : ''}
                  </Text>
                </Box>
              )}
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
            {/* Browse Plans Tab */}
            <TabPane 
              tab={
                <Space>
                  <ShoppingOutlined />
                  Browse Plans
                </Space>
              } 
              key="browse"
            >
              <ServicesCatalog onSubscribe={handleSubscribe} />
            </TabPane>

            {/* Subscriptions Tab */}
            <TabPane 
              tab={
                <Space>
                  <HeartOutlined />
                  My Subscriptions
                  {userSubscriptions.filter(sub => sub.status === 'pending_setup').length > 0 && (
                    <Badge 
                      count={userSubscriptions.filter(sub => sub.status === 'pending_setup').length} 
                      size="small" 
                    />
                  )}
                </Space>
              } 
              key="subscriptions"
            >
              <SubscriptionManager 
                userSubscriptions={userSubscriptions}
                onSubscriptionUpdate={handleSubscriptionUpdate}
              />
            </TabPane>

            {/* Consultation Rooms Tab */}
            {consultationRooms.length > 0 && (
              <TabPane 
                tab={
                  <Space>
                    <MessageOutlined />
                    Consultations
                    {unreadMessages > 0 && (
                      <Badge count={unreadMessages} size="small" />
                    )}
                  </Space>
                } 
                key="consultations"
              >
                <Box>
                  <Title level={3}>Your Consultation Rooms</Title>
                  <Row gutter={[16, 16]}>
                    {consultationRooms.map(room => (
                      <Col xs={24} lg={12} key={room.id}>
                        <Card
                          hoverable
                          style={{ borderRadius: 12 }}
                          actions={[
                            <Button 
                              type="primary" 
                              icon={<MessageOutlined />}
                              onClick={() => navigate(`/client/consultation/${room.id}`)}
                            >
                              Open Room
                            </Button>,
                            <Button 
                              icon={<CalendarOutlined />}
                              onClick={() => navigate(`/client/appointments/${room.subscriptionInfo.id}`)}
                            >
                              Schedule
                            </Button>
                          ]}
                        >
                          <Card.Meta
                            title={room.planTitle}
                            description={
                              <Box>
                                <Text type="secondary">
                                  <UserOutlined /> {room.practitionerType}
                                </Text>
                                <br />
                                <Text type="secondary">
                                  Last activity: {new Date(room.lastActivity).toLocaleDateString()}
                                </Text>
                                {room.practitionerId && (
                                  <div style={{ marginTop: 8 }}>
                                    <Badge status="processing" text="Practitioner assigned" />
                                  </div>
                                )}
                              </Box>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Box>
              </TabPane>
            )}

            {/* Appointments Tab */}
            <TabPane 
              tab={
                <Space>
                  <CalendarOutlined />
                  Appointments
                </Space>
              } 
              key="appointments"
            >
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CalendarOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                <Title level={3} type="secondary">Appointments Coming Soon</Title>
                <Text type="secondary">
                  Schedule video calls and in-person appointments with your practitioners.
                </Text>
              </Box>
            </TabPane>

            {/* Profile Settings Tab */}
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
                  <Card title="Profile Information" style={{ borderRadius: 12 }}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <div>
                        <Text strong>Full Name:</Text>
                        <br />
                        <Text>{userProfile.displayName}</Text>
                      </div>
                      <div>
                        <Text strong>Email:</Text>
                        <br />
                        <Text>{userProfile.email}</Text>
                        {currentUser?.emailVerified ? (
                          <Text type="success" style={{ marginLeft: 8 }}>✓ Verified</Text>
                        ) : (
                          <Text type="warning" style={{ marginLeft: 8 }}>⚠ Not Verified</Text>
                        )}
                      </div>
                      <div>
                        <Text strong>Phone:</Text>
                        <br />
                        <Text>{userProfile.phone || 'Not provided'}</Text>
                      </div>
                      <div>
                        <Text strong>Member Since:</Text>
                        <br />
                        <Text>{new Date(userProfile.createdAt).toLocaleDateString()}</Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
                
                <Col xs={24} lg={12}>
                  <Card title="Account Settings" style={{ borderRadius: 12 }}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Button type="default" disabled>
                        Edit Profile (Coming Soon)
                      </Button>
                      <Button type="default" disabled>
                        Notification Settings (Coming Soon)
                      </Button>
                      <Button type="default" disabled>
                        Privacy Settings (Coming Soon)
                      </Button>
                      <Button danger disabled>
                        Delete Account (Coming Soon)
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

export default ClientDashboardPage;