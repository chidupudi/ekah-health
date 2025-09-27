import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Input,
  Form,
  Upload,
  message,
  Table,
  Space,
  Modal,
  Image,
  Switch,
  Tooltip,
  Divider,
  Row,
  Col,
  Tag,
  Popconfirm,
  Alert
} from 'antd';
import QRCode from 'qrcode';
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  QrcodeOutlined,
  BankOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../services/firebase/config';
import { useTheme } from '../ParticleBackground';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PaymentsManagement = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [paymentDetailModal, setPaymentDetailModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [generatedQRCode, setGeneratedQRCode] = useState(null);
  const [generatingQR, setGeneratingQR] = useState(false);

  const { isDark } = useTheme();

  useEffect(() => {
    fetchPaymentMethods();
    fetchPendingPayments();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const methodsQuery = query(
        collection(db, 'paymentMethods'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(methodsQuery);
      const methods = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      message.error('Failed to fetch payment methods');
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const paymentsQuery = query(
        collection(db, 'payments'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(paymentsQuery);
      const payments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setPendingPayments(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      message.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (upiId) => {
    try {
      setGeneratingQR(true);

      // Simple UPI URL
      const upiUrl = `upi://pay?pa=${upiId}`;

      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(upiUrl, {
        width: 200,
        margin: 1
      });

      setGeneratedQRCode(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setGeneratingQR(false);
    }
  };

  const handleAddMethod = () => {
    setEditingMethod(null);
    form.resetFields();
    setGeneratedQRCode(null);
    setModalVisible(true);
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
    form.setFieldsValue(method);
    setGeneratedQRCode(null);
    setModalVisible(true);
  };

  const handleDeleteMethod = async (methodId) => {
    try {
      await deleteDoc(doc(db, 'paymentMethods', methodId));
      message.success('Payment method deleted successfully');
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      message.error('Failed to delete payment method');
    }
  };

  const handleSaveMethod = async (values) => {
    try {
      setLoading(true);

      const methodData = {
        name: values.name,
        upiId: values.upiId,
        isActive: values.isActive !== undefined ? values.isActive : true,
        updatedAt: serverTimestamp()
      };

      if (editingMethod) {
        await updateDoc(doc(db, 'paymentMethods', editingMethod.id), methodData);
        message.success('Payment method updated successfully');
      } else {
        await addDoc(collection(db, 'paymentMethods'), {
          ...methodData,
          createdAt: serverTimestamp()
        });
        message.success('Payment method added successfully');
      }

      setModalVisible(false);
      setGeneratedQRCode(null);
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      message.error('Failed to save payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (paymentId) => {
    try {
      // First approve the payment
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: 'admin'
      });

      // Find the payment to get booking ID
      const payment = pendingPayments.find(p => p.id === paymentId);

      if (payment && payment.bookingId) {
        // Update the booking status to show it's ready for booking approval
        await updateDoc(doc(db, 'bookings', payment.bookingId), {
          paymentStatus: 'approved',
          status: 'payment_approved', // Ready for final booking approval
          paymentApprovedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      message.success('Payment approved! Booking is now ready for final approval in Bookings tab.');
      fetchPendingPayments();
    } catch (error) {
      console.error('Error approving payment:', error);
      message.error('Failed to approve payment');
    }
  };

  const handleRejectPayment = async (paymentId) => {
    try {
      // Reject the payment
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectedBy: 'admin'
      });

      // Find the payment to get booking ID
      const payment = pendingPayments.find(p => p.id === paymentId);

      if (payment && payment.bookingId) {
        // Update the booking status to rejected
        await updateDoc(doc(db, 'bookings', payment.bookingId), {
          paymentStatus: 'rejected',
          status: 'payment_rejected',
          paymentRejectedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      message.success('Payment rejected. User will be notified.');
      fetchPendingPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      message.error('Failed to reject payment');
    }
  };

  const showPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setPaymentDetailModal(true);
  };

  const paymentMethodColumns = [
    {
      title: 'Method Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <BankOutlined style={{ color: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <Text type="secondary">{record.description}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'UPI ID',
      dataIndex: 'upiId',
      key: 'upiId',
      render: (upiId) => (
        <Text code copyable>{upiId}</Text>
      ),
    },
    {
      title: 'QR Code',
      dataIndex: 'qrCodeUrl',
      key: 'qrCodeUrl',
      render: (qrCodeUrl) => (
        qrCodeUrl ? (
          <Image
            src={qrCodeUrl}
            width={50}
            height={50}
            style={{ borderRadius: '4px' }}
          />
        ) : (
          <Text type="secondary">No QR Code</Text>
        )
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditMethod(record)}
            />
          </Tooltip>
          <Tooltip title="View QR Code">
            <Button
              icon={<QrcodeOutlined />}
              size="small"
              onClick={() => {
                if (record.qrCodeUrl) {
                  Modal.info({
                    title: `QR Code - ${record.name}`,
                    content: (
                      <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Image src={record.qrCodeUrl} width={200} />
                        <div style={{ marginTop: '10px' }}>
                          <Text>UPI ID: </Text>
                          <Text code copyable>{record.upiId}</Text>
                        </div>
                      </div>
                    ),
                    width: 300,
                  });
                }
              }}
              disabled={!record.qrCodeUrl}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this payment method?"
            onConfirm={() => handleDeleteMethod(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const paymentColumns = [
    {
      title: 'User',
      dataIndex: 'userEmail',
      key: 'userEmail',
      render: (email, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.userName || 'Unknown'}</div>
          <Text type="secondary">{email}</Text>
        </div>
      ),
    },
    {
      title: 'Service',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <Text strong>₹{amount}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          pending: 'orange',
          approved: 'green',
          rejected: 'red'
        };
        return (
          <Tag color={colors[status] || 'default'}>
            {status?.toUpperCase() || 'PENDING'}
          </Tag>
        );
      },
    },
    {
      title: 'Submitted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? date.toLocaleString() : 'Unknown',
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
              onClick={() => showPaymentDetails(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button
                  icon={<CheckCircleOutlined />}
                  size="small"
                  type="primary"
                  onClick={() => handleApprovePayment(record.id)}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button
                  icon={<CloseCircleOutlined />}
                  size="small"
                  danger
                  onClick={() => handleRejectPayment(record.id)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>💳 Payments Management</Title>
        <Text type="secondary">
          Manage UPI payment methods and approve user payments
        </Text>
      </div>

      {/* Payment Methods Section */}
      <Card
        title={
          <Space>
            <BankOutlined />
            Payment Methods
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddMethod}
          >
            Add Payment Method
          </Button>
        }
        style={{ marginBottom: '24px' }}
      >
        <Table
          columns={paymentMethodColumns}
          dataSource={paymentMethods}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Pending Payments Section */}
      <Card
        title={
          <Space>
            <QrcodeOutlined />
            Payment Approvals
            <Tag color="orange">{pendingPayments.filter(p => p.status === 'pending').length} Pending</Tag>
          </Space>
        }
      >
        <Table
          columns={paymentColumns}
          dataSource={pendingPayments}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Add/Edit Payment Method Modal */}
      <Modal
        title={editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveMethod}
        >
          <Form.Item
            name="name"
            label="Method Name"
            rules={[{ required: true, message: 'Please enter method name' }]}
          >
            <Input placeholder="e.g., Primary UPI, Business Account" />
          </Form.Item>


          <Form.Item
            name="upiId"
            label="UPI ID"
            rules={[{ required: true, message: 'Please enter UPI ID' }]}
          >
            <Input
              placeholder="example@upi or 9876543210@paytm"
              onChange={(e) => {
                const upiId = e.target.value;
                // Auto-generate QR when user types UPI ID
                if (upiId && upiId.includes('@') && upiId.length > 5) {
                  generateQRCode(upiId.trim());
                } else {
                  setGeneratedQRCode(null);
                }
              }}
            />
          </Form.Item>

          {/* Show generated QR code */}
          {generatedQRCode && (
            <Form.Item label="QR Code Preview">
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <img
                  src={generatedQRCode}
                  alt="UPI QR Code"
                  width={150}
                  style={{ border: '1px solid #d9d9d9' }}
                />
                <div style={{ marginTop: '8px', color: '#666' }}>
                  UPI QR Code - Ready to use
                </div>
              </div>
            </Form.Item>
          )}


          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={uploading || loading}
              >
                {editingMethod ? 'Update' : 'Add'} Method
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Payment Detail Modal */}
      <Modal
        title="Payment Details"
        visible={paymentDetailModal}
        onCancel={() => setPaymentDetailModal(false)}
        footer={[
          <Button key="close" onClick={() => setPaymentDetailModal(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedPayment && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="User Information" size="small">
                  <p><strong>Name:</strong> {selectedPayment.userName || 'Unknown'}</p>
                  <p><strong>Email:</strong> {selectedPayment.userEmail}</p>
                  <p><strong>Service:</strong> {selectedPayment.serviceName}</p>
                  <p><strong>Amount:</strong> ₹{selectedPayment.amount}</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Payment Screenshot" size="small">
                  {selectedPayment.screenshotUrl || selectedPayment.screenshotData ? (
                    <div>
                      <Image
                        src={selectedPayment.screenshotUrl || `data:${selectedPayment.screenshotType || 'image/png'};base64,${selectedPayment.screenshotData}`}
                        width="100%"
                        style={{ maxWidth: '250px' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                      />
                      {selectedPayment.screenshotFileName && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                          File: {selectedPayment.screenshotFileName}
                        </div>
                      )}
                      {selectedPayment.screenshotSize && (
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Size: {(selectedPayment.screenshotSize / 1024).toFixed(1)} KB
                        </div>
                      )}
                    </div>
                  ) : (
                    <Text type="secondary">No screenshot uploaded</Text>
                  )}
                </Card>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Status & Actions" size="small">
                  <p><strong>Current Status:</strong>
                    <Tag
                      color={selectedPayment.status === 'approved' ? 'green' : selectedPayment.status === 'rejected' ? 'red' : 'orange'}
                      style={{ marginLeft: '8px' }}
                    >
                      {selectedPayment.status?.toUpperCase() || 'PENDING'}
                    </Tag>
                  </p>
                  <p><strong>Submitted:</strong> {selectedPayment.createdAt?.toLocaleString()}</p>

                  {selectedPayment.status === 'pending' && (
                    <Space style={{ marginTop: '16px' }}>
                      <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => {
                          handleApprovePayment(selectedPayment.id);
                          setPaymentDetailModal(false);
                        }}
                      >
                        Approve Payment
                      </Button>
                      <Button
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => {
                          handleRejectPayment(selectedPayment.id);
                          setPaymentDetailModal(false);
                        }}
                      >
                        Reject Payment
                      </Button>
                    </Space>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentsManagement;