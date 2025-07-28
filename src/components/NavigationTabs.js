import React from 'react';
import { 
  HeartOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  CustomerServiceOutlined,
  HomeOutlined,
  SafetyOutlined 
} from '@ant-design/icons';
import { ExpandableTabs } from './ui/expandable-tabs';

// Convert Ant Design icons to work with our component
const IconWrapper = ({ AntIcon, ...props }) => {
  return <AntIcon {...props} style={{ fontSize: '18px', ...props.style }} />;
};

const NavigationTabs = ({ className = '', activeColor = '' }) => {
  const therapyTabs = [
    { 
      title: "Home", 
      icon: (props) => <IconWrapper AntIcon={HomeOutlined} {...props} />
    },
    { 
      title: "About", 
      icon: (props) => <IconWrapper AntIcon={UserOutlined} {...props} />
    },
    { type: "separator" },
    { 
      title: "Services", 
      icon: (props) => <IconWrapper AntIcon={HeartOutlined} {...props} />
    },
    { 
      title: "Booking", 
      icon: (props) => <IconWrapper AntIcon={CalendarOutlined} {...props} />
    },
    { type: "separator" },
    { 
      title: "Contact", 
      icon: (props) => <IconWrapper AntIcon={CustomerServiceOutlined} {...props} />
    },
    { 
      title: "Support", 
      icon: (props) => <IconWrapper AntIcon={SafetyOutlined} {...props} />
    }
  ];

  return (
    <ExpandableTabs 
      tabs={therapyTabs}
      activeColor={activeColor}
      className={className}
    />
  );
};

export default NavigationTabs;