import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialForm = {
  clientName: "",
  workOrder: "",
  raBillNumber: "",
  raBillDate: "",
  duration: "",
  taxInvoiceNumber: "",
  taxInvoiceDate: "",
  boqItem: "",
  rate: "",
  billQty: "",
  billAmount: "",
  attachment: "",
};

const RABill = () => {
  const [raBils, setRABills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("raBillNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const [boqOptions, setBoqOptions] = useState([]);
  const navigate = useNavigate();

  // Handle Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Sumbit Button
  const handleSubmit = async (e) => {};

  // Handle Cancel Button
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setViewingId(null);
    setFormData(initialForm);
  };

  // Handle Sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="ra-bill-container flex flex-col md:flex-row">
      {/* Modal for add/edit/view */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {viewingId
                    ? "View RA Bill"
                    : editingId
                    ? "Edit RA Bill"
                    : "Add New RA Bill"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RA Bill No. *
                  </label>
                  <input
                    type="text"
                    name="raBillNumber"
                    value={formData.raBillNumber}
                    onChange={handleInputChange}
                    disabled={viewingId}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                {/* Continue from this line... */}
              </div>
              {!viewingId && (
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    <FaSave />
                    {loading ? "Saving..." : editingId ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <div className={showForm ? "hidden md:block" : "block"}>
        <Sidebar title="RA Bills" />
      </div>

      {/* Main Content */}
      <main className="ra-bill-main flex-1 px-2 sm:px-4 md:px-8 py-6">
        <div className="max-w-300 mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">
              Manage RA Bills
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Add, update, view, and delete RA Bills
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="status-message success-message">{success}</div>
          )}
          {error && <div className="status-message error-message">{error}</div>}

          {/* Controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-4 sm:w-auto">
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setViewingId(null);
                  setFormData(initialForm);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <FaPlus /> Add New RA Bill
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Dashboard
              </button>
            </div>
            {/* Search */}
            <div className="sm:w-64">
              <input
                type="text"
                placeholder="Search RA Bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Material List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-200 border-b border-gray-200">
                  <tr>
                    <th className="px-2 py-3 min-w-[140px] text-center">
                      <button
                        onClick={() => handleSort("raBillNumber")}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        RA Bill No.
                        {sortBy === "raBillNumber" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    {/* Continue from this line... */}
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RABill;
