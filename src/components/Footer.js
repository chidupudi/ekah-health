import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined
} from '@ant-design/icons';
import { useTheme } from './ParticleBackground';

const Footer = ({
  logo = {
    url: "/",
    title: "EkahHealth"
  },
  sections = null,
  description = "Professional mental health therapy services providing compassionate care for your wellness journey.",
  socialLinks = null,
  copyright = "© 2024 EkahHealth. All rights reserved.",
  legalLinks = null
}) => {
  const navigate = useNavigate();
  const { theme, getThemeStyles } = useTheme();
  const themeStyles = getThemeStyles();

  const defaultSections = [
    {
      title: "Services",
      links: [
        { name: "Individual Therapy", href: "/services" },
        { name: "Group Therapy", href: "/services" },
        { name: "Couples Counseling", href: "/services" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
        { name: "Book Session", href: "/booking" },
      ],
    },
  ];

  const defaultSocialLinks = [
    { 
      icon: <InstagramOutlined style={{ fontSize: '18px' }} />, 
      href: "#", 
      label: "Instagram" 
    },
    { 
      icon: <FacebookOutlined style={{ fontSize: '18px' }} />, 
      href: "#", 
      label: "Facebook" 
    },
    { 
      icon: <TwitterOutlined style={{ fontSize: '18px' }} />, 
      href: "#", 
      label: "Twitter" 
    },
    { 
      icon: <LinkedinOutlined style={{ fontSize: '18px' }} />, 
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
      padding: '32px 0', // Reduced from 80px to 32px
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
          gap: '24px' // Reduced from 40px
        }}>
          <div style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '32px', // Reduced from 40px
            flexWrap: 'wrap'
                      }}>
            {/* Logo and Description Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px', // Reduced from 24px
              minWidth: '280px', // Reduced from 300px
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
                  fontSize: '28px', // Reduced from 32px
                  color: themeStyles.accentPrimary
                }} />
                <h2 style={{
                  fontSize: '20px', // Reduced from 24px
                  fontWeight: '600',
                  color: themeStyles.textPrimary,
                  margin: 0
                }}>
                  {logo.title}
                </h2>
              </div>

              <p style={{
                maxWidth: '320px', // Reduced from 350px
                fontSize: '14px',
                color: themeStyles.textSecondary,
                lineHeight: '1.5', // Reduced from 1.6
                margin: 0
              }}>
                {description}
              </p>

              {/* Social Links */}
              <ul style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px', // Reduced from 24px
                color: themeStyles.textSecondary,
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
                  onMouseEnter={(e) => e.target.style.color = themeStyles.accentPrimary}
                  onMouseLeave={(e) => e.target.style.color = themeStyles.textSecondary}
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', // Reduced from 150px
              gap: '32px',
              flex: '1.5', // Reduced from 2
              minWidth: '300px' // Reduced from 400px
            }}>
              {finalSections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 style={{
                    marginBottom: '12px', // Reduced from 16px
                    fontWeight: 'bold',
                    color: themeStyles.textPrimary,
                    fontSize: '15px', // Reduced from 16px
                    margin: '0 0 12px 0'
                  }}>
                    {section.title}
                  </h3>
                  <ul style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px', // Reduced from 12px
                    fontSize: '13px', // Reduced from 14px
                    color: themeStyles.textSecondary,
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
            marginTop: '20px', // Reduced from 32px
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            borderTop: `1px solid ${themeStyles.borderColor}`,
            paddingTop: '20px', // Reduced from 32px
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
              gap: '20px', // Reduced from 24px
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