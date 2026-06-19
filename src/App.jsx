import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddShipment from "./pages/AddShipment";
import ProtectedRoute from "./components/ProtectedRoute";

import "antd/dist/reset.css";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 10,
          fontFamily: "Arial, sans-serif",
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "driver",
                  "customer",
                  "dispatcher",
                  "manager",
                ]}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-shipment"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddShipment />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
