import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Typography,
  Button,
  Modal,
  Form,
  Select,
  TimePicker,
  DatePicker,
  Space,
  message,
  Popover,
  Badge,
  Tooltip,
  Switch,
  Row,
  Col,
  Divider,
  Tag,
  Input,
  Drawer,
  List
} from 'antd';
import {
  CalendarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EyeOutlined,
  SettingOutlined,
  BlockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LeftOutlined,
  RightOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { timeSlotsDB, bookingsDB } from '../../services/firebase/database';
import { seedNext30Days } from '../../utils/calendarSeeder';
import moment from 'moment';
import './AdminCalendarSidebar.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const AdminCalendarSidebar = () => {
  // State management
  const [currentDate, setCurrentDate] = useState(moment());
  const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month'
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Modal states
  const [createSlotModal, setCreateSlotModal] = useState(false);
  const [editSlotModal, setEditSlotModal] = useState(false);
  const [bookingDetailsDrawer, setBookingDetailsDrawer] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Form instances
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Load data on mount and date changes
  useEffect(() => {
    loadCalendarData();
  }, [currentDate, viewMode]);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadTimeSlots(), loadBookings()]);
    } catch (error) {
      console.error('Error loading calendar data:', error);
      message.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDemoData = async () => {
    try {
      setLoading(true);
      const result = await seedNext30Days();
      message.success(result.message);
      loadCalendarData(); // Reload calendar data
    } catch (error) {
      console.error('Error seeding demo data:', error);
      message.error('Failed to create demo data');
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSlots = async () => {
    try {
      let startDate, endDate;
      
      if (viewMode === 'day') {
        startDate = endDate = currentDate.format('YYYY-MM-DD');
      } else if (viewMode === 'week') {
        startDate = currentDate.clone().startOf('week').format('YYYY-MM-DD');
        endDate = currentDate.clone().endOf('week').format('YYYY-MM-DD');
      } else {
        startDate = currentDate.clone().startOf('month').format('YYYY-MM-DD');
        endDate = currentDate.clone().endOf('month').format('YYYY-MM-DD');
      }
      
      const slots = await timeSlotsDB.getSlotsInRange(startDate, endDate);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error loading time slots:', error);
    }
  };

  const loadBookings = async () => {
    try {
      const allBookings = await bookingsDB.getAll();
      const relevantBookings = allBookings.filter(booking => {
        if (!booking.preferredDate) return false;
        const bookingDate = moment(booking.preferredDate.toDate ? booking.preferredDate.toDate() : booking.preferredDate);
        
        if (viewMode === 'day') {
          return bookingDate.isSame(currentDate, 'day');
        } else if (viewMode === 'week') {
          return bookingDate.isBetween(currentDate.clone().startOf('week'), currentDate.clone().endOf('week'), 'day', '[]');
        } else {
          return bookingDate.isBetween(currentDate.clone().startOf('month'), currentDate.clone().endOf('month'), 'day', '[]');
        }
      });
      setBookings(relevantBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const generateTimeSlots = async (values) => {
    try {
      setLoading(true);
      const { dateRange, startTime, endTime, duration, breakBetween, days } = values;
      
      const slots = [];
      const slotDuration = duration || 30; // default 30 minutes
      const breakDuration = breakBetween || 0;
      
      // Generate slots for selected date range
      for (let date = dateRange[0].clone(); date.isSameOrBefore(dateRange[1]); date.add(1, 'day')) {
        const dayName = date.format('dddd').toLowerCase();
        
        // Skip if this day is not selected
        if (!days.includes(dayName)) continue;
        
        const dateStr = date.format('YYYY-MM-DD');
        let currentTime = startTime.clone();
        
        while (currentTime.isBefore(endTime)) {
          const endSlotTime = currentTime.clone().add(slotDuration, 'minutes');
          
          // Don't create slot if it would exceed end time
          if (endSlotTime.isAfter(endTime)) break;
          
          slots.push({
            date: dateStr,
            time: currentTime.format('HH:mm'),
            endTime: endSlotTime.format('HH:mm'),
            duration: slotDuration,
            status: 'available',
            createdBy: 'admin',
            createdAt: new Date()
          });
          
          // Move to next slot with break
          currentTime = endSlotTime.add(breakDuration, 'minutes');
        }
      }
      
      // Save all slots to database
      for (const slot of slots) {
        await timeSlotsDB.createSlot(slot);
      }
      
      message.success(`Generated ${slots.length} time slots successfully!`);
      loadTimeSlots();
      setCreateSlotModal(false);
      createForm.resetFields();
      
    } catch (error) {
      console.error('Error generating time slots:', error);
      message.error('Failed to generate time slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotStatusChange = async (slotId, newStatus) => {
    try {
      await timeSlotsDB.updateSlotStatus(slotId, newStatus);
      message.success(`Slot ${newStatus} successfully`);
      loadTimeSlots();
    } catch (error) {
      console.error('Error updating slot status:', error);
      message.error('Failed to update slot status');
    }
  };

  const deleteSlot = async (slotId) => {
    try {
      await timeSlotsDB.deleteSlot(slotId);
      message.success('Time slot deleted successfully');
      loadTimeSlots();
    } catch (error) {
      console.error('Error deleting slot:', error);
      message.error('Failed to delete time slot');
    }
  };

  const getSlotForDateTime = (date, time) => {
    return timeSlots.find(slot => 
      slot.date === date && 
      slot.time === time
    );
  };

  const getBookingForDateTime = (date, time) => {
    return bookings.find(booking => {
      if (!booking.preferredDate || !booking.preferredTime) return false;
      const bookingDate = moment(booking.preferredDate.toDate ? booking.preferredDate.toDate() : booking.preferredDate);
      const bookingTime = moment(booking.preferredTime.toDate ? booking.preferredTime.toDate() : booking.preferredTime);
      return bookingDate.format('YYYY-MM-DD') === date && bookingTime.format('HH:mm') === time;
    });
  };

  const generateWeekView = () => {
    const weekStart = currentDate.clone().startOf('week');
    const weekDays = [];
    const timeSlots = [];
    
    // Generate time slots from 9 AM to 6 PM
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        timeSlots.push(moment().hour(hour).minute(minute).format('HH:mm'));
      }
    }
    
    // Generate week days
    for (let i = 0; i < 7; i++) {
      weekDays.push(weekStart.clone().add(i, 'days'));
    }
    
    return { weekDays, timeSlots };
  };

  const renderTimeSlotCell = (date, time) => {
    const dateStr = date.format('YYYY-MM-DD');
    const slot = getSlotForDateTime(dateStr, time);
    const booking = getBookingForDateTime(dateStr, time);
    
    let cellClasses = ['calendar-slot-cell'];
    let content = null;
    let status = 'empty';
    
    if (booking) {
      status = 'booked';
      cellClasses.push('calendar-slot-booked');
      content = (
        <Tooltip title={`Booked: ${booking.firstName} ${booking.lastName}`}>
          <div className="calendar-slot-content">
            <div className="calendar-slot-patient-name">
              <UserOutlined /> {booking.firstName}
            </div>
            <div className="calendar-slot-service">
              {booking.selectedServices?.[0]?.title || 'Consultation'}
            </div>
          </div>
        </Tooltip>
      );
    } else if (slot) {
      if (slot.status === 'available') {
        status = 'available';
        cellClasses.push('calendar-slot-available');
        content = (
          <div className="calendar-slot-content" style={{ textAlign: 'center' }}>
            <CheckCircleOutlined />
          </div>
        );
      } else if (slot.status === 'blocked') {
        status = 'blocked';
        cellClasses.push('calendar-slot-blocked');
        content = (
          <div className="calendar-slot-content" style={{ textAlign: 'center' }}>
            <BlockOutlined />
          </div>
        );
      }
    }
    
    const handleCellClick = () => {
      if (booking) {
        setSelectedBooking(booking);
        setBookingDetailsDrawer(true);
      } else if (slot) {
        setSelectedSlot({ ...slot, date: dateStr, time });
        setEditSlotModal(true);
      } else {
        // Create new slot
        setSelectedSlot({ date: dateStr, time, status: 'available' });
        setEditSlotModal(true);
      }
    };
    
    return (
      <div
        key={`${dateStr}-${time}`}
        className={cellClasses.join(' ')}
        onClick={handleCellClick}
      >
        {content}
      </div>
    );
  };

  const { weekDays, timeSlots: weekTimeSlots } = generateWeekView();

  return (
    <div className="admin-calendar-sidebar" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Card size="small" style={{ marginBottom: '8px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>
            <CalendarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Calendar Manager
          </Title>
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setCreateSlotModal(true)}
            >
              Create Slots
            </Button>
            <Button
              size="small"
              icon={<SettingOutlined />}
              onClick={handleSeedDemoData}
              loading={loading}
              title="Generate demo time slots for next 30 days"
            >
              Demo Data
            </Button>
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={loadCalendarData}
              loading={loading}
            />
          </Space>
        </div>
      </Card>

      {/* Navigation */}
      <Card size="small" style={{ marginBottom: '8px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button
              size="small"
              icon={<LeftOutlined />}
              onClick={() => setCurrentDate(prev => prev.clone().subtract(1, viewMode))}
            />
            <Button
              size="small"
              onClick={() => setCurrentDate(moment())}
            >
              Today
            </Button>
            <Button
              size="small"
              icon={<RightOutlined />}
              onClick={() => setCurrentDate(prev => prev.clone().add(1, viewMode))}
            />
          </Space>
          
          <Select
            size="small"
            value={viewMode}
            onChange={setViewMode}
            style={{ width: '80px' }}
          >
            <Select.Option value="day">Day</Select.Option>
            <Select.Option value="week">Week</Select.Option>
            <Select.Option value="month">Month</Select.Option>
          </Select>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <Text strong>
            {viewMode === 'week' && 
              `Week of ${currentDate.clone().startOf('week').format('MMM DD')} - ${currentDate.clone().endOf('week').format('MMM DD, YYYY')}`
            }
            {viewMode === 'day' && currentDate.format('dddd, MMMM DD, YYYY')}
            {viewMode === 'month' && currentDate.format('MMMM YYYY')}
          </Text>
        </div>
      </Card>

      {/* Legend */}
      <Card size="small" style={{ marginBottom: '8px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#52c41a', borderRadius: '2px' }} />
            <Text style={{ fontSize: '10px' }}>Available</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#1890ff', borderRadius: '2px' }} />
            <Text style={{ fontSize: '10px' }}>Booked</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#ff4d4f', borderRadius: '2px' }} />
            <Text style={{ fontSize: '10px' }}>Blocked</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#fafafa', border: '1px solid #d9d9d9', borderRadius: '2px' }} />
            <Text style={{ fontSize: '10px' }}>Empty</Text>
          </div>
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card 
        size="small" 
        style={{ flex: 1, borderRadius: '8px', overflow: 'hidden' }}
        bodyStyle={{ padding: '8px', height: '100%', overflow: 'auto' }}
      >
        {viewMode === 'week' && (
          <div className="calendar-container">
            <div className="calendar-grid-container">
              <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', gap: '1px', fontSize: '10px' }}>
                {/* Time column header */}
                <div className="calendar-header-cell calendar-time-column">
                  Time
                </div>
                
                {/* Day headers */}
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className={`calendar-header-cell ${day.isSame(moment(), 'day') ? 'calendar-today-highlight' : ''}`}
                  >
                    <div>{day.format('ddd')}</div>
                    <div style={{ fontSize: '12px', marginTop: '2px' }}>{day.format('DD')}</div>
                  </div>
                ))}
                
                {/* Time slots */}
                {weekTimeSlots.map((time) => (
                  <React.Fragment key={time}>
                    {/* Time label */}
                    <div className="calendar-time-cell calendar-time-column">
                      {time}
                    </div>
                    
                    {/* Day cells */}
                    {weekDays.map((day) => renderTimeSlotCell(day, time))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {viewMode === 'day' && (
          <div>
            <Title level={5} style={{ textAlign: 'center', marginBottom: '16px' }}>
              {currentDate.format('dddd, MMMM DD, YYYY')}
            </Title>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2px' }}>
              {weekTimeSlots.map((time) => (
                <div key={time} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '50px', fontSize: '10px', textAlign: 'right' }}>{time}</div>
                  <div style={{ flex: 1 }}>
                    {renderTimeSlotCell(currentDate, time)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Create Time Slots Modal */}
      <Modal
        title="Create Time Slots"
        open={createSlotModal}
        onCancel={() => setCreateSlotModal(false)}
        onOk={() => createForm.submit()}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={generateTimeSlots}
        >
          <Form.Item
            label="Date Range"
            name="dateRange"
            rules={[{ required: true, message: 'Please select date range' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Start Time"
                name="startTime"
                rules={[{ required: true, message: 'Please select start time' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="End Time"
                name="endTime"
                rules={[{ required: true, message: 'Please select end time' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Slot Duration (minutes)"
                name="duration"
                initialValue={30}
              >
                <Select>
                  <Select.Option value={15}>15 minutes</Select.Option>
                  <Select.Option value={30}>30 minutes</Select.Option>
                  <Select.Option value={45}>45 minutes</Select.Option>
                  <Select.Option value={60}>60 minutes</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Break Between Slots (minutes)"
                name="breakBetween"
                initialValue={0}
              >
                <Select>
                  <Select.Option value={0}>No break</Select.Option>
                  <Select.Option value={5}>5 minutes</Select.Option>
                  <Select.Option value={10}>10 minutes</Select.Option>
                  <Select.Option value={15}>15 minutes</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="Days of Week"
            name="days"
            rules={[{ required: true, message: 'Please select at least one day' }]}
          >
            <Select mode="multiple" placeholder="Select days">
              <Select.Option value="monday">Monday</Select.Option>
              <Select.Option value="tuesday">Tuesday</Select.Option>
              <Select.Option value="wednesday">Wednesday</Select.Option>
              <Select.Option value="thursday">Thursday</Select.Option>
              <Select.Option value="friday">Friday</Select.Option>
              <Select.Option value="saturday">Saturday</Select.Option>
              <Select.Option value="sunday">Sunday</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Slot Modal */}
      <Modal
        title={selectedSlot?.id ? "Edit Time Slot" : "Create Time Slot"}
        open={editSlotModal}
        onCancel={() => setEditSlotModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditSlotModal(false)}>
            Cancel
          </Button>,
          selectedSlot?.id && (
            <Button
              key="delete"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: 'Delete Time Slot',
                  content: 'Are you sure you want to delete this time slot?',
                  onOk: () => {
                    deleteSlot(selectedSlot.id);
                    setEditSlotModal(false);
                  }
                });
              }}
            >
              Delete
            </Button>
          ),
          <Button
            key="block"
            danger
            icon={<BlockOutlined />}
            onClick={() => {
              handleSlotStatusChange(selectedSlot.id, 'blocked');
              setEditSlotModal(false);
            }}
            disabled={!selectedSlot?.id}
          >
            Block
          </Button>,
          <Button
            key="available"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              if (selectedSlot?.id) {
                handleSlotStatusChange(selectedSlot.id, 'available');
              } else {
                // Create new slot logic here
              }
              setEditSlotModal(false);
            }}
          >
            Make Available
          </Button>
        ]}
      >
        {selectedSlot && (
          <div>
            <p><strong>Date:</strong> {moment(selectedSlot.date).format('dddd, MMMM DD, YYYY')}</p>
            <p><strong>Time:</strong> {selectedSlot.time}</p>
            <p><strong>Status:</strong> 
              <Tag color={
                selectedSlot.status === 'available' ? 'green' :
                selectedSlot.status === 'blocked' ? 'red' : 'default'
              }>
                {selectedSlot.status?.toUpperCase()}
              </Tag>
            </p>
          </div>
        )}
      </Modal>

      {/* Booking Details Drawer */}
      <Drawer
        title="Booking Details"
        placement="right"
        onClose={() => setBookingDetailsDrawer(false)}
        open={bookingDetailsDrawer}
        width={400}
      >
        {selectedBooking && (
          <div>
            <Card size="small" style={{ marginBottom: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <UserOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                <Title level={4} style={{ margin: '8px 0' }}>
                  {selectedBooking.firstName} {selectedBooking.lastName}
                </Title>
                <Tag color={
                  selectedBooking.status === 'confirmed' ? 'blue' :
                  selectedBooking.status === 'completed' ? 'green' :
                  selectedBooking.status === 'cancelled' ? 'red' : 'orange'
                }>
                  {selectedBooking.status?.toUpperCase()}
                </Tag>
              </div>
            </Card>
            
            <Card size="small" title="Appointment Details" style={{ marginBottom: '16px' }}>
              <p><strong>Date:</strong> {moment(selectedBooking.preferredDate.toDate()).format('dddd, MMMM DD, YYYY')}</p>
              <p><strong>Time:</strong> {moment(selectedBooking.preferredTime.toDate()).format('HH:mm')}</p>
              <p><strong>Duration:</strong> 30 minutes</p>
              <p><strong>Type:</strong> {selectedBooking.sessionType}</p>
            </Card>
            
            <Card size="small" title="Contact Information" style={{ marginBottom: '16px' }}>
              <p><strong>Email:</strong> {selectedBooking.email}</p>
              <p><strong>Phone:</strong> {selectedBooking.phone}</p>
              <p><strong>Age:</strong> {selectedBooking.age} years</p>
            </Card>
            
            {selectedBooking.selectedServices && (
              <Card size="small" title="Services" style={{ marginBottom: '16px' }}>
                {selectedBooking.selectedServices.map((service, index) => (
                  <Tag key={index} color="blue" style={{ margin: '2px' }}>
                    {service.title}
                  </Tag>
                ))}
              </Card>
            )}
            
            {selectedBooking.currentConcerns && (
              <Card size="small" title="Current Concerns" style={{ marginBottom: '16px' }}>
                <Text>{selectedBooking.currentConcerns}</Text>
              </Card>
            )}
            
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button type="primary" icon={<EyeOutlined />}>
                View Full Details
              </Button>
              <Button icon={<EditOutlined />}>
                Edit Booking
              </Button>
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AdminCalendarSidebar;