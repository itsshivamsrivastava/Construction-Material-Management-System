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
import "./ContractorBills.css";
import { useNavigate } from "react-router-dom";

const initialForm = {
  contractorWONumber: "",
  contractorName: "",
  projectName: "",
  workOrder: "",
  contractorRABill: "",
  billDate: "",
  particulars: "",
  boqItem: "",
  qtyClaimed: "",
  rate: "",
  amount: "",
};

const ContractorBills = () => {
  const [bills, setBills] = useState([]);
  const [workorders, setWorkorders] = useState([]);
  const [boqItems, setBoqItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("contractorWONumber");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();

  const billsPerPage = 6;
  const filteredBills = bills.filter(
    (b) =>
      b.contractorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contractorWONumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedBills = [...filteredBills].sort((a, b) => {
    const aValue = a[sortBy]?.toString().toLowerCase();
    const bValue = b[sortBy]?.toString().toLowerCase();
    return sortOrder === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });
  const totalPages = Math.ceil(sortedBills.length / billsPerPage);
  const currentBills = sortedBills.slice(
    currentPage * billsPerPage,
    currentPage * billsPerPage + billsPerPage
  );

  useEffect(() => {
    fetchBills();
    fetchWorkorders();
    fetchBOQItems();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:3000/api/contractorBill/getAllContractorBills");
      setBills(res.data);
    } catch(err) {
        console.log(err);
      setError("Failed to fetch contractor bills");
    }
    setLoading(false);
  };

  const fetchWorkorders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/workorder/getAll");
      setWorkorders(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch workorders");
    }
  };

  const fetchBOQItems = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/boq/getAll");
      setBoqItems(res.data);
    } catch (err) {
        console.log(err);
        setError("Failed to fetch BOQ items");
    }
  };

  const fetchBill = async (id) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `http://localhost:3000/api/contractorBill/getContractorBillById/${id}`
      );
      setFormData(res.data);
    } catch {
      setError("Failed to fetch bill details");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (viewingId) {
      fetchBill(viewingId);
    }
  }, [viewingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:3000/api/contractorBill/updateContractorBill/${editingId}`,
          formData
        );
        setSuccess("Contractor Bill updated successfully!");
      } else {
        await axios.post(
          "http://localhost:3000/api/contractorBill/createCotractorBill",
          formData
        );
        setSuccess("Contractor Bill created successfully!");
      }
      setShowForm(false);
      setEditingId(null);
      setViewingId(null);
      setFormData(initialForm);
      fetchBills();
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setError("Operation failed");
    }
    setLoading(false);
  };

  const handleEdit = (bill) => {
    setFormData(bill);
    setEditingId(bill._id);
    setShowForm(true);
    setViewingId(null);
  };

  const handleView = (bill) => {
    setFormData(bill);
    setViewingId(bill._id);
    setEditingId(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this contractor bill?")
    )
      return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(
        `http://localhost:3000/api/contractorBill/deleteContractorBill/${id}`
      );
      setSuccess("Contractor Bill deleted successfully!");
      fetchBills();
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setError("Failed to delete contractor bill");
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setViewingId(null);
    setFormData(initialForm);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Summary
  const totalBills = bills.length;
  const totalAmount = bills.reduce(
    (sum, b) => sum + (parseFloat(b.amount) || 0),
    0
  );
  const uniqueContractors = new Set(bills.map((b) => b.contractorName)).size;

  return (
    <div className="manage-materials-container flex flex-col md:flex-row">
      {/* Modal for add/edit/view */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {viewingId
                    ? "View Contractor Bill"
                    : editingId
                    ? "Edit Contractor Bill"
                    : "Add New Contractor Bill"}
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
                      Work Order *
                    </label>
                    <select
                      name="workOrder"
                      value={formData.workOrder}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select Work Order</option>
                      {workorders.map((wo) => (
                        <option key={wo._id} value={wo._id}>
                          {wo.woNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contractor WO No *
                    </label>
                    <input
                      type="text"
                      name="contractorWONumber"
                      value={formData.contractorWONumber}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contractor Name *
                    </label>
                    <input
                      type="text"
                      name="contractorName"
                      value={formData.contractorName}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RA Bill *
                    </label>
                    <input
                      type="text"
                      name="contractorRABill"
                      value={formData.contractorRABill}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bill Date *
                    </label>
                    <input
                      type="date"
                      name="billDate"
                      value={
                        formData.billDate
                          ? formData.billDate.substring(0, 10)
                          : ""
                      }
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Particulars *
                    </label>
                    <input
                      type="text"
                      name="particulars"
                      value={formData.particulars}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      BOQ Item *
                    </label>
                    <select
                      name="boqItem"
                      value={formData.boqItem}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select BOQ Item</option>
                      {boqItems.map((boq) => (
                        <option key={boq._id} value={boq._id}>
                          {boq.boqNumber} - {boq.boqItemsDesc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qty Claimed *
                    </label>
                    <input
                      type="number"
                      name="qtyClaimed"
                      value={formData.qtyClaimed}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate *
                    </label>
                    <input
                      type="number"
                      name="rate"
                      value={formData.rate}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
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
      {/* Sidebar */}
      <div className={showForm ? "hidden md:block" : "block"}>
        <Sidebar title="Manage Contractor Bills" />
      </div>
      {/* Main Content */}
      <main className="manage-materials-main flex-1 px-2 sm:px-4 md:px-8 py-6">
        <div className="max-w-300 mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">
              Manage Contractor Bills
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Add, update, view, and delete Contractor Bills
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
                <FaPlus /> Add New Contractor Bill
              </button>
              <button
                onClick={() => navigate("/dashboard") }
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Dashboard
              </button>
            </div>
            {/* Search */}
            <div className="sm:w-64">
              <input
                type="text"
                placeholder="Search contractor bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* Contractor Bills List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-200 border-b border-gray-200">
                  <tr>
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
                    <th className="px-2 py-3 min-w-[140px] text-center">
                      <button
                        onClick={() => handleSort("contractorWONumber")}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        Contractor WO No
                        {sortBy === "contractorWONumber" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-2 py-3 min-w-[140px] text-center">
                      <button
                        onClick={() => handleSort("contractorName")}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        Contractor Name
                        {sortBy === "contractorName" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-2 py-3 min-w-[140px] text-center">
                      <button
                        onClick={() => handleSort("projectName")}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        Project Name
                        {sortBy === "projectName" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      RA Bill
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      Bill Date
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      Particulars
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      BOQ Item
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      Qty Claimed
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      Rate
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      Amount
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={12}
                        className="p-8 text-center text-gray-500"
                      >
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2">Loading...</p>
                      </td>
                    </tr>
                  ) : currentBills.length === 0 ? (
                    <tr>
                      <td
                        colSpan={12}
                        className="p-8 text-center text-gray-500"
                      >
                        {searchTerm
                          ? "No contractor bills found matching your search."
                          : "No contractor bills found."}
                      </td>
                    </tr>
                  ) : (
                    currentBills.map((bill) => (
                      <tr
                        key={bill._id}
                        className={
                          "materials-row border-b border-gray-100 hover:bg-gray-50 odd:bg-white even:bg-gray-100"
                        }
                      >
                        <td className="px-2 py-2 font-medium text-blue-700 text-center cursor-pointer hover:text-blue-900">
                          {
                            workorders.find((wo) => wo._id === bill.workOrder)
                              ?.woNumber
                          }
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {bill.contractorWONumber}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {bill.contractorName}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {bill.projectName}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {bill.contractorRABill}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {bill.billDate
                            ? new Date(bill.billDate).toLocaleDateString()
                            : ""}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {bill.particulars}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {
                            boqItems.find((boq) => boq._id === bill.boqItem)
                              ?.boqNumber
                          }
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {bill.qtyClaimed}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          ₹{bill.rate}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          ₹{bill.amount}
                        </td>
                        <td className="px-2 py-2 flex justify-center gap-2">
                          <button
                            onClick={() => handleView(bill)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(bill)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(bill._id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
          {/* Summary */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totalBills}
                </div>
                <div className="text-gray-600">Total Bills</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{totalAmount.toFixed(2)}
                </div>
                <div className="text-gray-600">Total Amount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {uniqueContractors}
                </div>
                <div className="text-gray-600">Unique Contractors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {boqItems.length}
                </div>
                <div className="text-gray-600">BOQ Items</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContractorBills;
