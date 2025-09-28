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
  DownloadOutlined,
  LinkOutlined,
  ShareAltOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { bookingsDB } from '../services/firebase/database';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import { useTheme } from '../components/ParticleBackground';
import { useNavigate } from 'react-router-dom';
import { JitsiMeetingRoom, JitsiPreJoin } from '../components/JitsiMeeting';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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
    notification.success({
      message: 'Meeting Ended',
      description: 'Thank you for using EkahHealth video consultation!'
    });
  };

  // Detect if user is on mobile device
  const isMobileDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  };

  // Copy meeting link with enhanced functionality
  const copyMeetingLink = (booking) => {
    const meetingURL = booking.meetingURL || `https://meet.jit.si/${generateMeetingRoom(booking)}`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(meetingURL).then(() => {
        notification.success({
          message: 'Link Copied!',
          description: 'Meeting link copied to clipboard',
          duration: 3
        });
      }).catch(() => {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(meetingURL);
      });
    } else {
      // Fallback for older browsers
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
  const handleJoinMeetingEnhanced = (booking) => {
    const meetingURL = booking.meetingURL || `https://meet.jit.si/${generateMeetingRoom(booking)}`;

    if (isMobileDevice()) {
      // On mobile, try to open in Jitsi app first, fallback to browser
      const jitsiAppURL = meetingURL.replace('https://meet.jit.si/', 'org.jitsi.meet://');

      // Try to open in app
      const appLink = document.createElement('a');
      appLink.href = jitsiAppURL;
      appLink.click();

      // Fallback to browser after short delay
      setTimeout(() => {
        window.open(meetingURL, '_blank');
      }, 1000);

      notification.info({
        message: 'Opening Meeting',
        description: 'Trying to open in Jitsi app. If app is not installed, it will open in browser.',
        duration: 4
      });
    } else {
      // On desktop, open in new tab
      window.open(meetingURL, '_blank');
      notification.success({
        message: 'Meeting Opened',
        description: 'Meeting opened in new tab',
        duration: 3
      });
    }
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
    navigate(`/booking-details/${booking.id}`);
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
        {/* Enhanced Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          position: 'relative',
          padding: '32px 0'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '4px',
            background: themeStyles.gradientPrimary,
            borderRadius: '2px',
            marginBottom: '24px'
          }} />
          <Title
            level={1}
            style={{
              color: themeStyles.textPrimary,
              marginBottom: '16px',
              marginTop: '16px',
              fontSize: '2.5rem',
              fontWeight: '800',
              background: themeStyles.gradientPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em'
            }}
          >
            My Appointments
          </Title>
          <Text style={{
            color: themeStyles.textSecondary,
            fontSize: '18px',
            fontWeight: '500',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto',
            display: 'block'
          }}>
            Manage your video consultations and appointment history with ease
          </Text>
        </div>

        {/* Enhanced Statistics Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
          <Col xs={24} sm={6}>
            <Card style={{
              background: themeStyles.cardBg,
              border: `2px solid ${theme === 'dark' ? 'rgba(67, 127, 151, 0.3)' : 'rgba(67, 127, 151, 0.2)'}`,
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: `0 8px 32px ${themeStyles.shadowColor}`,
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 48px ${themeStyles.shadowColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 32px ${themeStyles.shadowColor}`;
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #437F97 0%, #5A9BB8 100%)'
              }} />
              <Statistic
                title={<span style={{ color: themeStyles.textSecondary, fontSize: '14px', fontWeight: '600' }}>Total Appointments</span>}
                value={stats.total}
                prefix={<CalendarOutlined style={{ color: themeStyles.primaryColor, fontSize: '20px' }} />}
                valueStyle={{ color: themeStyles.textPrimary, fontSize: '28px', fontWeight: '700' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{
              background: themeStyles.cardBg,
              border: `2px solid ${theme === 'dark' ? 'rgba(67, 127, 151, 0.3)' : 'rgba(67, 127, 151, 0.2)'}`,
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: `0 8px 32px ${themeStyles.shadowColor}`,
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 48px ${themeStyles.shadowColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 32px ${themeStyles.shadowColor}`;
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)'
              }} />
              <Statistic
                title={<span style={{ color: themeStyles.textSecondary, fontSize: '14px', fontWeight: '600' }}>Upcoming</span>}
                value={stats.upcoming}
                valueStyle={{ color: themeStyles.primaryColor, fontSize: '28px', fontWeight: '700' }}
                prefix={<ClockCircleOutlined style={{ color: themeStyles.primaryColor, fontSize: '20px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{
              background: themeStyles.cardBg,
              border: `2px solid ${theme === 'dark' ? 'rgba(67, 127, 151, 0.3)' : 'rgba(67, 127, 151, 0.2)'}`,
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: `0 8px 32px ${themeStyles.shadowColor}`,
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 48px ${themeStyles.shadowColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 32px ${themeStyles.shadowColor}`;
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)'
              }} />
              <Statistic
                title={<span style={{ color: themeStyles.textSecondary, fontSize: '14px', fontWeight: '600' }}>Completed</span>}
                value={stats.completed}
                valueStyle={{ color: themeStyles.successColor, fontSize: '28px', fontWeight: '700' }}
                prefix={<CheckCircleOutlined style={{ color: themeStyles.successColor, fontSize: '20px' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{
              background: themeStyles.cardBg,
              border: `2px solid ${theme === 'dark' ? 'rgba(67, 127, 151, 0.3)' : 'rgba(67, 127, 151, 0.2)'}`,
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: `0 8px 32px ${themeStyles.shadowColor}`,
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 48px ${themeStyles.shadowColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 32px ${themeStyles.shadowColor}`;
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)'
              }} />
              <Statistic
                title={<span style={{ color: themeStyles.textSecondary, fontSize: '14px', fontWeight: '600' }}>Cancelled</span>}
                value={stats.cancelled}
                valueStyle={{ color: themeStyles.errorColor, fontSize: '28px', fontWeight: '700' }}
                prefix={<ExclamationCircleOutlined style={{ color: themeStyles.errorColor, fontSize: '20px' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Enhanced Jitsi Meet Info */}
        <div style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, rgba(67, 127, 151, 0.2) 0%, rgba(67, 127, 151, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(67, 127, 151, 0.08) 0%, rgba(238, 225, 179, 0.1) 100%)',
          border: `2px solid ${theme === 'dark' ? 'rgba(67, 127, 151, 0.3)' : 'rgba(67, 127, 151, 0.2)'}`,
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '48px',
          backdropFilter: 'blur(20px)',
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
            background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)'
          }} />
          <Row align="middle" justify="space-between">
            <Col xs={24} lg={18}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <VideoCameraOutlined style={{
                    fontSize: '24px',
                    color: theme === 'dark' ? '#06b6d4' : '#2563eb',
                    background: theme === 'dark' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(37, 99, 235, 0.1)',
                    padding: '8px',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} />
                  <Title level={4} style={{
                    color: themeStyles.textPrimary,
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    Video Consultations Powered by Jitsi Meet
                  </Title>
                </div>
                <Text style={{
                  color: themeStyles.textSecondary,
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}>
                  Secure, free video meetings right in your browser. No downloads required! Click 'Join Meeting' when it's time for your appointment.
                </Text>
              </Space>
            </Col>
            <Col xs={24} lg={6} style={{ textAlign: 'right' }}>
              <Button
                size="large"
                icon={<DownloadOutlined />}
                onClick={downloadJitsiApp}
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: '600',
                  height: '48px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.3)';
                }}
              >
                Get Mobile App
              </Button>
            </Col>
          </Row>
        </div>

        {/* Enhanced Quick Actions */}
        <div style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, rgba(67, 127, 151, 0.15) 0%, rgba(238, 225, 179, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(238, 225, 179, 0.1) 0%, rgba(67, 127, 151, 0.08) 100%)',
          border: `2px solid ${theme === 'dark' ? 'rgba(238, 225, 179, 0.3)' : 'rgba(238, 225, 179, 0.2)'}`,
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '48px',
          backdropFilter: 'blur(20px)',
          boxShadow: `0 8px 32px ${themeStyles.shadowColor}`,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #f59e0b 0%, #eab308 100%)'
          }} />
          <Row justify="space-between" align="middle" gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    background: theme === 'dark' ? 'rgba(238, 225, 179, 0.2)' : 'rgba(238, 225, 179, 0.3)',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CalendarOutlined style={{
                      fontSize: '24px',
                      color: theme === 'dark' ? '#EEE1B3' : '#f59e0b'
                    }} />
                  </div>
                  <Title level={3} style={{
                    color: themeStyles.textPrimary,
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: '700'
                  }}>
                    Need to book another appointment?
                  </Title>
                </div>
                <Text style={{
                  color: themeStyles.textSecondary,
                  fontSize: '16px',
                  lineHeight: '1.6',
                  marginLeft: '64px'
                }}>
                  Browse our services and schedule your next consultation with ease
                </Text>
              </Space>
            </Col>
            <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/services')}
                style={{
                  background: themeStyles.gradientPrimary,
                  border: 'none',
                  borderRadius: '16px',
                  color: '#1f2937',
                  fontWeight: '700',
                  fontSize: '16px',
                  height: '56px',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  boxShadow: `0 8px 24px ${themeStyles.shadowColor}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 12px 32px ${themeStyles.shadowColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${themeStyles.shadowColor}`;
                }}
              >
                <Space>
                  <HeartOutlined />
                  Book New Appointment
                </Space>
              </Button>
            </Col>
          </Row>
        </div>

        {/* Enhanced Bookings List */}
        <div style={{
          background: themeStyles.cardBg,
          border: `2px solid ${themeStyles.borderColor}`,
          borderRadius: '24px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
          boxShadow: `0 12px 48px ${themeStyles.shadowColor}`,
          position: 'relative',
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              background: theme === 'dark' ? 'rgba(67, 127, 151, 0.2)' : 'rgba(67, 127, 151, 0.1)',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CalendarOutlined style={{
                fontSize: '24px',
                color: themeStyles.accentPrimary
              }} />
            </div>
            <Title level={2} style={{
              color: themeStyles.textPrimary,
              margin: 0,
              fontSize: '28px',
              fontWeight: '800',
              background: themeStyles.gradientPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Appointment History
            </Title>
          </div>
          
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
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '14px',
                        border: `2px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                        boxShadow: `0 4px 12px ${themeStyles.shadowColor}`,
                        transition: 'all 0.3s ease'
                      }}>
                        {getStatusIcon(booking.status)}
                      </div>
                    }
                  >
                    <Card
                      size="small"
                      hoverable
                      onClick={() => showBookingDetails(booking)}
                      style={{
                        background: isUpcoming
                          ? theme === 'dark'
                            ? 'rgba(67, 127, 151, 0.2)'
                            : 'rgba(67, 127, 151, 0.08)'
                          : themeStyles.cardBg,
                        border: `2px solid ${isUpcoming ? themeStyles.primaryColor : themeStyles.cardBorder}`,
                        borderRadius: '16px',
                        marginBottom: '16px',
                        boxShadow: `0 4px 16px ${themeStyles.shadowColor}`,
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 8px 32px ${themeStyles.shadowColor}`;
                        e.currentTarget.style.borderColor = themeStyles.accentPrimary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 4px 16px ${themeStyles.shadowColor}`;
                        e.currentTarget.style.borderColor = isUpcoming ? themeStyles.primaryColor : themeStyles.cardBorder;
                      }}
                    >
                      {/* Clickable indicator */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '0',
                        height: '0',
                        borderStyle: 'solid',
                        borderWidth: '0 20px 20px 0',
                        borderColor: `transparent ${themeStyles.accentPrimary} transparent transparent`,
                        opacity: 0.7
                      }} />
                      <div style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        zIndex: 1
                      }}>
                        <EyeOutlined />
                      </div>
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

                            {/* Meeting Link Display - Enhanced */}
                            {booking.status === 'confirmed' && (
                              <div style={{
                                background: theme === 'dark'
                                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)'
                                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(37, 99, 235, 0.05) 100%)',
                                borderRadius: '12px',
                                padding: '12px',
                                marginTop: '12px',
                                border: `1px solid ${theme === 'dark'
                                  ? 'rgba(16, 185, 129, 0.3)'
                                  : 'rgba(16, 185, 129, 0.2)'
                                }`,
                                position: 'relative',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  height: '2px',
                                  background: 'linear-gradient(90deg, #10b981 0%, #2563eb 100%)'
                                }} />
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  marginBottom: '8px'
                                }}>
                                  <VideoCameraOutlined style={{
                                    color: '#10b981',
                                    fontSize: '16px'
                                  }} />
                                  <Text strong style={{
                                    color: themeStyles.textPrimary,
                                    fontSize: '14px',
                                    fontWeight: '600'
                                  }}>
                                    Video Meeting
                                  </Text>
                                  <Badge
                                    count="Ready"
                                    style={{
                                      backgroundColor: '#10b981',
                                      fontSize: '10px',
                                      height: '18px',
                                      lineHeight: '18px',
                                      minWidth: '40px'
                                    }}
                                  />
                                </div>

                                <div style={{
                                  background: theme === 'dark'
                                    ? 'rgba(26, 29, 35, 0.8)'
                                    : 'rgba(255, 255, 255, 0.9)',
                                  borderRadius: '8px',
                                  padding: '8px 12px',
                                  border: `1px solid ${theme === 'dark'
                                    ? 'rgba(255, 255, 255, 0.1)'
                                    : 'rgba(0, 0, 0, 0.1)'
                                  }`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}>
                                  <GlobalOutlined style={{
                                    color: themeStyles.accentPrimary,
                                    fontSize: '14px'
                                  }} />
                                  <Text
                                    code
                                    style={{
                                      flex: 1,
                                      fontSize: '12px',
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
                                  <Button
                                    size="small"
                                    type="text"
                                    icon={<CopyOutlined />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyMeetingLink(booking);
                                    }}
                                    style={{
                                      color: themeStyles.accentPrimary,
                                      border: 'none',
                                      padding: '4px'
                                    }}
                                    title="Copy meeting link"
                                  />
                                </div>

                                {/* Quick Access Buttons */}
                                <div style={{
                                  marginTop: '8px',
                                  display: 'flex',
                                  gap: '4px',
                                  flexWrap: 'wrap'
                                }}>
                                  {canJoinMeeting && (
                                    <Button
                                      size="small"
                                      type="primary"
                                      icon={<VideoCameraOutlined />}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleJoinMeetingEnhanced(booking);
                                      }}
                                      style={{
                                        background: '#10b981',
                                        borderColor: '#10b981',
                                        fontSize: '11px',
                                        height: '24px',
                                        paddingLeft: '6px',
                                        paddingRight: '6px'
                                      }}
                                    >
                                      Join
                                    </Button>
                                  )}
                                  <Button
                                    size="small"
                                    icon={<LinkOutlined />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyMeetingLink(booking);
                                    }}
                                    style={{
                                      borderColor: themeStyles.accentPrimary,
                                      color: themeStyles.accentPrimary,
                                      fontSize: '11px',
                                      height: '24px',
                                      paddingLeft: '6px',
                                      paddingRight: '6px'
                                    }}
                                  >
                                    Copy
                                  </Button>
                                  <Button
                                    size="small"
                                    icon={<EyeOutlined />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showBookingDetails(booking);
                                    }}
                                    style={{
                                      borderColor: themeStyles.textSecondary,
                                      color: themeStyles.textSecondary,
                                      fontSize: '11px',
                                      height: '24px',
                                      paddingLeft: '6px',
                                      paddingRight: '6px'
                                    }}
                                  >
                                    Details
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Space>
                        </Col>
                        
                        <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                              <Text style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>
                                Booked: {moment(booking.createdAt?.toDate?.() || booking.createdAt).format('MMM DD, YYYY')}
                              </Text>

                              {/* Additional Actions */}
                              <Space>
                                {canJoinMeeting && (
                                  <Button
                                    type="primary"
                                    icon={<VideoCameraOutlined />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleJoinMeetingEnhanced(booking);
                                    }}
                                    style={{
                                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                      borderColor: 'transparent',
                                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                    }}
                                    size="small"
                                  >
                                    {isMobileDevice() ? 'Open Meeting' : 'Join Meeting'}
                                  </Button>
                                )}
                                <Button
                                  size="small"
                                  icon={<EyeOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showBookingDetails(booking);
                                  }}
                                  style={{
                                    borderColor: themeStyles.primaryColor,
                                    color: themeStyles.primaryColor
                                  }}
                                >
                                  Full Details
                                </Button>
                              </Space>
                            </Space>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          )}
        </div>
      </div>

    </div>
  );
};

export default MyBookings;