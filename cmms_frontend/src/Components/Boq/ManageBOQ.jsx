import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaEye } from "react-icons/fa";
import "./ManageBOQ.css";

const ManageBOQ = () => {
  const [boqs, setBoqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("boqNumber");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();
  const { id } = useParams();

  // Form state
  const [formData, setFormData] = useState({
    boqNumber: "",
    boqItemsDesc: "",
    boqUnit: "",
    boqQuantity: "",
    boqRate: "",
    boqAmount: "",
  });

  const boqPerPage = 6;
  const filteredBOQs = boqs.filter(boq =>
    boq.boqNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBOQs = [...filteredBOQs].sort((a, b) => {
    const aValue = a[sortBy]?.toString().toLowerCase();
    const bValue = b[sortBy]?.toString().toLowerCase();
    return sortOrder === "asc" 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const totalPages = Math.ceil(sortedBOQs.length / boqPerPage);
  const currentBOQs = sortedBOQs.slice(
    currentPage * boqPerPage,
    currentPage * boqPerPage + boqPerPage
  );

  // Fetch all BOQ data
  const fetchBoqs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:3000/api/boq/getAll");
      setBoqs(res.data);
    } catch (err) {
      setError("Failed to fetch BOQs");
      console.error(err);
    }
    setLoading(false);
  };

  // Fetch single BOQ for editing
  const fetchBOQ = async (boqId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/boq/get/${boqId}`);
      setFormData(res.data);
    } catch (err) {
      setError("Failed to fetch BOQ details");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBoqs();
    if (id) {
      setEditingId(id);
      fetchBOQ(id);
      setShowForm(true);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate amount when quantity or rate changes
    if (name === "boqQuantity" || name === "boqRate") {
      const quantity = name === "boqQuantity" ? value : formData.boqQuantity;
      const rate = name === "boqRate" ? value : formData.boqRate;
      if (quantity && rate) {
        setFormData(prev => ({
          ...prev,
          boqAmount: (parseFloat(quantity) * parseFloat(rate)).toFixed(2)
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/api/boq/update/${editingId}`, formData);
        setSuccess("BOQ updated successfully!");
      } else {
        await axios.post("http://localhost:3000/api/boq/create", formData);
        setSuccess("BOQ created successfully!");
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({
        boqNumber: "",
        boqItemsDesc: "",
        boqUnit: "",
        boqQuantity: "",
        boqRate: "",
        boqAmount: "",
      });
      fetchBoqs();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
      console.error(err);
    }
    setLoading(false);
  };

  const handleEdit = (boq) => {
    setFormData(boq);
    setEditingId(boq._id);
    setShowForm(true);
    setViewingId(null);
  };

  const handleView = (boq) => {
    setFormData(boq);
    setViewingId(boq._id);
    setEditingId(null);
    setShowForm(true);
  };

  const handleDelete = async (boqId) => {
    if (!window.confirm("Are you sure you want to delete this BOQ?")) return;
    
    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:3000/api/boq/delete/${boqId}`);
      setSuccess("BOQ deleted successfully!");
      fetchBoqs();
    } catch (err) {
      setError("Failed to delete BOQ");
      console.error(err);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setViewingId(null);
    setFormData({
      boqNumber: "",
      boqItemsDesc: "",
      boqUnit: "",
      boqQuantity: "",
      boqRate: "",
      boqAmount: "",
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Sidebar */}
      <Sidebar title="Manage BOQ" />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">
              Manage BOQ
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Add, update, and delete Bill of Quantities
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <FaPlus /> Add New BOQ
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Dashboard
              </button>
            </div>

            {/* Search */}
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search BOQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {viewingId ? "View BOQ" : editingId ? "Edit BOQ" : "Add New BOQ"}
                    </h2>
                    <button
                      onClick={handleCancel}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          BOQ Number *
                        </label>
                        <input
                          type="text"
                          name="boqNumber"
                          value={formData.boqNumber}
                          onChange={handleInputChange}
                          disabled={viewingId}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unit *
                        </label>
                        <select
                          name="boqUnit"
                          value={formData.boqUnit}
                          onChange={handleInputChange}
                          disabled={viewingId}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        >
                          <option value="">Select Unit</option>
                          <option value="Nos">Nos</option>
                          <option value="Meter">Meter</option>
                          <option value="Sq.Meter">Sq.Meter</option>
                          <option value="Cum">Cum</option>
                          <option value="Kg">Kg</option>
                          <option value="Ton">Ton</option>
                          <option value="Liter">Liter</option>
                          <option value="Set">Set</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="boqItemsDesc"
                        value={formData.boqItemsDesc}
                        onChange={handleInputChange}
                        disabled={viewingId}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          name="boqQuantity"
                          value={formData.boqQuantity}
                          onChange={handleInputChange}
                          disabled={viewingId}
                          required
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rate (₹) *
                        </label>
                        <input
                          type="number"
                          name="boqRate"
                          value={formData.boqRate}
                          onChange={handleInputChange}
                          disabled={viewingId}
                          required
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount (₹) *
                        </label>
                        <input
                          type="number"
                          name="boqAmount"
                          value={formData.boqAmount}
                          onChange={handleInputChange}
                          disabled={viewingId}
                          required
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 bg-gray-50"
                        />
                      </div>
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
            </div>
          )}

          {/* BOQ List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-2">
                  <button
                    onClick={() => handleSort("boqNumber")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    BOQ Number
                    {sortBy === "boqNumber" && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </button>
                </div>
                <div className="col-span-4">Description</div>
                <div className="col-span-1">Unit</div>
                <div className="col-span-1">
                  <button
                    onClick={() => handleSort("boqQuantity")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Qty
                    {sortBy === "boqQuantity" && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </button>
                </div>
                <div className="col-span-1">
                  <button
                    onClick={() => handleSort("boqRate")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Rate
                    {sortBy === "boqRate" && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </button>
                </div>
                <div className="col-span-1">
                  <button
                    onClick={() => handleSort("boqAmount")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Amount
                    {sortBy === "boqAmount" && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </button>
                </div>
                <div className="col-span-2 text-center">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2">Loading...</p>
              </div>
            ) : currentBOQs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? "No BOQs found matching your search." : "No BOQs found."}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {currentBOQs.map((boq) => (
                  <div key={boq._id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center text-sm">
                      <div className="col-span-2 font-medium text-blue-600">
                        {boq.boqNumber}
                      </div>
                      <div className="col-span-4 text-gray-700">
                        {boq.boqItemsDesc}
                      </div>
                      <div className="col-span-1 text-gray-600">
                        {boq.boqUnit}
                      </div>
                      <div className="col-span-1 text-gray-700">
                        {boq.boqQuantity}
                      </div>
                      <div className="col-span-1 text-gray-700">
                        ₹{boq.boqRate}
                      </div>
                      <div className="col-span-1 font-semibold text-green-600">
                        ₹{boq.boqAmount}
                      </div>
                      <div className="col-span-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleView(boq)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(boq)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(boq._id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Summary */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{boqs.length}</div>
                <div className="text-gray-600">Total BOQs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{boqs.reduce((sum, boq) => sum + (parseFloat(boq.boqAmount) || 0), 0).toFixed(2)}
                </div>
                <div className="text-gray-600">Total Amount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {boqs.reduce((sum, boq) => sum + (parseFloat(boq.boqQuantity) || 0), 0).toFixed(2)}
                </div>
                <div className="text-gray-600">Total Quantity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(boqs.map(boq => boq.boqUnit)).size}
                </div>
                <div className="text-gray-600">Unique Units</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageBOQ;
