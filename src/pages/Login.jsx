import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Alert, Button, Card, Flex, Form, Input, Typography } from "antd";
import { LockOutlined, MailOutlined, TruckOutlined } from "@ant-design/icons";

import { auth } from "../firebase";

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);

      // For now redirect to customer tracking.
      // Later we can redirect based on user role.
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e6f4ff 0%, #f5f7fa 100%)",
        padding: 24,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 430,
          borderRadius: 18,
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
        }}
      >
        <Flex vertical align="center" style={{ marginBottom: 24 }}>
          <Flex
            justify="center"
            align="center"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#1677ff",
              color: "#fff",
              fontSize: 30,
              marginBottom: 16,
            }}
          >
            <TruckOutlined />
          </Flex>

          <Title level={3} style={{ margin: 0 }}>
            Smart Logistics
          </Title>

          <Text type="secondary">Sign in to continue</Text>
        </Flex>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 18 }}
          />
        )}

        <Form
          layout="vertical"
          initialValues={{
            email: "driver@test.com",
            password: "123456",
          }}
          onFinish={handleLogin}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email." },
              { type: "email", message: "Please enter a valid email." },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="Enter email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password." },
              { min: 6, message: "Password must be at least 6 characters." },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Enter password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            Login
          </Button>
        </Form>
      </Card>
    </Flex>
  );
}

export default Login;
