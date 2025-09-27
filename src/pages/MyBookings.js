// src/pages/MyBookings.js - Updated with Jitsi Integration
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
  Statistic,
  notification
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
  UserOutlined,
  CopyOutlined,
  WhatsAppOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { bookingsDB } from '../services/firebase/database';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { JitsiMeetingRoom, JitsiPreJoin } from '../components/JitsiMeeting';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [showJitsiMeeting, setShowJitsiMeeting] = useState(false);
  const [showPreJoin, setShowPreJoin] = useState(false);
  const [meetingRoomName, setMeetingRoomName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');
  const { user: currentUser } = useAuth();
  const { theme, getThemeStyles } = useTheme();
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
      const userBookings = await bookingsDB.getByUserId(currentUser.id);

      // Fetch payment status for each booking
      const bookingsWithPayment = await Promise.all(
        userBookings.map(async (booking) => {
          try {
            const paymentsQuery = query(
              collection(db, 'payments'),
              where('bookingId', '==', booking.id)
            );
            const paymentSnapshot = await getDocs(paymentsQuery);

            let paymentStatus = 'unpaid';
            let paymentDetails = null;

            if (!paymentSnapshot.empty) {
              const paymentDoc = paymentSnapshot.docs[0];
              paymentDetails = { id: paymentDoc.id, ...paymentDoc.data() };
              paymentStatus = paymentDetails.status || 'pending';
            }

            return {
              ...booking,
              paymentStatus,
              paymentDetails
            };
          } catch (error) {
            console.error('Error fetching payment for booking:', booking.id, error);
            return {
              ...booking,
              paymentStatus: 'unpaid',
              paymentDetails: null
            };
          }
        })
      );

      // Sort by creation date (newest first)
      const sortedBookings = bookingsWithPayment.sort((a, b) => {
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

  const themeStyles = getThemeStyles();

  const getStatusColor = (status, paymentStatus) => {
    const colors = {
      pending: themeStyles.warningColor,
      confirmed: themeStyles.accentPrimary,
      completed: themeStyles.successColor,
      cancelled: themeStyles.errorColor
    };

    // Override with payment status colors if payment affects the status
    if (paymentStatus === 'rejected') {
      return themeStyles.errorColor;
    } else if (paymentStatus === 'approved' && status === 'pending') {
      return themeStyles.successColor;
    } else if (paymentStatus === 'pending') {
      return themeStyles.warningColor;
    }

    return colors[status] || themeStyles.textSecondary;
  };

  const getPaymentStatusColor = (paymentStatus) => {
    const colors = {
      unpaid: '#f5222d',      // red
      pending: '#fa8c16',     // orange
      approved: '#52c41a',    // green
      rejected: '#f5222d'     // red
    };
    return colors[paymentStatus] || themeStyles.textSecondary;
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

  // Generate meeting room name from booking
  const generateMeetingRoom = (booking) => {
    const sanitizedName = booking.firstName.replace(/[^a-zA-Z0-9]/g, '');
    return `EkahHealth-${booking.confirmationNumber}-${sanitizedName}`;
  };

  // Join video meeting
  const handleJoinMeeting = (booking) => {
    if (booking.meetingURL) {
      // If meeting URL exists, open it
      window.open(booking.meetingURL, '_blank');
    } else {
      // Generate meeting room and show pre-join
      const roomName = generateMeetingRoom(booking);
      setMeetingRoomName(roomName);
      setPatientName(`${booking.firstName} ${booking.lastName}`);
      setMeetingPassword(''); // No password for generated rooms
      setSelectedBooking(booking);
      setShowPreJoin(true);
    }
  };

  // Handle pre-join completion
  const handlePreJoinComplete = (userName) => {
    setPatientName(userName);
    setShowPreJoin(false);
    setShowJitsiMeeting(true);
  };

  // Handle meeting end
  const handleMeetingEnd = () => {
    setShowJitsiMeeting(false);
    setShowPreJoin(false);
    setSelectedBooking(null);
    notification.success({
      message: 'Meeting Ended',
      description: 'Thank you for using EkahHealth video consultation!'
    });
  };

  // Copy meeting link
  const copyMeetingLink = (booking) => {
    const meetingURL = booking.meetingURL || `https://meet.jit.si/${generateMeetingRoom(booking)}`;
    navigator.clipboard.writeText(meetingURL);
    notification.success({
      message: 'Link Copied!',
      description: 'Meeting link copied to clipboard'
    });
  };

  // Download Jitsi app
  const downloadJitsiApp = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    let downloadUrl = '';
    
    if (userAgent.includes('android')) {
      downloadUrl = 'https://play.google.com/store/apps/details?id=org.jitsi.meet';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      downloadUrl = 'https://apps.apple.com/app/jitsi-meet/id1165103905';
    } else {
      notification.info({
        message: 'Desktop App Not Required',
        description: 'Jitsi Meet works directly in your web browser!'
      });
      return;
    }
    
    window.open(downloadUrl, '_blank');
  };

  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailModalVisible(true);
  };

  // Check if appointment is soon (within 30 minutes)
  const isAppointmentSoon = (booking) => {
    if (!booking.preferredDate || !booking.preferredTime) return false;
    
    const appointmentDate = moment(booking.preferredDate.toDate?.() || booking.preferredDate);
    const appointmentTime = moment(booking.preferredTime.toDate?.() || booking.preferredTime);
    const appointmentDateTime = moment(appointmentDate.format('YYYY-MM-DD') + ' ' + appointmentTime.format('HH:mm'));
    
    const now = moment();
    const diffMinutes = appointmentDateTime.diff(now, 'minutes');
    
    return diffMinutes >= -15 && diffMinutes <= 30; // 15 minutes after to 30 minutes before
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

  // Show full-screen meeting
  if (showJitsiMeeting) {
    return (
      <JitsiMeetingRoom
        roomName={meetingRoomName}
        displayName={patientName}
        password={meetingPassword}
        onBack={handleMeetingEnd}
      />
    );
  }

  // Show pre-join screen
  if (showPreJoin) {
    return (
      <JitsiPreJoin
        roomName={meetingRoomName}
        displayName={patientName}
        meetingPassword={meetingPassword}
        onJoinMeeting={handlePreJoinComplete}
      />
    );
  }

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
            My Appointments
          </Title>
          <Text style={{ color: themeStyles.textSecondary, fontSize: '16px' }}>
            Manage your video consultations and appointment history
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
                title={<span style={{ color: themeStyles.textSecondary }}>Total Appointments</span>}
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
                prefix={<ClockCircleOutlined />}
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
                prefix={<CheckCircleOutlined />}
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
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Jitsi Meet Info */}
        <Alert
          message="🎥 Video Consultations Powered by Jitsi Meet"
          description="Secure, free video meetings right in your browser. No downloads required! Click 'Join Meeting' when it's time for your appointment."
          type="info"
          showIcon
          closable
          action={
            <Button size="small" icon={<DownloadOutlined />} onClick={downloadJitsiApp}>
              Get Mobile App
            </Button>
          }
          style={{ 
            marginBottom: '32px',
            background: themeStyles.cardBg,
            border: `1px solid ${themeStyles.cardBorder}`
          }}
        />

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
                Browse our services and schedule your next consultation
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
            Appointment History
          </Title>
          
          {bookings.length === 0 ? (
            <Empty
              description={
                <span style={{ color: themeStyles.textSecondary }}>
                  No appointments found. Book your first consultation!
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
                const isSoon = isAppointmentSoon(booking);
                const canJoinMeeting = booking.status === 'confirmed' && (isUpcoming || isSoon);
                
                return (
                  <Timeline.Item
                    key={booking.id}
                    dot={
                      <div style={{
                        background: getStatusColor(booking.status, booking.paymentStatus),
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px'
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                              <Text code style={{ 
                                background: themeStyles.primaryColor,
                                color: 'white',
                                border: 'none',
                                padding: '2px 8px',
                                borderRadius: '4px'
                              }}>
                                {booking.confirmationNumber}
                              </Text>
                              <Tag color={getStatusColor(booking.status, booking.paymentStatus)}>
                                {booking.status?.toUpperCase()}
                              </Tag>
                              <Tag color={getPaymentStatusColor(booking.paymentStatus)}>
                                💳 {booking.paymentStatus?.toUpperCase() || 'UNPAID'}
                              </Tag>
                              {isUpcoming && (
                                <Badge status="processing" text="Upcoming" />
                              )}
                              {isSoon && (
                                <Badge status="warning" text="Starting Soon" />
                              )}
                              {booking.meetingURL && (
                                <Badge 
                                  count={<VideoCameraOutlined />} 
                                  style={{ backgroundColor: '#52c41a' }}
                                  title="Video Meeting Ready"
                                />
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
                            
                            <Space direction="vertical" size="small">
                              {canJoinMeeting && (
                                <Button
                                  type="primary"
                                  icon={<VideoCameraOutlined />}
                                  onClick={() => handleJoinMeeting(booking)}
                                  style={{
                                    background: '#52c41a',
                                    borderColor: '#52c41a'
                                  }}
                                  size="small"
                                >
                                  Join Video Meeting
                                </Button>
                              )}
                              
                              <Space>
                                <Button
                                  size="small"
                                  icon={<EyeOutlined />}
                                  onClick={() => showBookingDetails(booking)}
                                  style={{
                                    borderColor: themeStyles.primaryColor,
                                    color: themeStyles.primaryColor
                                  }}
                                >
                                  Details
                                </Button>
                                
                                {(canJoinMeeting || booking.meetingURL) && (
                                  <Button
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copyMeetingLink(booking)}
                                    title="Copy meeting link"
                                  />
                                )}
                              </Space>
                            </Space>
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
            Appointment Details - {selectedBooking?.confirmationNumber}
            {selectedBooking?.meetingURL && (
              <Tag color="green" style={{ marginLeft: 8 }}>
                <VideoCameraOutlined /> Video Ready
              </Tag>
            )}
          </span>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
          selectedBooking && (selectedBooking.status === 'confirmed' && (isAppointmentSoon(selectedBooking) || selectedBooking.meetingURL)) && (
            <Button 
              key="join" 
              type="primary"
              icon={<VideoCameraOutlined />}
              onClick={() => {
                setDetailModalVisible(false);
                handleJoinMeeting(selectedBooking);
              }}
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
            >
              Join Video Meeting
            </Button>
          )
        ]}
        width={700}
      >
        {selectedBooking && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Status" span={2}>
                <Space>
                  <Tag color={getStatusColor(selectedBooking.status, selectedBooking.paymentStatus)}>
                    {selectedBooking.status?.toUpperCase()}
                  </Tag>
                  <Tag color={getPaymentStatusColor(selectedBooking.paymentStatus)}>
                    💳 Payment: {selectedBooking.paymentStatus?.toUpperCase() || 'UNPAID'}
                  </Tag>
                  {selectedBooking.meetingURL && (
                    <Tag color="green">
                      <VideoCameraOutlined /> Video Meeting Ready
                    </Tag>
                  )}
                </Space>
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
                <Space>
                  {getSessionTypeIcon(selectedBooking.sessionType)}
                  {selectedBooking.sessionType?.charAt(0).toUpperCase() + selectedBooking.sessionType?.slice(1)}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Duration">
                30-60 minutes
              </Descriptions.Item>
              
              <Descriptions.Item label="Phone">
                <a href={`tel:${selectedBooking.phone}`}>{selectedBooking.phone}</a>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <a href={`mailto:${selectedBooking.email}`}>{selectedBooking.email}</a>
              </Descriptions.Item>
              
              {/* Video Meeting Details */}
              {selectedBooking.meetingURL && (
                <Descriptions.Item label="Video Meeting" span={2}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Alert
                      message="Video Meeting Information"
                      description={
                        <div>
                          <p><strong>Meeting Link:</strong></p>
                          <div style={{ 
                            background: '#f6f8fa', 
                            padding: '8px 12px', 
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '10px'
                          }}>
                            <Text code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                              {selectedBooking.meetingURL}
                            </Text>
                            <Button 
                              size="small"
                              icon={<CopyOutlined />}
                              onClick={() => copyMeetingLink(selectedBooking)}
                            />
                          </div>
                          
                          {selectedBooking.meetingPassword && (
                            <p><strong>Password:</strong> <Text code>{selectedBooking.meetingPassword}</Text></p>
                          )}
                          
                          <div style={{ marginTop: '10px' }}>
                            <Text type="secondary">
                              💡 <strong>Tip:</strong> Click the meeting link 5 minutes before your appointment time
                            </Text>
                          </div>
                        </div>
                      }
                      type="info"
                      showIcon
                    />
                    
                    <Space>
                      <Button 
                        type="primary"
                        icon={<VideoCameraOutlined />}
                        onClick={() => {
                          setDetailModalVisible(false);
                          handleJoinMeeting(selectedBooking);
                        }}
                        style={{ background: '#52c41a', borderColor: '#52c41a' }}
                      >
                        Join Meeting
                      </Button>
                      <Button 
                        icon={<DownloadOutlined />}
                        onClick={downloadJitsiApp}
                      >
                        Get Mobile App
                      </Button>
                    </Space>
                  </Space>
                </Descriptions.Item>
              )}
              
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
                {moment(selectedBooking.updatedAt?.toDate?.() || selectedBooking.updatedAt || selectedBooking.createdAt?.toDate?.() || selectedBooking.createdAt)
                  .format('MMMM DD, YYYY HH:mm')}
              </Descriptions.Item>
            </Descriptions>
            
            {selectedBooking.selectedServices && selectedBooking.selectedServices.length > 0 && (
              <div style={{ marginTop: 16 }}>
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

            {/* Payment Details */}
            {selectedBooking.paymentDetails && (
              <div style={{ marginTop: 16 }}>
                <Title level={5} style={{ color: themeStyles.textPrimary }}>
                  Payment Information
                </Title>
                <Card size="small" style={{
                  background: themeStyles.cardBg,
                  border: `1px solid ${themeStyles.cardBorder}`
                }}>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Text style={{ color: themeStyles.textSecondary }}>Amount:</Text>
                      <div style={{ color: themeStyles.textPrimary, fontWeight: 'bold' }}>
                        ₹{selectedBooking.paymentDetails.amount || 0}
                      </div>
                    </Col>
                    <Col span={12}>
                      <Text style={{ color: themeStyles.textSecondary }}>Status:</Text>
                      <div>
                        <Tag color={getPaymentStatusColor(selectedBooking.paymentStatus)}>
                          {selectedBooking.paymentStatus?.toUpperCase() || 'UNPAID'}
                        </Tag>
                      </div>
                    </Col>
                    <Col span={12}>
                      <Text style={{ color: themeStyles.textSecondary }}>Submitted:</Text>
                      <div style={{ color: themeStyles.textPrimary }}>
                        {selectedBooking.paymentDetails.createdAt?.toDate ?
                          moment(selectedBooking.paymentDetails.createdAt.toDate()).format('MMM DD, YYYY HH:mm') :
                          'N/A'
                        }
                      </div>
                    </Col>
                    {selectedBooking.paymentDetails.screenshotUrl && (
                      <Col span={12}>
                        <Text style={{ color: themeStyles.textSecondary }}>Screenshot:</Text>
                        <div>
                          <Button
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => window.open(selectedBooking.paymentDetails.screenshotUrl, '_blank')}
                          >
                            View
                          </Button>
                        </div>
                      </Col>
                    )}
                  </Row>
                  {selectedBooking.paymentStatus === 'rejected' && (
                    <Alert
                      message="Payment Rejected"
                      description="Your payment was rejected. Please contact support for assistance."
                      type="error"
                      style={{ marginTop: '12px' }}
                    />
                  )}
                  {selectedBooking.paymentStatus === 'pending' && (
                    <Alert
                      message="Payment Under Review"
                      description="Your payment is being reviewed by our admin team. You will be notified once approved."
                      type="info"
                      style={{ marginTop: '12px' }}
                    />
                  )}
                  {selectedBooking.paymentStatus === 'approved' && (
                    <Alert
                      message="Payment Approved"
                      description="Your payment has been approved. Your booking is confirmed!"
                      type="success"
                      style={{ marginTop: '12px' }}
                    />
                  )}
                </Card>
              </div>
            )}

            {/* Meeting Instructions */}
            {selectedBooking.status === 'confirmed' && (
              <div style={{ marginTop: 16 }}>
                <Alert
                  message="How to Join Your Video Consultation"
                  description={
                    <div>
                      <ol style={{ paddingLeft: '20px' }}>
                        <li><strong>5 minutes before:</strong> Click "Join Video Meeting" button</li>
                        <li><strong>Allow permissions:</strong> Enable camera and microphone when prompted</li>
                        <li><strong>Wait for doctor:</strong> Your healthcare provider will join shortly</li>
                        <li><strong>Backup plan:</strong> Call +91 63617 43098 if you have technical issues</li>
                      </ol>
                      
                      <div style={{ marginTop: '10px', padding: '8px', background: '#f0f9ff', borderRadius: '4px' }}>
                        <Text type="secondary">
                          📱 <strong>Mobile users:</strong> Download the free "Jitsi Meet" app for the best experience, or use your mobile browser
                        </Text>
                      </div>
                    </div>
                  }
                  type="success"
                  showIcon={false}
                  style={{ marginTop: 16 }}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyBookings;