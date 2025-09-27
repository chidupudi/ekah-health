import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Avatar,
  Row,
  Col,
  Form,
  Input,
  Button,
  Upload,
  message,
  Divider,
  Space,
  Tag,
  Modal,
  Descriptions,
  Alert,
  Progress,
  Statistic
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  GoogleOutlined,
  SafetyCertificateOutlined, // Corrected from ShieldCheckOutlined
  HeartOutlined,
  SettingOutlined,
  CloseOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../components/ParticleBackground';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase/config';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme, getThemeStyles } = useTheme();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    joinDate: null
  });
  const [bookings, setBookings] = useState([]);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    fetchUserData();
    fetchUserStats();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      if (user?.id) {
        const userDocRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileData(userData);
          form.setFieldsValue({
            name: userData.name || user.name,
            email: userData.email || user.email,
            phone: userData.phone || '',
            address: userData.address || '',
            bio: userData.bio || '',
            emergencyContact: userData.emergencyContact || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      if (user?.id) {
        // Fetch user bookings
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('userId', '==', user.id),
          orderBy('createdAt', 'desc')
        );

        const bookingsSnapshot = await getDocs(bookingsQuery);
        const userBookings = bookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          preferredDate: doc.data().preferredDate?.toDate()
        }));

        setBookings(userBookings);

        // Calculate stats
        const totalBookings = userBookings.length;
        const completedSessions = userBookings.filter(b => b.status === 'completed').length;
        const upcomingSessions = userBookings.filter(b => {
          if (b.status === 'confirmed' && b.preferredDate) {
            return moment(b.preferredDate).isAfter(moment());
          }
          return false;
        }).length;

        setUserStats({
          totalBookings,
          completedSessions,
          upcomingSessions,
          joinDate: user.createdAt || profileData.createdAt
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const themeStyles = getThemeStyles();

  const handleSaveProfile = async (values) => {
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        ...values,
        updatedAt: new Date()
      });

      setProfileData(prev => ({ ...prev, ...values }));
      message.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file) => {
    setUploading(true);
    try {
      const photoRef = ref(storage, `profile-photos/${user.id}_${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(photoRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        photoURL: downloadURL,
        updatedAt: new Date()
      });

      setProfileData(prev => ({ ...prev, photoURL: downloadURL }));
      message.success('Profile photo updated successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      message.error('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getAccountAge = () => {
    const joinDate = userStats.joinDate || user.createdAt;
    if (joinDate) {
      const duration = moment.duration(moment().diff(moment(joinDate)));
      const days = Math.floor(duration.asDays());
      if (days < 30) {
        return `${days} days`;
      } else if (days < 365) {
        return `${Math.floor(days / 30)} months`;
      } else {
        return `${Math.floor(days / 365)} years`;
      }
    }
    return 'New member';
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: themeStyles.background,
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <Title
            level={1}
            style={{
              color: themeStyles.textPrimary,
              marginBottom: '8px',
              background: `linear-gradient(135deg, ${themeStyles.accentPrimary} 0%, ${themeStyles.accentSecondary} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            My Profile
          </Title>
          <Text style={{ color: themeStyles.textSecondary, fontSize: '16px' }}>
            Manage your personal information and preferences
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* Left Column - Profile Info */}
          <Col xs={24} lg={8}>
            {/* Profile Card */}
            <Card
              style={{
                background: themeStyles.cardBg,
                border: `1px solid ${themeStyles.borderColor}`,
                borderRadius: '16px',
                marginBottom: '24px',
                backdropFilter: 'blur(20px)',
                boxShadow: `0 8px 32px ${themeStyles.shadowColor || 'rgba(0, 0, 0, 0.1)'}`
              }}
              styles={{ body: { padding: '32px', textAlign: 'center' } }}
            >
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
                <Avatar
                  size={120}
                  src={profileData.photoURL || user.photoURL}
                  style={{
                    backgroundColor: themeStyles.accentPrimary,
                    border: `4px solid ${themeStyles.borderColor}`,
                    boxShadow: `0 8px 32px ${themeStyles.shadowColor || 'rgba(0, 0, 0, 0.3)'}`
                  }}
                >
                  {!profileData.photoURL && !user.photoURL && (
                    <span style={{ fontSize: '48px', fontWeight: 'bold' }}>
                      {(profileData.name || user.name || user.email)?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </Avatar>

                <Upload
                  beforeUpload={handlePhotoUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CameraOutlined />}
                    loading={uploading}
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      right: '5px',
                      background: themeStyles.accentPrimary,
                      borderColor: themeStyles.accentPrimary,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                </Upload>
              </div>

              <Title level={3} style={{ color: themeStyles.textPrimary, marginBottom: '8px' }}>
                {profileData.name || user.name || 'No name set'}
              </Title>

              <Text style={{ color: themeStyles.textSecondary, fontSize: '16px' }}>
                {profileData.email || user.email}
              </Text>

              <div style={{ marginTop: '16px' }}>
                <Space wrap>
                  <Tag
                    icon={<SafetyCertificateOutlined />}
                    color={user.photoURL ? 'red' : 'blue'}
                    style={{ fontSize: '12px' }}
                  >
                    {user.photoURL ? 'Google Account' : 'Email Account'}
                  </Tag>
                  <Tag
                    icon={<CalendarOutlined />}
                    color="green"
                    style={{ fontSize: '12px' }}
                  >
                    Member for {getAccountAge()}
                  </Tag>
                </Space>
              </div>

              {profileData.bio && (
                <div style={{ marginTop: '20px' }}>
                  <Paragraph
                    style={{
                      color: themeStyles.textSecondary,
                      fontSize: '14px',
                      margin: 0,
                      fontStyle: 'italic'
                    }}
                  >
                    "{profileData.bio}"
                  </Paragraph>
                </div>
              )}
            </Card>

            {/* Stats Card */}
            <Card
              title={
                <Space style={{ color: themeStyles.textPrimary }}>
                  <HeartOutlined />
                  <span>My Health Journey</span>
                </Space>
              }
              style={{
                background: themeStyles.cardBg,
                border: `1px solid ${themeStyles.cardBorder}`,
                borderRadius: '16px',
                backdropFilter: 'blur(20px)'
              }}
              styles={{
                header: {
                  borderBottom: `1px solid ${themeStyles.cardBorder}`,
                  color: themeStyles.textPrimary
                }
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Total Bookings"
                    value={userStats.totalBookings}
                    valueStyle={{ color: themeStyles.accentPrimary }}
                    prefix={<CalendarOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Completed"
                    value={userStats.completedSessions}
                    valueStyle={{ color: themeStyles.successColor }}
                    prefix={<HeartOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Upcoming"
                    value={userStats.upcomingSessions}
                    valueStyle={{ color: themeStyles.warningColor }}
                    prefix={<ClockCircleOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <div>
                    <Text style={{ color: themeStyles.textSecondary, fontSize: '14px' }}>
                      Progress
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Progress
                        percent={userStats.totalBookings > 0 ? Math.round((userStats.completedSessions / userStats.totalBookings) * 100) : 0}
                        size="small"
                        strokeColor={themeStyles.accentPrimary}
                        style={{ fontSize: '12px' }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column - Profile Details */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: themeStyles.textPrimary
                }}>
                  <Space>
                    <SettingOutlined />
                    <span>Profile Information</span>
                  </Space>

                  {!isEditing ? (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setIsEditing(true)}
                      style={{
                        background: themeStyles.accentPrimary,
                        borderColor: themeStyles.accentPrimary
                      }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Space>
                      <Button
                        icon={<CloseOutlined />}
                        onClick={() => {
                          setIsEditing(false);
                          form.resetFields();
                        }}
                        style={{
                          background: themeStyles.listItemHover,
                          borderColor: themeStyles.cardBorder,
                          color: themeStyles.textPrimary
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={loading}
                        onClick={() => form.submit()}
                        style={{
                          background: themeStyles.successColor,
                          borderColor: themeStyles.successColor
                        }}
                      >
                        Save Changes
                      </Button>
                    </Space>
                  )}
                </div>
              }
              style={{
                background: themeStyles.cardBg,
                border: `1px solid ${themeStyles.cardBorder}`,
                borderRadius: '16px',
                backdropFilter: 'blur(20px)',
                boxShadow: `0 8px 32px ${themeStyles.shadowColor || 'rgba(0, 0, 0, 0.1)'}`
              }}
              styles={{
                header: {
                  borderBottom: `1px solid ${themeStyles.cardBorder}`,
                  color: themeStyles.textPrimary
                },
                body: { padding: '32px' }
              }}
            >
              {isEditing ? (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSaveProfile}
                  style={{ color: themeStyles.textPrimary }}
                >
                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="name"
                        label={<span style={{ color: themeStyles.textPrimary }}>Full Name</span>}
                        rules={[{ required: true, message: 'Please enter your full name' }]}
                      >
                        <Input
                          prefix={<UserOutlined style={{ color: themeStyles.textSecondary }} />}
                          placeholder="Enter your full name"
                          style={{
                            background: themeStyles.cardBg,
                            border: `1px solid ${themeStyles.borderColor}`,
                            borderRadius: '8px',
                            color: themeStyles.textPrimary
                          }}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label={<span style={{ color: themeStyles.textPrimary }}>Email Address</span>}
                        rules={[
                          { required: true, message: 'Please enter your email' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined style={{ color: themeStyles.textSecondary }} />}
                          placeholder="Enter your email"
                          disabled
                          style={{
                            background: themeStyles.listItemHover,
                            border: `1px solid ${themeStyles.borderColor}`,
                            borderRadius: '8px',
                            color: themeStyles.textSecondary
                          }}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label={<span style={{ color: themeStyles.textPrimary }}>Phone Number</span>}
                      >
                        <Input
                          prefix={<PhoneOutlined style={{ color: themeStyles.textSecondary }} />}
                          placeholder="Enter your phone number"
                          style={{
                            background: themeStyles.cardBg,
                            border: `1px solid ${themeStyles.borderColor}`,
                            borderRadius: '8px',
                            color: themeStyles.textPrimary
                          }}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        name="emergencyContact"
                        label={<span style={{ color: themeStyles.textPrimary }}>Emergency Contact</span>}
                      >
                        <Input
                          prefix={<PhoneOutlined style={{ color: themeStyles.textSecondary }} />}
                          placeholder="Emergency contact number"
                          style={{
                            background: themeStyles.cardBg,
                            border: `1px solid ${themeStyles.borderColor}`,
                            borderRadius: '8px',
                            color: themeStyles.textPrimary
                          }}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item
                        name="address"
                        label={<span style={{ color: themeStyles.textPrimary }}>Address</span>}
                      >
                        <TextArea
                          prefix={<HomeOutlined style={{ color: themeStyles.textSecondary }} />}
                          placeholder="Enter your address"
                          rows={3}
                          style={{
                            background: themeStyles.cardBg,
                            border: `1px solid ${themeStyles.borderColor}`,
                            borderRadius: '8px',
                            color: themeStyles.textPrimary
                          }}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item
                        name="bio"
                        label={<span style={{ color: themeStyles.textPrimary }}>Bio</span>}
                      >
                        <TextArea
                          placeholder="Tell us about yourself (optional)"
                          rows={4}
                          maxLength={200}
                          showCount
                          style={{
                            background: themeStyles.cardBg,
                            border: `1px solid ${themeStyles.borderColor}`,
                            borderRadius: '8px',
                            color: themeStyles.textPrimary
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              ) : (
                <Descriptions
                  column={{ xs: 1, sm: 1, md: 2 }}
                  style={{ color: themeStyles.textPrimary }}
                >
                  <Descriptions.Item
                    label={<span style={{ color: themeStyles.textSecondary }}>Full Name</span>}
                  >
                    <span style={{ color: themeStyles.textPrimary }}>
                      {profileData.name || user.name || 'Not set'}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={<span style={{ color: themeStyles.textSecondary }}>Email</span>}
                  >
                    <span style={{ color: themeStyles.textPrimary }}>
                      {profileData.email || user.email}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={<span style={{ color: themeStyles.textSecondary }}>Phone</span>}
                  >
                    <span style={{ color: themeStyles.textPrimary }}>
                      {profileData.phone || 'Not set'}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={<span style={{ color: themeStyles.textSecondary }}>Emergency Contact</span>}
                  >
                    <span style={{ color: themeStyles.textPrimary }}>
                      {profileData.emergencyContact || 'Not set'}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={<span style={{ color: themeStyles.textSecondary }}>Address</span>}
                    span={2}
                  >
                    <span style={{ color: themeStyles.textPrimary }}>
                      {profileData.address || 'Not set'}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={<span style={{ color: themeStyles.textSecondary }}>Bio</span>}
                    span={2}
                  >
                    <span style={{ color: themeStyles.textPrimary }}>
                      {profileData.bio || 'No bio added yet'}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={<span style={{ color: themeStyles.textSecondary }}>Member Since</span>}
                  >
                    <span style={{ color: themeStyles.textPrimary }}>
                      {userStats.joinDate ? moment(userStats.joinDate).format('MMMM DD, YYYY') : 'Recently joined'}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={<span style={{ color: themeStyles.textSecondary }}>Account Type</span>}
                  >
                    <Tag
                      icon={user.photoURL ? <GoogleOutlined /> : <MailOutlined />}
                      color={user.photoURL ? 'red' : 'blue'}
                    >
                      {user.photoURL ? 'Google Account' : 'Email Account'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>

            {/* Recent Activity */}
            {bookings.length > 0 && (
              <Card
                title={
                  <Space style={{ color: themeStyles.textPrimary }}>
                    <CalendarOutlined />
                    <span>Recent Bookings</span>
                  </Space>
                }
                style={{
                  background: themeStyles.cardBg,
                  border: `1px solid ${themeStyles.cardBorder}`,
                  borderRadius: '16px',
                  marginTop: '24px',
                  backdropFilter: 'blur(20px)'
                }}
                styles={{
                  header: {
                    borderBottom: `1px solid ${themeStyles.cardBorder}`,
                    color: themeStyles.textPrimary
                  }
                }}
              >
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {bookings.slice(0, 5).map((booking, index) => (
                    <div
                      key={booking.id}
                      style={{
                        padding: '16px',
                        borderBottom: index < Math.min(bookings.length, 5) - 1 ? `1px solid ${themeStyles.cardBorder}` : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <Text strong style={{ color: themeStyles.textPrimary }}>
                          {booking.selectedServices?.map(s => s.title).join(', ') || 'Health Consultation'}
                        </Text>
                        <br />
                        <Text style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>
                          {booking.preferredDate ? moment(booking.preferredDate).format('MMM DD, YYYY') : 'Date TBD'}
                        </Text>
                      </div>
                      <Tag
                        color={
                          booking.status === 'completed' ? 'green' :
                          booking.status === 'confirmed' ? 'blue' :
                          booking.status === 'pending' ? 'orange' : 'red'
                        }
                      >
                        {booking.status?.toUpperCase()}
                      </Tag>
                    </div>
                  ))}
                </div>

                {bookings.length > 5 && (
                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Button
                      type="link"
                      onClick={() => navigate('/my-bookings')}
                      style={{ color: themeStyles.accentPrimary }}
                    >
                      View All Bookings
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Profile;