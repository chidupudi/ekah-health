





// src/pages/error/NotFoundPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Result, Button } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Content } = Layout;

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
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
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
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
                icon={<ArrowLeftOutlined />}
                onClick={handleGoBack}
                size="large"
              >
                Go Back
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

export default NotFoundPage;