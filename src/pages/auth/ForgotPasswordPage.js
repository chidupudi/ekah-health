// src/pages/auth/ForgotPasswordPage.jsx
import React from 'react';
import { Layout } from 'antd';
import { Box } from '@mui/material';
import ForgotPassword from '../../components/auth/ForgotPassword/ForgotPassword';

const { Content } = Layout;

const ForgotPasswordPage = () => {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ForgotPassword />
        </Box>
      </Content>
    </Layout>
  );
};
export default ForgotPasswordPage;