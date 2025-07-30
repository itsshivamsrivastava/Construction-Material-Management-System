import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
  FaEye,
} from "react-icons/fa";
// import "./ManageBOQ.css"; // Keep this import for your custom CSS

const initialForm = {
  boqNumber: "",
  workorder: "",
  boqItemsDesc: "",
  boqUnit: "",
  boqQuantity: "",
  boqRate: "",
  boqAmount: "",
};

const ManageBOQ = () => {
  const [boqs, setBoqs] = useState([]);
  const [workorders, setWorkorders] = useState([]);
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
  const [formData, setFormData] = useState(initialForm);

  const boqPerPage = 6;
  const filteredBOQs = boqs.filter((boq) =>
    boq.boqNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBOQs = [...filteredBOQs].sort((a, b) => {
    // Handling potential null/undefined values and ensuring comparison of actual values
    const aValue = a[sortBy]?.toString().toLowerCase() || "";
    const bValue = b[sortBy]?.toString().toLowerCase() || "";

    // Special handling for numerical sorts if sortBy field is numeric
    if (
      sortBy === "boqQuantity" ||
      sortBy === "boqRate" ||
      sortBy === "boqAmount"
    ) {
      const numA = parseFloat(aValue);
      const numB = parseFloat(bValue);
      if (sortOrder === "asc") {
        return numA - numB;
      } else {
        return numB - numA;
      }
    }

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
    fetchWorkorders();
    if (id) {
      setEditingId(id);
      fetchBOQ(id);
      setShowForm(true);
    }
  }, [id]);

  const fetchWorkorders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/workorder/getAll");
      setWorkorders(res.data);
      console.log("Fetched workorders:", res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch workorders");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-calculate amount when quantity or rate changes
    if (name === "boqQuantity" || name === "boqRate") {
      const quantity =
        name === "boqQuantity"
          ? parseFloat(value)
          : parseFloat(formData.boqQuantity);
      const rate =
        name === "boqRate" ? parseFloat(value) : parseFloat(formData.boqRate);

      if (!isNaN(quantity) && !isNaN(rate)) {
        // Ensure they are valid numbers
        setFormData((prev) => ({
          ...prev,
          boqAmount: (quantity * rate).toFixed(2),
        }));
      } else {
        setFormData((prev) => ({
          // Clear amount if inputs are invalid
          ...prev,
          boqAmount: "",
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
        await axios.put(
          `http://localhost:3000/api/boq/update/${editingId}`,
          formData
        );
        setSuccess("BOQ updated successfully!");
      } else {
        await axios.post("http://localhost:3000/api/boq/create", formData);
        setSuccess("BOQ created successfully!");
      }

      console.log("Form data submitted:", formData);
      console.log("Initial form data:", initialForm);
      setShowForm(false);
      setEditingId(null);
      setFormData(initialForm);
      console.log("Form reset to initial state:", initialForm);
      fetchBoqs();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
      console.error(err);
    }
    setLoading(false);
  };

  const handleEdit = (boq) => {
    setFormData({
      ...boq,
      workorder: boq.workorder ? boq.workorder._id : "",
    });
    setEditingId(boq._id);
    setShowForm(true);
    setViewingId(null);
  };

  const handleView = (boq) => {
    setFormData({
      ...boq,
      workorder: boq.workorder ? boq.workorder._id : "",
    });
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
    setFormData(initialForm); // Reset to initialForm
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
      <div className={showForm ? "hidden md:hidden" : "block md:block"}>
        <Sidebar title="Manage BOQ" />
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 px-1 sm:px-4 md:px-8 py-6 ${
          showForm ? "w-full" : "md:w-[calc(100%-16rem)]"
        }`}
      >
        {/* Adjust width dynamically */}
        <div className="main-div max-w-5xl mx-auto">
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
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-fadeIn">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-fadeIn">
              {error}
            </div>
          )}

          {/* Controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="add-dashboard-btn flex flex-col sm:flex-row gap-4 sm:w-auto">
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setViewingId(null);
                  setFormData(initialForm);
                }} // Reset form data when adding new
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
            <div className="sm:w-64">
              <input
                type="text"
                placeholder="Search BOQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent search-input"
              />
            </div>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 modal-backdrop">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
                <div className="">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {viewingId
                        ? "View BOQ"
                        : editingId
                        ? "Edit BOQ"
                        : "Add New BOQ"}
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
                      <div className="form-group">
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
                          className="form-control"
                        />
                      </div>

                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Work Order *
                        </label>

                        <select
                          name="workorder"
                          value={formData.workorder}
                          onChange={handleInputChange}
                          disabled={viewingId}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        >
                          <option value="">Select Work Order</option>
                          {workorders.map((wo) => (
                            <option key={wo._id} value={wo._id}>
                              {wo.woNumber} - {wo.projectName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          BOQ Item Unit *
                        </label>
                        <select
                          name="boqUnit"
                          value={formData.boqUnit}
                          onChange={handleInputChange}
                          disabled={viewingId}
                          required
                          className="form-control"
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

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        BOQ Item Description *
                      </label>
                      <textarea
                        name="boqItemsDesc"
                        value={formData.boqItemsDesc}
                        onChange={handleInputChange}
                        disabled={viewingId}
                        required
                        rows={3}
                        className="form-control"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          BOQ Item Quantity *
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
                          className="form-control"
                        />
                      </div>

                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          BOQ Item Rate (₹) *
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
                          className="form-control"
                        />
                      </div>

                      <div className="form-group">
                        {" "}
                        {/* Added form-group */}
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          BOQ Item Amount (₹) *
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
                          className="form-control bg-gray-50"
                        />
                      </div>
                    </div>

                    {!viewingId && (
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 btn-primary"
                        >
                          <FaSave />
                          {loading
                            ? "Saving..."
                            : editingId
                            ? "Update"
                            : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-6 py-2 rounded-lg font-semibold transition-colors btn-secondary"
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
            <div className="overflow-x-auto table-responsive">
              <table className="w-full text-sm text-left boq-table">
                <thead className="bg-gray-200 border-b border-gray-200">
                  <tr>
                    <th className="px-2 py-3 min-w-[140px] text-center">
                      <button
                        onClick={() => handleSort("boqNumber")}
                        className="items-center gap-1 hover:text-blue-600 sort-indicator"
                      >
                        BOQ Number
                        {sortBy === "boqNumber" && (
                          <span className="sort-arrow">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 min-w-[135px] text-center">
                      <button
                        onClick={() => handleSort("workOrder")}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        WorkOrder No.
                        {sortBy === "workOrder" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-2 py-3 min-w-[200px] text-center">
                      BOQ Item Description
                    </th>
                    <th className="px-2 py-3 min-w-[100px] text-center">
                      BOQ Item Unit
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      <button
                        onClick={() => handleSort("boqQuantity")}
                        className="items-center gap-1 hover:text-blue-600 sort-indicator"
                      >
                        BOQ Item Quantity
                        {sortBy === "boqQuantity" && (
                          <span className="sort-arrow">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}{" "}
                      </button>
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      <button
                        onClick={() => handleSort("boqRate")}
                        className="items-center gap-1 hover:text-blue-600 sort-indicator"
                      >
                        BOQ Item Rate
                        {sortBy === "boqRate" && (
                          <span className="sort-arrow">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-2 py-3 min-w-[140px] text-center">
                      <button
                        onClick={() => handleSort("boqAmount")}
                        className="items-center gap-1 hover:text-blue-600 sort-indicator"
                      >
                        BOQ Item Amount
                        {sortBy === "boqAmount" && (
                          <span className="sort-arrow">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto spinner"></div>
                        <p className="mt-2">Loading...</p>
                      </td>
                    </tr>
                  ) : currentBOQs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        {searchTerm
                          ? "No BOQs found matching your search."
                          : "No BOQs found."}
                      </td>
                    </tr>
                  ) : (
                    currentBOQs.map((boq) => (
                      <tr
                        key={boq._id}
                        className="boq-row border-b border-gray-100 hover:bg-gray-50 odd:bg-white even:bg-gray-100"
                      >
                        <td className="px-2 py-2 font-medium text-blue-600 text-center">
                          {boq.boqNumber}
                        </td>
                        <td className="px-2 py-2 font-medium text-blue-700 text-center cursor-pointer hover:text-blue-900">
                          {boq.workorder ? boq.workorder.woNumber : '-'}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-justify">
                          {boq.boqItemsDesc}
                        </td>
                        <td className="px-2 py-2 text-gray-600 text-center">
                          {boq.boqUnit}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {boq.boqQuantity}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          ₹{boq.boqRate}
                        </td>
                        <td className="px-2 py-2 font-semibold text-green-600 text-center">
                          ₹{boq.boqAmount}
                        </td>
                        <td className="px-2 py-2 flex justify-center gap-2">
                          <button
                            onClick={() => handleView(boq)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors action-btn action-btn-view"
                            title="View"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(boq)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors action-btn action-btn-edit"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(boq._id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors action-btn action-btn-delete"
                            title="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors pagination-btn"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                }
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors pagination-btn"
              >
                Next
              </button>
            </div>
          )}

          {/* Summary */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-2 sm:p-4 summary-card">
            {" "}
            {/* Added summary-card */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 summary-value">
                  {" "}
                  {/* Added summary-value */}
                  {boqs.length}
                </div>
                <div className="text-gray-600 summary-label">Total BOQs</div>{" "}
                {/* Added summary-label */}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 summary-value">
                  {" "}
                  {/* Added summary-value */}₹
                  {boqs
                    .reduce(
                      (sum, boq) => sum + (parseFloat(boq.boqAmount) || 0),
                      0
                    )
                    .toFixed(2)}
                </div>
                <div className="text-gray-600 summary-label">Total Amount</div>{" "}
                {/* Added summary-label */}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 summary-value">
                  {" "}
                  {/* Added summary-value */}
                  {boqs
                    .reduce(
                      (sum, boq) => sum + (parseFloat(boq.boqQuantity) || 0),
                      0
                    )
                    .toFixed(2)}
                </div>
                <div className="text-gray-600 summary-label">
                  Total Quantity
                </div>{" "}
                {/* Added summary-label */}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 summary-value">
                  {" "}
                  {/* Added summary-value */}
                  {new Set(boqs.map((boq) => boq.boqUnit)).size}
                </div>
                <div className="text-gray-600 summary-label">Unique Units</div>{" "}
                {/* Added summary-label */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageBOQ;
