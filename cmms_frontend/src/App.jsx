import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './Components/header/NavBar';
import UserLogin from './Components/UserLogin/UserLogin';
import Dashboard from './Components/Dashboard/Dashboard';
import Companies from './Components/Companies/Companies';
import AdminProfile from './Components/AdminProfile/AdminProfile';
import WorkOrder from './Components/Workorder/Workorder';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
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
          path='/profile/:username'
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

        <Route path='/work-orders' element={<ProtectedRoute> <WorkOrder /> </ProtectedRoute>} />
        
        {/* Add other protected routes here */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
