import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useTheme } from './ParticleBackground';

const Footer = ({
  logo = {
    url: "/",
    title: "EkahHealth"
  },
  sections = null,
  description = "Professional mental health therapy services providing compassionate care and evidence-based treatment for your wellness journey.",
  socialLinks = null,
  copyright = "© 2024 EkahHealth. All rights reserved.",
  legalLinks = null
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        textColor: '#f8fafc',
        mutedTextColor: '#94a3b8',
        borderColor: 'rgba(71, 85, 105, 0.3)',
        hoverColor: '#60a5fa',
        logoColor: '#60a5fa'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        textColor: '#1e293b',
        mutedTextColor: '#64748b',
        borderColor: 'rgba(226, 232, 240, 0.6)',
        hoverColor: '#2563eb',
        logoColor: '#2563eb'
      };
    }
  };

  const themeStyles = getThemeStyles();

  const defaultSections = [
    {
      title: "Services",
      links: [
        { name: "Individual Therapy", href: "/services" },
        { name: "Group Therapy", href: "/services" },
        { name: "Couples Counseling", href: "/services" },
        { name: "Family Therapy", href: "/services" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Support", href: "/contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Book Session", href: "/booking" },
        { name: "Emergency Help", href: "/contact" },
        { name: "FAQ", href: "/contact" },
      ],
    },
  ];

  const defaultSocialLinks = [
    { 
      icon: <InstagramOutlined style={{ fontSize: '20px' }} />, 
      href: "#", 
      label: "Instagram" 
    },
    { 
      icon: <FacebookOutlined style={{ fontSize: '20px' }} />, 
      href: "#", 
      label: "Facebook" 
    },
    { 
      icon: <TwitterOutlined style={{ fontSize: '20px' }} />, 
      href: "#", 
      label: "Twitter" 
    },
    { 
      icon: <LinkedinOutlined style={{ fontSize: '20px' }} />, 
      href: "#", 
      label: "LinkedIn" 
    },
  ];

  const defaultLegalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "HIPAA Compliance", href: "/hipaa" },
  ];

  const finalSections = sections || defaultSections;
  const finalSocialLinks = socialLinks || defaultSocialLinks;
  const finalLegalLinks = legalLinks || defaultLegalLinks;

  const handleNavigation = (href) => {
    if (href.startsWith('/')) {
      navigate(href);
    } else {
      window.open(href, '_blank');
    }
  };

  return (
    <section style={{
      padding: '80px 0',
      background: themeStyles.background,
      borderTop: `1px solid ${themeStyles.borderColor}`
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '40px'
        }}>
          <div style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            {/* Logo and Description Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px',
              minWidth: '300px',
              flex: '1'
            }}>
              {/* Logo */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
              onClick={() => handleNavigation(logo.url)}
              >
                <HeartOutlined style={{
                  fontSize: '32px',
                  color: themeStyles.logoColor
                }} />
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: themeStyles.textColor,
                  margin: 0
                }}>
                  {logo.title}
                </h2>
              </div>

              <p style={{
                maxWidth: '350px',
                fontSize: '14px',
                color: themeStyles.mutedTextColor,
                lineHeight: '1.6',
                margin: 0
              }}>
                {description}
              </p>

              {/* Contact Info */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: themeStyles.mutedTextColor,
                  fontSize: '14px'
                }}>
                  <PhoneOutlined />
                  <span>(555) 123-4567</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: themeStyles.mutedTextColor,
                  fontSize: '14px'
                }}>
                  <MailOutlined />
                  <span>info@ekahhealth.com</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: themeStyles.mutedTextColor,
                  fontSize: '14px'
                }}>
                  <EnvironmentOutlined />
                  <span>123 Wellness St, Health City, HC 12345</span>
                </div>
              </div>

              {/* Social Links */}
              <ul style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                color: themeStyles.mutedTextColor,
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {finalSocialLinks.map((social, idx) => (
                  <li key={idx} style={{
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = themeStyles.hoverColor}
                  onMouseLeave={(e) => e.target.style.color = themeStyles.mutedTextColor}
                  onClick={() => handleNavigation(social.href)}
                  >
                    {social.icon}
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Sections */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '40px',
              flex: '2',
              minWidth: '400px'
            }}>
              {finalSections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 style={{
                    marginBottom: '16px',
                    fontWeight: 'bold',
                    color: themeStyles.textColor,
                    fontSize: '16px',
                    margin: '0 0 16px 0'
                  }}>
                    {section.title}
                  </h3>
                  <ul style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    fontSize: '14px',
                    color: themeStyles.mutedTextColor,
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx} style={{
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = themeStyles.hoverColor}
                      onMouseLeave={(e) => e.target.style.color = themeStyles.mutedTextColor}
                      onClick={() => handleNavigation(link.href)}
                      >
                        {link.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div style={{
            marginTop: '32px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            borderTop: `1px solid ${themeStyles.borderColor}`,
            paddingTop: '32px',
            fontSize: '12px',
            fontWeight: '500',
            color: themeStyles.mutedTextColor,
            flexWrap: 'wrap'
          }}>
            <p style={{ margin: 0 }}>
              {copyright}
            </p>
            <ul style={{
              display: 'flex',
              gap: '24px',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              flexWrap: 'wrap'
            }}>
              {finalLegalLinks.map((link, idx) => (
                <li key={idx} style={{
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = themeStyles.hoverColor}
                onMouseLeave={(e) => e.target.style.color = themeStyles.mutedTextColor}
                onClick={() => handleNavigation(link.href)}
                >
                  {link.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;