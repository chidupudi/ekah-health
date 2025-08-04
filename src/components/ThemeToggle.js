import React from 'react';
import { Button } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from './ParticleBackground';

const ThemeToggle = ({ style = {} }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="text"
      icon={theme === 'light' ? <BulbOutlined /> : <BulbFilled />}
      onClick={toggleTheme}
      style={{
        color: theme === 'light' ? '#000000' : '#ffffff',
        ...style
      }}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    />
  );
};

export default ThemeToggle;