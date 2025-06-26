// src/pages/error/ErrorPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Result, Button } from 'antd';
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';

const { Content } = Layout;

const ErrorPage = ({ error, resetError }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (resetError) resetError();
    navigate('/dashboard');
  };

  const handleReload = () => {
    if (resetError) resetError();
    window.location.reload();
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '50px',
        }}
      >
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong. Please try again later."
          extra={
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Button 
                type="primary" 
                icon={<HomeOutlined />}
                onClick={handleGoHome}
                size="large"
              >
                Back Home
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={handleReload}
                size="large"
              >
                Reload Page
              </Button>
            </div>
          }
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        />
      </Content>
    </Layout>
  );
};

export default ErrorPage;