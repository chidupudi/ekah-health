// src/components/services/ServicesCatalog/ServicesCatalog.jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Tag, Modal, Descriptions, Alert, Spin } from 'antd';
import { 
  HeartOutlined, 
  UserOutlined, 
  ClockCircleOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  StarOutlined,
  CalendarOutlined,
  TeamOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Box } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../services/firebase/config';

const { Title, Text, Paragraph } = Typography;

const ServicesCatalog = ({ onSubscribe }) => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { userProfile } = useAuth();

  // Load programs from Firebase
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        // Listen for real-time updates
        const unsubscribe = onSnapshot(
          query(
            collection(db, 'wellness_programs'),
            where('isActive', '==', true)
          ),
          (snapshot) => {
            const programsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              // Process features and benefits from strings to arrays
              features: typeof doc.data().features === 'string' 
                ? doc.data().features.split('\n').filter(f => f.trim())
                : doc.data().features || [],
              benefits: typeof doc.data().benefits === 'string'
                ? doc.data().benefits.split('\n').filter(b => b.trim())
                : doc.data().benefits || []
            }));
            
            // Sort by popular first, then by creation date
            programsData.sort((a, b) => {
              if (a.popular && !b.popular) return -1;
              if (!a.popular && b.popular) return 1;
              return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            });
            
            setPrograms(programsData);
            setLoading(false);
          },
          (error) => {
            console.error('Error loading programs:', error);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up programs listener:', error);
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  const handleSubscribe = async (program) => {
    setSubscribing(true);
    try {
      await onSubscribe(program);
      setModalVisible(false);
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setSubscribing(false);
    }
  };

  const calculateSavings = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return { savings: 0, percentage: 0 };
    const savings = originalPrice - currentPrice;
    const percentage = Math.round((savings / originalPrice) * 100);
    return { savings, percentage };
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <Spin size="large" />
        <div style={{ marginTop: '1rem' }}>
          <Text>Loading our wellness programs...</Text>
        </div>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏥</div>
        <Title level={3}>No Programs Available</Title>
        <Text type="secondary">
          Our wellness programs are being updated. Please check back soon!
        </Text>
        <div style={{ marginTop: '2rem' }}>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="services-catalog">
      <style jsx>{`
        .services-catalog {
          padding: 0;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }

        .hero-section {
          text-align: center;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          margin-bottom: 4rem;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #fff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.4rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }

        .stats-row {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 3rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          display: block;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .programs-grid {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .program-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,0.12);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(255,255,255,0.2);
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .program-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .popular-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #333;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          z-index: 3;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .card-header {
          height: 200px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          overflow: hidden;
        }

        .card-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }

        .card-body {
          padding: 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .program-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #2c3e50;
        }

        .program-type {
          display: inline-block;
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }

        .program-description {
          color: #6c757d;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .pricing-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .price-main {
          font-size: 2rem;
          font-weight: 800;
          color: #2c3e50;
        }

        .price-original {
          text-decoration: line-through;
          color: #95a5a6;
          font-size: 1rem;
        }

        .savings-badge {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .features-preview {
          margin-bottom: 1.5rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .feature-icon {
          color: #27ae60;
          margin-right: 0.5rem;
        }

        .benefits-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .benefit-tag {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 0.7rem;
        }

        .action-button {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          border: none;
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
        }

        .program-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #7f8c8d;
        }

        .rating-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .rating-stars {
          color: #f39c12;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .stats-row {
            flex-direction: column;
            gap: 1rem;
          }
          
          .programs-grid {
            padding: 0 1rem;
          }
          
          .card-body {
            padding: 1.5rem;
          }
          
          .program-card:hover {
            transform: translateY(-8px) scale(1.01);
          }
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Transform Your Health Journey</h1>
          <p className="hero-subtitle">
            Discover our carefully crafted wellness programs designed by certified experts 
            to help you achieve optimal health and vitality.
          </p>
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Happy Clients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="programs-grid">
        <Row gutter={[32, 32]}>
          {programs.map(program => {
            const { savings, percentage } = calculateSavings(program.originalPrice, program.price);
            
            return (
              <Col xs={24} md={12} lg={6} key={program.id}>
                <div 
                  className="program-card"
                  onMouseEnter={() => setHoveredCard(program.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {program.popular && (
                    <div className="popular-badge">
                      ⭐ Most Popular
                    </div>
                  )}
                  
                  <div 
                    className="card-header"
                    style={{ background: program.gradient || 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)' }}
                  >
                    <div>
                      <div className="card-icon">{program.icon || '👩‍⚕️'}</div>
                      <h3 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>
                        {program.type || 'Wellness Program'}
                      </h3>
                    </div>
                  </div>

                  <div className="card-body">
                    <h3 className="program-title">{program.title}</h3>
                    
                    <div className="program-type">{program.duration}</div>
                    
                    <div className="program-details">
                      <span>
                        <CalendarOutlined /> {program.duration_details || program.duration}
                      </span>
                      <div className="rating-section">
                        <span className="rating-stars">★</span>
                        <span>{program.rating || 4.5}</span>
                      </div>
                    </div>

                    <p className="program-description">{program.description}</p>

                    <div className="pricing-section">
                      <div>
                        <div className="price-main">${program.price}</div>
                        {program.originalPrice > program.price && (
                          <div className="price-original">${program.originalPrice}</div>
                        )}
                      </div>
                      {percentage > 0 && (
                        <div className="savings-badge">
                          Save {percentage}%
                        </div>
                      )}
                    </div>

                    <div className="features-preview">
                      {program.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="feature-item">
                          <CheckCircleOutlined className="feature-icon" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {program.features.length > 3 && (
                        <div className="feature-item">
                          <span style={{ color: '#3498db' }}>
                            +{program.features.length - 3} more features
                          </span>
                        </div>
                      )}
                    </div>

                    {program.benefits && program.benefits.length > 0 && (
                      <div className="benefits-row">
                        {program.benefits.map((benefit, index) => (
                          <span key={index} className="benefit-tag">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    )}

                    <button 
                      className="action-button"
                      onClick={() => {
                        setSelectedProgram(program);
                        setModalVisible(true);
                      }}
                    >
                      Choose This Program
                    </button>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>

      {/* Program Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>{selectedProgram?.icon || '👩‍⚕️'}</span>
            <div>
              <h2 style={{ margin: 0, color: '#2c3e50' }}>{selectedProgram?.title}</h2>
              <p style={{ margin: 0, color: '#7f8c8d' }}>{selectedProgram?.type} Program</p>
            </div>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)} size="large">
            Cancel
          </Button>,
          <Button 
            key="subscribe" 
            type="primary" 
            size="large"
            loading={subscribing}
            onClick={() => handleSubscribe(selectedProgram)}
            style={{ 
              background: selectedProgram?.gradient || 'linear-gradient(135deg, #e74c3c, #c0392b)',
              border: 'none',
              borderRadius: '8px',
              height: '48px',
              paddingLeft: '32px',
              paddingRight: '32px'
            }}
          >
            Start Your Journey - ${selectedProgram?.price}
          </Button>
        ]}
      >
        {selectedProgram && (
          <div>
            <Alert
              message="🎉 Ready to Transform Your Health?"
              description="Join thousands of satisfied clients who have transformed their lives with our expert-designed programs."
              type="success"
              showIcon
              style={{ marginBottom: 24, borderRadius: 12 }}
            />

            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Descriptions 
                  title="Program Details" 
                  bordered 
                  column={1}
                  style={{ marginBottom: 24 }}
                >
                  <Descriptions.Item label="Investment">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2c3e50' }}>
                        ${selectedProgram.price}
                      </span>
                      {selectedProgram.originalPrice > selectedProgram.price && (
                        <>
                          <span style={{ textDecoration: 'line-through', color: '#95a5a6' }}>
                            ${selectedProgram.originalPrice}
                          </span>
                          <Tag color="red">
                            {calculateSavings(selectedProgram.originalPrice, selectedProgram.price).percentage}% OFF
                          </Tag>
                        </>
                      )}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Duration">{selectedProgram.duration}</Descriptions.Item>
                  <Descriptions.Item label="Sessions">{selectedProgram.sessionsIncluded} sessions included</Descriptions.Item>
                  <Descriptions.Item label="Expert">{selectedProgram.practitionerType}</Descriptions.Item>
                  <Descriptions.Item label="Rating">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StarOutlined style={{ color: '#f39c12' }} />
                      <span>{selectedProgram.rating}/5.0</span>
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </Col>

              <Col xs={24} md={12}>
                <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>What You'll Get:</h3>
                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {selectedProgram.features.map((feature, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      marginBottom: '0.5rem',
                      padding: '8px',
                      background: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <CheckCircleOutlined style={{ color: '#27ae60' }} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>

            {selectedProgram.benefits && selectedProgram.benefits.length > 0 && (
              <div style={{ 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginTop: '1.5rem'
              }}>
                <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>🎯 Why Choose This Program?</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedProgram.benefits.map((benefit, index) => (
                    <Tag key={index} color="blue" style={{ margin: '2px' }}>
                      {benefit}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <Alert
              message="💡 Satisfaction Guarantee"
              description="Not satisfied with your program? Get a full refund within the first 7 days. Your health journey should be risk-free!"
              type="info"
              showIcon
              style={{ marginTop: 16, borderRadius: 8 }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServicesCatalog;