import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Button,
  Tag,
  Space,
  Alert,
  Spin,
  Empty,
  Badge,
  message
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { calendarConfigDB, timeSlotsDB } from '../services/firebase/database';
import { useTheme } from './ParticleBackground';
import moment from 'moment';

const { Title, Text } = Typography;

const CalendarPicker = ({ 
  onSlotSelect, 
  selectedSlot, 
  disabled = false,
  minDate = new Date(),
  maxDate = null 
}) => {
  const { theme } = useTheme();
  const [calendarConfig, setCalendarConfig] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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
    loadCalendarConfig();
  }, []);

  useEffect(() => {
    if (calendarConfig) {
      loadAvailableSlots();
    }
  }, [currentWeek, calendarConfig]);

  const loadCalendarConfig = async () => {
    try {
      const config = await calendarConfigDB.getConfig();
      setCalendarConfig(config);
    } catch (error) {
      console.error('Error loading calendar config:', error);
      message.error('Failed to load calendar configuration');
    }
  };

  const loadAvailableSlots = useCallback(async () => {
    if (!calendarConfig) return;

    try {
      setLoading(true);
      const startDate = currentWeek.format('YYYY-MM-DD');
      const endDate = currentWeek.clone().add(6, 'days').format('YYYY-MM-DD');
      
      console.log('Loading slots for:', { startDate, endDate });
      
      // Load available slots for the current week
      const slots = await timeSlotsDB.getAvailableSlots(startDate, endDate);
      console.log('Raw available slots:', slots);
      
      // Filter out past slots
      const now = moment();
      const futureSlots = slots.filter(slot => {
        const slotDateTime = moment(`${slot.date} ${slot.time}`, 'YYYY-MM-DD HH:mm');
        return slotDateTime.isAfter(now);
      });
      
      console.log('Future slots after filtering:', futureSlots);
      
      // Group slots by date
      const slotsByDate = futureSlots.reduce((acc, slot) => {
        if (!acc[slot.date]) {
          acc[slot.date] = [];
        }
        acc[slot.date].push(slot);
        return acc;
      }, {});
      
      console.log('Grouped slots by date:', slotsByDate);
      setAvailableSlots(slotsByDate);
      
      if (Object.keys(slotsByDate).length === 0) {
        message.warning('No available time slots found. Please check with admin to generate slots.');
      }
    } catch (error) {
      console.error('Error loading available slots:', error);
      message.error(`Failed to load available time slots: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [currentWeek, calendarConfig]);

  const generateWeekDays = () => {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = currentWeek.clone().add(i, 'days');
      weekDays.push(day);
    }
    return weekDays;
  };

  const isDateDisabled = (date) => {
    if (disabled) return true;
    
    const dateStr = date.format('YYYY-MM-DD');
    const dayName = date.format('dddd').toLowerCase();
    
    // Check if it's a business day
    if (!calendarConfig?.businessHours[dayName]?.enabled) {
      return true;
    }
    
    // Check if it's in the past
    if (date.isBefore(moment(), 'day')) {
      return true;
    }
    
    // Check if it's beyond max advance booking days
    if (calendarConfig?.advanceBookingDays) {
      const maxDate = moment().add(calendarConfig.advanceBookingDays, 'days');
      if (date.isAfter(maxDate, 'day')) {
        return true;
      }
    }
    
    return false;
  };

  const handleSlotClick = (date, time) => {
    if (disabled) return;
    
    const slotInfo = {
      date: date,
      time: time,
      dateTime: moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm')
    };
    
    setSelectedDate(date);
    onSlotSelect(slotInfo);
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
            Select Date & Time
          </Title>
          <Text style={{ color: themeStyles.textSecondary }}>
            Choose an available appointment slot
          </Text>
        </Col>
        <Col>
          <Space>
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

      {/* Week Header */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <Text strong style={{ color: themeStyles.textPrimary, fontSize: '18px' }}>
          Week of {currentWeek.format('MMM DD, YYYY')}
        </Text>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <div>
          {/* Calendar Grid */}
          <Row gutter={[8, 8]}>
            {weekDays.map((day, index) => {
              const dateStr = day.format('YYYY-MM-DD');
              const daySlots = availableSlots[dateStr] || [];
              const isDisabled = isDateDisabled(day);
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
                          Not Available
                        </div>
                      ) : daySlots.length === 0 ? (
                        <div style={{ 
                          textAlign: 'center', 
                          color: themeStyles.textSecondary,
                          fontSize: '12px',
                          padding: '20px 0'
                        }}>
                          No Slots
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
                                onClick={() => handleSlotClick(slot.date, slot.time)}
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
                  <CalendarOutlined style={{ marginRight: '8px' }} />
                  Selected: <strong>
                    {moment(selectedSlot.dateTime).format('dddd, MMMM DD, YYYY [at] HH:mm')}
                  </strong>
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

          {/* Legend */}
          <div style={{ 
            marginTop: '24px', 
            padding: '16px',
            background: themeStyles.cardBg,
            border: `1px solid ${themeStyles.cardBorder}`,
            borderRadius: '8px'
          }}>
            <Text strong style={{ color: themeStyles.textPrimary, marginBottom: '8px' }}>
              Legend:
            </Text>
            <Space size="large" wrap>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: themeStyles.availableSlot,
                  borderRadius: '2px'
                }} />
                <Text style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>
                  Available
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: themeStyles.selectedSlot,
                  borderRadius: '2px'
                }} />
                <Text style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>
                  Selected
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: themeStyles.disabledSlot,
                  borderRadius: '2px'
                }} />
                <Text style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>
                  Unavailable
                </Text>
              </div>
            </Space>
          </div>

          {/* Instructions */}
          <Alert
            message="How to select your appointment:"
            description={
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Click on any available time slot (shown in green)</li>
                <li>Your selected time will be highlighted in blue</li>
                <li>Use the navigation buttons to view different weeks</li>
                <li>Only future time slots during business hours are available</li>
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

export default CalendarPicker;