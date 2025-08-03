import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaFileInvoiceDollar, FaClipboardList, FaBoxes, FaShoppingCart, FaFileContract, FaMoneyBillWave /*, FaUsers */} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token) {
      navigate('/signin');
    } else {
      setIsAuthenticated(true);
      setUserName(JSON.parse(user)?.name || 'User');
    }
  }, [navigate]);

  const dashboardItems = [
    {
      title: 'Companies',
      icon: <FaBuilding />,
      path: '/companies',
      description: 'Manage company information and details'
    },
    {
      title: 'Work Orders',
      icon: <FaClipboardList />,
      path: '/workorders',
      description: 'Create and manage work orders'
    },
    {
      title: 'BOQ',
      icon: <FaMoneyBillWave />,
      path: '/manage-boq',
      description: 'Create and manage bill of quantity'
    },
    {
      title: 'Contractor Bills',
      icon: <FaFileInvoiceDollar />,
      path: '/contractor-bills',
      description: 'Handle contractor billing and payments'
    },
    {
      title: 'Materials',
      icon: <FaBoxes />,
      path: '/manage-materials',
      description: 'Track and manage construction materials'
    },
    {
      title: 'PO Consumables',
      icon: <FaShoppingCart />,
      path: '/poconsumables',
      description: 'Manage purchase order consumables'
    },
    {
      title: 'Purchase Orders',
      icon: <FaFileContract />,
      path: '/purchase-orders',
      description: 'Create and track purchase orders'
    },
    {
      title: 'RA Bill Entry',
      icon: <FaMoneyBillWave />,
      path: '/ra-bills',
      description: 'Process RA bill entries'
    }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {userName}</h1>
        <p>Construction Material Management System</p>
      </header>

      <div className="dashboard-grid">
        {dashboardItems.map((item, index) => (
          <div
            key={index}
            className="dashboard-card"
            onClick={() => navigate(item.path)}
          >
            <div className="card-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
