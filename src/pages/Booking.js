import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Button,
  Steps,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Checkbox,
  message,
  Avatar,
  Tag,
  Divider,
  Space,
  Modal,
  Alert,
  Badge,
  Progress,
  Spin
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  TeamOutlined,
  FileTextOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../components/ParticleBackground';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const Booking = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({});
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    // Check if coming from services page with pre-selected service
    if (location.state?.service) {
      setSelectedServices([location.state.service]);
    }

    fetchServices();
    initializeFormData();
  }, [user, navigate, location.state]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const servicesQuery = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(servicesQuery);
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      message.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const initializeFormData = () => {
    form.setFieldsValue({
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: '',
      address: '',
      emergencyContact: '',
      sessionType: 'video',
      specialRequests: ''
    });
  };

  const getThemeStyles = () => {
    if (isDark) {
      return {
        pageBackground: '#0f0f23',
        cardBackground: 'rgba(255, 255, 255, 0.05)',
        cardBorder: 'rgba(255, 255, 255, 0.1)',
        textPrimary: '#f0f6fc',
        textSecondary: '#8b949e',
        accentPrimary: '#58a6ff',
        accentSecondary: '#7c3aed',
        inputBackground: 'rgba(255, 255, 255, 0.05)',
        inputBorder: 'rgba(255, 255, 255, 0.2)',
        buttonPrimary: '#58a6ff',
        buttonSecondary: 'rgba(255, 255, 255, 0.1)',
        gradientOverlay: 'linear-gradient(135deg, rgba(88, 166, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
        successColor: '#3fb950',
        warningColor: '#f2cc60',
        errorColor: '#f85149',
        stepActive: '#58a6ff',
        stepCompleted: '#3fb950',
        stepInactive: '#8b949e'
      };
    } else {
      return {
        pageBackground: '#f8fafc',
        cardBackground: '#ffffff',
        cardBorder: 'rgba(0, 0, 0, 0.06)',
        textPrimary: '#1e293b',
        textSecondary: '#64748b',
        accentPrimary: '#3b82f6',
        accentSecondary: '#8b5cf6',
        inputBackground: '#ffffff',
        inputBorder: 'rgba(0, 0, 0, 0.15)',
        buttonPrimary: '#3b82f6',
        buttonSecondary: 'rgba(0, 0, 0, 0.05)',
        gradientOverlay: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        successColor: '#10b981',
        warningColor: '#f59e0b',
        errorColor: '#ef4444',
        stepActive: '#3b82f6',
        stepCompleted: '#10b981',
        stepInactive: '#9ca3af'
      };
    }
  };

  const themeStyles = getThemeStyles();

  const steps = [
    {
      title: 'Select Services',
      icon: <HeartOutlined />,
      description: 'Choose your therapy services'
    },
    {
      title: 'Personal Details',
      icon: <UserOutlined />,
      description: 'Your information'
    },
    {
      title: 'Schedule',
      icon: <CalendarOutlined />,
      description: 'Pick date and time'
    },
    {
      title: 'Review & Confirm',
      icon: <CheckCircleOutlined />,
      description: 'Final confirmation'
    }
  ];

  const generateTimeSlots = (date) => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 18; // 6 PM

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        time: `${hour}:00`,
        available: Math.random() > 0.3, // Random availability for demo
        label: moment().hour(hour).minute(0).format('h:mm A')
      });
      slots.push({
        time: `${hour}:30`,
        available: Math.random() > 0.3,
        label: moment().hour(hour).minute(30).format('h:mm A')
      });
    }

    return slots;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    if (date) {
      const slots = generateTimeSlots(date);
      setAvailableSlots(slots);
    }
  };

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => total + (service.price || 0), 0);
  };

  const nextStep = async () => {
    try {
      if (currentStep === 0 && selectedServices.length === 0) {
        message.error('Please select at least one service');
        return;
      }

      if (currentStep === 1) {
        await form.validateFields();
        const values = form.getFieldsValue();
        setFormData(values);
      }

      if (currentStep === 2) {
        if (!selectedDate || !selectedTime) {
          message.error('Please select both date and time');
          return;
        }
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        await handleBookingSubmit();
      }
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingSubmit = async () => {
    setLoading(true);
    try {
      const confirmationNum = 'EH' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();

      const bookingData = {
        userId: user.id,
        ...formData,
        selectedServices: selectedServices.map(service => ({
          id: service.id,
          title: service.title,
          price: service.price,
          duration: service.duration,
          category: service.category
        })),
        selectedDate: selectedDate.toDate(),
        selectedTime: selectedTime,
        totalAmount: calculateTotal(),
        confirmationNumber: confirmationNum,
        status: 'pending',
        createdAt: new Date(),
        paymentStatus: 'pending'
      };

      await addDoc(collection(db, 'bookings'), bookingData);

      setConfirmationNumber(confirmationNum);
      setBookingConfirmed(true);
      message.success('Booking confirmed! Redirecting to payment...');

      // Redirect to payment after a short delay
      setTimeout(() => {
        navigate('/my-bookings');
      }, 3000);

    } catch (error) {
      console.error('Error submitting booking:', error);
      message.error('Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderServiceSelection = () => (
    <div style={{ padding: '24px 0' }}>
      <Title level={3} style={{ color: themeStyles.textPrimary, textAlign: 'center', marginBottom: '32px' }}>
        Choose Your Therapy Services
      </Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: themeStyles.textSecondary }}>
            Loading services...
          </div>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {services.map(service => (
            <Col xs={24} md={12} lg={8} key={service.id}>
              <Card
                hoverable
                style={{
                  background: themeStyles.cardBackground,
                  border: selectedServices.find(s => s.id === service.id)
                    ? `2px solid ${themeStyles.accentPrimary}`
                    : `1px solid ${themeStyles.cardBorder}`,
                  borderRadius: '16px',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(20px)',
                  boxShadow: isDark
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
                bodyStyle={{ padding: '24px' }}
                onClick={() => handleServiceToggle(service)}
              >
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <Avatar
                    size={64}
                    style={{
                      backgroundColor: themeStyles.accentPrimary,
                      marginBottom: '16px'
                    }}
                    icon={<HeartOutlined style={{ fontSize: '28px' }} />}
                  />

                  {selectedServices.find(s => s.id === service.id) && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: themeStyles.successColor,
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircleOutlined style={{ color: 'white', fontSize: '14px' }} />
                    </div>
                  )}
                </div>

                <Title level={4} style={{ color: themeStyles.textPrimary, textAlign: 'center', marginBottom: '8px' }}>
                  {service.title}
                </Title>

                <Text style={{ color: themeStyles.textSecondary, display: 'block', textAlign: 'center', marginBottom: '16px' }}>
                  {service.description}
                </Text>

                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <Space wrap>
                    <Tag color="blue">{service.category}</Tag>
                    <Tag color="green">{service.duration} min</Tag>
                  </Space>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Text strong style={{ color: themeStyles.accentPrimary, fontSize: '20px' }}>
                    ₹{service.price}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {selectedServices.length > 0 && (
        <Card
          style={{
            background: themeStyles.cardBackground,
            border: `1px solid ${themeStyles.cardBorder}`,
            borderRadius: '12px',
            marginTop: '32px',
            backdropFilter: 'blur(20px)'
          }}
        >
          <Title level={4} style={{ color: themeStyles.textPrimary, marginBottom: '16px' }}>
            Selected Services ({selectedServices.length})
          </Title>

          <Space wrap style={{ marginBottom: '16px' }}>
            {selectedServices.map(service => (
              <Tag
                key={service.id}
                color="blue"
                closable
                onClose={() => handleServiceToggle(service)}
                style={{ marginBottom: '8px' }}
              >
                {service.title} - ₹{service.price}
              </Tag>
            ))}
          </Space>

          <Divider />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            <span style={{ color: themeStyles.textPrimary }}>Total Amount:</span>
            <span style={{ color: themeStyles.accentPrimary }}>₹{calculateTotal()}</span>
          </div>
        </Card>
      )}
    </div>
  );

  const renderPersonalDetails = () => (
    <div style={{ padding: '24px 0' }}>
      <Title level={3} style={{ color: themeStyles.textPrimary, textAlign: 'center', marginBottom: '32px' }}>
        Personal Information
      </Title>

      <Card
        style={{
          background: themeStyles.cardBackground,
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
          maxWidth: '800px',
          margin: '0 auto'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={() => {}}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="firstName"
                label={<span style={{ color: themeStyles.textPrimary }}>First Name</span>}
                rules={[{ required: true, message: 'Please enter your first name' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: themeStyles.textSecondary }} />}
                  placeholder="Enter your first name"
                  style={{
                    background: themeStyles.inputBackground,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    borderRadius: '8px',
                    color: themeStyles.textPrimary,
                    height: '48px'
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="lastName"
                label={<span style={{ color: themeStyles.textPrimary }}>Last Name</span>}
                rules={[{ required: true, message: 'Please enter your last name' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: themeStyles.textSecondary }} />}
                  placeholder="Enter your last name"
                  style={{
                    background: themeStyles.inputBackground,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    borderRadius: '8px',
                    color: themeStyles.textPrimary,
                    height: '48px'
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
                    background: themeStyles.buttonSecondary,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    borderRadius: '8px',
                    color: themeStyles.textSecondary,
                    height: '48px'
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label={<span style={{ color: themeStyles.textPrimary }}>Phone Number</span>}
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: themeStyles.textSecondary }} />}
                  placeholder="Enter your phone number"
                  style={{
                    background: themeStyles.inputBackground,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    borderRadius: '8px',
                    color: themeStyles.textPrimary,
                    height: '48px'
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="address"
                label={<span style={{ color: themeStyles.textPrimary }}>Address</span>}
                rules={[{ required: true, message: 'Please enter your address' }]}
              >
                <TextArea
                  prefix={<HomeOutlined style={{ color: themeStyles.textSecondary }} />}
                  placeholder="Enter your complete address"
                  rows={3}
                  style={{
                    background: themeStyles.inputBackground,
                    border: `1px solid ${themeStyles.inputBorder}`,
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
                rules={[{ required: true, message: 'Please enter emergency contact' }]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: themeStyles.textSecondary }} />}
                  placeholder="Emergency contact number"
                  style={{
                    background: themeStyles.inputBackground,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    borderRadius: '8px',
                    color: themeStyles.textPrimary,
                    height: '48px'
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="sessionType"
                label={<span style={{ color: themeStyles.textPrimary }}>Session Type</span>}
                rules={[{ required: true, message: 'Please select session type' }]}
              >
                <Select
                  placeholder="Select session type"
                  style={{
                    height: '48px'
                  }}
                  dropdownStyle={{
                    background: themeStyles.cardBackground,
                    border: `1px solid ${themeStyles.cardBorder}`
                  }}
                >
                  <Option value="video">Video Call</Option>
                  <Option value="audio">Audio Call</Option>
                  <Option value="in-person">In-Person</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="specialRequests"
                label={<span style={{ color: themeStyles.textPrimary }}>Special Requests (Optional)</span>}
              >
                <TextArea
                  placeholder="Any special requirements or notes"
                  rows={3}
                  style={{
                    background: themeStyles.inputBackground,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    borderRadius: '8px',
                    color: themeStyles.textPrimary
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );

  const renderScheduleSelection = () => (
    <div style={{ padding: '24px 0' }}>
      <Title level={3} style={{ color: themeStyles.textPrimary, textAlign: 'center', marginBottom: '32px' }}>
        Select Date & Time
      </Title>

      <Row gutter={[32, 32]} justify="center">
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space style={{ color: themeStyles.textPrimary }}>
                <CalendarOutlined />
                <span>Choose Date</span>
              </Space>
            }
            style={{
              background: themeStyles.cardBackground,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: '16px',
              backdropFilter: 'blur(20px)'
            }}
            headStyle={{
              borderBottom: `1px solid ${themeStyles.cardBorder}`,
              color: themeStyles.textPrimary
            }}
          >
            <DatePicker
              style={{
                width: '100%',
                height: '48px',
                background: themeStyles.inputBackground,
                border: `1px solid ${themeStyles.inputBorder}`,
                borderRadius: '8px'
              }}
              placeholder="Select appointment date"
              onChange={handleDateChange}
              disabledDate={(current) => current && current < moment().startOf('day')}
              format="MMMM DD, YYYY"
            />

            {selectedDate && (
              <Alert
                message={`Selected Date: ${selectedDate.format('MMMM DD, YYYY')}`}
                type="info"
                style={{
                  marginTop: '16px',
                  background: themeStyles.inputBackground,
                  border: `1px solid ${themeStyles.accentPrimary}`,
                  color: themeStyles.textPrimary
                }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space style={{ color: themeStyles.textPrimary }}>
                <ClockCircleOutlined />
                <span>Choose Time</span>
              </Space>
            }
            style={{
              background: themeStyles.cardBackground,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: '16px',
              backdropFilter: 'blur(20px)'
            }}
            headStyle={{
              borderBottom: `1px solid ${themeStyles.cardBorder}`,
              color: themeStyles.textPrimary
            }}
          >
            {!selectedDate ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: themeStyles.textSecondary
              }}>
                Please select a date first
              </div>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Row gutter={[8, 8]}>
                  {availableSlots.map((slot, index) => (
                    <Col xs={12} sm={8} key={index}>
                      <Button
                        block
                        disabled={!slot.available}
                        type={selectedTime === slot.time ? 'primary' : 'default'}
                        onClick={() => setSelectedTime(slot.time)}
                        style={{
                          height: '40px',
                          borderRadius: '8px',
                          background: selectedTime === slot.time ? themeStyles.accentPrimary :
                                    slot.available ? themeStyles.inputBackground : themeStyles.buttonSecondary,
                          border: `1px solid ${themeStyles.inputBorder}`,
                          color: selectedTime === slot.time ? '#ffffff' :
                                slot.available ? themeStyles.textPrimary : themeStyles.textSecondary
                        }}
                      >
                        {slot.label}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {selectedDate && selectedTime && (
        <Card
          style={{
            background: themeStyles.cardBackground,
            border: `2px solid ${themeStyles.successColor}`,
            borderRadius: '12px',
            marginTop: '32px',
            maxWidth: '600px',
            margin: '32px auto 0'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <CheckCircleOutlined
              style={{
                fontSize: '48px',
                color: themeStyles.successColor,
                marginBottom: '16px'
              }}
            />
            <Title level={4} style={{ color: themeStyles.textPrimary, marginBottom: '8px' }}>
              Appointment Scheduled
            </Title>
            <Text style={{ color: themeStyles.textSecondary, fontSize: '16px' }}>
              {selectedDate.format('dddd, MMMM DD, YYYY')} at {moment(selectedTime, 'HH:mm').format('h:mm A')}
            </Text>
          </div>
        </Card>
      )}
    </div>
  );

  const renderReviewConfirm = () => (
    <div style={{ padding: '24px 0' }}>
      <Title level={3} style={{ color: themeStyles.textPrimary, textAlign: 'center', marginBottom: '32px' }}>
        Review Your Booking
      </Title>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Services Summary */}
        <Card
          title={
            <Space style={{ color: themeStyles.textPrimary }}>
              <HeartOutlined />
              <span>Selected Services</span>
            </Space>
          }
          style={{
            background: themeStyles.cardBackground,
            border: `1px solid ${themeStyles.cardBorder}`,
            borderRadius: '16px',
            marginBottom: '24px',
            backdropFilter: 'blur(20px)'
          }}
          headStyle={{
            borderBottom: `1px solid ${themeStyles.cardBorder}`,
            color: themeStyles.textPrimary
          }}
        >
          {selectedServices.map(service => (
            <div key={service.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: `1px solid ${themeStyles.cardBorder}`
            }}>
              <div>
                <Text strong style={{ color: themeStyles.textPrimary }}>
                  {service.title}
                </Text>
                <br />
                <Text style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>
                  {service.duration} minutes • {service.category}
                </Text>
              </div>
              <Text strong style={{ color: themeStyles.accentPrimary, fontSize: '16px' }}>
                ₹{service.price}
              </Text>
            </div>
          ))}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            <span style={{ color: themeStyles.textPrimary }}>Total Amount:</span>
            <span style={{ color: themeStyles.accentPrimary }}>₹{calculateTotal()}</span>
          </div>
        </Card>

        {/* Personal Details Summary */}
        <Card
          title={
            <Space style={{ color: themeStyles.textPrimary }}>
              <UserOutlined />
              <span>Personal Information</span>
            </Space>
          }
          style={{
            background: themeStyles.cardBackground,
            border: `1px solid ${themeStyles.cardBorder}`,
            borderRadius: '16px',
            marginBottom: '24px',
            backdropFilter: 'blur(20px)'
          }}
          headStyle={{
            borderBottom: `1px solid ${themeStyles.cardBorder}`,
            color: themeStyles.textPrimary
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Text style={{ color: themeStyles.textSecondary }}>Name:</Text>
              <div style={{ color: themeStyles.textPrimary, fontWeight: '500' }}>
                {formData.firstName} {formData.lastName}
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Text style={{ color: themeStyles.textSecondary }}>Email:</Text>
              <div style={{ color: themeStyles.textPrimary, fontWeight: '500' }}>
                {formData.email}
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Text style={{ color: themeStyles.textSecondary }}>Phone:</Text>
              <div style={{ color: themeStyles.textPrimary, fontWeight: '500' }}>
                {formData.phone}
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Text style={{ color: themeStyles.textSecondary }}>Session Type:</Text>
              <div style={{ color: themeStyles.textPrimary, fontWeight: '500' }}>
                {formData.sessionType === 'video' ? 'Video Call' :
                 formData.sessionType === 'audio' ? 'Audio Call' : 'In-Person'}
              </div>
            </Col>
          </Row>
        </Card>

        {/* Schedule Summary */}
        <Card
          title={
            <Space style={{ color: themeStyles.textPrimary }}>
              <CalendarOutlined />
              <span>Appointment Schedule</span>
            </Space>
          }
          style={{
            background: themeStyles.cardBackground,
            border: `1px solid ${themeStyles.cardBorder}`,
            borderRadius: '16px',
            marginBottom: '24px',
            backdropFilter: 'blur(20px)'
          }}
          headStyle={{
            borderBottom: `1px solid ${themeStyles.cardBorder}`,
            color: themeStyles.textPrimary
          }}
        >
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <CalendarOutlined
              style={{
                fontSize: '48px',
                color: themeStyles.accentPrimary,
                marginBottom: '16px'
              }}
            />
            <div style={{ color: themeStyles.textPrimary, fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
              {selectedDate?.format('dddd, MMMM DD, YYYY')}
            </div>
            <div style={{ color: themeStyles.accentPrimary, fontSize: '24px', fontWeight: 'bold' }}>
              {selectedTime && moment(selectedTime, 'HH:mm').format('h:mm A')}
            </div>
          </div>
        </Card>

        {/* Terms and Conditions */}
        <Card
          style={{
            background: themeStyles.cardBackground,
            border: `1px solid ${themeStyles.cardBorder}`,
            borderRadius: '16px',
            backdropFilter: 'blur(20px)'
          }}
        >
          <Alert
            message="Important Information"
            description={
              <div style={{ color: themeStyles.textSecondary }}>
                • Please arrive 5 minutes early for your appointment
                • Cancellations must be made at least 24 hours in advance
                • Payment will be processed after admin approval
                • You will receive a confirmation email shortly
              </div>
            }
            type="info"
            showIcon
            style={{
              background: themeStyles.inputBackground,
              border: `1px solid ${themeStyles.accentPrimary}`,
              marginBottom: '20px'
            }}
          />

          <Checkbox style={{ color: themeStyles.textPrimary }}>
            I agree to the terms and conditions and privacy policy
          </Checkbox>
        </Card>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div style={{ padding: '24px 0', textAlign: 'center' }}>
      <div style={{
        background: themeStyles.cardBackground,
        border: `1px solid ${themeStyles.cardBorder}`,
        borderRadius: '20px',
        padding: '60px 40px',
        maxWidth: '600px',
        margin: '0 auto',
        backdropFilter: 'blur(20px)',
        boxShadow: isDark
          ? '0 20px 40px rgba(0, 0, 0, 0.3)'
          : '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <CheckCircleOutlined
          style={{
            fontSize: '80px',
            color: themeStyles.successColor,
            marginBottom: '24px'
          }}
        />

        <Title level={2} style={{ color: themeStyles.textPrimary, marginBottom: '16px' }}>
          Booking Confirmed!
        </Title>

        <Text style={{ color: themeStyles.textSecondary, fontSize: '16px', display: 'block', marginBottom: '24px' }}>
          Your appointment has been successfully booked. You will receive a confirmation email shortly.
        </Text>

        <div style={{
          background: themeStyles.inputBackground,
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px'
        }}>
          <Text style={{ color: themeStyles.textSecondary }}>Confirmation Number</Text>
          <div style={{
            color: themeStyles.accentPrimary,
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            letterSpacing: '2px'
          }}>
            {confirmationNumber}
          </div>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/my-bookings')}
            style={{
              background: themeStyles.accentPrimary,
              borderColor: themeStyles.accentPrimary,
              height: '48px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            View My Bookings
          </Button>

          <Button
            size="large"
            onClick={() => navigate('/')}
            style={{
              background: themeStyles.buttonSecondary,
              borderColor: themeStyles.cardBorder,
              color: themeStyles.textPrimary,
              height: '48px',
              borderRadius: '12px',
              fontSize: '16px'
            }}
          >
            Back to Home
          </Button>
        </Space>
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (bookingConfirmed) {
      return renderConfirmation();
    }

    switch (currentStep) {
      case 0:
        return renderServiceSelection();
      case 1:
        return renderPersonalDetails();
      case 2:
        return renderScheduleSelection();
      case 3:
        return renderReviewConfirm();
      default:
        return renderServiceSelection();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: themeStyles.pageBackground,
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
            Book Your Appointment
          </Title>
          <Text style={{ color: themeStyles.textSecondary, fontSize: '16px' }}>
            Schedule your therapy session in just a few simple steps
          </Text>
        </div>

        {!bookingConfirmed && (
          <Card
            style={{
              background: themeStyles.cardBackground,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: '16px',
              marginBottom: '32px',
              backdropFilter: 'blur(20px)'
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <Steps
              current={currentStep}
              style={{ marginBottom: '20px' }}
              items={steps.map((step, index) => ({
                title: <span style={{ color: themeStyles.textPrimary }}>{step.title}</span>,
                description: <span style={{ color: themeStyles.textSecondary }}>{step.description}</span>,
                icon: React.cloneElement(step.icon, {
                  style: {
                    color: index <= currentStep ? themeStyles.stepCompleted : themeStyles.stepInactive
                  }
                })
              }))}
            />

            <Progress
              percent={((currentStep + 1) / steps.length) * 100}
              strokeColor={themeStyles.accentPrimary}
              showInfo={false}
              style={{ marginTop: '20px' }}
            />
          </Card>
        )}

        {/* Step Content */}
        <Card
          style={{
            background: themeStyles.cardBackground,
            border: `1px solid ${themeStyles.cardBorder}`,
            borderRadius: '16px',
            backdropFilter: 'blur(20px)',
            boxShadow: isDark
              ? '0 20px 40px rgba(0, 0, 0, 0.3)'
              : '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}
          bodyStyle={{ padding: '0' }}
        >
          {renderStepContent()}
        </Card>

        {/* Navigation Buttons */}
        {!bookingConfirmed && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '32px'
          }}>
            <Button
              size="large"
              onClick={prevStep}
              disabled={currentStep === 0}
              icon={<ArrowLeftOutlined />}
              style={{
                borderRadius: '12px',
                height: '48px',
                background: themeStyles.buttonSecondary,
                border: `1px solid ${themeStyles.cardBorder}`,
                color: themeStyles.textPrimary
              }}
            >
              Previous
            </Button>

            <Badge
              count={`Step ${currentStep + 1} of ${steps.length}`}
              style={{
                backgroundColor: themeStyles.accentPrimary,
                color: 'white',
                fontSize: '12px',
                fontWeight: '500'
              }}
            />

            <Button
              type="primary"
              size="large"
              onClick={nextStep}
              loading={loading}
              icon={currentStep === steps.length - 1 ? <CheckCircleOutlined /> : <ArrowRightOutlined />}
              style={{
                borderRadius: '12px',
                height: '48px',
                background: themeStyles.accentPrimary,
                borderColor: themeStyles.accentPrimary,
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {currentStep === steps.length - 1 ? 'Confirm Booking' : 'Next Step'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;