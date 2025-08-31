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
      pending: bookingsList.filter(b => b.status === 'pending' || b.status === 'pending_admin_confirmation').length,
      confirmed: bookingsList.filter(b => b.status === 'confirmed').length,
      completed: bookingsList.filter(b => b.status === 'completed').length,
      cancelled: bookingsList.filter(b => b.status === 'cancelled' || b.status === 'rejected').length
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

  // Atomic confirm booking with meeting generation
  const handleConfirmBooking = async (booking) => {
    try {
      setLoading(true);
      
      const adminData = {
        adminId: 'admin_001', // You can get this from auth context
        notes: `Booking confirmed via admin interface for ${booking.confirmationNumber}`
      };

      // Use atomic confirmation operation
      const result = await timeSlotsDB.atomicAdminConfirmBooking(booking.id, adminData);
      
      console.log('Booking confirmed with atomic operation:', result);
      message.success('Booking confirmed successfully! Meet link has been sent to the patient.');
      
      // Reload bookings to get updated data
      loadBookings();
      
    } catch (error) {
      console.error('Error confirming booking:', error);
      message.error('Failed to confirm booking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Atomic reject booking
  const handleRejectBooking = async (booking) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      setLoading(true);
      
      const rejectionData = {
        adminId: 'admin_001',
        reason: reason,
        notes: `Booking rejected via admin interface for ${booking.confirmationNumber}`
      };

      // Use atomic rejection operation
      const result = await timeSlotsDB.atomicAdminRejectBooking(booking.id, rejectionData);
      
      console.log('Booking rejected with atomic operation:', result);
      message.success('Booking rejected successfully. Patient has been notified.');
      
      // Reload bookings to get updated data
      loadBookings();
      
    } catch (error) {
      console.error('Error rejecting booking:', error);
      message.error('Failed to reject booking: ' + error.message);
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
      pending_admin_confirmation: 'gold',
      confirmed: 'blue',
      completed: 'green',
      cancelled: 'red',
      rejected: 'red'
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
      width: 250,
      render: (_, record) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => showBookingDetails(record)}
            block
          >
            View
          </Button>
          
          {/* Show Confirm/Reject buttons for pending admin confirmation */}
          {record.status === 'pending_admin_confirmation' && (
            <Space size="small" style={{ width: '100%' }}>
              <Button 
                size="small" 
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleConfirmBooking(record)}
                loading={loading}
              >
                Confirm
              </Button>
              <Button 
                size="small" 
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleRejectBooking(record)}
                loading={loading}
              >
                Reject
              </Button>
            </Space>
          )}
          
          {/* Show meeting link for confirmed bookings */}
          {record.status === 'confirmed' && record.meetLink && (
            <Button 
              size="small" 
              type="link"
              onClick={() => window.open(record.meetLink.url || record.meetLink, '_blank')}
              style={{ padding: 0 }}
            >
              🎥 Join Meeting
            </Button>
          )}
          
          {/* Legacy pending status support */}
          {record.status === 'pending' && (
            <Button 
              size="small" 
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleConfirmBooking(record)}
              loading={loading}
              block
            >
              Confirm & Create Meet
            </Button>
          )}
          
          {/* Cancel button for active bookings */}
          {(record.status === 'pending' || record.status === 'pending_admin_confirmation' || record.status === 'confirmed') && (
            <Button 
              size="small" 
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => handleStatusChange(record.id, 'cancelled')}
              disabled={loading}
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
              <Option value="pending_admin_confirmation">Needs Confirmation</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="rejected">Rejected</Option>
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
                {/* Confirm/Reject for pending admin confirmation */}
                {selectedBooking.status === 'pending_admin_confirmation' && (
                  <>
                    <Button 
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={() => {
                        handleConfirmBooking(selectedBooking);
                        setDetailModalVisible(false);
                      }}
                      loading={loading}
                    >
                      Confirm Booking
                    </Button>
                    <Button 
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => {
                        handleRejectBooking(selectedBooking);
                        setDetailModalVisible(false);
                      }}
                      loading={loading}
                    >
                      Reject Booking
                    </Button>
                  </>
                )}
                
                {/* Legacy pending status */}
                {selectedBooking.status === 'pending' && (
                  <Button 
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      handleConfirmBooking(selectedBooking);
                      setDetailModalVisible(false);
                    }}
                    loading={loading}
                  >
                    Confirm Booking
                  </Button>
                )}
                
                {/* Mark complete for confirmed */}
                {selectedBooking.status === 'confirmed' && (
                  <>
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
                    {selectedBooking.meetLink && (
                      <Button 
                        type="link"
                        onClick={() => window.open(selectedBooking.meetLink.url || selectedBooking.meetLink, '_blank')}
                      >
                        🎥 Join Meeting
                      </Button>
                    )}
                  </>
                )}
                
                {/* Cancel for active bookings */}
                {(selectedBooking.status === 'pending' || selectedBooking.status === 'pending_admin_confirmation' || selectedBooking.status === 'confirmed') && (
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