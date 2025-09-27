// src/pages/BookingDetails.js - Dedicated Booking Details Page
import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Spin,
  Descriptions,
  Badge,
  Alert,
  notification,
  Breadcrumb
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
  ArrowLeftOutlined,
  LinkOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  HomeOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { bookingsDB } from '../services/firebase/database';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import { useTheme } from '../components/ParticleBackground';
import { useNavigate, useParams } from 'react-router-dom';
import { JitsiMeetingRoom, JitsiPreJoin } from '../components/JitsiMeeting';
import moment from 'moment';

const { Title, Text } = Typography;

const BookingDetails = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJitsiMeeting, setShowJitsiMeeting] = useState(false);
  const [showPreJoin, setShowPreJoin] = useState(false);
  const [meetingRoomName, setMeetingRoomName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');

  const { user: currentUser } = useAuth();
  const { theme, getThemeStyles } = useTheme();
  const navigate = useNavigate();
  const { bookingId } = useParams();

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }
    if (!bookingId) {
      navigate('/my-bookings');
      return;
    }
    loadBookingDetails();
  }, [currentUser, bookingId, navigate]);

  const loadBookingDetails = async () => {
    setLoading(true);
    try {
      // Get the specific booking
      const userBookings = await bookingsDB.getByUserId(currentUser.id);
      const selectedBooking = userBookings.find(b => b.id === bookingId);

      if (!selectedBooking) {
        notification.error({
          message: 'Booking Not Found',
          description: 'The requested booking could not be found.'
        });
        navigate('/my-bookings');
        return;
      }

      // Fetch payment status for the booking
      try {
        const paymentsQuery = query(
          collection(db, 'payments'),
          where('bookingId', '==', selectedBooking.id)
        );
        const paymentSnapshot = await getDocs(paymentsQuery);

        let paymentStatus = 'unpaid';
        let paymentDetails = null;

        if (!paymentSnapshot.empty) {
          const paymentDoc = paymentSnapshot.docs[0];
          paymentDetails = { id: paymentDoc.id, ...paymentDoc.data() };
          paymentStatus = paymentDetails.status || 'pending';
        }

        setBooking({
          ...selectedBooking,
          paymentStatus,
          paymentDetails
        });
      } catch (error) {
        console.error('Error fetching payment for booking:', selectedBooking.id, error);
        setBooking({
          ...selectedBooking,
          paymentStatus: 'unpaid',
          paymentDetails: null
        });
      }
    } catch (error) {
      console.error('Error loading booking details:', error);
      notification.error({
        message: 'Error Loading Booking',
        description: 'There was an error loading the booking details.'
      });
      navigate('/my-bookings');
    } finally {
      setLoading(false);
    }
  };

  const themeStyles = getThemeStyles();

  // Detect if user is on mobile device
  const isMobileDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  };

  // Copy meeting link with enhanced functionality
  const copyMeetingLink = (bookingData) => {
    const meetingURL = bookingData.meetingURL || `https://meet.jit.si/${generateMeetingRoom(bookingData)}`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(meetingURL).then(() => {
        notification.success({
          message: 'Link Copied!',
          description: 'Meeting link copied to clipboard',
          duration: 3
        });
      }).catch(() => {
        fallbackCopyTextToClipboard(meetingURL);
      });
    } else {
      fallbackCopyTextToClipboard(meetingURL);
    }
  };

  // Fallback copy function for older browsers
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      notification.success({
        message: 'Link Copied!',
        description: 'Meeting link copied to clipboard',
        duration: 3
      });
    } catch (err) {
      notification.error({
        message: 'Copy Failed',
        description: 'Unable to copy link. Please copy manually.',
        duration: 5
      });
    }

    document.body.removeChild(textArea);
  };

  // Enhanced join meeting function with platform detection
  const handleJoinMeetingEnhanced = (bookingData) => {
    const meetingURL = bookingData.meetingURL || `https://meet.jit.si/${generateMeetingRoom(bookingData)}`;

    if (isMobileDevice()) {
      const jitsiAppURL = meetingURL.replace('https://meet.jit.si/', 'org.jitsi.meet://');
      const appLink = document.createElement('a');
      appLink.href = jitsiAppURL;
      appLink.click();

      setTimeout(() => {
        window.open(meetingURL, '_blank');
      }, 1000);

      notification.info({
        message: 'Opening Meeting',
        description: 'Trying to open in Jitsi app. If app is not installed, it will open in browser.',
        duration: 4
      });
    } else {
      window.open(meetingURL, '_blank');
      notification.success({
        message: 'Meeting Opened',
        description: 'Meeting opened in new tab',
        duration: 3
      });
    }
  };

  // Generate meeting room name from booking
  const generateMeetingRoom = (bookingData) => {
    const sanitizedName = bookingData.firstName.replace(/[^a-zA-Z0-9]/g, '');
    return `EkahHealth-${bookingData.confirmationNumber}-${sanitizedName}`;
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

  const getStatusColor = (status, paymentStatus) => {
    const colors = {
      pending: themeStyles.warningColor,
      confirmed: themeStyles.accentPrimary,
      completed: themeStyles.successColor,
      cancelled: themeStyles.errorColor
    };

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
      unpaid: '#f5222d',
      pending: '#fa8c16',
      approved: '#52c41a',
      rejected: '#f5222d'
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

  // Check if appointment is soon (within 30 minutes)
  const isAppointmentSoon = (bookingData) => {
    if (!bookingData.preferredDate || !bookingData.preferredTime) return false;

    const appointmentDate = moment(bookingData.preferredDate.toDate?.() || bookingData.preferredDate);
    const appointmentTime = moment(bookingData.preferredTime.toDate?.() || bookingData.preferredTime);
    const appointmentDateTime = moment(appointmentDate.format('YYYY-MM-DD') + ' ' + appointmentTime.format('HH:mm'));

    const now = moment();
    const diffMinutes = appointmentDateTime.diff(now, 'minutes');

    return diffMinutes >= -15 && diffMinutes <= 30;
  };

  // Show full-screen meeting
  if (showJitsiMeeting) {
    return (
      <JitsiMeetingRoom
        roomName={meetingRoomName}
        displayName={patientName}
        password={meetingPassword}
        onBack={() => setShowJitsiMeeting(false)}
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
        onJoinMeeting={(userName) => {
          setPatientName(userName);
          setShowPreJoin(false);
          setShowJitsiMeeting(true);
        }}
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

  if (!booking) {
    return (
      <div style={{
        background: themeStyles.background,
        minHeight: '100vh',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Card style={{ textAlign: 'center' }}>
          <Title level={3}>Booking Not Found</Title>
          <Text>The requested booking could not be found.</Text>
          <div style={{ marginTop: '20px' }}>
            <Button type="primary" onClick={() => navigate('/my-bookings')}>
              Back to My Bookings
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const canJoinMeeting = booking.status === 'confirmed' && (isAppointmentSoon(booking) || booking.meetingURL);

  return (
    <div style={{
      background: themeStyles.background,
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '32px' }}>
          <Breadcrumb
            items={[
              {
                title: (
                  <a onClick={() => navigate('/')}>
                    <HomeOutlined style={{ marginRight: '8px' }} />
                    Home
                  </a>
                )
              },
              {
                title: (
                  <a onClick={() => navigate('/my-bookings')}>
                    My Bookings
                  </a>
                )
              },
              {
                title: `Booking ${booking.confirmationNumber}`
              }
            ]}
            style={{
              fontSize: '16px',
              fontWeight: '500'
            }}
          />
        </div>

        {/* Back Button and Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/my-bookings')}
            size="large"
            style={{
              borderRadius: '12px',
              height: '48px',
              paddingLeft: '20px',
              paddingRight: '20px',
              borderColor: themeStyles.primaryColor,
              color: themeStyles.primaryColor,
              fontWeight: '600'
            }}
          >
            Back to Bookings
          </Button>

          <div>
            <Title
              level={1}
              style={{
                color: themeStyles.textPrimary,
                margin: 0,
                fontSize: '2.5rem',
                fontWeight: '800',
                background: themeStyles.gradientPrimary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em'
              }}
            >
              Appointment Details
            </Title>
            <Text style={{
              color: themeStyles.textSecondary,
              fontSize: '18px',
              fontWeight: '500'
            }}>
              Booking Reference: {booking.confirmationNumber}
            </Text>
          </div>
        </div>

        {/* Action Buttons for Meeting */}
        {canJoinMeeting && (
          <div style={{
            background: theme === 'dark'
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '32px',
            border: `2px solid ${theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
            }} />
            <Row align="middle" justify="space-between">
              <Col xs={24} lg={16}>
                <Space direction="vertical" size="small">
                  <Title level={4} style={{
                    color: themeStyles.textPrimary,
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    🎥 Your Video Meeting is Ready!
                  </Title>
                  <Text style={{
                    color: themeStyles.textSecondary,
                    fontSize: '16px'
                  }}>
                    Join your consultation when you're ready or copy the link to join later.
                  </Text>
                </Space>
              </Col>
              <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
                <Space wrap>
                  <Button
                    type="primary"
                    size="large"
                    icon={<VideoCameraOutlined />}
                    onClick={() => handleJoinMeetingEnhanced(booking)}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderColor: 'transparent',
                      borderRadius: '12px',
                      height: '48px',
                      fontWeight: '700',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    {isMobileDevice() ? 'Open Meeting' : 'Join Meeting'}
                  </Button>
                  <Button
                    size="large"
                    icon={<LinkOutlined />}
                    onClick={() => copyMeetingLink(booking)}
                    style={{
                      borderColor: themeStyles.primaryColor,
                      color: themeStyles.primaryColor,
                      borderRadius: '12px',
                      height: '48px',
                      fontWeight: '600'
                    }}
                  >
                    Copy Link
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>
        )}

        {/* Main Content Grid */}
        <Row gutter={[32, 32]}>
          {/* Left Column - Main Details */}
          <Col xs={24} lg={16}>
            {/* Quick Info Header */}
            <Card style={{
              background: themeStyles.cardBg,
              border: `2px solid ${themeStyles.borderColor}`,
              borderRadius: '20px',
              marginBottom: '24px',
              boxShadow: `0 8px 32px ${themeStyles.shadowColor}`,
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: themeStyles.gradientPrimary
              }} />
              <Row gutter={[16, 16]} align="middle" style={{ padding: '8px 0' }}>
                <Col xs={24} sm={8}>
                  <Space direction="vertical" size="small">
                    <Text style={{ color: themeStyles.textSecondary, fontSize: '12px', fontWeight: '600' }}>
                      APPOINTMENT DATE
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CalendarOutlined style={{ color: themeStyles.accentPrimary, fontSize: '18px' }} />
                      <Text style={{
                        color: themeStyles.textPrimary,
                        fontSize: '16px',
                        fontWeight: '700'
                      }}>
                        {booking.preferredDate ?
                          moment(booking.preferredDate.toDate?.() || booking.preferredDate)
                            .format('MMM DD, YYYY') : 'Not set'
                        }
                      </Text>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} sm={8}>
                  <Space direction="vertical" size="small">
                    <Text style={{ color: themeStyles.textSecondary, fontSize: '12px', fontWeight: '600' }}>
                      TIME
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ClockCircleOutlined style={{ color: themeStyles.accentPrimary, fontSize: '18px' }} />
                      <Text style={{
                        color: themeStyles.textPrimary,
                        fontSize: '16px',
                        fontWeight: '700'
                      }}>
                        {booking.preferredTime ?
                          moment(booking.preferredTime.toDate?.() || booking.preferredTime)
                            .format('HH:mm') : 'Not set'
                        }
                      </Text>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} sm={8}>
                  <Space direction="vertical" size="small">
                    <Text style={{ color: themeStyles.textSecondary, fontSize: '12px', fontWeight: '600' }}>
                      SESSION TYPE
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getSessionTypeIcon(booking.sessionType)}
                      <Text style={{
                        color: themeStyles.textPrimary,
                        fontSize: '16px',
                        fontWeight: '700'
                      }}>
                        {booking.sessionType?.charAt(0).toUpperCase() + booking.sessionType?.slice(1)}
                      </Text>
                    </div>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Status and Payment Info */}
            <Card style={{
              background: themeStyles.cardBg,
              border: `2px solid ${themeStyles.borderColor}`,
              borderRadius: '20px',
              marginBottom: '24px',
              boxShadow: `0 8px 32px ${themeStyles.shadowColor}`
            }}>
              <Title level={4} style={{
                color: themeStyles.textPrimary,
                marginBottom: '16px'
              }}>
                Status & Payment
              </Title>
              <Space wrap size="large">
                <Tag
                  style={{
                    background: theme === 'dark' ? 'rgba(67, 127, 151, 0.2)' : 'rgba(67, 127, 151, 0.1)',
                    color: getStatusColor(booking.status, booking.paymentStatus),
                    border: `1px solid ${getStatusColor(booking.status, booking.paymentStatus)}`,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {getStatusIcon(booking.status)}
                  <span style={{ marginLeft: '8px' }}>
                    {booking.status?.toUpperCase()}
                  </span>
                </Tag>
                <Tag
                  style={{
                    background: theme === 'dark' ? 'rgba(238, 225, 179, 0.2)' : 'rgba(238, 225, 179, 0.1)',
                    color: getPaymentStatusColor(booking.paymentStatus),
                    border: `1px solid ${getPaymentStatusColor(booking.paymentStatus)}`,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  💳 Payment: {booking.paymentStatus?.toUpperCase() || 'UNPAID'}
                </Tag>
                {booking.meetingURL && (
                  <Tag
                    style={{
                      background: theme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                      color: theme === 'dark' ? '#10b981' : '#059669',
                      border: `1px solid ${theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <VideoCameraOutlined style={{ marginRight: '8px' }} />
                    Video Meeting Ready
                  </Tag>
                )}
              </Space>
            </Card>

            {/* Selected Services */}
            {booking.selectedServices && booking.selectedServices.length > 0 && (
              <Card style={{
                background: themeStyles.cardBg,
                border: `2px solid ${themeStyles.borderColor}`,
                borderRadius: '20px',
                marginBottom: '24px',
                boxShadow: `0 8px 32px ${themeStyles.shadowColor}`
              }}>
                <Title level={4} style={{
                  color: themeStyles.textPrimary,
                  marginBottom: '16px'
                }}>
                  <HeartOutlined style={{ marginRight: '8px', color: themeStyles.accentPrimary }} />
                  Selected Services
                </Title>
                <Space wrap>
                  {booking.selectedServices.map((service, index) => (
                    <Tag
                      key={index}
                      style={{
                        background: theme === 'dark' ? 'rgba(67, 127, 151, 0.2)' : 'rgba(67, 127, 151, 0.1)',
                        color: themeStyles.accentPrimary,
                        border: `1px solid ${theme === 'dark' ? 'rgba(67, 127, 151, 0.3)' : 'rgba(67, 127, 151, 0.2)'}`,
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      <HeartOutlined style={{ marginRight: '6px', fontSize: '12px' }} />
                      {service.title} - {service.category}
                    </Tag>
                  ))}
                </Space>
              </Card>
            )}

            {/* Meeting Link Information */}
            {booking.status === 'confirmed' && (
              <Card style={{
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(37, 99, 235, 0.05) 100%)',
                border: `2px solid ${theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                borderRadius: '20px',
                marginBottom: '24px',
                boxShadow: `0 8px 32px ${themeStyles.shadowColor}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #10b981 0%, #2563eb 100%)'
                }} />
                <Title level={4} style={{
                  color: themeStyles.textPrimary,
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <VideoCameraOutlined style={{ color: '#10b981', fontSize: '20px' }} />
                  Video Meeting Link
                  <Badge
                    count="Ready"
                    style={{
                      backgroundColor: '#10b981',
                      fontSize: '11px',
                      height: '20px',
                      lineHeight: '20px',
                      minWidth: '45px'
                    }}
                  />
                </Title>

                <div>
                  <div style={{
                    background: theme === 'dark'
                      ? 'rgba(26, 29, 35, 0.8)'
                      : 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: `1px solid ${theme === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)'
                    }`,
                    marginBottom: '16px'
                  }}>
                    <Text style={{
                      color: themeStyles.textSecondary,
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Meeting URL
                    </Text>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{
                        flex: 1,
                        minWidth: '200px',
                        background: theme === 'dark'
                          ? 'rgba(67, 127, 151, 0.1)'
                          : 'rgba(67, 127, 151, 0.05)',
                        borderRadius: '8px',
                        padding: '12px',
                        border: `1px solid ${theme === 'dark'
                          ? 'rgba(67, 127, 151, 0.2)'
                          : 'rgba(67, 127, 151, 0.15)'
                        }`
                      }}>
                        <Text
                          code
                          style={{
                            fontSize: '13px',
                            color: themeStyles.textPrimary,
                            fontFamily: 'monospace',
                            wordBreak: 'break-all',
                            background: 'transparent',
                            border: 'none',
                            padding: 0
                          }}
                        >
                          {booking.meetingURL || `https://meet.jit.si/${generateMeetingRoom(booking)}`}
                        </Text>
                      </div>
                      <Button
                        icon={<CopyOutlined />}
                        onClick={() => copyMeetingLink(booking)}
                        style={{
                          borderColor: themeStyles.accentPrimary,
                          color: themeStyles.accentPrimary,
                          borderRadius: '8px',
                          height: '40px',
                          fontWeight: '600'
                        }}
                      >
                        Copy Link
                      </Button>
                    </div>
                  </div>

                  {/* Meeting Instructions */}
                  <div style={{
                    background: theme === 'dark'
                      ? 'rgba(37, 99, 235, 0.15)'
                      : 'rgba(37, 99, 235, 0.08)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: `1px solid ${theme === 'dark'
                      ? 'rgba(37, 99, 235, 0.3)'
                      : 'rgba(37, 99, 235, 0.2)'
                    }`
                  }}>
                    <Text style={{
                      color: themeStyles.textPrimary,
                      fontSize: '14px',
                      lineHeight: '1.6'
                    }}>
                      💡 <strong>Quick Tip:</strong> Click the meeting link 5 minutes before your appointment time.
                      On mobile, the Jitsi Meet app will open automatically if installed, otherwise it will open in your browser.
                    </Text>
                  </div>
                </div>
              </Card>
            )}

            {/* Medical Information */}
            <Card style={{
              background: themeStyles.cardBg,
              border: `2px solid ${themeStyles.borderColor}`,
              borderRadius: '20px',
              marginBottom: '24px',
              boxShadow: `0 8px 32px ${themeStyles.shadowColor}`
            }}>
              <Title level={4} style={{
                color: themeStyles.textPrimary,
                marginBottom: '16px'
              }}>
                Medical Information
              </Title>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Text strong style={{ color: themeStyles.textSecondary, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Current Concerns
                  </Text>
                  <div style={{
                    background: theme === 'dark'
                      ? 'rgba(238, 225, 179, 0.1)'
                      : 'rgba(238, 225, 179, 0.05)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginTop: '8px',
                    border: `1px solid ${theme === 'dark' ? 'rgba(238, 225, 179, 0.2)' : 'rgba(238, 225, 179, 0.3)'}`
                  }}>
                    {booking.currentConcerns ? (
                      <Text style={{ color: themeStyles.textPrimary, fontSize: '14px', lineHeight: '1.6' }}>
                        {booking.currentConcerns}
                      </Text>
                    ) : (
                      <Text style={{ color: themeStyles.textSecondary, fontStyle: 'italic' }}>
                        No specific concerns mentioned
                      </Text>
                    )}
                  </div>
                </div>

                <div>
                  <Text strong style={{ color: themeStyles.textSecondary, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Special Requests
                  </Text>
                  <div style={{
                    background: theme === 'dark'
                      ? 'rgba(67, 127, 151, 0.1)'
                      : 'rgba(67, 127, 151, 0.05)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginTop: '8px',
                    border: `1px solid ${theme === 'dark' ? 'rgba(67, 127, 151, 0.2)' : 'rgba(67, 127, 151, 0.3)'}`
                  }}>
                    {booking.specialRequests ? (
                      <Text style={{ color: themeStyles.textPrimary, fontSize: '14px', lineHeight: '1.6' }}>
                        {booking.specialRequests}
                      </Text>
                    ) : (
                      <Text style={{ color: themeStyles.textSecondary, fontStyle: 'italic' }}>
                        No special requests
                      </Text>
                    )}
                  </div>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Right Column - Contact & Additional Info */}
          <Col xs={24} lg={8}>
            {/* Patient Information */}
            <Card style={{
              background: themeStyles.cardBg,
              border: `2px solid ${themeStyles.borderColor}`,
              borderRadius: '20px',
              marginBottom: '24px',
              boxShadow: `0 8px 32px ${themeStyles.shadowColor}`
            }}>
              <Title level={4} style={{
                color: themeStyles.textPrimary,
                marginBottom: '16px'
              }}>
                <UserOutlined style={{ marginRight: '8px', color: themeStyles.accentPrimary }} />
                Patient Information
              </Title>
              <Space direction="vertical" size="medium" style={{ width: '100%' }}>
                <div>
                  <Text style={{ color: themeStyles.textSecondary, fontSize: '12px', fontWeight: '600' }}>
                    PATIENT NAME
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text style={{ color: themeStyles.textPrimary, fontSize: '16px', fontWeight: '600' }}>
                      {booking.firstName} {booking.lastName}
                    </Text>
                  </div>
                </div>
                <div>
                  <Text style={{ color: themeStyles.textSecondary, fontSize: '12px', fontWeight: '600' }}>
                    EMAIL ADDRESS
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <a href={`mailto:${booking.email}`} style={{ color: themeStyles.accentPrimary, fontSize: '14px' }}>
                      {booking.email}
                    </a>
                  </div>
                </div>
                <div>
                  <Text style={{ color: themeStyles.textSecondary, fontSize: '12px', fontWeight: '600' }}>
                    PHONE NUMBER
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <a href={`tel:${booking.phone}`} style={{ color: themeStyles.accentPrimary, fontSize: '14px' }}>
                      {booking.phone}
                    </a>
                  </div>
                </div>
                {booking.age && (
                  <div>
                    <Text style={{ color: themeStyles.textSecondary, fontSize: '12px', fontWeight: '600' }}>
                      AGE
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text style={{ color: themeStyles.textPrimary, fontSize: '14px' }}>
                        {booking.age}
                      </Text>
                    </div>
                  </div>
                )}
              </Space>
            </Card>

            {/* Booking Details */}
            <Card style={{
              background: themeStyles.cardBg,
              border: `2px solid ${themeStyles.borderColor}`,
              borderRadius: '20px',
              marginBottom: '24px',
              boxShadow: `0 8px 32px ${themeStyles.shadowColor}`
            }}>
              <Title level={4} style={{
                color: themeStyles.textPrimary,
                marginBottom: '16px'
              }}>
                Booking Details
              </Title>
              <Space direction="vertical" size="medium" style={{ width: '100%' }}>
                <div>
                  <Text style={{ color: themeStyles.textSecondary, fontSize: '12px', fontWeight: '600' }}>
                    BOOKING REFERENCE
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text code style={{
                      background: themeStyles.accentPrimary,
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontWeight: '600'
                    }}>
                      {booking.confirmationNumber}
                    </Text>
                  </div>
                </div>
                <div>
                  <Text style={{ color: themeStyles.textSecondary, fontSize: '12px', fontWeight: '600' }}>
                    DURATION
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text style={{ color: themeStyles.textPrimary, fontSize: '14px' }}>
                      30-60 minutes
                    </Text>
                  </div>
                </div>
                <div>
                  <Text style={{ color: themeStyles.textSecondary, fontSize: '12px', fontWeight: '600' }}>
                    BOOKING CREATED
                  </Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text style={{ color: themeStyles.textPrimary, fontSize: '14px' }}>
                      {moment(booking.createdAt?.toDate?.() || booking.createdAt)
                        .format('MMM DD, YYYY [at] HH:mm')}
                    </Text>
                  </div>
                </div>
              </Space>
            </Card>

            {/* Meeting Instructions for Confirmed Bookings */}
            {booking.status === 'confirmed' && (
              <Card style={{
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%)',
                border: `2px solid ${theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                borderRadius: '20px',
                marginBottom: '24px',
                boxShadow: `0 8px 32px ${themeStyles.shadowColor}`
              }}>
                <Title level={4} style={{
                  color: themeStyles.textPrimary,
                  marginBottom: '16px'
                }}>
                  <VideoCameraOutlined style={{ marginRight: '8px', color: '#10b981' }} />
                  Meeting Instructions
                </Title>
                <div style={{ color: themeStyles.textPrimary }}>
                  <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li><strong>5 minutes before:</strong> Click "Join Meeting" button</li>
                    <li><strong>Allow permissions:</strong> Enable camera and microphone</li>
                    <li><strong>Wait for doctor:</strong> Your provider will join shortly</li>
                    <li><strong>Backup plan:</strong> Call +91 63617 43098 for issues</li>
                  </ol>
                  <div style={{ marginTop: '12px' }}>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={downloadJitsiApp}
                      style={{
                        borderColor: '#10b981',
                        color: '#10b981'
                      }}
                    >
                      Get Mobile App
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </Col>
        </Row>

        {/* Footer Information */}
        <div style={{
          marginTop: '48px',
          padding: '24px',
          background: theme === 'dark'
            ? 'linear-gradient(135deg, rgba(67, 127, 151, 0.08) 0%, rgba(238, 225, 179, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(67, 127, 151, 0.05) 0%, rgba(238, 225, 179, 0.08) 100%)',
          borderRadius: '20px',
          border: `1px solid ${theme === 'dark' ? 'rgba(67, 127, 151, 0.2)' : 'rgba(67, 127, 151, 0.15)'}`,
          textAlign: 'center'
        }}>
          <Text style={{
            color: themeStyles.textSecondary,
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            💙 <strong>EkahHealth</strong> - Your trusted healthcare partner<br/>
            For any questions or concerns, contact us at{' '}
            <a href="tel:+916361743098" style={{ color: themeStyles.accentPrimary }}>
              +91 63617 43098
            </a>{' '}
            or{' '}
            <a href="mailto:support@ekahhealth.com" style={{ color: themeStyles.accentPrimary }}>
              support@ekahhealth.com
            </a>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;