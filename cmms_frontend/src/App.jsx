import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./Components/header/NavBar";
// import Footer from "./Components/footer/Footer";
import UserLogin from "./Components/UserLogin/UserLogin";
import Dashboard from "./Components/Dashboard/Dashboard";
import Companies from "./Components/Companies/Companies";
import AdminProfile from "./Components/AdminProfile/AdminProfile";
import ContractorBills from "./Components/ContractorBills/ContractorBills";
import ManageBOQ from "./Components/Boq/ManageBOQ";
import WorkOrder from "./Components/Workorder/Workorder";
import ManageMaterials from "./Components/Materials/ManageMaterials";
import PoConsumables from "./Components/PoConsumables/PoConsumables";
import RABill from "./Components/RABIll/RABill";
import PurchaseOrder from "./Components/PurchaseOrder/PurchaseOrder";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <NavBar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/signin" element={<UserLogin />} />
        <Route path="/signup" element={<UserLogin />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <Companies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workorders"
          element={
            <ProtectedRoute>
              <WorkOrder />
            </ProtectedRoute>
          }
        />
        <Route path="/workorders/:id" element={<WorkOrder />} />

        <Route
          path="/manage-boq"
          element={
            <ProtectedRoute>
              <ManageBOQ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-boq/:id"
          element={
            <ProtectedRoute>
              <ManageBOQ />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contractor-bills"
          element={
            <ProtectedRoute>
              <ContractorBills />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-materials"
          element={
            <ProtectedRoute>
              <ManageMaterials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/poconsumables"
          element={
            <ProtectedRoute>
              <PoConsumables />
            </ProtectedRoute>
          }
        />

        <Route 
        path="/purchase-orders"
        element={
          <ProtectedRoute>
            <PurchaseOrder />
          </ProtectedRoute>
        }
        />

        <Route 
        path="/ra-bills"
        element={
          <ProtectedRoute>
            <RABill />
          </ProtectedRoute>
        }
        />


        {/* <Footer /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
