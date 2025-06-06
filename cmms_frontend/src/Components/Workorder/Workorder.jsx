import React, { useState, useEffect } from "react";
import axios from "axios";
import './WorkorderStyle.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const modules = [
  { name: 'Companies', path: '/companies' },
  { name: 'Work Orders', path: '/work-orders' },
  { name: 'Contractor Bills', path: '/contractor-bills' },
  { name: 'Materials', path: '/materials' },
  { name: 'PO Consumables', path: '/po-consumables' },
  { name: 'Purchase Orders', path: '/purchase-orders' },
  { name: 'RA Bill Entry', path: '/ra-bills' },
];

export default function WorkOrder() {
  const initialFormData = {
    clientName: "",
    clientNickName: "",
    woNumber: "",
    woDate: "",
    projectName: "",
    boqNumber: "",
    boqItemsDesc: "",
    boqUnit: "",
    boqQuantity: "",
    boqRate: "",
    boqAmount: "",
    woValidityDate: "",
    woCompletionDate: "",
    retentionPercentage: "",
    pbgPercentage: "",
    pbgDuration: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const recordsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);

  // Fetch all work orders
  const fetchWorkOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:3000/api/workorder/getAll");
      setWorkOrders(res.data);
    } catch {
      setError("Failed to fetch work orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Edit handler
  const handleEdit = (wo) => {
    setFormData({
      clientName: wo.clientName || "",
      clientNickName: wo.clientNickName || "",
      woNumber: wo.woNumber || "",
      woDate: wo.woDate ? wo.woDate.slice(0, 10) : "",
      projectName: wo.projectName || "",
      boqNumber: wo.boqNumber || "",
      boqItemsDesc: wo.boqItemsDesc || "",
      boqUnit: wo.boqUnit || "",
      boqQuantity: wo.boqQuantity || "",
      boqRate: wo.boqRate || "",
      boqAmount: wo.boqAmount || "",
      woValidityDate: wo.woValidityDate ? wo.woValidityDate.slice(0, 10) : "",
      woCompletionDate: wo.woCompletionDate ? wo.woCompletionDate.slice(0, 10) : "",
      retentionPercentage: wo.retentionPercentage || "",
      pbgPercentage: wo.pbgPercentage || "",
      pbgDuration: wo.pbgDuration || "",
    });
    setEditingId(wo._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this work order?")) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:3000/api/workorder/delete/${id}`);
      fetchWorkOrders();
    } catch {
      setError("Failed to delete work order");
    }
    setLoading(false);
  };

  // Update handler (on form submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/api/workorder/update/${editingId}`, formData);
        alert("Work Order Updated Successfully");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:3000/api/workorder/add", formData);
        alert("Work Order Added Successfully");
      }
      setFormData(initialFormData); // Reset form after submit
      fetchWorkOrders(); // Refresh work orders list
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // For navigation
  const handleModuleClick = (path) => {
    window.location.href = path;
  };

  // Close sidebar on overlay click (mobile)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('companies-sidebar-overlay')) {
      setSidebarOpen(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(workOrders.length / recordsPerPage);
  const paginatedWorkOrders = workOrders.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="companies-page-container flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hamburger for mobile */}
      <div className="mt-20 md:hidden w-full flex items-start">
        <button
          className="sidebar-hamburger mt-4 ml-2 z-50 bg-white text-blue-700 p-2 rounded-full shadow-md border border-blue-200 hover:bg-blue-50 hover:text-blue-900 transition focus:outline-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="companies-sidebar-overlay fixed inset-0 bg-black bg-opacity-40 z-40" onClick={handleOverlayClick}>
          <aside className="companies-sidebar mobile-open animate-slide-in-left">
            <button
              className="sidebar-close absolute top-4 right-4 text-2xl text-blue-700 bg-white rounded-full p-1 shadow focus:outline-none"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>
            <nav>
              <ul className="space-y-2 mt-10">
                {modules.map((mod) => (
                  <li key={mod.path}>
                    <button
                      className={`sidebar-link w-full text-left px-4 py-3 rounded-lg font-semibold text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition ${window.location.pathname === mod.path ? 'bg-blue-100 text-blue-900 font-bold shadow' : ''}`}
                      onClick={() => handleModuleClick(mod.path)}
                      aria-current={window.location.pathname === mod.path ? 'page' : undefined}
                    >
                      {mod.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}
      {/* Sidebar for desktop */}
      <aside className="companies-sidebar-lg-screen companies-sidebar hidden md:block w-64 bg-white/90 border-r border-blue-100 shadow-lg py-8 px-4 flex-shrink-0 sticky top-0 z-10">
        <nav>
          <ul className="space-y-2">
            {modules.map((mod) => (
              <li key={mod.path}>
                <button
                  className={`sidebar-link w-full text-left px-4 py-3 rounded-lg font-semibold text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition ${window.location.pathname === mod.path ? 'bg-blue-100 text-blue-900 font-bold shadow' : ''}`}
                  onClick={() => handleModuleClick(mod.path)}
                  aria-current={window.location.pathname === mod.path ? 'page' : undefined}
                >
                  {mod.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="companies-main flex-1 px-2 sm:px-4 md:px-8 py-6">
        <div className="mb-8 mt-20 text-center main-container">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">Create Work Order</h2>
          <p className="text-gray-500 text-base md:text-lg">Fill in the details below to add a new work order.</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 shadow-xl rounded-2xl p-6 md:p-8 mb-10 flex flex-col gap-4 border border-blue-100"
        >
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Client Name", name: "clientName", required: true },
          { label: "Client Nickname", name: "clientNickName" },
          { label: "WO Number", name: "woNumber", required: true },
          { label: "WO Date", name: "woDate", type: "date", required: true },
          { label: "Project Name", name: "projectName", required: true },
          { label: "BOQ Number", name: "boqNumber", required: true },
          { label: "BOQ Item Description", name: "boqItemsDesc", required: true },
          { label: "BOQ Unit", name: "boqUnit", required: true },
          { label: "BOQ Quantity", name: "boqQuantity", required: true },
          { label: "BOQ Rate", name: "boqRate", required: true },
          { label: "BOQ Amount", name: "boqAmount", required: true },
          { label: "WO Validity Date", name: "woValidityDate", type: "date", required: true },
          { label: "WO Completion Date", name: "woCompletionDate", type: "date" },
          { label: "Retention %", name: "retentionPercentage", required: true },
          { label: "PBG %", name: "pbgPercentage", required: true },
          { label: "PBG Duration (Months)", name: "pbgDuration", required: true },
        ].map(({ label, name, required, type = "text" }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-gray-700 font-semibold mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={required}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}
          </div>
          <div className="w-full mt-6">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60"
              >
                {editingId ? 'Update Work Order' : 'Submit Work Order'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-gray-400 to-gray-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-gray-500 hover:to-gray-700 transition disabled:opacity-60"
                  onClick={() => { setEditingId(null); setFormData(initialFormData); }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
        {/* Work Orders Table */}
        <div className="companies-table-wrapper overflow-x-auto rounded-2xl shadow-lg bg-white/90 border border-blue-100 mt-8">
          <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center pt-6">All Work Orders</h3>
          {loading ? (
            <div className="text-blue-500 text-center py-8 font-semibold animate-pulse">Loading...</div>
          ) : error ? (
            <div className="text-red-600 text-center py-8 font-semibold animate-pulse">{error}</div>
          ) : workOrders.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No work orders found.</div>
          ) : (
            <>
              <table className="companies-table w-full divide-y divide-blue-200">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                  <tr>
                    <th>Actions</th>
                    <th>Client Name</th>
                    <th>WO Number</th>
                    <th>WO Date</th>
                    <th>Project Name</th>
                    <th>BOQ Number</th>
                    <th>BOQ Item Desc</th>
                    <th>BOQ Unit</th>
                    <th>BOQ Qty</th>
                    <th>BOQ Rate</th>
                    <th>BOQ Amount</th>
                    <th>WO Validity</th>
                    <th>WO Completion</th>
                    <th>Retention %</th>
                    <th>PBG %</th>
                    <th>PBG Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {paginatedWorkOrders.map((wo) => (
                    <tr key={wo._id} className="hover:bg-blue-50 transition">
                      <td className="flex gap-2 items-center py-2">
                        <button title="Edit" className="text-blue-600 hover:text-blue-900" onClick={() => handleEdit(wo)}><FaEdit /></button>
                        <button title="Delete" className="text-red-600 hover:text-red-900" onClick={() => handleDelete(wo._id)}><FaTrash /></button>
                      </td>
                      <td>{wo.clientName}</td>
                      <td>{wo.woNumber}</td>
                      <td>{wo.woDate ? wo.woDate.slice(0,10) : ''}</td>
                      <td>{wo.projectName}</td>
                      <td>{wo.boqNumber}</td>
                      <td>{wo.boqItemsDesc}</td>
                      <td>{wo.boqUnit}</td>
                      <td>{wo.boqQuantity}</td>
                      <td>{wo.boqRate}</td>
                      <td>{wo.boqAmount}</td>
                      <td>{wo.woValidityDate ? wo.woValidityDate.slice(0,10) : ''}</td>
                      <td>{wo.woCompletionDate ? wo.woCompletionDate.slice(0,10) : ''}</td>
                      <td>{wo.retentionPercentage}</td>
                      <td>{wo.pbgPercentage}</td>
                      <td>{wo.pbgDuration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-2 py-4">
                <button
                  className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 disabled:opacity-60"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-3 py-1 rounded font-semibold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 disabled:opacity-60"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
