import React from 'react';
import { Button } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from './ParticleBackground';

const ThemeToggle = ({ style = {} }) => {
  const { theme, toggleTheme, getThemeStyles } = useTheme();
  const themeStyles = getThemeStyles();

  return (
    <Button
      type="text"
      icon={theme === 'light' ? <BulbOutlined /> : <BulbFilled />}
      onClick={toggleTheme}
      style={{
        color: themeStyles.textPrimary,
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = themeStyles.listItemHover;
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    />
  );
};

export default ThemeToggle;