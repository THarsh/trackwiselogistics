import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  TruckOutlined,
} from "@ant-design/icons";

import { db } from "../firebase";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function AddShipment() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const handleSaveShipment = async (values) => {
    const trackingId = values.trackingId.trim().toUpperCase();

    setSaving(true);

    try {
      const shipmentRef = doc(db, "shipments", trackingId);
      const shipmentSnap = await getDoc(shipmentRef);

      if (shipmentSnap.exists()) {
        message.error(
          "This tracking ID already exists. Please use another ID.",
        );
        return;
      }

      const shipmentData = {
        trackingId,
        customerName: values.customerName.trim(),
        email: values.email.trim(),
        driverName: values.driverName.trim(),
        status: values.status,
        currentLocation: values.currentLocation.trim(),
        eta: values.eta ? values.eta.format("YYYY-MM-DD HH:mm") : "",
        address: values.address.trim(),
        specialInstructions: values.specialInstructions?.trim() || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        mobile: values.mobile.trim() || "",
      };

      await setDoc(shipmentRef, shipmentData);

      message.success("Shipment added successfully.");

      form.resetFields();

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      message.error("Failed to add shipment. Please check Firebase.");
    } finally {
      setSaving(false);
    }
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
            Add New Shipment
          </Title>
        </Flex>

        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </Header>

      <Content style={{ padding: 32 }}>
        <Card
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            borderRadius: 14,
          }}
        >
          <Title level={3}>Shipment Details</Title>
          <Text type="secondary">
            Add a new shipment record to Firebase Firestore.
          </Text>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveShipment}
            style={{ marginTop: 24 }}
            initialValues={{
              status: "Pending",
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Tracking ID"
                  name="trackingId"
                  rules={[
                    { required: true, message: "Please enter tracking ID." },
                  ]}
                >
                  <Input placeholder="Example: TRK1002" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: "Please select status." }]}
                >
                  <Select
                    size="large"
                    options={[
                      { label: "Pending", value: "Pending" },
                      { label: "Out for Delivery", value: "Out for Delivery" },
                      { label: "Delivered", value: "Delivered" },
                      { label: "Delayed", value: "Delayed" },
                      { label: "Failed", value: "Failed" },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Customer Name"
                  name="customerName"
                  rules={[
                    { required: true, message: "Please enter customer name." },
                  ]}
                >
                  <Input placeholder="Example: Sarah Johnson" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Driver Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter driver email." },
                    { type: "email", message: "Please enter a valid email." },
                  ]}
                >
                  <Input
                    placeholder="Example: customer@test.com"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Driver Name"
                  name="driverName"
                  rules={[
                    { required: true, message: "Please enter driver name." },
                  ]}
                >
                  <Input placeholder="Example: Kasun Perera" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Current Location"
                  name="currentLocation"
                  rules={[
                    {
                      required: true,
                      message: "Please enter current location.",
                    },
                  ]}
                >
                  <Input
                    placeholder="Example: Colombo Warehouse"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="ETA"
                  name="eta"
                  rules={[{ required: true, message: "Please select ETA." }]}
                >
                  <DatePicker
                    showTime
                    size="large"
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD HH:mm"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Delivery Address"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter delivery address.",
                    },
                  ]}
                >
                  <Input placeholder="Example: No 25, Colombo" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="mobile"
                  name="mobile"
                  rules={[
                    {
                      required: true,
                      message: "Please enter mobile number.",
                    },
                  ]}
                >
                  <Input placeholder="Example: 077 76 78 765" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label="Special Instructions"
                  name="specialInstructions"
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Example: Leave the package at the front desk."
                  />
                </Form.Item>
              </Col>
            </Row>

            <Flex justify="flex-end" gap={12}>
              <Button onClick={() => navigate("/dashboard")}>Cancel</Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                icon={<SaveOutlined />}
              >
                Save Shipment
              </Button>
            </Flex>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}

export default AddShipment;
