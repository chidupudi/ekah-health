// src/components/JitsiMeeting.js - Jitsi Video Meeting Component
import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Typography, Space, Alert, Modal, Spin } from 'antd';
import { 
  VideoCameraOutlined, 
  AudioOutlined, 
  PhoneOutlined, 
  FullscreenOutlined,
  SettingOutlined,
  UserOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const JitsiMeeting = ({ 
  roomName, 
  displayName, 
  password, 
  onMeetingEnd, 
  onMeetingJoined,
  width = '100%',
  height = '500px',
  showPreJoin = true,
  startWithAudioMuted = false,
  startWithVideoMuted = false 
}) => {
  const jitsiContainerRef = useRef(null);
  const [jitsiApi, setJitsiApi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load Jitsi Meet API script
  useEffect(() => {
    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadJitsiScript()
      .then(() => {
        initializeJitsi();
      })
      .catch((error) => {
        console.error('Failed to load Jitsi script:', error);
        setHasError(true);
        setErrorMessage('Failed to load video meeting. Please refresh the page and try again.');
        setIsLoading(false);
      });

    // Cleanup on unmount
    return () => {
      if (jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [roomName, displayName]);

  const initializeJitsi = () => {
    if (!window.JitsiMeetExternalAPI) {
      setHasError(true);
      setErrorMessage('Jitsi Meet API not available');
      setIsLoading(false);
      return;
    }

    try {
      const domain = 'meet.jit.si';
      
      const options = {
        roomName: roomName,
        width: '100%',
        height: height,
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: startWithAudioMuted,
          startWithVideoMuted: startWithVideoMuted,
          prejoinPageEnabled: showPreJoin,
          requireDisplayName: true,
          disableThirdPartyRequests: true,
          enableWelcomePage: false,
          enableClosePage: false,
          defaultLanguage: 'en',
          // UI customization
          toolbarButtons: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 
            'fullscreen', 'fodeviceselection', 'hangup', 'chat',
            'recording', 'livestreaming', 'etherpad', 'sharedvideo',
            'settings', 'raisehand', 'videoquality', 'filmstrip',
            'feedback', 'stats', 'shortcuts', 'tileview', 'videobackgroundblur',
            'download', 'help', 'mute-everyone'
          ]
        },
        interfaceConfigOverwrite: {
          BRAND_WATERMARK_LINK: '',
          SHOW_BRAND_WATERMARK: false,
          SHOW_JITSI_WATERMARK: false,
          SHOW_POWERED_BY: false,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_WELCOME_PAGE_LOGO_URL: '',
          APP_NAME: 'EkahHealth Video Consultation',
          NATIVE_APP_NAME: 'EkahHealth',
          DEFAULT_LOGO_URL: '',
          MOBILE_APP_PROMO: false
        },
        userInfo: {
          displayName: displayName || 'Patient'
        }
      };

      console.log('Initializing Jitsi with options:', options);

      const api = new window.JitsiMeetExternalAPI(domain, options);
      setJitsiApi(api);

      // Event listeners
      api.addEventListeners({
        readyToClose: () => {
          console.log('Jitsi meeting ended');
          setIsJoined(false);
          if (onMeetingEnd) {
            onMeetingEnd();
          }
        },
        participantJoined: (participant) => {
          console.log('Participant joined:', participant);
          setParticipantCount(prev => prev + 1);
          if (!isJoined) {
            setIsJoined(true);
            if (onMeetingJoined) {
              onMeetingJoined();
            }
          }
        },
        participantLeft: (participant) => {
          console.log('Participant left:', participant);
          setParticipantCount(prev => Math.max(0, prev - 1));
        },
        videoConferenceJoined: (participant) => {
          console.log('Local participant joined:', participant);
          setIsJoined(true);
          setIsLoading(false);
          if (onMeetingJoined) {
            onMeetingJoined();
          }
        },
        videoConferenceLeft: () => {
          console.log('Local participant left');
          setIsJoined(false);
          if (onMeetingEnd) {
            onMeetingEnd();
          }
        }
      });

      // Set password if provided
      if (password) {
        api.executeCommand('password', password);
      }

    } catch (error) {
      console.error('Error initializing Jitsi:', error);
      setHasError(true);
      setErrorMessage(`Failed to initialize video meeting: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleEndMeeting = () => {
    Modal.confirm({
      title: 'End Meeting?',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to end the video consultation?',
      okText: 'End Meeting',
      cancelText: 'Stay',
      onOk: () => {
        if (jitsiApi) {
          jitsiApi.executeCommand('hangup');
        }
      }
    });
  };

  const handleToggleAudio = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleAudio');
    }
  };

  const handleToggleVideo = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleVideo');
    }
  };

  const handleToggleFullScreen = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleFilmStrip');
    }
  };

  if (hasError) {
    return (
      <Card>
        <Alert
          message="Video Meeting Error"
          description={errorMessage}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          }
        />
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Title level={4}>Alternative Ways to Join:</Title>
          <Space direction="vertical" size="middle">
            <Text>
              📱 <strong>Mobile App:</strong> Download "Jitsi Meet" from your app store
            </Text>
            <Text>
              🌐 <strong>Direct Link:</strong> <a href={`https://meet.jit.si/${roomName}`} target="_blank" rel="noopener noreferrer">
                Open in new tab
              </a>
            </Text>
            <Text>
              📞 <strong>Phone Support:</strong> +91 63617 43098
            </Text>
          </Space>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      style={{ width: '100%' }}
      bodyStyle={{ padding: '12px' }}
      title={
        <Space>
          <VideoCameraOutlined />
          EkahHealth Video Consultation
          {isJoined && (
            <Text type="secondary" style={{ fontSize: '14px' }}>
              • {participantCount + 1} participant(s)
            </Text>
          )}
        </Space>
      }
      extra={
        isJoined && (
          <Space>
            <Button size="small" icon={<AudioOutlined />} onClick={handleToggleAudio} title="Toggle Audio" />
            <Button size="small" icon={<VideoCameraOutlined />} onClick={handleToggleVideo} title="Toggle Video" />
            <Button size="small" icon={<FullscreenOutlined />} onClick={handleToggleFullScreen} title="Toggle Fullscreen" />
            <Button size="small" danger icon={<PhoneOutlined />} onClick={handleEndMeeting} title="End Meeting" />
          </Space>
        )
      }
    >
      {isLoading && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: height,
          flexDirection: 'column',
          gap: '16px'
        }}>
          <Spin size="large" />
          <Text>Loading video meeting...</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Make sure your camera and microphone are enabled
          </Text>
        </div>
      )}
      
      <div 
        ref={jitsiContainerRef} 
        style={{ 
          width: '100%', 
          height: height,
          display: isLoading ? 'none' : 'block'
        }} 
      />
      
      {!isJoined && !isLoading && (
        <Alert
          message="Waiting to join meeting"
          description="Please allow camera and microphone access when prompted, then click 'Join meeting'"
          type="info"
          showIcon
          style={{ marginTop: '10px' }}
        />
      )}
    </Card>
  );
};

// Meeting Room Component - Full page meeting experience
export const JitsiMeetingRoom = ({ 
  roomName, 
  displayName, 
  password,
  onBack
}) => {
  const [meetingJoined, setMeetingJoined] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);

  const handleMeetingJoined = () => {
    setMeetingJoined(true);
    console.log('Patient joined the meeting');
  };

  const handleMeetingEnd = () => {
    setMeetingEnded(true);
    console.log('Meeting ended');
    
    // Show thank you message for a moment, then go back
    setTimeout(() => {
      if (onBack) {
        onBack();
      }
    }, 3000);
  };

  if (meetingEnded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <Card style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
            <Title level={2}>Consultation Complete</Title>
            <Paragraph>
              Thank you for using EkahHealth video consultation. 
              Your session has ended successfully.
            </Paragraph>
            <Paragraph type="secondary">
              You will receive a summary via email shortly.
            </Paragraph>
            <Button 
              type="primary" 
              size="large" 
              onClick={onBack}
              style={{ marginTop: '20px' }}
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <Card style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                <UserOutlined style={{ marginRight: '8px' }} />
                Welcome, {displayName}
              </Title>
              <Text type="secondary">EkahHealth Video Consultation</Text>
            </div>
            <div>
              <Button onClick={onBack} style={{ marginRight: '10px' }}>
                Back to Bookings
              </Button>
              <Text type="secondary">Room: {roomName}</Text>
            </div>
          </div>
        </Card>

        {/* Meeting Instructions (shown before joining) */}
        {!meetingJoined && (
          <Card style={{ marginBottom: '20px' }}>
            <Alert
              message="Getting Ready for Your Consultation"
              description={
                <div>
                  <Paragraph>
                    🎥 <strong>Camera & Audio:</strong> Please allow access to your camera and microphone when prompted
                  </Paragraph>
                  <Paragraph>
                    👨‍⚕️ <strong>Doctor Will Join:</strong> Your healthcare provider will join the meeting shortly
                  </Paragraph>
                  <Paragraph>
                    🔧 <strong>Technical Issues?</strong> Contact support at +91 63617 43098
                  </Paragraph>
                </div>
              }
              type="info"
              showIcon
            />
          </Card>
        )}

        {/* Main Meeting Container */}
        <JitsiMeeting
          roomName={roomName}
          displayName={displayName}
          password={password}
          onMeetingJoined={handleMeetingJoined}
          onMeetingEnd={handleMeetingEnd}
          width="100%"
          height="600px"
          showPreJoin={true}
          startWithAudioMuted={true}
          startWithVideoMuted={false}
        />

        {/* Meeting Status */}
        {meetingJoined && (
          <Card style={{ marginTop: '20px' }}>
            <Alert
              message="Consultation In Progress"
              description="Your video consultation is now active. The doctor can see and hear you."
              type="success"
              showIcon
            />
          </Card>
        )}
      </div>
    </div>
  );
};

// Pre-join Meeting Component - Shows before entering the meeting
export const JitsiPreJoin = ({ 
  roomName, 
  displayName, 
  onJoinMeeting,
  meetingPassword
}) => {
  const [userName, setUserName] = useState(displayName || '');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinMeeting = () => {
    if (!userName.trim()) {
      Modal.warning({
        title: 'Name Required',
        content: 'Please enter your name to join the meeting.'
      });
      return;
    }

    setIsJoining(true);
    if (onJoinMeeting) {
      onJoinMeeting(userName.trim());
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      <Card style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎥</div>
          <Title level={2}>Join Video Consultation</Title>
          <Paragraph type="secondary" style={{ marginBottom: '30px' }}>
            You're about to join your EkahHealth video consultation
          </Paragraph>

          <div style={{ marginBottom: '24px' }}>
            <Text strong>Meeting Room: </Text>
            <Text code>{roomName}</Text>
          </div>

          {meetingPassword && (
            <div style={{ marginBottom: '24px' }}>
              <Text strong>Password: </Text>
              <Text code>{meetingPassword}</Text>
            </div>
          )}

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                Enter Your Name:
              </Text>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your full name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleJoinMeeting();
                  }
                }}
              />
            </div>

            <Button 
              type="primary" 
              size="large" 
              onClick={handleJoinMeeting}
              loading={isJoining}
              disabled={!userName.trim()}
              style={{ width: '100%', height: '48px', fontSize: '16px' }}
            >
              {isJoining ? 'Joining Meeting...' : 'Join Video Meeting'}
            </Button>
          </Space>

          <div style={{ marginTop: '30px', padding: '16px', background: '#f6f8fa', borderRadius: '8px' }}>
            <Title level={5} style={{ margin: '0 0 10px 0' }}>Before You Join:</Title>
            <div style={{ textAlign: 'left' }}>
              <Text>🎧 <strong>Audio:</strong> Enable microphone access</Text><br/>
              <Text>📹 <strong>Video:</strong> Enable camera access</Text><br/>
              <Text>🌐 <strong>Browser:</strong> Chrome or Firefox recommended</Text><br/>
              <Text>📱 <strong>Mobile:</strong> Download Jitsi Meet app for better experience</Text>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JitsiMeeting;