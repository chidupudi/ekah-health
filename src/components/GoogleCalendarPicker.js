import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Button,
  Space,
  Alert,
  Spin,
  Badge,
  message,
  Select,
  Switch
} from 'antd';
import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  GoogleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useTheme } from './ParticleBackground';
import moment from 'moment';
import googleCalendarService from '../services/googleCalendar';

const { Title, Text } = Typography;
const { Option } = Select;

const GoogleCalendarPicker = ({ 
  onSlotSelect, 
  selectedSlot, 
  disabled = false,
  duration = 60, // appointment duration in minutes
  workingHours = { start: '09:00', end: '17:00' }
}) => {
  const { theme } = useTheme();
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState(['primary']);
  const [useGoogleCalendar, setUseGoogleCalendar] = useState(false);
  const [status, setStatus] = useState({ isInitialized: false, isSignedIn: false });

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'rgba(67, 127, 151, 0.08)',
        cardBg: 'rgba(67, 127, 151, 0.12)',
        cardBorder: 'rgba(67, 127, 151, 0.25)',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        primaryColor: '#437F97',
        accentColor: '#FFB5C2',
        availableSlot: '#52c41a',
        selectedSlot: '#1890ff',
        disabledSlot: '#8c8c8c',
      };
    } else {
      return {
        background: 'rgba(67, 127, 151, 0.05)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(67, 127, 151, 0.15)',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        primaryColor: '#437F97',
        accentColor: '#FFB5C2',
        availableSlot: '#52c41a',
        selectedSlot: '#1890ff',
        disabledSlot: '#8c8c8c',
      };
    }
  };

  const themeStyles = getThemeStyles();

  useEffect(() => {
    // Check Google Calendar configuration
    const config = localStorage.getItem('googleCalendarConfig');
    if (config) {
      const parsedConfig = JSON.parse(config);
      setUseGoogleCalendar(parsedConfig.enabled);
    }
    
    // Monitor Google Calendar status
    const interval = setInterval(() => {
      setStatus(googleCalendarService.getSignInStatus());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status.isSignedIn && useGoogleCalendar) {
      loadCalendars();
    }
  }, [status.isSignedIn, useGoogleCalendar]);

  useEffect(() => {
    loadAvailableSlots();
  }, [currentWeek, selectedCalendars, useGoogleCalendar, status]);

  const loadCalendars = async () => {
    try {
      const userCalendars = await googleCalendarService.getCalendars();
      setCalendars(userCalendars);
    } catch (error) {
      console.error('Error loading calendars:', error);
    }
  };

  const loadAvailableSlots = useCallback(async () => {
    if (!useGoogleCalendar || !status.isSignedIn) {
      // Fallback to basic time slots when Google Calendar is not available
      generateBasicTimeSlots();
      return;
    }

    try {
      setLoading(true);
      
      const startDate = currentWeek.format('YYYY-MM-DD');
      const endDate = currentWeek.clone().add(6, 'days').format('YYYY-MM-DD');
      
      const timeMin = currentWeek.clone().startOf('day').toISOString();
      const timeMax = currentWeek.clone().add(6, 'days').endOf('day').toISOString();
      
      console.log('Loading Google Calendar slots for:', { startDate, endDate, timeMin, timeMax });
      
      // Find available slots using Google Calendar free/busy API
      const slots = await googleCalendarService.findAvailableSlots(
        selectedCalendars,
        duration,
        timeMin,
        timeMax,
        workingHours
      );
      
      console.log('Google Calendar available slots:', slots);
      
      // Filter out past slots
      const now = moment();
      const futureSlots = slots.filter(slot => {
        const slotDateTime = moment(slot.start);
        return slotDateTime.isAfter(now);
      });
      
      // Group slots by date
      const slotsByDate = futureSlots.reduce((acc, slot) => {
        if (!acc[slot.date]) {
          acc[slot.date] = [];
        }
        acc[slot.date].push({
          date: slot.date,
          time: slot.time,
          start: slot.start,
          end: slot.end
        });
        return acc;
      }, {});
      
      setAvailableSlots(slotsByDate);
      
      if (Object.keys(slotsByDate).length === 0) {
        message.warning('No available time slots found based on your Google Calendar.');
      }
    } catch (error) {
      console.error('Error loading Google Calendar slots:', error);
      message.error(`Failed to load calendar availability: ${error.message}`);
      // Fallback to basic slots on error
      generateBasicTimeSlots();
    } finally {
      setLoading(false);
    }
  }, [currentWeek, selectedCalendars, duration, workingHours, useGoogleCalendar, status]);

  const generateBasicTimeSlots = () => {
    const slots = {};
    const weekDays = generateWeekDays();
    
    weekDays.forEach(day => {
      if (day.day() === 0 || day.day() === 6) return; // Skip weekends
      if (day.isBefore(moment(), 'day')) return; // Skip past days
      
      const dateStr = day.format('YYYY-MM-DD');
      const daySlots = [];
      
      const startHour = parseInt(workingHours.start.split(':')[0]);
      const endHour = parseInt(workingHours.end.split(':')[0]);
      
      for (let hour = startHour; hour < endHour; hour++) {
        const slotTime = `${hour.toString().padStart(2, '0')}:00`;
        const slotDateTime = moment(`${dateStr} ${slotTime}`, 'YYYY-MM-DD HH:mm');
        
        if (slotDateTime.isAfter(moment())) {
          daySlots.push({
            date: dateStr,
            time: slotTime,
            start: slotDateTime.toISOString(),
            end: slotDateTime.clone().add(duration, 'minutes').toISOString()
          });
        }
      }
      
      if (daySlots.length > 0) {
        slots[dateStr] = daySlots;
      }
    });
    
    setAvailableSlots(slots);
  };

  const generateWeekDays = () => {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = currentWeek.clone().add(i, 'days');
      weekDays.push(day);
    }
    return weekDays;
  };

  const handleSlotClick = (slot) => {
    if (disabled) return;
    
    const slotInfo = {
      date: slot.date,
      time: slot.time,
      start: slot.start,
      end: slot.end,
      dateTime: moment(slot.start)
    };
    
    setSelectedDate(slot.date);
    onSlotSelect(slotInfo);
  };

  const handleRefresh = () => {
    loadAvailableSlots();
  };

  const weekDays = generateWeekDays();

  return (
    <div style={{
      background: themeStyles.background,
      borderRadius: '16px',
      padding: '24px'
    }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={4} style={{ color: themeStyles.textPrimary, margin: 0 }}>
            <Space>
              {useGoogleCalendar ? <GoogleOutlined /> : <CalendarOutlined />}
              Select Date & Time
            </Space>
          </Title>
          <Text style={{ color: themeStyles.textSecondary }}>
            {useGoogleCalendar ? 'Integrated with Google Calendar' : 'Basic calendar view'}
          </Text>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<SyncOutlined />}
              onClick={handleRefresh}
              loading={loading}
              disabled={disabled}
            >
              Refresh
            </Button>
            <Button
              icon={<LeftOutlined />}
              onClick={() => setCurrentWeek(prev => prev.clone().subtract(1, 'week'))}
              disabled={currentWeek.isSameOrBefore(moment(), 'week')}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentWeek(moment().startOf('week'))}
            >
              This Week
            </Button>
            <Button
              icon={<RightOutlined />}
              onClick={() => setCurrentWeek(prev => prev.clone().add(1, 'week'))}
            >
              Next
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Google Calendar Status */}
      {useGoogleCalendar && (
        <Alert
          message={
            <Space>
              <GoogleOutlined style={{ color: '#4285f4' }} />
              <Text>
                Google Calendar Integration: {status.isSignedIn ? 'Connected' : 'Not Connected'}
              </Text>
              {status.isSignedIn && (
                <Badge status="success" text="Live availability" />
              )}
            </Space>
          }
          type={status.isSignedIn ? 'success' : 'warning'}
          style={{ marginBottom: '16px' }}
          showIcon={false}
        />
      )}

      {/* Calendar Selection for Google Calendar */}
      {useGoogleCalendar && status.isSignedIn && calendars.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ color: themeStyles.textPrimary, marginRight: '8px' }}>
            Check availability against:
          </Text>
          <Select
            mode="multiple"
            value={selectedCalendars}
            onChange={setSelectedCalendars}
            style={{ minWidth: '300px' }}
            placeholder="Select calendars to check"
          >
            {calendars.map(calendar => (
              <Option key={calendar.id} value={calendar.id}>
                {calendar.summary} {calendar.primary && '(Primary)'}
              </Option>
            ))}
          </Select>
        </div>
      )}

      {/* Week Header */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <Text strong style={{ color: themeStyles.textPrimary, fontSize: '18px' }}>
          Week of {currentWeek.format('MMM DD, YYYY')}
        </Text>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text style={{ color: themeStyles.textSecondary }}>
              {useGoogleCalendar ? 'Checking Google Calendar availability...' : 'Loading time slots...'}
            </Text>
          </div>
        </div>
      ) : (
        <div>
          {/* Calendar Grid */}
          <Row gutter={[8, 8]}>
            {weekDays.map((day, index) => {
              const dateStr = day.format('YYYY-MM-DD');
              const daySlots = availableSlots[dateStr] || [];
              const isWeekend = day.day() === 0 || day.day() === 6;
              const isPast = day.isBefore(moment(), 'day');
              const isDisabled = isWeekend || isPast || disabled;
              const isSelected = selectedDate === dateStr;

              return (
                <Col xs={24} sm={12} md={8} lg={6} xl={3.42} key={index}>
                  <Card
                    size="small"
                    style={{
                      background: isSelected ? `${themeStyles.primaryColor}20` : themeStyles.cardBg,
                      border: `2px solid ${isSelected ? themeStyles.primaryColor : themeStyles.cardBorder}`,
                      borderRadius: '12px',
                      opacity: isDisabled ? 0.6 : 1,
                      minHeight: '200px'
                    }}
                  >
                    {/* Day Header */}
                    <div style={{ 
                      textAlign: 'center', 
                      marginBottom: '12px',
                      borderBottom: `1px solid ${themeStyles.cardBorder}`,
                      paddingBottom: '8px'
                    }}>
                      <div style={{ 
                        color: themeStyles.textSecondary, 
                        fontSize: '12px',
                        textTransform: 'uppercase' 
                      }}>
                        {day.format('ddd')}
                      </div>
                      <div style={{ 
                        color: themeStyles.textPrimary, 
                        fontSize: '18px',
                        fontWeight: 'bold' 
                      }}>
                        {day.format('DD')}
                      </div>
                      <div style={{ 
                        color: themeStyles.textSecondary, 
                        fontSize: '12px' 
                      }}>
                        {day.format('MMM')}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div style={{ minHeight: '120px' }}>
                      {isDisabled ? (
                        <div style={{ 
                          textAlign: 'center', 
                          color: themeStyles.textSecondary,
                          fontSize: '12px',
                          padding: '20px 0'
                        }}>
                          {isWeekend ? 'Weekend' : isPast ? 'Past Date' : 'Not Available'}
                        </div>
                      ) : daySlots.length === 0 ? (
                        <div style={{ 
                          textAlign: 'center', 
                          color: themeStyles.textSecondary,
                          fontSize: '12px',
                          padding: '20px 0'
                        }}>
                          {useGoogleCalendar ? 'No Free Slots' : 'No Slots'}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {daySlots.slice(0, 6).map((slot, slotIndex) => {
                            const isSlotSelected = selectedSlot && 
                              selectedSlot.date === slot.date && 
                              selectedSlot.time === slot.time;
                            
                            return (
                              <Button
                                key={slotIndex}
                                size="small"
                                type={isSlotSelected ? 'primary' : 'default'}
                                style={{
                                  height: '28px',
                                  fontSize: '11px',
                                  background: isSlotSelected ? themeStyles.selectedSlot : 'transparent',
                                  borderColor: isSlotSelected ? themeStyles.selectedSlot : themeStyles.cardBorder,
                                  color: isSlotSelected ? 'white' : themeStyles.textPrimary
                                }}
                                onClick={() => handleSlotClick(slot)}
                                disabled={disabled}
                              >
                                {slot.time}
                                {isSlotSelected && (
                                  <CheckCircleOutlined style={{ marginLeft: '4px' }} />
                                )}
                              </Button>
                            );
                          })}
                          
                          {daySlots.length > 6 && (
                            <Text 
                              style={{ 
                                fontSize: '10px', 
                                color: themeStyles.textSecondary, 
                                textAlign: 'center',
                                marginTop: '4px'
                              }}
                            >
                              +{daySlots.length - 6} more
                            </Text>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Selected Slot Display */}
          {selectedSlot && (
            <Alert
              message={
                <div>
                  <Space>
                    {useGoogleCalendar ? <GoogleOutlined /> : <CalendarOutlined />}
                    Selected: <strong>
                      {moment(selectedSlot.dateTime).format('dddd, MMMM DD, YYYY [at] HH:mm')}
                    </strong>
                    <Text type="secondary">({duration} minutes)</Text>
                  </Space>
                </div>
              }
              type="success"
              style={{ 
                marginTop: '24px',
                borderRadius: '8px'
              }}
              showIcon={false}
            />
          )}

          {/* Instructions */}
          <Alert
            message="How to select your appointment:"
            description={
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Click on any available time slot (shown in green)</li>
                <li>Your selected time will be highlighted in blue</li>
                <li>Use the navigation buttons to view different weeks</li>
                {useGoogleCalendar ? (
                  <li>Times shown are free based on your Google Calendar</li>
                ) : (
                  <li>Basic time slots during business hours are shown</li>
                )}
              </ul>
            }
            type="info"
            showIcon
            style={{ 
              marginTop: '16px',
              borderRadius: '8px'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarPicker;