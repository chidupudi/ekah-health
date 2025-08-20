// src/components/admin/ServicesManagement.js
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
  Space, 
  Typography, 
  Tag, 
  Popconfirm,
  Row,
  Col,
  Alert,
  message,
  Tabs
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { servicesData, serviceGroups } from '../../pages/Services/data/servicesData';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ServicesManagement = () => {
  const [services, setServices] = useState([...servicesData]);
  const [categories, setCategories] = useState([...serviceGroups]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize services from data
    setServices([...servicesData]);
    setCategories([...serviceGroups]);
  }, []);

  const handleAddService = () => {
    setEditingService(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    form.setFieldsValue({
      title: service.title,
      duration: service.duration,
      category: service.category,
      description: service.description,
      rating: service.rating,
      price: service.options[0]?.price,
      includes: service.includes?.join('\n')
    });
    setModalVisible(true);
  };

  const handleDeleteService = (serviceId) => {
    setServices(prevServices => 
      prevServices.filter(service => service.id !== serviceId)
    );
    message.success('Service deleted successfully');
  };

  const handleSaveService = async (values) => {
    setLoading(true);
    try {
      const serviceData = {
        ...values,
        includes: values.includes?.split('\n').filter(item => item.trim()) || [],
        options: [
          {
            type: "Complete Program",
            price: values.price?.toString() || "0",
            duration: values.duration || "1 Month"
          }
        ]
      };

      if (editingService) {
        // Update existing service
        setServices(prevServices =>
          prevServices.map(service =>
            service.id === editingService.id
              ? { ...service, ...serviceData }
              : service
          )
        );
        message.success('Service updated successfully');
      } else {
        // Add new service
        const newService = {
          id: Math.max(...services.map(s => s.id)) + 1,
          ...serviceData,
          icon: '🔹' // Default icon
        };
        setServices(prevServices => [...prevServices, newService]);
        message.success('Service added successfully');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const serviceColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category) => <Tag color="blue">{category}</Tag>
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
    },
    {
      title: 'Price (₹)',
      key: 'price',
      width: 100,
      render: (_, record) => record.options[0]?.price || 'N/A',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 80,
      render: (rating) => <Tag color="gold">{rating} ⭐</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            title="View Details"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditService(record)}
            title="Edit Service"
          />
          <Popconfirm
            title="Are you sure you want to delete this service?"
            onConfirm={() => handleDeleteService(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
              title="Delete Service"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const categoryColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      width: 60,
      render: (icon) => <span style={{ fontSize: '18px' }}>{icon}</span>
    },
    {
      title: 'Services Count',
      key: 'servicesCount',
      width: 120,
      render: (_, record) => record.services?.length || 0,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    }
  ];

  const tabItems = [
    {
      key: 'services',
      label: 'Services',
      children: (
        <div>
          <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
            <Col>
              <Space>
                <Title level={4} style={{ margin: 0 }}>Services Management</Title>
                <Tag color="blue">{services.length} Services</Tag>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button icon={<ReloadOutlined />}>Refresh</Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleAddService}
                >
                  Add Service
                </Button>
              </Space>
            </Col>
          </Row>

          <Alert
            message="Services Management"
            description="Here you can view, add, edit, and delete services. Changes will be reflected immediately on the website."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <Card>
            <Table
              columns={serviceColumns}
              dataSource={services}
              rowKey="id"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} services`
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </div>
      )
    },
    {
      key: 'categories',
      label: 'Categories',
      children: (
        <div>
          <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
            <Col>
              <Space>
                <Title level={4} style={{ margin: 0 }}>Categories Management</Title>
                <Tag color="green">{categories.length} Categories</Tag>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button icon={<ReloadOutlined />}>Refresh</Button>
                <Button type="primary" icon={<PlusOutlined />}>Add Category</Button>
              </Space>
            </Col>
          </Row>

          <Alert
            message="Categories Management"
            description="Manage service categories and their groupings. Categories help organize services for better user experience."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <Card>
            <Table
              columns={categoryColumns}
              dataSource={categories}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </div>
      )
    }
  ];

  return (
    <>
      <Tabs items={tabItems} />

      <Modal
        title={editingService ? 'Edit Service' : 'Add New Service'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveService}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Service Title"
                rules={[{ required: true, message: 'Please enter service title' }]}
              >
                <Input placeholder="Enter service title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Duration"
                rules={[{ required: true, message: 'Please enter duration' }]}
              >
                <Input placeholder="e.g., 3 MONTHS" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="Programs">Programs</Option>
                  <Option value="Consultation">Consultation</Option>
                  <Option value="Women's Health">Women's Health</Option>
                  <Option value="Women & Pregnancy">Women & Pregnancy</Option>
                  <Option value="Specials">Specials</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Price (₹)"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  placeholder="Enter price"
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea
              rows={3}
              placeholder="Enter service description"
            />
          </Form.Item>

          <Form.Item
            name="includes"
            label="Includes (one per line)"
          >
            <TextArea
              rows={4}
              placeholder="Complete Diet & Yoga Program&#10;2 Consultations per Month&#10;24/7 WhatsApp Support"
            />
          </Form.Item>

          <Form.Item
            name="rating"
            label="Rating"
          >
            <InputNumber
              placeholder="4.5"
              min={0}
              max={5}
              step={0.1}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingService ? 'Update Service' : 'Add Service'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ServicesManagement;