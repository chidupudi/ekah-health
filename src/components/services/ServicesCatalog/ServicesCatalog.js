// src/components/services/ServicesCatalog/ServicesCatalog.jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Tag, Modal, Descriptions, Alert } from 'antd';
import { 
  HeartOutlined, 
  UserOutlined, 
  ClockCircleOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import { Box } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

// Mock data - you'll replace this with Firebase data
const AVAILABLE_PLANS = [
  {
    id: 'wellness-basic',
    title: 'Basic Wellness Plan',
    category: 'wellness',
    price: 49.99,
    duration: '1 Month',
    description: 'Essential wellness guidance and basic health monitoring',
    features: [
      'Weekly health check-ins',
      'Basic nutrition guidance',
      'Exercise recommendations',
      'Email support'
    ],
    practitionerType: 'Wellness Coach',
    rating: 4.5,
    image: '/api/placeholder/300/200',
    popular: false
  },
  {
    id: 'nutrition-premium',
    title: 'Premium Nutrition Plan',
    category: 'nutrition',
    price: 99.99,
    duration: '1 Month',
    description: 'Comprehensive nutrition planning with personalized meal plans',
    features: [
      'Personalized meal plans',
      'Grocery shopping lists',
      'Daily nutrition tracking',
      'Video consultations (2x/month)',
      'Recipe recommendations',
      'Progress monitoring'
    ],
    practitionerType: 'Certified Nutritionist',
    rating: 4.8,
    image: '/api/placeholder/300/200',
    popular: true
  },
  {
    id: 'fitness-advanced',
    title: 'Advanced Fitness Plan',
    category: 'fitness',
    price: 79.99,
    duration: '1 Month',
    description: 'Complete fitness transformation with personal training',
    features: [
      'Custom workout plans',
      'Form correction videos',
      'Progress tracking',
      'Weekly video calls',
      'Equipment recommendations',
      'Injury prevention tips'
    ],
    practitionerType: 'Personal Trainer',
    rating: 4.7,
    image: '/api/placeholder/300/200',
    popular: false
  },
  {
    id: 'mental-health-premium',
    title: 'Mental Wellness Plan',
    category: 'mental-health',
    price: 129.99,
    duration: '1 Month',
    description: 'Professional mental health support and stress management',
    features: [
      'Weekly therapy sessions',
      'Stress management techniques',
      'Mindfulness exercises',
      'Crisis support',
      'Progress assessments',
      '24/7 chat support'
    ],
    practitionerType: 'Licensed Therapist',
    rating: 4.9,
    image: '/api/placeholder/300/200',
    popular: true
  },
  {
    id: 'comprehensive-health',
    title: 'Comprehensive Health Plan',
    category: 'comprehensive',
    price: 199.99,
    duration: '1 Month',
    description: 'All-in-one health and wellness solution',
    features: [
      'All wellness services included',
      'Dedicated health coordinator',
      'Monthly comprehensive review',
      'Priority scheduling',
      'Family health planning',
      'Emergency consultations'
    ],
    practitionerType: 'Health Coordinator + Specialists',
    rating: 5.0,
    image: '/api/placeholder/300/200',
    popular: true
  }
];

const CATEGORIES = [
  { key: 'all', label: 'All Plans', icon: '🏥' },
  { key: 'wellness', label: 'Wellness', icon: '💚' },
  { key: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { key: 'fitness', label: 'Fitness', icon: '💪' },
  { key: 'mental-health', label: 'Mental Health', icon: '🧠' },
  { key: 'comprehensive', label: 'Comprehensive', icon: '⭐' }
];

const ServicesCatalog = ({ onSubscribe }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();

  const filteredPlans = selectedCategory === 'all' 
    ? AVAILABLE_PLANS 
    : AVAILABLE_PLANS.filter(plan => plan.category === selectedCategory);

  const handleSubscribe = async (plan) => {
    setLoading(true);
    try {
      // Call parent component's subscribe handler
      await onSubscribe(plan);
      setModalVisible(false);
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      wellness: 'green',
      nutrition: 'orange',
      fitness: 'blue',
      'mental-health': 'purple',
      comprehensive: 'gold'
    };
    return colors[category] || 'default';
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          Choose Your Wellness Plan 🌟
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          Select the perfect plan for your health journey. Once subscribed, you'll get access to your dedicated practitioner.
        </Paragraph>
      </Box>

      {/* Category Filter */}
      <Box sx={{ mb: 3 }}>
        <Row gutter={[8, 8]} justify="center">
          {CATEGORIES.map(category => (
            <Col key={category.key}>
              <Button
                size="large"
                type={selectedCategory === category.key ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(category.key)}
                style={{ borderRadius: 20 }}
              >
                {category.icon} {category.label}
              </Button>
            </Col>
          ))}
        </Row>
      </Box>

      {/* Plans Grid */}
      <Row gutter={[24, 24]}>
        {filteredPlans.map(plan => (
          <Col xs={24} sm={12} lg={8} key={plan.id}>
            <Card
              hoverable
              style={{ 
                borderRadius: 12,
                height: '100%',
                position: 'relative',
                border: plan.popular ? '2px solid #1890ff' : '1px solid #d9d9d9'
              }}
              cover={
                <div style={{ 
                  height: 200, 
                  background: `linear-gradient(135deg, ${getCategoryColor(plan.category) === 'green' ? '#52c41a' : getCategoryColor(plan.category) === 'orange' ? '#fa8c16' : getCategoryColor(plan.category) === 'blue' ? '#1890ff' : getCategoryColor(plan.category) === 'purple' ? '#722ed1' : '#faad14'}, ${getCategoryColor(plan.category) === 'green' ? '#73d13d' : getCategoryColor(plan.category) === 'orange' ? '#ffc53d' : getCategoryColor(plan.category) === 'blue' ? '#40a9ff' : getCategoryColor(plan.category) === 'purple' ? '#9254de' : '#ffd666'})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '48px'
                }}>
                  {CATEGORIES.find(cat => cat.key === plan.category)?.icon}
                </div>
              }
              actions={[
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => {
                    setSelectedPlan(plan);
                    setModalVisible(true);
                  }}
                  style={{ width: '90%', borderRadius: 8 }}
                >
                  View Details & Subscribe
                </Button>
              ]}
            >
              {plan.popular && (
                <Tag 
                  color="gold" 
                  style={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10, 
                    zIndex: 1,
                    borderRadius: 12
                  }}
                >
                  <StarOutlined /> Popular
                </Tag>
              )}

              <Meta
                title={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{plan.title}</span>
                    <Tag color={getCategoryColor(plan.category)}>
                      {plan.category.replace('-', ' ').toUpperCase()}
                    </Tag>
                  </Box>
                }
                description={
                  <Box>
                    <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
                      {plan.description}
                    </Paragraph>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Text strong style={{ fontSize: '20px', color: '#1890ff' }}>
                        ${plan.price}/month
                      </Text>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarOutlined style={{ color: '#faad14' }} />
                        <Text>{plan.rating}</Text>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <UserOutlined style={{ color: '#666' }} />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {plan.practitionerType}
                        </Text>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ClockCircleOutlined style={{ color: '#666' }} />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {plan.duration}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Plan Details Modal */}
      <Modal
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: '24px' }}>
              {CATEGORIES.find(cat => cat.key === selectedPlan?.category)?.icon}
            </span>
            {selectedPlan?.title}
            {selectedPlan?.popular && (
              <Tag color="gold">
                <StarOutlined /> Popular Choice
              </Tag>
            )}
          </Box>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={700}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="subscribe" 
            type="primary" 
            size="large"
            loading={loading}
            onClick={() => handleSubscribe(selectedPlan)}
            style={{ borderRadius: 8 }}
          >
            Subscribe for ${selectedPlan?.price}/month
          </Button>
        ]}
      >
        {selectedPlan && (
          <Box>
            <Alert
              message="🎉 Ready to start your wellness journey?"
              description="Once you subscribe, we'll create a private consultation room where you can communicate directly with your dedicated practitioner."
              type="info"
              showIcon
              style={{ marginBottom: 24, borderRadius: 8 }}
            />

            <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Price">
                <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                  ${selectedPlan.price} per month
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Duration">{selectedPlan.duration}</Descriptions.Item>
              <Descriptions.Item label="Practitioner">{selectedPlan.practitionerType}</Descriptions.Item>
              <Descriptions.Item label="Rating">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarOutlined style={{ color: '#faad14' }} />
                  <Text>{selectedPlan.rating}/5.0</Text>
                </Box>
              </Descriptions.Item>
            </Descriptions>

            <Title level={4}>What's Included:</Title>
            <Box sx={{ mb: 3 }}>
              {selectedPlan.features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text>{feature}</Text>
                </Box>
              ))}
            </Box>

            <Box sx={{ p: 2, backgroundColor: '#f6ffed', borderRadius: 8, border: '1px solid #b7eb8f' }}>
              <Text strong style={{ color: '#52c41a' }}>
                💬 After subscription, you'll get:
              </Text>
              <ul style={{ marginTop: 8, marginBottom: 0 }}>
                <li>Instant access to your private consultation room</li>
                <li>Direct messaging with your practitioner</li>
                <li>Personalized health plan within 24 hours</li>
                <li>Schedule video calls and appointments</li>
              </ul>
            </Box>
          </Box>
        )}
      </Modal>
    </Box>
  );
};

export default ServicesCatalog;