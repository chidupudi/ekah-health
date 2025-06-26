// src/pages/auth/RegisterPage.jsx
import React from 'react';
import { Layout } from 'antd';
import { Box } from '@mui/material';
import RegisterForm from '../../components/auth/RegisterForm/RegisterForm';

const { Content } = Layout;

const RegisterPage = () => {
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
            maxWidth: 500,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <RegisterForm />
        </Box>
      </Content>
    </Layout>
  );
};

export default RegisterPage;