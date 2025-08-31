import React, { useState, useEffect } from 'react';
import { 
  Steps, 
  Card, 
  Button, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  TimePicker, 
  Radio, 
  Checkbox, 
  Typography, 
  Row, 
  Col, 
  Divider, 
  message,
  Result,
  Progress,
  Badge,
  Space,
  Avatar
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  ContactsOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../components/ParticleBackground';
import { bookingsDB, timeSlotsDB } from '../services/firebase/database';
import CalendarPicker from '../components/CalendarPicker';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const BookingFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [form] = Form.useForm();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  // Get service data from navigation state
  const serviceData = location.state?.service;
  const selectedServices = location.state?.selectedServices || [serviceData].filter(Boolean);

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }
    
    if (!serviceData && selectedServices.length === 0) {
      navigate('/services');
      return;
    }
  }, [currentUser, serviceData, selectedServices, navigate]);

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        cardBg: 'rgba(67, 127, 151, 0.12)',
        cardBorder: 'rgba(67, 127, 151, 0.25)',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        stepsBg: 'rgba(67, 127, 151, 0.08)',
        progressColor: '#EEEIB3',
        primaryColor: '#437F97',
        accentColor: '#FFB5C2',
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #f8fafc 0%, rgba(238, 225, 179, 0.1) 50%, #f8fafc 100%)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(67, 127, 151, 0.15)',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        stepsBg: 'rgba(67, 127, 151, 0.05)',
        progressColor: '#437F97',
        primaryColor: '#437F97',
        accentColor: '#FFB5C2',
      };
    }
  };

  const themeStyles = getThemeStyles();

  const steps = [
    {
      title: 'Personal Details',
      icon: <UserOutlined />,
      description: 'Basic information'
    },
    {
      title: 'Health Information',
      icon: <HeartOutlined />,
      description: 'Medical background'
    },
    {
      title: 'Appointment',
      icon: <CalendarOutlined />,
      description: 'Date & time preference'
    },
    {
      title: 'Review & Confirm',
      icon: <CheckCircleOutlined />,
      description: 'Final confirmation'
    }
  ];

  const generateConfirmationNumber = () => {
    return 'EH' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();
  };

  const nextStep = async () => {
    try {
      // Special validation for appointment step
      if (currentStep === 2) {
        if (!selectedTimeSlot) {
          message.error('Please select an appointment time slot');
          return;
        }
      }
      
      await form.validateFields();
      const values = form.getFieldsValue();
      setFormData(prev => ({ ...prev, ...values }));
      
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
      const confirmationNum = generateConfirmationNumber();
      
      // Prepare booking data for database
      const bookingData = {
        // User Information
        userId: currentUser.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        emergencyContact: formData.emergencyContact,

        // Health Information
        age: formData.age,
        gender: formData.gender,
        medicalHistory: formData.medicalHistory,
        currentConcerns: formData.currentConcerns,
        previousTherapy: formData.previousTherapy,

        // Appointment Details
        preferredDate: selectedTimeSlot ? selectedTimeSlot.dateTime.toDate() : null,
        preferredTime: selectedTimeSlot ? selectedTimeSlot.dateTime.toDate() : null,
        sessionType: formData.sessionType,
        alternativeSlots: formData.alternativeSlots,
        specialRequests: formData.specialRequests,

        // Selected Services (clean the data)
        selectedServices: selectedServices.map(service => ({
          id: service.id,
          title: service.title,
          category: service.category,
          duration: service.duration,
          description: service.description
        })),
        
        // Booking Metadata
        confirmationNumber: confirmationNum,
        termsAccepted: formData.termsAccepted
      };

      // Save booking to database
      const savedBooking = await bookingsDB.add(bookingData);
      
      // Book the selected time slot
      if (selectedTimeSlot && savedBooking.id) {
        try {
          await timeSlotsDB.atomicBookSlot(selectedTimeSlot.date, selectedTimeSlot.time, {
            bookingId: savedBooking.id,
            patientName: `${formData.firstName} ${formData.lastName}`,
            patientEmail: formData.email,
            serviceType: selectedServices.map(s => s.title).join(', '),
            notes: formData.specialRequests || ''
          });
        } catch (slotErr) {
          // Rollback booking if slot is not available
          message.error('Selected slot is no longer available. Please choose another.');
          // Optionally, delete the booking if needed
          // await bookingsDB.delete(savedBooking.id);
          setLoading(false);
          return;
        }
      }
      
      console.log('Booking saved successfully:', savedBooking);
      
      setConfirmationNumber(confirmationNum);
      setBookingComplete(true);
      
      message.success('Booking confirmed and time slot reserved!');
    } catch (error) {
      console.error('Booking submission error:', error);
      message.error(`Booking failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalDetails = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24}>
        <Title level={4} style={{ color: themeStyles.textPrimary, marginBottom: '24px' }}>
          Personal Information
        </Title>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name="firstName"
          label={<span style={{ color: themeStyles.textPrimary }}>First Name</span>}
          rules={[{ required: true, message: 'Please enter your first name' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Enter first name"
            style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              color: themeStyles.textPrimary
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
            prefix={<UserOutlined />} 
            placeholder="Enter last name"
            style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              color: themeStyles.textPrimary
            }}
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name="phone"
          label={<span style={{ color: themeStyles.textPrimary }}>Phone Number</span>}
          rules={[
            { required: true, message: 'Please enter your phone number' },
            { pattern: /^\+?[\d\s\-\(\)]+$/, message: 'Please enter a valid phone number' }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined />} 
            placeholder="+1 (555) 123-4567"
            style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              color: themeStyles.textPrimary
            }}
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name="email"
          label={<span style={{ color: themeStyles.textPrimary }}>Email Address</span>}
          initialValue={currentUser?.email}
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="your.email@example.com"
            disabled={!!currentUser?.email}
            style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              color: themeStyles.textPrimary
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
            prefix={<HomeOutlined />} 
            placeholder="Enter your full address"
            rows={3}
            style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              color: themeStyles.textPrimary
            }}
          />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          name="emergencyContact"
          label={<span style={{ color: themeStyles.textPrimary }}>Emergency Contact</span>}
          rules={[{ required: true, message: 'Please enter emergency contact details' }]}
        >
          <Input 
            prefix={<ContactsOutlined />} 
            placeholder="Name and phone number"
            style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              color: themeStyles.textPrimary
            }}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderHealthInformation = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24}>
        <Title level={4} style={{ color: themeStyles.textPrimary, marginBottom: '24px' }}>
          Health Information
        </Title>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name="age"
          label={<span style={{ color: themeStyles.textPrimary }}>Age</span>}
          rules={[{ required: true, message: 'Please enter your age' }]}
        >
          <Input 
            type="number" 
            placeholder="Enter your age"
            min={1}
            max={120}
            style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              color: themeStyles.textPrimary
            }}
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          name="gender"
          label={<span style={{ color: themeStyles.textPrimary }}>Gender</span>}
          rules={[{ required: true, message: 'Please select your gender' }]}
        >
          <Select 
            placeholder="Select gender"
            style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
            }}
          >
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
            <Option value="prefer-not-to-say">Prefer not to say</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          name="medicalHistory"
          label={<span style={{ color: themeStyles.textPrimary }}>Medical History</span>}
        >
          <TextArea 
            placeholder="Please describe any relevant medical history, current medications, allergies, or conditions"
            rows={4}
            style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              color: themeStyles.textPrimary
            }}
          />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          name="currentConcerns"
          label={<span style={{ color: themeStyles.textPrimary }}>Current Health Concerns</span>}
          rules={[{ required: true, message: 'Please describe your current concerns' }]}
        >
          <TextArea 
            placeholder="What would you like to discuss during your session?"
            rows={4}
            style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              color: themeStyles.textPrimary
            }}
          />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item
          name="previousTherapy"
          label={<span style={{ color: themeStyles.textPrimary }}>Previous Therapy Experience</span>}
        >
          <Radio.Group>
            <Radio value="yes" style={{ color: themeStyles.textPrimary }}>Yes</Radio>
            <Radio value="no" style={{ color: themeStyles.textPrimary }}>No</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
    </Row>
  );

  const renderAppointmentDetails = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24}>
        <Title level={4} style={{ color: themeStyles.textPrimary, marginBottom: '24px' }}>
          Select Your Appointment Time
        </Title>
      </Col>
      
      {/* Calendar Picker */}
      <Col xs={24}>
        <CalendarPicker
          onSlotSelect={(slotInfo) => {
            setSelectedTimeSlot(slotInfo);
            // Update form data with the selected slot
            setFormData(prev => ({
              ...prev,
              preferredDate: slotInfo.dateTime,
              preferredTime: slotInfo.dateTime,
              selectedSlot: slotInfo
            }));
          }}
          selectedSlot={selectedTimeSlot}
          disabled={loading}
        />
      </Col>
      
      <Col xs={24}>
        <Form.Item
          name="sessionType"
          label={<span style={{ color: themeStyles.textPrimary }}>Session Type</span>}
          rules={[{ required: true, message: 'Please select session type' }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="online" style={{ color: themeStyles.textPrimary }}>
                Online Meet
              </Radio>
              <Radio value="phone" style={{ color: themeStyles.textPrimary }}>
                Phone Consultation
              </Radio>
               <Radio value="offline" style={{ color: themeStyles.textPrimary }}>
               In-Person Consultation
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Col>
      
      <Col xs={24}>
        <Form.Item
          name="specialRequests"
          label={<span style={{ color: themeStyles.textPrimary }}>Special Requests or Notes</span>}
        >
          <TextArea 
            placeholder="Any special requirements, accessibility needs, or additional notes"
            rows={3}
            style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              color: themeStyles.textPrimary
            }}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderReviewConfirm = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24}>
        <Title level={4} style={{ color: themeStyles.textPrimary, marginBottom: '24px' }}>
          Review Your Booking
        </Title>
      </Col>
      
      {/* Selected Services */}
      <Col xs={24}>
        <Card 
          title={<span style={{ color: themeStyles.textPrimary }}>Selected Services</span>}
          style={{
            background: themeStyles.cardBg,
            border: `1px solid ${themeStyles.cardBorder}`,
            marginBottom: '16px'
          }}
        >
          {selectedServices.filter(service => service && service.title).map((service, index) => (
            <div key={service.id || index} style={{ marginBottom: '12px' }}>
              <Space>
                <Avatar style={{ backgroundColor: themeStyles.primaryColor }}>
                  <HeartOutlined />
                </Avatar>
                <div>
                  <Text strong style={{ color: themeStyles.textPrimary }}>
                    {service.title}
                  </Text>
                  <br />
                  <Text style={{ color: themeStyles.textSecondary }}>
                    {service.duration || 'Duration TBD'} • {service.category || 'General'}
                  </Text>
                </div>
              </Space>
            </div>
          ))}
          {selectedServices.filter(service => service && service.title).length === 0 && (
            <Text style={{ color: themeStyles.textSecondary }}>No services selected</Text>
          )}
        </Card>
      </Col>

      {/* Personal Information Summary */}
      <Col xs={24} md={12}>
        <Card 
          title={<span style={{ color: themeStyles.textPrimary }}>Personal Information</span>}
          style={{
            background: themeStyles.cardBg,
            border: `1px solid ${themeStyles.cardBorder}`,
          }}
        >
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text style={{ color: themeStyles.textSecondary }}>
              <strong>Name:</strong> {formData.firstName || ''} {formData.lastName || ''}
            </Text>
            <Text style={{ color: themeStyles.textSecondary }}>
              <strong>Phone:</strong> {formData.phone || 'Not provided'}
            </Text>
            <Text style={{ color: themeStyles.textSecondary }}>
              <strong>Email:</strong> {formData.email || 'Not provided'}
            </Text>
            <Text style={{ color: themeStyles.textSecondary }}>
              <strong>Age:</strong> {formData.age || 'Not provided'} • <strong>Gender:</strong> {formData.gender || 'Not selected'}
            </Text>
          </Space>
        </Card>
      </Col>

      {/* Appointment Details */}
      <Col xs={24} md={12}>
        <Card 
          title={<span style={{ color: themeStyles.textPrimary }}>Appointment Details</span>}
          style={{
            background: themeStyles.cardBg,
            border: `1px solid ${themeStyles.cardBorder}`,
          }}
        >
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text style={{ color: themeStyles.textSecondary }}>
              <strong>Date:</strong> {selectedTimeSlot ? selectedTimeSlot.dateTime.format('MMMM DD, YYYY') : 'Not selected'}
            </Text>
            <Text style={{ color: themeStyles.textSecondary }}>
              <strong>Time:</strong> {selectedTimeSlot ? selectedTimeSlot.dateTime.format('HH:mm') : 'Not selected'}
            </Text>
            <Text style={{ color: themeStyles.textSecondary }}>
              <strong>Type:</strong> {formData.sessionType ? formData.sessionType.charAt(0).toUpperCase() + formData.sessionType.slice(1) : 'Not selected'}
            </Text>
          </Space>
        </Card>
      </Col>

      {/* Terms and Conditions */}
      <Col xs={24}>
        <Form.Item
          name="termsAccepted"
          valuePropName="checked"
          rules={[{ required: true, message: 'Please accept the terms and conditions' }]}
        >
          <Checkbox style={{ color: themeStyles.textPrimary }}>
            I agree to the{' '}
            <a href="/terms" target="_blank" style={{ color: themeStyles.primaryColor }}>
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" style={{ color: themeStyles.primaryColor }}>
              Privacy Policy
            </a>
          </Checkbox>
        </Form.Item>
      </Col>
    </Row>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalDetails();
      case 1:
        return renderHealthInformation();
      case 2:
        return renderAppointmentDetails();
      case 3:
        return renderReviewConfirm();
      default:
        return null;
    }
  };

  const renderSuccessScreen = () => (
    <div>
      <Result
        status="success"
        title={<span style={{ color: themeStyles.textPrimary }}>Booking Confirmed!</span>}
        subTitle={
          <div>
            <Text style={{ color: themeStyles.textSecondary, fontSize: '16px' }}>
              Your appointment has been successfully booked and saved to our system.
            </Text>
            <br />
            <Text style={{ color: themeStyles.textSecondary }}>
              Confirmation Number: <strong style={{ color: themeStyles.primaryColor }}>{confirmationNumber}</strong>
            </Text>
          </div>
        }
        extra={[
          <Button 
            key="services"
            onClick={() => navigate('/services')}
            style={{ marginRight: '12px' }}
          >
            Book Another Service
          </Button>,
          <Button 
            key="home"
            type="primary" 
            onClick={() => navigate('/')}
            style={{ 
              background: themeStyles.primaryColor,
              borderColor: themeStyles.primaryColor
            }}
          >
            Back to Home
          </Button>,
        ]}
        style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '32px'
        }}
      />
      
      {/* Booking Summary Card */}
      <Card
        title={<span style={{ color: themeStyles.textPrimary }}>📋 What Happens Next?</span>}
        style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: '16px',
          marginBottom: '24px'
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <Text style={{ color: themeStyles.textPrimary }}>
              <strong>Booking Saved:</strong> Your appointment details are securely stored in our system
            </Text>
          </div>
          <div>
            <MailOutlined style={{ color: themeStyles.primaryColor, marginRight: '8px' }} />
            <Text style={{ color: themeStyles.textSecondary }}>
              You will receive a confirmation email at <strong>{formData.email}</strong>
            </Text>
          </div>
          <div>
            <PhoneOutlined style={{ color: themeStyles.primaryColor, marginRight: '8px' }} />
            <Text style={{ color: themeStyles.textSecondary }}>
              Our team will contact you at <strong>{formData.phone}</strong> to confirm your appointment
            </Text>
          </div>
          <div>
            <CalendarOutlined style={{ color: themeStyles.primaryColor, marginRight: '8px' }} />
            <Text style={{ color: themeStyles.textSecondary }}>
              Confirmed appointment: <strong>
                {selectedTimeSlot ? selectedTimeSlot.dateTime.format('MMMM DD, YYYY [at] HH:mm') : 'Time slot confirmed'}
              </strong>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );

  if (!currentUser) {
    return null;
  }

  if (bookingComplete) {
    return (
      <div style={{ 
        background: themeStyles.background, 
        minHeight: '100vh',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {renderSuccessScreen()}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: themeStyles.background, 
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={2} style={{ color: themeStyles.textPrimary, marginBottom: '8px' }}>
            Book Your Appointment
          </Title>
          <Text style={{ color: themeStyles.textSecondary, fontSize: '16px' }}>
            Complete the steps below to schedule your session
          </Text>
        </div>

        {/* Progress Steps */}
        <Card style={{
          background: themeStyles.stepsBg,
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: '16px',
          marginBottom: '32px'
        }}>
          <Steps 
            current={currentStep}
            items={steps}
            style={{ margin: '20px 0' }}
          />
          <Progress 
            percent={((currentStep + 1) / steps.length) * 100} 
            strokeColor={themeStyles.progressColor}
            showInfo={false}
            style={{ margin: '20px 0 0' }}
          />
        </Card>

        {/* Form Content */}
        <Card style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: '16px',
          padding: '20px'
        }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={formData}
            onValuesChange={(_, allValues) => setFormData(prev => ({ ...prev, ...allValues }))}
          >
            {renderStepContent()}
          </Form>

          {/* Navigation Buttons */}
          <Divider />
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
                borderRadius: '8px',
                border: `1px solid ${themeStyles.cardBorder}`,
                color: themeStyles.textPrimary
              }}
            >
              Previous
            </Button>

            <Badge count={`${currentStep + 1} of ${steps.length}`} 
              style={{ 
                backgroundColor: themeStyles.primaryColor,
                color: 'white'
              }} 
            />

            <Button 
              type="primary"
              size="large"
              onClick={nextStep}
              loading={loading}
              icon={currentStep === steps.length - 1 ? <CheckCircleOutlined /> : <ArrowRightOutlined />}
              style={{
                borderRadius: '8px',
                background: themeStyles.primaryColor,
                borderColor: themeStyles.primaryColor
              }}
            >
              {currentStep === steps.length - 1 ? 'Confirm Booking' : 'Next'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BookingFlow;