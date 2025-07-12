import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./Components/header/NavBar";
import UserLogin from "./Components/UserLogin/UserLogin";
import Dashboard from "./Components/Dashboard/Dashboard";
import Companies from "./Components/Companies/Companies";
import AdminProfile from "./Components/AdminProfile/AdminProfile";
import ContractorBills from "./Components/ContractorBills/ContractorBills";
import ManageWorkorder from "./Components/Workorder/ManageWorkorder";
import ManageBOQ from "./Components/Boq/ManageBOQ";
import WorkOrder from "./Components/Workorder/Workorder";
import ManageMaterials from "./Components/Materials/ManageMaterials";

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
      <NavBar />
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
          path="/manage-workorder"
          element={
            <ProtectedRoute>
              <ManageWorkorder />
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
        <Route
          path="/manage-workorder/:id"
          element={
            <ProtectedRoute>
              <ManageWorkorder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-boq"
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

        {/* Add other protected routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
