// src/components/consultation/ConsultationRoom/ConsultationRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Card, Input, Button, Typography, Avatar, List, Upload, Tag, Space, Divider } from 'antd';
import { 
  SendOutlined, 
  UserOutlined, 
  PaperClipOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
  ArrowLeftOutlined,
  RobotOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  getDoc,
  updateDoc 
} from 'firebase/firestore';
import { db } from '../../../services/firebase/config';
import { useAuth } from '../../../context/AuthContext';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const ConsultationRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [practitionerInfo, setPractitionerInfo] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch room data
  useEffect(() => {
    if (!roomId) return;

    const fetchRoomData = async () => {
      try {
        const roomDoc = await getDoc(doc(db, 'consultation_rooms', roomId));
        if (roomDoc.exists()) {
          const data = roomDoc.data();
          setRoomData(data);
          
          // If practitioner is assigned, fetch their info
          if (data.practitionerId) {
            const practitionerDoc = await getDoc(doc(db, 'practitioners', data.practitionerId));
            if (practitionerDoc.exists()) {
              setPractitionerInfo(practitionerDoc.data());
            }
          }
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRoomData();
  }, [roomId]);

  // Listen for messages
  useEffect(() => {
    if (!roomId) return;

    const messagesQuery = query(
      collection(db, 'messages'),
      where('roomId', '==', roomId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
      
      // Mark messages as read
      snapshot.docs.forEach(async (doc) => {
        const message = doc.data();
        if (message.sender !== currentUser.uid && !message.read) {
          await updateDoc(doc.ref, { read: true });
        }
      });
    });

    return () => unsubscribe();
  }, [roomId, currentUser]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    try {
      const messageData = {
        roomId,
        content: newMessage.trim(),
        sender: currentUser.uid,
        senderName: userProfile.displayName,
        senderType: 'client',
        timestamp: new Date().toISOString(),
        type: 'text',
        read: false
      };

      await addDoc(collection(db, 'messages'), messageData);
      
      // Update room's last activity
      await updateDoc(doc(db, 'consultation_rooms', roomId), {
        lastActivity: new Date().toISOString()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getMessageAvatar = (message) => {
    if (message.type === 'system') {
      return <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />;
    } else if (message.senderType === 'practitioner') {
      return <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />;
    } else {
      return <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#722ed1' }} />;
    }
  };

  if (!roomData) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading consultation room...</Text>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/client/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Divider type="vertical" />
          <Title level={4} style={{ margin: 0 }}>
            {roomData.planTitle}
          </Title>
          <Tag color="green">Active</Tag>
        </Box>

        <Space>
          {practitionerInfo ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <Text strong>{practitionerInfo.displayName}</Text>
              <Text type="secondary">({roomData.practitionerType})</Text>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#d9d9d9' }} />
              <Text type="secondary">Practitioner will be assigned soon</Text>
            </Box>
          )}
          
          <Button 
            type="primary" 
            icon={<VideoCameraOutlined />}
            disabled={!practitionerInfo}
          >
            Video Call
          </Button>
        </Space>
      </Header>

      {/* Messages Area */}
      <Content style={{ 
        padding: '24px',
        background: '#f0f2f5',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Card 
          style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 12,
            overflow: 'hidden'
          }}
          bodyStyle={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 0
          }}
        >
          {/* Messages List */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '16px',
            maxHeight: 'calc(100vh - 300px)'
          }}>
            <List
              dataSource={messages}
              renderItem={(message) => (
                <List.Item style={{ 
                  border: 'none',
                  padding: '8px 0',
                  display: 'flex',
                  justifyContent: message.sender === currentUser.uid ? 'flex-end' : 'flex-start'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    gap: 1,
                    maxWidth: '70%',
                    flexDirection: message.sender === currentUser.uid ? 'row-reverse' : 'row'
                  }}>
                    {getMessageAvatar(message)}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: message.sender === currentUser.uid ? 'flex-end' : 'flex-start'
                    }}>
                      <Box sx={{
                        background: message.type === 'system' 
                          ? '#f6ffed' 
                          : message.sender === currentUser.uid 
                          ? '#1890ff' 
                          : '#fff',
                        color: message.sender === currentUser.uid && message.type !== 'system' 
                          ? 'white' 
                          : 'inherit',
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: message.type === 'system' ? '1px solid #b7eb8f' : '1px solid #d9d9d9',
                        marginBottom: '4px',
                        maxWidth: '100%',
                        wordBreak: 'break-word'
                      }}>
                        {message.type === 'system' && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <RobotOutlined style={{ color: '#52c41a' }} />
                            <Text strong style={{ color: '#52c41a' }}>System</Text>
                          </Box>
                        )}
                        <Text style={{ 
                          color: message.sender === currentUser.uid && message.type !== 'system' 
                            ? 'white' 
                            : 'inherit',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {message.content}
                        </Text>
                      </Box>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {message.type !== 'system' && message.senderName} {formatTimestamp(message.timestamp)}
                        {message.sender === currentUser.uid && message.read && (
                          <CheckCircleOutlined style={{ marginLeft: 4, color: '#52c41a' }} />
                        )}
                      </Text>
                    </Box>
                  </Box>
                </List.Item>
              )}
            />
            <div ref={messagesEndRef} />
          </Box>

          {/* Message Input */}
          <Box sx={{ 
            borderTop: '1px solid #f0f0f0', 
            padding: '16px',
            background: '#fafafa'
          }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextArea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                autoSize={{ minRows: 1, maxRows: 4 }}
                style={{ flex: 1, borderRadius: 8 }}
              />
              
              <Upload disabled>
                <Button icon={<PaperClipOutlined />} />
              </Upload>
              
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                loading={loading}
                disabled={!newMessage.trim()}
                style={{ borderRadius: 8 }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Card>
      </Content>
    </Layout>
  );
};

export default ConsultationRoom;