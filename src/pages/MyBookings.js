import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Timeline,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Empty,
  Spin,
  Modal,
  Descriptions,
  Badge,
  Divider,
  Alert,
  Statistic
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  DesktopOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { bookingsDB } from '../services/firebase/database';
import { useTheme } from '../components/ParticleBackground';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }
    loadUserBookings();
  }, [currentUser, navigate]);

  const loadUserBookings = async () => {
    setLoading(true);
    try {
      const userBookings = await bookingsDB.getByUserId(currentUser.uid);
      // Sort by creation date (newest first)
      const sortedBookings = userBookings.sort((a, b) => {
        const aDate = new Date(a.createdAt.toDate ? a.createdAt.toDate() : a.createdAt);
        const bDate = new Date(b.createdAt.toDate ? b.createdAt.toDate() : b.createdAt);
        return bDate - aDate;
      });
      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error loading user bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        cardBg: 'rgba(67, 127, 151, 0.12)',
        cardBorder: 'rgba(67, 127, 151, 0.25)',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        primaryColor: '#437F97',
        accentColor: '#FFB5C2',
        successColor: '#52c41a',
        warningColor: '#faad14',
        errorColor: '#f5222d',
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #f8fafc 0%, rgba(238, 225, 179, 0.1) 50%, #f8fafc 100%)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(67, 127, 151, 0.15)',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        primaryColor: '#437F97',
        accentColor: '#FFB5C2',
        successColor: '#52c41a',
        warningColor: '#faad14',
        errorColor: '#f5222d',
      };
    }
  };

  const themeStyles = getThemeStyles();

  const getStatusColor = (status) => {
    const colors = {
      pending: themeStyles.warningColor,
      confirmed: themeStyles.primaryColor,
      completed: themeStyles.successColor,
      cancelled: themeStyles.errorColor
    };
    return colors[status] || themeStyles.textSecondary;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <ClockCircleOutlined />,
      confirmed: <CheckCircleOutlined />,
      completed: <CheckCircleOutlined />,
      cancelled: <ExclamationCircleOutlined />
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  const getSessionTypeIcon = (type) => {
    const icons = {
      'online': <VideoCameraOutlined />,
      'in-person': <EnvironmentOutlined />,
      'phone': <PhoneOutlined />
    };
    return icons[type] || <DesktopOutlined />;
  };

  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailModalVisible(true);
  };

  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      upcoming: 0,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };

    // Count upcoming appointments
    bookings.forEach(booking => {
      if ((booking.status === 'pending' || booking.status === 'confirmed')) {
        const appointmentDate = moment(booking.preferredDate?.toDate?.() || booking.preferredDate);
        if (appointmentDate.isAfter(moment())) {
          stats.upcoming++;
        }
      }
    });

    return stats;
  };

  const stats = getBookingStats();

  if (loading) {
    return (
      <div style={{
        background: themeStyles.background,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div style={{
      background: themeStyles.background,
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={2} style={{ color: themeStyles.textPrimary, marginBottom: '8px' }}>
            My Bookings
          </Title>
          <Text style={{ color: themeStyles.textSecondary, fontSize: '16px' }}>
            Manage your appointments and view booking history
          </Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={6}>
            <Card style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: '12px'
            }}>
              <Statistic
                title={<span style={{ color: themeStyles.textSecondary }}>Total Bookings</span>}
                value={stats.total}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: themeStyles.textPrimary }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: '12px'
            }}>
              <Statistic
                title={<span style={{ color: themeStyles.textSecondary }}>Upcoming</span>}
                value={stats.upcoming}
                valueStyle={{ color: themeStyles.primaryColor }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: '12px'
            }}>
              <Statistic
                title={<span style={{ color: themeStyles.textSecondary }}>Completed</span>}
                value={stats.completed}
                valueStyle={{ color: themeStyles.successColor }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: '12px'
            }}>
              <Statistic
                title={<span style={{ color: themeStyles.textSecondary }}>Cancelled</span>}
                value={stats.cancelled}
                valueStyle={{ color: themeStyles.errorColor }}
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Card style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: '16px',
          marginBottom: '32px'
        }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ color: themeStyles.textPrimary, margin: 0 }}>
                Need to book another appointment?
              </Title>
              <Text style={{ color: themeStyles.textSecondary }}>
                Browse our services and schedule your next session
              </Text>
            </Col>
            <Col>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/services')}
                style={{
                  background: themeStyles.primaryColor,
                  borderColor: themeStyles.primaryColor,
                  borderRadius: '8px'
                }}
              >
                Book New Appointment
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Bookings List */}
        <Card style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: '16px'
        }}>
          <Title level={4} style={{ color: themeStyles.textPrimary, marginBottom: '24px' }}>
            Booking History
          </Title>
          
          {bookings.length === 0 ? (
            <Empty
              description={
                <span style={{ color: themeStyles.textSecondary }}>
                  No bookings found. Book your first appointment!
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                onClick={() => navigate('/services')}
                style={{
                  background: themeStyles.primaryColor,
                  borderColor: themeStyles.primaryColor
                }}
              >
                Browse Services
              </Button>
            </Empty>
          ) : (
            <Timeline>
              {bookings.map((booking) => {
                const appointmentDate = moment(booking.preferredDate?.toDate?.() || booking.preferredDate);
                const appointmentTime = moment(booking.preferredTime?.toDate?.() || booking.preferredTime);
                const isUpcoming = appointmentDate.isAfter(moment()) && 
                  (booking.status === 'pending' || booking.status === 'confirmed');
                
                return (
                  <Timeline.Item
                    key={booking.id}
                    dot={
                      <div style={{
                        background: getStatusColor(booking.status),
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        {getStatusIcon(booking.status)}
                      </div>
                    }
                  >
                    <Card
                      size="small"
                      style={{
                        background: isUpcoming ? `${themeStyles.primaryColor}10` : themeStyles.cardBg,
                        border: `1px solid ${isUpcoming ? themeStyles.primaryColor : themeStyles.cardBorder}`,
                        borderRadius: '12px',
                        marginBottom: '16px'
                      }}
                    >
                      <Row justify="space-between" align="top">
                        <Col xs={24} lg={16}>
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <Text code style={{ 
                                background: themeStyles.primaryColor,
                                color: 'white',
                                border: 'none',
                                padding: '2px 8px',
                                borderRadius: '4px'
                              }}>
                                {booking.confirmationNumber}
                              </Text>
                              <Tag color={getStatusColor(booking.status)}>
                                {booking.status?.toUpperCase()}
                              </Tag>
                              {isUpcoming && (
                                <Badge status="processing" text="Upcoming" />
                              )}
                            </div>

                            {/* Services */}
                            <div>
                              <Text strong style={{ color: themeStyles.textPrimary }}>
                                Services: 
                              </Text>
                              <div style={{ marginTop: '4px' }}>
                                {booking.selectedServices?.map((service, index) => (
                                  <Tag key={index} icon={<HeartOutlined />} style={{ margin: '2px' }}>
                                    {service.title}
                                  </Tag>
                                ))}
                              </div>
                            </div>

                            {/* Appointment Details */}
                            <Row gutter={16}>
                              <Col xs={24} sm={12}>
                                <Space>
                                  <CalendarOutlined style={{ color: themeStyles.primaryColor }} />
                                  <Text style={{ color: themeStyles.textSecondary }}>
                                    {appointmentDate.format('MMM DD, YYYY')}
                                  </Text>
                                </Space>
                              </Col>
                              <Col xs={24} sm={12}>
                                <Space>
                                  <ClockCircleOutlined style={{ color: themeStyles.primaryColor }} />
                                  <Text style={{ color: themeStyles.textSecondary }}>
                                    {appointmentTime.format('HH:mm')}
                                  </Text>
                                </Space>
                              </Col>
                            </Row>

                            {/* Session Type */}
                            <Space>
                              {getSessionTypeIcon(booking.sessionType)}
                              <Text style={{ color: themeStyles.textSecondary }}>
                                {booking.sessionType?.charAt(0).toUpperCase() + booking.sessionType?.slice(1)} Session
                              </Text>
                            </Space>
                          </Space>
                        </Col>
                        
                        <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>
                              Booked: {moment(booking.createdAt?.toDate?.() || booking.createdAt).format('MMM DD, YYYY')}
                            </Text>
                            <Button
                              size="small"
                              icon={<EyeOutlined />}
                              onClick={() => showBookingDetails(booking)}
                              style={{
                                borderColor: themeStyles.primaryColor,
                                color: themeStyles.primaryColor
                              }}
                            >
                              View Details
                            </Button>
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          )}
        </Card>
      </div>

      {/* Booking Details Modal */}
      <Modal
        title={
          <span style={{ color: themeStyles.textPrimary }}>
            Booking Details - {selectedBooking?.confirmationNumber}
          </span>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedBooking && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Status" span={2}>
                <Tag color={getStatusColor(selectedBooking.status)}>
                  {selectedBooking.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Date">
                {selectedBooking.preferredDate ? 
                  moment(selectedBooking.preferredDate.toDate?.() || selectedBooking.preferredDate)
                    .format('MMMM DD, YYYY') : 'Not set'
                }
              </Descriptions.Item>
              <Descriptions.Item label="Time">
                {selectedBooking.preferredTime ? 
                  moment(selectedBooking.preferredTime.toDate?.() || selectedBooking.preferredTime)
                    .format('HH:mm') : 'Not set'
                }
              </Descriptions.Item>
              
              <Descriptions.Item label="Session Type">
                {selectedBooking.sessionType?.charAt(0).toUpperCase() + selectedBooking.sessionType?.slice(1)}
              </Descriptions.Item>
              <Descriptions.Item label="Age">
                {selectedBooking.age} years
              </Descriptions.Item>
              
              <Descriptions.Item label="Phone">
                {selectedBooking.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedBooking.email}
              </Descriptions.Item>
              
              <Descriptions.Item label="Current Concerns" span={2}>
                {selectedBooking.currentConcerns || 'Not provided'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Special Requests" span={2}>
                {selectedBooking.specialRequests || 'None'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Booked On">
                {moment(selectedBooking.createdAt?.toDate?.() || selectedBooking.createdAt)
                  .format('MMMM DD, YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {moment(selectedBooking.updatedAt?.toDate?.() || selectedBooking.updatedAt)
                  .format('MMMM DD, YYYY HH:mm')}
              </Descriptions.Item>
            </Descriptions>
            
            {selectedBooking.selectedServices && selectedBooking.selectedServices.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <Title level={5} style={{ color: themeStyles.textPrimary }}>
                  Selected Services
                </Title>
                <Space wrap>
                  {selectedBooking.selectedServices.map((service, index) => (
                    <Tag key={index} icon={<HeartOutlined />} color="blue">
                      {service.title} - {service.category}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyBookings;