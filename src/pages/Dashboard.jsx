import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
  message,
} from "antd";
import {
  EditOutlined,
  LogoutOutlined,
  PlusOutlined,
  SearchOutlined,
  TruckOutlined,
} from "@ant-design/icons";

import { auth, db } from "../firebase";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Replace these with your EmailJS values
const EMAILJS_SERVICE_ID = "service_ejdcwyo";
const EMAILJS_TEMPLATE_ID = "template_6shuai9";
const EMAILJS_PUBLIC_KEY = "8qChXLEv2GyKk-444";

function Dashboard() {
  const navigate = useNavigate();

  const [shipment, setShipment] = useState(null);
  const [selectedTrackingId, setSelectedTrackingId] = useState("");
  const [instruction, setInstruction] = useState("");

  const [userRole, setUserRole] = useState(null);

  const [loading, setLoading] = useState(false);
  const [savingInstruction, setSavingInstruction] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);
  const [error, setError] = useState("");
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!auth.currentUser) {
        setLoadingRole(false);
        return;
      }

      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Failed to load user role:", error);
        setUserRole(null);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchUserRole();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "green";
      case "delayed":
        return "orange";
      case "failed":
        return "red";
      case "out for delivery":
        return "blue";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  const handleSearch = async (values) => {
    setError("");
    setShipment(null);
    setLoading(true);

    try {
      const trackingId = values.trackingId.trim().toUpperCase();
      setSelectedTrackingId(trackingId);

      const shipmentRef = doc(db, "shipments", trackingId);
      const shipmentSnap = await getDoc(shipmentRef);

      if (!shipmentSnap.exists()) {
        setError("No shipment found for this tracking ID.");
        setInstruction("");
        return;
      }

      const shipmentData = shipmentSnap.data();

      setShipment(shipmentData);
      setInstruction(shipmentData.specialInstructions || "");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading shipment details.");
    } finally {
      setLoading(false);
    }
  };

  const sendInstructionEmail = async (updatedShipment, updatedInstruction) => {
    const customerEmail = updatedShipment?.email?.trim();

    if (!customerEmail) {
      throw new Error("Customer email is missing in Firestore.");
    }

    const templateParams = {
      to_email: customerEmail,
      customer_name: updatedShipment.customerName || "Customer",
      tracking_id: updatedShipment.trackingId || selectedTrackingId,
      status: updatedShipment.status || "N/A",
      driver_name: updatedShipment.driverName || "N/A",
      current_location: updatedShipment.currentLocation || "N/A",
      eta: updatedShipment.eta || "N/A",
      special_instructions: updatedInstruction,
    };

    return emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: EMAILJS_PUBLIC_KEY,
      },
    );
  };

  const handleOpenInstructionModal = () => {
    setInstruction(shipment?.specialInstructions || "");
    setIsInstructionModalOpen(true);
  };

  const handleCloseInstructionModal = () => {
    setIsInstructionModalOpen(false);
    setInstruction(shipment?.specialInstructions || "");
  };

  const handleSaveInstruction = async () => {
    if (!selectedTrackingId) {
      message.error("Please search a tracking ID first.");
      return;
    }

    if (!instruction.trim()) {
      message.error("Please enter special instructions.");
      return;
    }

    if (!shipment?.email?.trim()) {
      message.error("Customer email is missing in Firestore.");
      return;
    }

    setSavingInstruction(true);

    try {
      const updatedInstruction = instruction.trim();

      const shipmentRef = doc(db, "shipments", selectedTrackingId);

      await updateDoc(shipmentRef, {
        specialInstructions: updatedInstruction,
        updatedAt: new Date().toISOString(),
      });

      const updatedShipment = {
        ...shipment,
        trackingId: shipment.trackingId || selectedTrackingId,
        specialInstructions: updatedInstruction,
      };

      setShipment(updatedShipment);

      await sendInstructionEmail(updatedShipment, updatedInstruction);

      setIsInstructionModalOpen(false);

      message.success(
        "Special instructions updated and email sent successfully.",
      );
    } catch (err) {
      console.error(err);
      message.error(
        "Special instruction was not completed. Please check Firebase or EmailJS settings.",
      );
    } finally {
      setSavingInstruction(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Header
        style={{
          background: "#102a43",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Flex align="center" gap={12}>
          <TruckOutlined style={{ color: "#fff", fontSize: 26 }} />
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Smart Logistics Dashboard
          </Title>
        </Flex>

        <Space>
          {!loadingRole && userRole === "admin" && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/add-shipment")}
            >
              Add Shipment
            </Button>
          )}

          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: 32 }}>
        <Card
          style={{
            marginTop: 24,
            borderRadius: 14,
          }}
        >
          <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
            <div>
              <Title level={3} style={{ marginBottom: 4 }}>
                Track Shipment
              </Title>
            </div>

            {userRole && (
              <Tag color={userRole === "admin" ? "gold" : "blue"}>
                Role: {userRole}
              </Tag>
            )}
          </Flex>

          <Form
            layout="vertical"
            onFinish={handleSearch}
            style={{ marginTop: 24 }}
            initialValues={{
              trackingId: "TRK1001",
            }}
          >
            <Row gutter={12}>
              <Col xs={24} md={18}>
                <Form.Item
                  label="Enter a tracking ID to view shipment details."
                  name="trackingId"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a tracking ID.",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Example: TRK1001"
                    prefix={<SearchOutlined />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={6}>
                <Form.Item label=" ">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                    icon={<SearchOutlined />}
                  >
                    Search
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {error && (
            <Alert
              type="error"
              message={error}
              showIcon
              style={{ marginTop: 16 }}
            />
          )}

          {loading && (
            <Flex justify="center" style={{ marginTop: 32 }}>
              <Spin size="large" />
            </Flex>
          )}

          {shipment && !loading && (
            <Card
              title={
                <Space>
                  <span>{shipment.trackingId || selectedTrackingId}</span>
                  <Tag color={getStatusColor(shipment.status)}>
                    {shipment.status || "N/A"}
                  </Tag>
                </Space>
              }
              style={{ marginTop: 24 }}
            >
              <Descriptions bordered column={{ xs: 1, md: 2 }}>
                <Descriptions.Item label="Customer">
                  {shipment.customerName || "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Driver">
                  {shipment.driverName || "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Current Location">
                  {shipment.currentLocation || "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="ETA">
                  {shipment.eta || "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Delivery Address">
                  {shipment.address || "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Special Instructions">
                  <Flex justify="space-between" align="center" gap={12}>
                    <span>{shipment.specialInstructions || "None"}</span>

                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={handleOpenInstructionModal}
                    >
                      Update
                    </Button>
                  </Flex>
                </Descriptions.Item>

                <Descriptions.Item label="Email">
                  {shipment.email || "None"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Card>
      </Content>

      <Modal
        title="Update Special Instructions"
        open={isInstructionModalOpen}
        onCancel={handleCloseInstructionModal}
        destroyOnHidden
        footer={[
          <Button key="cancel" onClick={handleCloseInstructionModal}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={savingInstruction}
            onClick={handleSaveInstruction}
          >
            Save & Send Email
          </Button>,
        ]}
      >
        <Text type="secondary">
          Add or update delivery instructions for the driver. After saving, the
          customer will receive an email notification automatically.
        </Text>

        <Input.TextArea
          rows={5}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Example: Leave the package at the back door."
          style={{ marginTop: 16 }}
        />
      </Modal>
    </Layout>
  );
}

export default Dashboard;
