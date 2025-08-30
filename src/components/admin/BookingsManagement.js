import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Typography,
  Select,
  Input,
  DatePicker,
  Modal,
  Descriptions,
  message,
  Badge,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { bookingsDB, timeSlotsDB } from '../../services/firebase/database';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const allBookings = await bookingsDB.getAll();
      setBookings(allBookings);
      calculateStats(allBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      message.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookingsList) => {
    const stats = {
      total: bookingsList.length,
      pending: bookingsList.filter(b => b.status === 'pending').length,
      confirmed: bookingsList.filter(b => b.status === 'confirmed').length,
      completed: bookingsList.filter(b => b.status === 'completed').length,
      cancelled: bookingsList.filter(b => b.status === 'cancelled').length
    };
    setStats(stats);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      await bookingsDB.updateStatus(bookingId, newStatus);
      
      // Update time slot status based on booking status
      if (booking?.preferredDate && booking?.preferredTime) {
        const dateStr = moment(booking.preferredDate.toDate ? booking.preferredDate.toDate() : booking.preferredDate).format('YYYY-MM-DD');
        const timeStr = moment(booking.preferredTime.toDate ? booking.preferredTime.toDate() : booking.preferredTime).format('HH:mm');
        
        if (newStatus === 'confirmed') {
          // Book the time slot
          await timeSlotsDB.bookSlot(dateStr, timeStr, {
            bookingId: booking.id,
            patientName: `${booking.firstName} ${booking.lastName}`,
            patientEmail: booking.email,
            serviceType: booking.selectedServices?.[0]?.title || 'Consultation',
            notes: `Booking confirmed: ${booking.confirmationNumber}`
          });
        } else if (newStatus === 'cancelled' || newStatus === 'completed') {
          // Make slot available again
          await timeSlotsDB.unblockSlot(dateStr, timeStr);
        }
      }
      
      message.success(`Booking ${newStatus} successfully`);
      loadBookings(); // Reload to get updated data
    } catch (error) {
      console.error('Error updating booking status:', error);
      message.error('Failed to update booking status');
    }
  };

  // Add this function right after handleStatusChange
const handleConfirmWithMeeting = async (booking) => {
  try {
    setLoading(true);
    
    // First update booking status
    await bookingsDB.updateStatus(booking.id, 'confirmed');
    
    // Book the time slot
    if (booking?.preferredDate && booking?.preferredTime) {
      const dateStr = moment(booking.preferredDate.toDate ? booking.preferredDate.toDate() : booking.preferredDate).format('YYYY-MM-DD');
      const timeStr = moment(booking.preferredTime.toDate ? booking.preferredTime.toDate() : booking.preferredTime).format('HH:mm');
      
      await timeSlotsDB.bookSlot(dateStr, timeStr, {
        bookingId: booking.id,
        patientName: `${booking.firstName} ${booking.lastName}`,
        patientEmail: booking.email,
        serviceType: booking.selectedServices?.[0]?.title || 'Consultation',
        notes: `Booking confirmed with meeting: ${booking.confirmationNumber}`
      });
    }
    
    // Create meeting via API
    const response = await fetch('/api/create-meeting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId: booking.confirmationNumber,
        patientEmail: booking.email,
        patientName: `${booking.firstName} ${booking.lastName}`,
        appointmentDateTime: booking.preferredDate?.toDate?.() || booking.preferredDate,
        serviceType: booking.selectedServices?.map(s => s.title).join(', ') || 'Consultation'
      })
    });

    const result = await response.json();

    if (result.success) {
      // Update booking with meeting details
      await bookingsDB.update(booking.id, {
        meetLink: result.meetLink,
        eventId: result.eventId,
        meetingCreated: true,
        meetingCreatedAt: new Date()
      });

      message.success('Booking confirmed and Google Meet created! Invites sent to patient.');
    } else {
      message.error('Booking confirmed but failed to create meeting: ' + result.details);
    }
    
    loadBookings(); // Reload bookings
  } catch (error) {
    console.error('Error confirming with meeting:', error);
    message.error('Failed to confirm booking with meeting');
  } finally {
    setLoading(false);
  }
};

  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailModalVisible(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      confirmed: 'blue',
      completed: 'green',
      cancelled: 'red'
    };
    return colors[status] || 'default';
  };

  const filteredBookings = bookings.filter(booking => {
    // Status filter
    if (statusFilter !== 'all' && booking.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      const fullName = `${booking.firstName} ${booking.lastName}`.toLowerCase();
      const email = booking.email?.toLowerCase() || '';
      const phone = booking.phone?.toLowerCase() || '';
      const confirmation = booking.confirmationNumber?.toLowerCase() || '';
      
      if (!fullName.includes(searchLower) && 
          !email.includes(searchLower) && 
          !phone.includes(searchLower) && 
          !confirmation.includes(searchLower)) {
        return false;
      }
    }

    // Date range filter
    if (dateRange.length === 2) {
      const bookingDate = moment(booking.preferredDate?.toDate?.() || booking.preferredDate);
      if (!bookingDate.isBetween(dateRange[0], dateRange[1], 'day', '[]')) {
        return false;
      }
    }

    return true;
  });

  const columns = [
    {
      title: 'Confirmation #',
      dataIndex: 'confirmationNumber',
      key: 'confirmationNumber',
      width: 140,
      render: (text) => <Text code>{text}</Text>
    },
    {
      title: 'Patient',
      key: 'patient',
      width: 200,
      render: (_, record) => (
        <div>
          <Text strong>{record.firstName} {record.lastName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.email}
          </Text>
        </div>
      )
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: 'Services',
      dataIndex: 'selectedServices',
      key: 'services',
      width: 200,
      render: (services) => (
        <div>
          {services?.slice(0, 2).map((service, index) => (
            <Tag key={index} style={{ marginBottom: '4px' }}>
              {service.title}
            </Tag>
          ))}
          {services?.length > 2 && (
            <Tag>+{services.length - 2} more</Tag>
          )}
        </div>
      )
    },
    {
      title: 'Preferred Date',
      dataIndex: 'preferredDate',
      key: 'preferredDate',
      width: 150,
      render: (date) => {
        if (!date) return 'Not set';
        const momentDate = moment(date.toDate ? date.toDate() : date);
        return momentDate.format('MMM DD, YYYY');
      }
    },
    {
      title: 'Time',
      dataIndex: 'preferredTime',
      key: 'preferredTime',
      width: 100,
      render: (time) => {
        if (!time) return 'Not set';
        const momentTime = moment(time.toDate ? time.toDate() : time);
        return momentTime.format('HH:mm');
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => {
        const momentDate = moment(date.toDate ? date.toDate() : date);
        return momentDate.format('MMM DD');
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => showBookingDetails(record)}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <Button 
              size="small" 
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleConfirmWithMeeting(record)}
              style={{ marginRight: '8px' }}
            >
              Confirm & Create Meet
            </Button>
          )}
          {(record.status === 'pending' || record.status === 'confirmed') && (
            <Button 
              size="small" 
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => handleStatusChange(record.id, 'cancelled')}
            >
              Cancel
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={stats.total}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Confirmed"
              value={stats.confirmed}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Completed"
              value={stats.completed}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Cancelled"
              value={stats.cancelled}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Search
              placeholder="Search by name, email, phone, confirmation #"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">All Statuses</Option>
              <Option value="pending">Pending</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Start Date', 'End Date']}
              value={dateRange}
              onChange={setDateRange}
            />
          </Col>
          <Col span={4}>
            <Button onClick={loadBookings}>Refresh</Button>
          </Col>
        </Row>
      </Card>

      {/* Bookings Table */}
      <Card>
        <Title level={4}>All Bookings ({filteredBookings.length})</Title>
        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} bookings`
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Booking Details Modal */}
      <Modal
        title={`Booking Details - ${selectedBooking?.confirmationNumber}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedBooking && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Confirmation #" span={2}>
                <Text code>{selectedBooking.confirmationNumber}</Text>
                <Tag color={getStatusColor(selectedBooking.status)} style={{ marginLeft: 8 }}>
                  {selectedBooking.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Name">
                {selectedBooking.firstName} {selectedBooking.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Age">
                {selectedBooking.age} years
              </Descriptions.Item>
              
              <Descriptions.Item label="Email">
                <a href={`mailto:${selectedBooking.email}`}>{selectedBooking.email}</a>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <a href={`tel:${selectedBooking.phone}`}>{selectedBooking.phone}</a>
              </Descriptions.Item>
              
              <Descriptions.Item label="Gender">
                {selectedBooking.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Session Type">
                {selectedBooking.sessionType}
              </Descriptions.Item>
              
              <Descriptions.Item label="Preferred Date">
                {selectedBooking.preferredDate ? 
                  moment(selectedBooking.preferredDate.toDate ? 
                    selectedBooking.preferredDate.toDate() : 
                    selectedBooking.preferredDate
                  ).format('MMMM DD, YYYY') : 'Not set'
                }
              </Descriptions.Item>
              <Descriptions.Item label="Preferred Time">
                {selectedBooking.preferredTime ? 
                  moment(selectedBooking.preferredTime.toDate ? 
                    selectedBooking.preferredTime.toDate() : 
                    selectedBooking.preferredTime
                  ).format('HH:mm') : 'Not set'
                }
              </Descriptions.Item>
              
              <Descriptions.Item label="Address" span={2}>
                {selectedBooking.address || 'Not provided'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Emergency Contact" span={2}>
                {selectedBooking.emergencyContact || 'Not provided'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Current Concerns" span={2}>
                {selectedBooking.currentConcerns || 'Not provided'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Medical History" span={2}>
                {selectedBooking.medicalHistory || 'Not provided'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Special Requests" span={2}>
                {selectedBooking.specialRequests || 'None'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Previous Therapy">
                {selectedBooking.previousTherapy || 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {moment(selectedBooking.createdAt.toDate ? 
                  selectedBooking.createdAt.toDate() : 
                  selectedBooking.createdAt
                ).format('MMMM DD, YYYY HH:mm')}
              </Descriptions.Item>
            </Descriptions>
            
            {selectedBooking.selectedServices && selectedBooking.selectedServices.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Selected Services</Title>
                <Space wrap>
                  {selectedBooking.selectedServices.map((service, index) => (
                    <Tag key={index} icon={<HeartOutlined />} color="blue">
                      {service.title} - {service.category}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
            
            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Space>
                {selectedBooking.status === 'pending' && (
                  <Button 
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'confirmed');
                      setDetailModalVisible(false);
                    }}
                  >
                    Confirm Booking
                  </Button>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <Button 
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'completed');
                      setDetailModalVisible(false);
                    }}
                  >
                    Mark Complete
                  </Button>
                )}
                {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed') && (
                  <Button 
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, 'cancelled');
                      setDetailModalVisible(false);
                    }}
                  >
                    Cancel Booking
                  </Button>
                )}
                <Button onClick={() => setDetailModalVisible(false)}>
                  Close
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingsManagement;