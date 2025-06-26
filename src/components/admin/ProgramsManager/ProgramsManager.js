// src/components/admin/ProgramsManager/ProgramsManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Tag, 
  Space,
  Typography,
  Row,
  Col,
  Alert,
  Popconfirm,
  message,
  Switch,
  Upload
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Box } from '@mui/material';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../../services/firebase/config';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ProgramsManager = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [form] = Form.useForm();

  // Categories for programs
  const CATEGORIES = [
    { value: 'personal', label: 'Personal Consultation', color: '#FF6B35' },
    { value: 'holistic', label: 'Holistic Wellness', color: '#4ECDC4' },
    { value: 'women-health', label: 'Women\'s Health', color: '#E74C3C' },
    { value: 'group', label: 'Group Programs', color: '#95A5A6' }
  ];

  // Default program template
  const DEFAULT_PROGRAM = {
    title: '',
    category: 'personal',
    price: 0,
    originalPrice: 0,
    duration: '',
    type: '',
    description: '',
    features: [],
    practitionerType: '',
    rating: 4.5,
    sessionsIncluded: 1,
    duration_details: '',
    popular: false,
    color: '#FF6B35',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    icon: '👩‍⚕️',
    benefits: [],
    isActive: true
  };

  // Load programs from Firebase
  useEffect(() => {
    const loadPrograms = async () => {
      setLoading(true);
      try {
        // Listen for real-time updates
        const unsubscribe = onSnapshot(collection(db, 'wellness_programs'), (snapshot) => {
          const programsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setPrograms(programsData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading programs:', error);
        message.error('Failed to load programs');
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const programData = {
        ...values,
        features: values.features || [],
        benefits: values.benefits || [],
        updatedAt: new Date().toISOString(),
        gradient: getCategoryGradient(values.category),
        color: getCategoryColor(values.category),
        icon: getCategoryIcon(values.category)
      };

      if (editingProgram) {
        // Update existing program
        await updateDoc(doc(db, 'wellness_programs', editingProgram.id), programData);
        message.success('Program updated successfully!');
      } else {
        // Create new program
        programData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'wellness_programs'), programData);
        message.success('Program created successfully!');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingProgram(null);
    } catch (error) {
      console.error('Error saving program:', error);
      message.error('Failed to save program');
    } finally {
      setLoading(false);
    }
  };

  // Handle program deletion
  const handleDelete = async (programId) => {
    try {
      await deleteDoc(doc(db, 'wellness_programs', programId));
      message.success('Program deleted successfully!');
    } catch (error) {
      console.error('Error deleting program:', error);
      message.error('Failed to delete program');
    }
  };

  // Get category styling
  const getCategoryColor = (category) => {
    const categoryMap = {
      'personal': '#FF6B35',
      'holistic': '#4ECDC4',
      'women-health': '#E74C3C',
      'group': '#95A5A6'
    };
    return categoryMap[category] || '#FF6B35';
  };

  const getCategoryGradient = (category) => {
    const gradientMap = {
      'personal': 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      'holistic': 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
      'women-health': 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
      'group': 'linear-gradient(135deg, #95A5A6 0%, #7F8C8D 100%)'
    };
    return gradientMap[category] || 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)';
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'personal': '👩‍⚕️',
      'holistic': '🧘‍♀️',
      'women-health': '🌸',
      'group': '👥'
    };
    return iconMap[category] || '👩‍⚕️';
  };

  // Open edit modal
  const handleEdit = (program) => {
    setEditingProgram(program);
    form.setFieldsValue({
      ...program,
      features: program.features?.join('\n') || '',
      benefits: program.benefits?.join('\n') || ''
    });
    setModalVisible(true);
  };

  // Open create modal
  const handleCreate = () => {
    setEditingProgram(null);
    form.resetFields();
    form.setFieldsValue(DEFAULT_PROGRAM);
    setModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: 'Program',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: record.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}
          >
            {record.icon}
          </div>
          <div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.type}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const categoryInfo = CATEGORIES.find(cat => cat.value === category);
        return (
          <Tag color={getCategoryColor(category)}>
            {categoryInfo?.label || category}
          </Tag>
        );
      },
    },
    {
      title: 'Pricing',
      key: 'pricing',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '600', color: '#2c3e50' }}>
            ${record.price}
          </div>
          {record.originalPrice > record.price && (
            <div style={{ 
              fontSize: '12px', 
              color: '#95a5a6',
              textDecoration: 'line-through' 
            }}>
              ${record.originalPrice}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Sessions',
      dataIndex: 'sessionsIncluded',
      key: 'sessionsIncluded',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <div>
          <Tag color={record.popular ? 'gold' : 'default'}>
            {record.popular ? 'Popular' : 'Standard'}
          </Tag>
          <Tag color={record.isActive ? 'green' : 'red'}>
            {record.isActive ? 'Active' : 'Inactive'}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {/* View details */}}
          >
            View
          </Button>
          <Button 
            type="default" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this program?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="default" 
              size="small" 
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Wellness Programs Management
          </Title>
          <Text type="secondary">
            Manage your wellness programs, pricing, and content
          </Text>
        </Col>
        <Col>
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreate}
              size="large"
            >
              Add New Program
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                {programs.length}
              </div>
              <div style={{ color: '#666' }}>Total Programs</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                {programs.filter(p => p.isActive).length}
              </div>
              <div style={{ color: '#666' }}>Active Programs</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                {programs.filter(p => p.popular).length}
              </div>
              <div style={{ color: '#666' }}>Popular Programs</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                ${ programs.reduce((sum, p) => sum + (p.price || 0), 0).toFixed(0) }
              </div>
              <div style={{ color: '#666' }}>Total Revenue</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Programs Table */}
      <Card>
        <Table
          dataSource={programs}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add/Edit Program Modal */}
      <Modal
        title={editingProgram ? 'Edit Program' : 'Add New Program'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingProgram(null);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={DEFAULT_PROGRAM}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Program Title"
                name="title"
                rules={[{ required: true, message: 'Please enter program title' }]}
              >
                <Input placeholder="e.g., One-on-One Consultation" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {CATEGORIES.map(cat => (
                    <Option key={cat.value} value={cat.value}>
                      {cat.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Current Price ($)"
                name="price"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  placeholder="149.99"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Original Price ($)"
                name="originalPrice"
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  placeholder="199.99"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Sessions Included"
                name="sessionsIncluded"
                rules={[{ required: true, message: 'Please enter sessions count' }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="1"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Duration"
                name="duration"
                rules={[{ required: true, message: 'Please enter duration' }]}
              >
                <Input placeholder="e.g., Per Session, 1 Month, 3 Months" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Program Type"
                name="type"
                rules={[{ required: true, message: 'Please enter program type' }]}
              >
                <Input placeholder="e.g., Individual, Comprehensive, Group" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Duration Details"
            name="duration_details"
          >
            <Input placeholder="e.g., 60-90 minutes per session" />
          </Form.Item>

          <Form.Item
            label="Practitioner Type"
            name="practitionerType"
            rules={[{ required: true, message: 'Please enter practitioner type' }]}
          >
            <Input placeholder="e.g., Certified Health Consultant" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea
              rows={4}
              placeholder="Describe what this program offers..."
            />
          </Form.Item>

          <Form.Item
            label="Features (one per line)"
            name="features"
            rules={[{ required: true, message: 'Please enter features' }]}
          >
            <TextArea
              rows={6}
              placeholder={`Comprehensive health assessment
Personalized wellness plan
One-on-one expert guidance
Follow-up recommendations`}
            />
          </Form.Item>

          <Form.Item
            label="Benefits (one per line)"
            name="benefits"
          >
            <TextArea
              rows={4}
              placeholder={`Immediate health insights
Personalized action plan
Expert guidance
Flexible scheduling`}
            />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Rating"
                name="rating"
              >
                <InputNumber
                  min={1}
                  max={5}
                  step={0.1}
                  style={{ width: '100%' }}
                  placeholder="4.5"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Popular Program"
                name="popular"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Active"
                name="isActive"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: '24px', textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                  setEditingProgram(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
              >
                {editingProgram ? 'Update Program' : 'Create Program'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProgramsManager;