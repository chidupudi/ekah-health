import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Typography,
  Tag,
  Space,
  Button,
  Input,
  Select,
  DatePicker,
  Avatar,
  Tooltip,
  message,
  Modal,
  Descriptions,
  Statistic,
  Row,
  Col
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  CalendarOutlined,
  GoogleOutlined,
  MailOutlined,
  ClockCircleOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useTheme } from '../ParticleBackground';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailModalVisible, setUserDetailModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState([]);

  const { isDark } = useTheme();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchText, filterRole, dateRange]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('lastLogin', 'desc')
      );

      const snapshot = await getDocs(usersQuery);
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        lastLogin: doc.data().lastLogin?.toDate()
      }));

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Filter by date range
    if (dateRange.length === 2) {
      filtered = filtered.filter(user => {
        const userDate = user.lastLogin || user.createdAt;
        return userDate >= dateRange[0].toDate() && userDate <= dateRange[1].toDate();
      });
    }

    setFilteredUsers(filtered);
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return date.toLocaleString();
  };

  const getActivityStatus = (lastLogin) => {
    if (!lastLogin) return { status: 'never', text: 'Never logged in', color: 'default' };

    const now = new Date();
    const diffHours = (now - lastLogin) / (1000 * 60 * 60);

    if (diffHours < 1) {
      return { status: 'online', text: 'Online', color: 'green' };
    } else if (diffHours < 24) {
      return { status: 'recent', text: 'Active today', color: 'blue' };
    } else if (diffHours < 168) { // 7 days
      return { status: 'week', text: 'Active this week', color: 'orange' };
    } else {
      return { status: 'inactive', text: 'Inactive', color: 'red' };
    }
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const activeToday = users.filter(user => {
      if (!user.lastLogin) return false;
      const diffHours = (new Date() - user.lastLogin) / (1000 * 60 * 60);
      return diffHours < 24;
    }).length;

    const newThisWeek = users.filter(user => {
      if (!user.createdAt) return false;
      const diffDays = (new Date() - user.createdAt) / (1000 * 60 * 60 * 24);
      return diffDays < 7;
    }).length;

    const googleUsers = users.filter(user => user.photoURL).length;

    return { totalUsers, activeToday, newThisWeek, googleUsers };
  };

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setUserDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar
            src={record.photoURL}
            icon={<UserOutlined />}
            style={{ backgroundColor: isDark ? '#1890ff' : '#87d068' }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{name || 'No name'}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role?.toUpperCase() || 'USER'}
        </Tag>
      ),
    },
    {
      title: 'Auth Method',
      key: 'authMethod',
      render: (_, record) => (
        <Space>
          {record.photoURL ? (
            <Tag icon={<GoogleOutlined />} color="red">Google</Tag>
          ) : (
            <Tag icon={<MailOutlined />} color="blue">Email</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Activity Status',
      key: 'status',
      render: (_, record) => {
        const activity = getActivityStatus(record.lastLogin);
        return <Tag color={activity.color}>{activity.text}</Tag>;
      },
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin) => (
        <div>
          <div>{formatDate(lastLogin)}</div>
          {lastLogin && (
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {Math.floor((new Date() - lastLogin) / (1000 * 60 * 60))}h ago
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => formatDate(createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => showUserDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const stats = getUserStats();

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>👥 Users Management</Title>
        <Text type="secondary">
          Manage and monitor user activity across the platform
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: isDark ? '#1890ff' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Today"
              value={stats.activeToday}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="New This Week"
              value={stats.newThisWeek}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Google Users"
              value={stats.googleUsers}
              prefix={<GoogleOutlined />}
              valueStyle={{ color: '#f56565' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <Search
              placeholder="Search users..."
              allowClear
              style={{ width: 250 }}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              value={filterRole}
              onChange={setFilterRole}
              style={{ width: 120 }}
            >
              <Option value="all">All Roles</Option>
              <Option value="user">Users</Option>
              <Option value="admin">Admins</Option>
            </Select>
            <RangePicker
              placeholder={['Start date', 'End date']}
              onChange={setDateRange}
              style={{ width: 250 }}
            />
          </Space>
          <Button
            icon={<SearchOutlined />}
            onClick={fetchUsers}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* User Detail Modal */}
      <Modal
        title={
          <Space>
            <Avatar
              src={selectedUser?.photoURL}
              icon={<UserOutlined />}
              size="large"
            />
            <div>
              <div>{selectedUser?.name || 'No name'}</div>
              <Text type="secondary">{selectedUser?.email}</Text>
            </div>
          </Space>
        }
        visible={userDetailModalVisible}
        onCancel={() => setUserDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setUserDetailModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedUser && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="User ID">
              {selectedUser.id}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color={selectedUser.role === 'admin' ? 'red' : 'blue'}>
                {selectedUser.role?.toUpperCase() || 'USER'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Authentication Method">
              {selectedUser.photoURL ? (
                <Tag icon={<GoogleOutlined />} color="red">Google Sign-in</Tag>
              ) : (
                <Tag icon={<MailOutlined />} color="blue">Email & Password</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Activity Status">
              {(() => {
                const activity = getActivityStatus(selectedUser.lastLogin);
                return <Tag color={activity.color}>{activity.text}</Tag>;
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="Last Login">
              <Space>
                <LoginOutlined />
                {formatDate(selectedUser.lastLogin)}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Account Created">
              <Space>
                <CalendarOutlined />
                {formatDate(selectedUser.createdAt)}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Profile Photo">
              {selectedUser.photoURL ? (
                <Avatar
                  src={selectedUser.photoURL}
                  size={64}
                />
              ) : (
                <Text type="secondary">No profile photo</Text>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default UsersManagement;