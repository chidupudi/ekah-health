// src/components/subscriptions/SubscriptionManager/SubscriptionManager.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Badge, Tag, Alert, Modal, Steps, Form, Input, Select } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  MessageOutlined,
  VideoCameraOutlined,
  UserOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Box } from '@mui/material';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase/config';
import { useAuth } from '../../../context/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;

const SubscriptionManager = ({ userSubscriptions, onSubscriptionUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [setupModalVisible, setSetupModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [setupForm] = Form.useForm();
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const { currentUser, userProfile } = useAuth();

  // Handle new subscription
  const handleSubscribe = async (planData) => {
    setLoading(true);
    try {
      console.log('🔄 Processing subscription for plan:', planData.title);

      // Create subscription document
      const subscriptionData = {
        userId: currentUser.uid,
        planId: planData.id,
        planTitle: planData.title,
        planCategory: planData.category,
        price: planData.price,
        duration: planData.duration,
        practitionerType: planData.practitionerType,
        features: planData.features,
        status: 'pending_setup', // pending_setup -> active -> cancelled
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        billingCycle: 'monthly',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        roomId: null, // Will be created after setup
        practitionerId: null, // Will be assigned
        setupComplete: false
      };

      // Save subscription to Firestore
      const subscriptionRef = await addDoc(collection(db, 'subscriptions'), subscriptionData);
      console.log('✅ Subscription created:', subscriptionRef.id);

      // Update user's subscription list
      const updatedSubscriptions = [...(userSubscriptions || []), {
        id: subscriptionRef.id,
        ...subscriptionData
      }];

      // Update user profile with subscription info
      await updateDoc(doc(db, 'users', currentUser.uid), {
        subscriptions: updatedSubscriptions.map(sub => ({
          id: sub.id,
          planId: sub.planId,
          status: sub.status,
          createdAt: sub.createdAt
        })),
        hasActiveSubscriptions: true,
        updatedAt: new Date().toISOString()
      });

      // Open setup modal
      setSelectedSubscription({ id: subscriptionRef.id, ...subscriptionData });
      setSetupModalVisible(true);
      setCurrentStep(0);

      // Notify parent component
      onSubscriptionUpdate(updatedSubscriptions);

      console.log('🎉 Subscription process started');
    } catch (error) {
      console.error('❌ Subscription error:', error);
      Modal.error({
        title: 'Subscription Failed',
        content: 'There was an error processing your subscription. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Complete subscription setup
  const handleSetupComplete = async (values) => {
    setLoading(true);
    try {
      console.log('🔄 Completing subscription setup...', values);

      // Create private room
      const roomData = {
        subscriptionId: selectedSubscription.id,
        clientId: currentUser.uid,
        clientName: userProfile.displayName,
        clientEmail: userProfile.email,
        planTitle: selectedSubscription.planTitle,
        planCategory: selectedSubscription.planCategory,
        practitionerType: selectedSubscription.practitionerType,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        // Client preferences from setup form
        preferredTimes: values.preferredTimes,
        healthGoals: values.healthGoals,
        specialRequirements: values.specialRequirements,
        contactPreference: values.contactPreference,
        
        // Room settings
        settings: {
          allowVideoCall: true,
          allowFileSharing: true,
          allowAppointmentBooking: true,
          notificationsEnabled: true
        },
        
        // Messages array (empty initially)
        messages: [],
        lastActivity: new Date().toISOString()
      };

      // Create room document
      const roomRef = await addDoc(collection(db, 'consultation_rooms'), roomData);
      console.log('✅ Consultation room created:', roomRef.id);

      // Update subscription with room info
      await updateDoc(doc(db, 'subscriptions', selectedSubscription.id), {
        roomId: roomRef.id,
        status: 'active',
        setupComplete: true,
        updatedAt: new Date().toISOString(),
        clientPreferences: {
          preferredTimes: values.preferredTimes,
          healthGoals: values.healthGoals,
          specialRequirements: values.specialRequirements,
          contactPreference: values.contactPreference
        }
      });

      // Create initial welcome message in the room
      const welcomeMessage = {
        roomId: roomRef.id,
        type: 'system',
        content: `Welcome to your private consultation room! 🎉\n\nYour ${selectedSubscription.planTitle} subscription is now active. A ${selectedSubscription.practitionerType} will be assigned to you within 24 hours.\n\nIn the meantime, feel free to share any questions or concerns you have.`,
        timestamp: new Date().toISOString(),
        sender: 'system'
      };

      await addDoc(collection(db, 'messages'), welcomeMessage);

      setSetupModalVisible(false);
      setCurrentStep(0);
      setupForm.resetFields();

      // Show success message
      Modal.success({
        title: 'Subscription Activated! 🎉',
        content: (
          <div>
            <p>Your consultation room has been created successfully!</p>
            <p>A {selectedSubscription.practitionerType} will be assigned within 24 hours.</p>
            <p>You can now access your private consultation room from the dashboard.</p>
          </div>
        ),
      });

      // Refresh subscriptions
      onSubscriptionUpdate();

    } catch (error) {
      console.error('❌ Setup completion error:', error);
      Modal.error({
        title: 'Setup Failed',
        content: 'There was an error completing your setup. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending_setup': 'orange',
      'active': 'green',
      'paused': 'blue',
      'cancelled': 'red',
      'expired': 'default'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending_setup': 'Setup Required',
      'active': 'Active',
      'paused': 'Paused',
      'cancelled': 'Cancelled',
      'expired': 'Expired'
    };
    return statusMap[status] || status;
  };

  return (
    <Box>
      {/* Active Subscriptions */}
      {userSubscriptions && userSubscriptions.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Title level={3}>Your Active Plans</Title>
          
          {userSubscriptions.map(subscription => (
            <Card 
              key={subscription.id}
              style={{ marginBottom: 16, borderRadius: 12 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Title level={4} style={{ margin: 0 }}>
                      {subscription.planTitle}
                    </Title>
                    <Tag color={getStatusColor(subscription.status)}>
                      {getStatusText(subscription.status)}
                    </Tag>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Text type="secondary">
                      <UserOutlined /> {subscription.practitionerType}
                    </Text>
                    <Text type="secondary" style={{ marginLeft: 16 }}>
                      <CalendarOutlined /> Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                    </Text>
                  </Box>

                  {subscription.status === 'pending_setup' && (
                    <Alert
                      message="Setup Required"
                      description="Complete your subscription setup to activate your consultation room."
                      type="warning"
                      showIcon
                      style={{ marginBottom: 16 }}
                      action={
                        <Button 
                          size="small" 
                          type="primary"
                          onClick={() => {
                            setSelectedSubscription(subscription);
                            setSetupModalVisible(true);
                          }}
                        >
                          Complete Setup
                        </Button>
                      }
                    />
                  )}

                  {subscription.status === 'active' && (
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button 
                        type="primary" 
                        icon={<MessageOutlined />}
                        href={`/client/consultation/${subscription.roomId}`}
                      >
                        Open Consultation Room
                      </Button>
                      <Button 
                        icon={<VideoCameraOutlined />}
                        href={`/client/appointments/${subscription.id}`}
                      >
                        Schedule Appointment
                      </Button>
                    </Box>
                  )}
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                    ${subscription.price}/month
                  </Text>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Setup Modal */}
      <Modal
        title="Complete Your Subscription Setup"
        open={setupModalVisible}
        onCancel={() => setSetupModalVisible(false)}
        footer={null}
        width={700}
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step title="Personal Info" icon={<UserOutlined />} />
          <Step title="Preferences" icon={<CalendarOutlined />} />
          <Step title="Complete" icon={<CheckCircleOutlined />} />
        </Steps>

        <Form
          form={setupForm}
          layout="vertical"
          onFinish={handleSetupComplete}
        >
          {currentStep === 0 && (
            <Box>
              <Title level={4}>Tell us about your health goals</Title>
              <Form.Item
                label="What are your primary health goals?"
                name="healthGoals"
                rules={[{ required: true, message: 'Please describe your health goals' }]}
              >
                <Input.TextArea 
                  rows={4} 
                  placeholder="e.g., Lose weight, build muscle, manage stress, improve nutrition..."
                />
              </Form.Item>

              <Form.Item
                label="Any special requirements or medical conditions?"
                name="specialRequirements"
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="e.g., Allergies, dietary restrictions, injuries, medications..."
                />
              </Form.Item>

              <Button 
                type="primary" 
                onClick={() => setCurrentStep(1)}
                style={{ marginTop: 16 }}
              >
                Next
              </Button>
            </Box>
          )}

          {currentStep === 1 && (
            <Box>
              <Title level={4}>Communication Preferences</Title>
              
              <Form.Item
                label="Preferred consultation times"
                name="preferredTimes"
                rules={[{ required: true, message: 'Please select your preferred times' }]}
              >
                <Select mode="multiple" placeholder="Select preferred times">
                  <Option value="morning">Morning (8AM - 12PM)</Option>
                  <Option value="afternoon">Afternoon (12PM - 5PM)</Option>
                  <Option value="evening">Evening (5PM - 9PM)</Option>
                  <Option value="weekend">Weekends</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Preferred contact method"
                name="contactPreference"
                rules={[{ required: true, message: 'Please select contact preference' }]}
              >
                <Select placeholder="How would you like to be contacted?">
                  <Option value="chat">Text/Chat Messages</Option>
                  <Option value="video">Video Calls</Option>
                  <Option value="both">Both Chat and Video</Option>
                </Select>
              </Form.Item>

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button onClick={() => setCurrentStep(0)}>
                  Back
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => setCurrentStep(2)}
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}

          {currentStep === 2 && (
            <Box>
              <Title level={4}>Ready to Start! 🎉</Title>
              
              <Alert
                message="Your consultation room will be created"
                description={
                  <div>
                    <p>Once you complete the setup:</p>
                    <ul>
                      <li>A private consultation room will be created</li>
                      <li>A {selectedSubscription?.practitionerType} will be assigned within 24 hours</li>
                      <li>You'll receive a welcome message with next steps</li>
                      <li>You can start communicating immediately</li>
                    </ul>
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button 
                  type="primary" 
                  size="large"
                  loading={loading}
                  htmlType="submit"
                >
                  Complete Setup & Activate
                </Button>
              </Box>
            </Box>
          )}
        </Form>
      </Modal>
    </Box>
  );
};

export default SubscriptionManager;