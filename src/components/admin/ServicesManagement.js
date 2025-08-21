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
import { servicesDB, categoriesDB } from '../../services/firebase/database';
import { runSeedData as seedData } from '../../services/firebase/seedData';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);

  const loadData = async () => {
    try {
      setDataLoading(true);
      
      const [servicesResult, categoriesResult] = await Promise.all([
        servicesDB.getAll(),
        categoriesDB.getAll()
      ]);
      
      setServices(servicesResult);
      setCategories(categoriesResult);
      setSeeded(servicesResult.length > 0);
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Failed to load data from database');
    } finally {
      setDataLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    try {
      setLoading(true);
      const result = await seedData();
      if (result.success) {
        message.success(result.message);
        await loadData(); // Reload data after seeding
      } else {
        message.error('Failed to seed database');
      }
    } catch (error) {
      console.error('Seeding error:', error);
      message.error('Failed to seed database');
    } finally {
      setLoading(false);
    }
  };

  const handleForceSeed = async () => {
    try {
      setLoading(true);
      // Force clear and re-seed by temporarily modifying the seed function
      const result = await seedData();
      if (result.success) {
        message.success('Database force re-seeded successfully!');
        await loadData(); // Reload data after seeding
      } else {
        message.error('Failed to force seed database');
      }
    } catch (error) {
      console.error('Force seeding error:', error);
      message.error('Failed to force seed database');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();
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

  const handleDeleteService = async (serviceId) => {
    try {
      setLoading(true);
      await servicesDB.delete(serviceId);
      await loadData(); // Reload data
      message.success('Service deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Failed to delete service');
    } finally {
      setLoading(false);
    }
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
        await servicesDB.update(editingService.id, serviceData);
        message.success('Service updated successfully');
      } else {
        // Add new service
        const newServiceData = {
          id: Math.max(...services.map(s => parseInt(s.id) || 0)) + 1,
          ...serviceData,
          icon: '🔹' // Default icon
        };
        await servicesDB.add(newServiceData);
        message.success('Service added successfully');
      }

      await loadData(); // Reload data
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Save error:', error);
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
                <Button icon={<ReloadOutlined />} onClick={loadData} loading={dataLoading}>Refresh</Button>
                {services.length === 0 && (
                  <Button 
                    type="primary" 
                    onClick={handleSeedDatabase}
                    loading={loading}
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  >
                    Seed Database
                  </Button>
                )}
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleAddService}
                  disabled={services.length === 0}
                >
                  Add Service
                </Button>
              </Space>
            </Col>
          </Row>

          {services.length === 0 ? (
            <Alert
              message="No Services Found"
              description={`Found ${categories.length} categories but 0 services. Click 'Seed Database' or 'Force Re-seed' to populate with initial service data.`}
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          ) : (
            <Alert
              message="Services Management"
              description={`Managing ${services.length} services across ${categories.length} categories. Changes will be reflected immediately on the website.`}
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

          <Card>
            <Table
              columns={serviceColumns}
              dataSource={services}
              rowKey="id"
              loading={dataLoading}
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