import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Switch,
  TimePicker,
  InputNumber,
  Button,
  Select,
  message,
  Modal,
  Tag,
  Space,
  Popover,
  Divider,
  Alert,
  Badge,
  Tooltip
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { calendarConfigDB, timeSlotsDB, bookingsDB } from '../../services/firebase/database';
import { initializeCalendarSystem, createTestSlots, debugSlotData } from '../../utils/seedCalendarData';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const { Title, Text } = Typography;
const { Option } = Select;

const localizer = momentLocalizer(moment);

const CalendarManagement = () => {
  const [form] = Form.useForm();
  const [calendarConfig, setCalendarConfig] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [slotModalVisible, setSlotModalVisible] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf('week'));

  useEffect(() => {
    loadCalendarConfig();
    loadCalendarData();
  }, []);

  const loadCalendarConfig = async () => {
    try {
      const config = await calendarConfigDB.getConfig();
      setCalendarConfig(config);
      
      // Convert time strings to moment objects for the form
      const formData = { ...config };
      Object.keys(config.businessHours).forEach(day => {
        if (config.businessHours[day].start) {
          formData.businessHours[day].start = moment(config.businessHours[day].start, 'HH:mm');
        }
        if (config.businessHours[day].end) {
          formData.businessHours[day].end = moment(config.businessHours[day].end, 'HH:mm');
        }
      });
      
      form.setFieldsValue(formData);
    } catch (error) {
      console.error('Error loading calendar config:', error);
      message.error('Failed to load calendar configuration');
    }
  };

  const loadCalendarData = useCallback(async () => {
    try {
      setLoading(true);
      const startDate = currentWeekStart.format('YYYY-MM-DD');
      const endDate = currentWeekStart.clone().add(6, 'days').format('YYYY-MM-DD');
      
      // Load time slots for the week
      const slots = await timeSlotsDB.getSlots(startDate, endDate);
      setTimeSlots(slots);
      
      // Convert slots to calendar events
      const calendarEvents = slots.map(slot => {
        const startDateTime = moment(`${slot.date} ${slot.time}`, 'YYYY-MM-DD HH:mm');
        const endDateTime = startDateTime.clone().add(calendarConfig?.slotDuration || 60, 'minutes');
        
        let title = '';
        let color = '#52c41a'; // available - green
        
        if (slot.status === 'booked') {
          title = slot.patientName || 'Booked';
          color = '#1890ff'; // booked - blue
        } else if (slot.status === 'blocked') {
          title = 'Blocked';
          color = '#f5222d'; // blocked - red
        } else {
          title = 'Available';
        }
        
        return {
          id: slot.id,
          title,
          start: startDateTime.toDate(),
          end: endDateTime.toDate(),
          resource: slot,
          color
        };
      });
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading calendar data:', error);
      message.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, [currentWeekStart, calendarConfig]);

  useEffect(() => {
    if (calendarConfig) {
      loadCalendarData();
    }
  }, [currentWeekStart, calendarConfig, loadCalendarData]);

  const saveCalendarConfig = async (values) => {
    try {
      setLoading(true);
      
      // Convert moment objects back to time strings
      const configData = { ...values };
      Object.keys(values.businessHours).forEach(day => {
        if (values.businessHours[day].start) {
          configData.businessHours[day].start = values.businessHours[day].start.format('HH:mm');
        }
        if (values.businessHours[day].end) {
          configData.businessHours[day].end = values.businessHours[day].end.format('HH:mm');
        }
      });
      
      await calendarConfigDB.updateConfig(configData);
      setCalendarConfig({ ...calendarConfig, ...configData });
      message.success('Calendar configuration updated successfully');
      setConfigModalVisible(false);
      
      // Regenerate slots for the current week based on new config
      await generateSlotsForWeek();
    } catch (error) {
      console.error('Error saving calendar config:', error);
      message.error('Failed to save calendar configuration');
    } finally {
      setLoading(false);
    }
  };

  const generateSlotsForWeek = async () => {
    try {
      if (!calendarConfig) return;
      
      setLoading(true);
      const promises = [];
      
      for (let i = 0; i < 7; i++) {
        const date = currentWeekStart.clone().add(i, 'days');
        promises.push(
          timeSlotsDB.generateSlotsForDate(
            date.format('YYYY-MM-DD'),
            calendarConfig.businessHours,
            calendarConfig.slotDuration
          )
        );
      }
      
      await Promise.all(promises);
      await loadCalendarData();
      message.success('Time slots generated for the week');
    } catch (error) {
      console.error('Error generating slots:', error);
      message.error('Failed to generate time slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotAction = async (action, slot) => {
    try {
      switch (action) {
        case 'block':
          await timeSlotsDB.blockSlot(slot.date, slot.time, 'Blocked by admin');
          message.success('Time slot blocked');
          break;
        case 'unblock':
          await timeSlotsDB.unblockSlot(slot.date, slot.time);
          message.success('Time slot unblocked');
          break;
        case 'delete':
          await timeSlotsDB.deleteSlot(slot.date, slot.time);
          message.success('Time slot deleted');
          break;
      }
      await loadCalendarData();
    } catch (error) {
      console.error(`Error ${action} slot:`, error);
      message.error(`Failed to ${action} time slot`);
    }
  };

  const handleInitializeSystem = async () => {
    try {
      setLoading(true);
      const result = await initializeCalendarSystem();
      message.success(result.message);
      await loadCalendarConfig();
      await loadCalendarData();
    } catch (error) {
      console.error('Error initializing system:', error);
      message.error('Failed to initialize calendar system');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestSlots = async () => {
    try {
      setLoading(true);
      const result = await createTestSlots();
      message.success(result.message);
      await loadCalendarData();
    } catch (error) {
      console.error('Error creating test slots:', error);
      message.error('Failed to create test slots');
    } finally {
      setLoading(false);
    }
  };

  const handleDebugSlots = async () => {
    try {
      setLoading(true);
      const result = await debugSlotData();
      console.log('Debug result:', result);
      message.info(`Found ${result.allSlots.length} total slots, ${result.availableSlots.length} available`);
      await loadCalendarData();
    } catch (error) {
      console.error('Error debugging slots:', error);
      message.error('Failed to debug slot data');
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px'
      }
    };
  };

  const CustomEvent = ({ event }) => (
    <Tooltip 
      title={
        <div>
          <div><strong>{event.title}</strong></div>
          {event.resource.patientEmail && <div>Email: {event.resource.patientEmail}</div>}
          {event.resource.serviceType && <div>Service: {event.resource.serviceType}</div>}
          {event.resource.notes && <div>Notes: {event.resource.notes}</div>}
        </div>
      }
    >
      <div style={{ height: '100%', padding: '2px' }}>
        {event.title}
      </div>
    </Tooltip>
  );

  const getDayStats = () => {
    const stats = {
      available: timeSlots.filter(s => s.status === 'available').length,
      booked: timeSlots.filter(s => s.status === 'booked').length,
      blocked: timeSlots.filter(s => s.status === 'blocked').length
    };
    return stats;
  };

  const stats = getDayStats();

  return (
    <div>
      {/* Header with Controls */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Title level={3}>Calendar Management</Title>
          <Text type="secondary">
            Manage business hours, time slots, and appointments
          </Text>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          <Space wrap size="small">
            <Button
              icon={<SettingOutlined />}
              onClick={() => setConfigModalVisible(true)}
              style={{ minWidth: '120px' }}
            >
              Business Hours
            </Button>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={generateSlotsForWeek}
              loading={loading}
              style={{ minWidth: '110px' }}
            >
              Generate Slots
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadCalendarData}
              loading={loading}
              style={{ minWidth: '80px' }}
            >
              Refresh
            </Button>
            <Button
              onClick={handleInitializeSystem}
              loading={loading}
              style={{ minWidth: '120px' }}
            >
              Initialize System
            </Button>
            <Button
              onClick={handleCreateTestSlots}
              loading={loading}
              style={{ minWidth: '120px' }}
            >
              Create Test Slots
            </Button>
            <Button
              onClick={handleDebugSlots}
              loading={loading}
              style={{ minWidth: '100px' }}
            >
              Debug Slots
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary">Available Slots</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  {stats.available}
                </div>
              </div>
              <div style={{ fontSize: '32px', color: '#52c41a' }}>
                <ClockCircleOutlined />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary">Booked Slots</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  {stats.booked}
                </div>
              </div>
              <div style={{ fontSize: '32px', color: '#1890ff' }}>
                <UserOutlined />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary">Blocked Slots</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                  {stats.blocked}
                </div>
              </div>
              <div style={{ fontSize: '32px', color: '#f5222d' }}>
                <LockOutlined />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary">Total Slots</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {timeSlots.length}
                </div>
              </div>
              <div style={{ fontSize: '32px', color: '#722ed1' }}>
                <CalendarOutlined />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Calendar View */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4}>
                Week of {currentWeekStart.format('MMM DD, YYYY')}
              </Title>
            </Col>
            <Col>
              <Space>
                <Button 
                  onClick={() => setCurrentWeekStart(prev => prev.clone().subtract(1, 'week'))}
                >
                  Previous Week
                </Button>
                <Button 
                  onClick={() => setCurrentWeekStart(moment().startOf('week'))}
                >
                  This Week
                </Button>
                <Button 
                  onClick={() => setCurrentWeekStart(prev => prev.clone().add(1, 'week'))}
                >
                  Next Week
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <div style={{ height: 600 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            views={['week', 'day']}
            step={calendarConfig?.slotDuration || 60}
            timeslots={1}
            min={new Date(2024, 0, 1, 8, 0)} // 8 AM
            max={new Date(2024, 0, 1, 20, 0)} // 8 PM
            eventPropGetter={eventStyleGetter}
            components={{
              event: CustomEvent
            }}
            onSelectEvent={(event) => {
              setSelectedEvent(event);
              setEventModalVisible(true);
            }}
            onSelectSlot={(slotInfo) => {
              setSelectedDate(slotInfo.start);
              setSlotModalVisible(true);
            }}
            selectable
            loading={loading}
          />
        </div>

        {/* Legend */}
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Space size="large">
            <Badge color="#52c41a" text="Available" />
            <Badge color="#1890ff" text="Booked" />
            <Badge color="#f5222d" text="Blocked" />
          </Space>
        </div>
      </Card>

      {/* Business Hours Configuration Modal */}
      <Modal
        title="Business Hours Configuration"
        open={configModalVisible}
        onCancel={() => setConfigModalVisible(false)}
        width={800}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={saveCalendarConfig}
        >
          <Alert
            message="Configure your business hours and appointment settings"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          {/* Business Hours */}
          <Title level={5}>Business Hours</Title>
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
            <Row key={day} gutter={16} align="middle" style={{ marginBottom: 16 }}>
              <Col span={4}>
                <Text strong>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
              </Col>
              <Col span={4}>
                <Form.Item
                  name={['businessHours', day, 'enabled']}
                  valuePropName="checked"
                  style={{ margin: 0 }}
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name={['businessHours', day, 'start']}
                  style={{ margin: 0 }}
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>
              </Col>
              <Col span={2} style={{ textAlign: 'center' }}>
                <Text>to</Text>
              </Col>
              <Col span={6}>
                <Form.Item
                  name={['businessHours', day, 'end']}
                  style={{ margin: 0 }}
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>
          ))}
          
          <Divider />
          
          {/* Other Settings */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Slot Duration (minutes)"
                name="slotDuration"
                rules={[{ required: true, message: 'Please enter slot duration' }]}
              >
                <InputNumber min={15} max={240} step={15} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Buffer Time (minutes)"
                name="bufferTime"
                rules={[{ required: true, message: 'Please enter buffer time' }]}
              >
                <InputNumber min={0} max={60} step={5} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Advance Booking Days"
                name="advanceBookingDays"
                rules={[{ required: true, message: 'Please enter advance booking days' }]}
              >
                <InputNumber min={1} max={365} />
              </Form.Item>
            </Col>
          </Row>
          
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button onClick={() => setConfigModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Configuration
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Event Details Modal */}
      <Modal
        title="Time Slot Details"
        open={eventModalVisible}
        onCancel={() => setEventModalVisible(false)}
        footer={null}
      >
        {selectedEvent && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Date:</Text>
                <div>{moment(selectedEvent.start).format('MMMM DD, YYYY')}</div>
              </Col>
              <Col span={12}>
                <Text strong>Time:</Text>
                <div>{moment(selectedEvent.start).format('HH:mm')} - {moment(selectedEvent.end).format('HH:mm')}</div>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Status:</Text>
                <div>
                  <Tag color={selectedEvent.color}>
                    {selectedEvent.resource.status?.toUpperCase()}
                  </Tag>
                </div>
              </Col>
              {selectedEvent.resource.patientName && (
                <Col span={12}>
                  <Text strong>Patient:</Text>
                  <div>{selectedEvent.resource.patientName}</div>
                </Col>
              )}
            </Row>
            
            {selectedEvent.resource.patientEmail && (
              <div style={{ marginTop: 16 }}>
                <Text strong>Email:</Text>
                <div>{selectedEvent.resource.patientEmail}</div>
              </div>
            )}
            
            {selectedEvent.resource.serviceType && (
              <div style={{ marginTop: 16 }}>
                <Text strong>Service:</Text>
                <div>{selectedEvent.resource.serviceType}</div>
              </div>
            )}
            
            {selectedEvent.resource.notes && (
              <div style={{ marginTop: 16 }}>
                <Text strong>Notes:</Text>
                <div>{selectedEvent.resource.notes}</div>
              </div>
            )}
            
            <Divider />
            
            <div style={{ textAlign: 'right' }}>
              <Space>
                {selectedEvent.resource.status === 'available' && (
                  <Button 
                    icon={<LockOutlined />}
                    onClick={() => {
                      handleSlotAction('block', selectedEvent.resource);
                      setEventModalVisible(false);
                    }}
                  >
                    Block Slot
                  </Button>
                )}
                {selectedEvent.resource.status === 'blocked' && (
                  <Button 
                    icon={<UnlockOutlined />}
                    onClick={() => {
                      handleSlotAction('unblock', selectedEvent.resource);
                      setEventModalVisible(false);
                    }}
                  >
                    Unblock Slot
                  </Button>
                )}
                <Button 
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => {
                    Modal.confirm({
                      title: 'Delete Time Slot',
                      content: 'Are you sure you want to delete this time slot?',
                      onOk: () => {
                        handleSlotAction('delete', selectedEvent.resource);
                        setEventModalVisible(false);
                      }
                    });
                  }}
                >
                  Delete Slot
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarManagement;