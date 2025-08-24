import "../PurchaseOrder/PurchaseOrder.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import Sidebar from "../Sidebar/Sidebar";

const PURCHASE_ORDER_API_BASE = "http://localhost:3000/api/purchaseOrder";
const COMPANY_API_BASE = "http://localhost:3000/api/company";
const WORKORDER_API_BASE = "http://localhost:3000/api/workorder";
const MATERIAL_API_BASE = "http://localhost:3000/api/material";

const initialForm = {
  company: "",
  supplierDetails: "",
  projectName: "",
  poNumber: "",
  poDate: "",
  materialName: "",
  unit: "",
  qtyToOrder: "",
  rate: "",
  amount: "",
  paymentTerms: "",
  otherTerms: "",
  taxDetails: {
    cgst: "",
    sgst: "",
    igst: "",
  },
  otherCharges: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
};

const PurchaseOrder = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("poNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const [companyOptions, setCompanyOptions] = useState([]);
  const [workordersOptions, setWorkordersOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [qtyError, setQtyError] = useState("");

  const navigate = useNavigate();

  const purchaseOrdersPerPage = 5;
  const filteredPurchaseOrders = purchaseOrders.filter((po) =>
    po.poNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedPurchaseOrders = [...filteredPurchaseOrders].sort((a, b) => {
    const aValue = a[sortBy]?.toString().toLowerCase();
    const bValue = b[sortBy]?.toString().toLowerCase();
    return sortOrder === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });
  const totalPages = Math.ceil(
    sortedPurchaseOrders.length / purchaseOrdersPerPage
  );
  const currentPurchaseOrders = sortedPurchaseOrders.slice(
    currentPage * purchaseOrdersPerPage,
    (currentPage + 1) * purchaseOrdersPerPage
  );

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${PURCHASE_ORDER_API_BASE}/getAll`);
      setPurchaseOrders(response.data);
    } catch (err) {
      setError("Failed to fetch Purchase Orders");
    }
    setLoading(false);
  };

  const fetchPurchaseOrder = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${PURCHASE_ORDER_API_BASE}/get/${id}`);
      const data = response.data;
      return data;
    } catch (err) {
      setError("Failed to fetch Purchase Order details");
    }
    setLoading(false);
  };
  const fetchOptions = async () => {
    try {
      const [companiesResponse, workordersResponse, materialsResponse] =
        await Promise.all([
          axios.get(`${COMPANY_API_BASE}/getCompany`),
          axios.get(`${WORKORDER_API_BASE}/getAll`),
          axios.get(`${MATERIAL_API_BASE}/getAll`),
        ]);
      setCompanyOptions(companiesResponse.data);
      setWorkordersOptions(workordersResponse.data);
      setMaterialOptions(materialsResponse.data);
    } catch (err) {
      setError("Failed to fetch options");
    }
  };

  useEffect(() => {
    fetchOptions();
    if (viewingId) {
      fetchPurchaseOrder(viewingId)
        .then((data) => {
          setFormData({
            ...data,
            company: data.company ? data.company._id : "",
            poDate: data.poDate ? data.poDate.slice(0, 10) : "",
          });
        })
        .catch((error) => {
          console.error("Error fetching or setting data:", error);
          setError("Failed to load Purchase Order for viewing.");
        });
    } else {
      // Reset form if viewingId is cleared
      setFormData(initialForm);
    }
    setLoading(false);
  }, [viewingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Material qty validation
    if (name === "qtyToOrder") {
      const selectedMaterial = materialOptions.find(
        (m) => m._id === formData.materialName
      );
      if (selectedMaterial && Number(value) > selectedMaterial.totalQuantity) {
        setQtyError(
          `Quantity cannot exceed available stock (${selectedMaterial.totalQuantity})`
        );
      } else {
        setQtyError("");
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      taxDetails: {
        ...prevData.taxDetails,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (qtyError) {
      setError(qtyError);
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await axios.put(
          `${PURCHASE_ORDER_API_BASE}/update/${editingId}`,
          formData
        );
        setSuccess("Purchase Order updated successfully");
      } else {
        await axios.post(`${PURCHASE_ORDER_API_BASE}/create`, formData);
        setSuccess("Purchase Order created successfully");
      }
      setShowForm(false);
      setEditingId(null);
      setViewingId(null);
      setFormData(initialForm);
      fetchPurchaseOrders();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Failed to save Purchase Order");
    }
    setLoading(false);
  };

  const handleEdit = (purchaseOrder) => {
    setFormData({
      ...purchaseOrder,
      company: purchaseOrder.company ? purchaseOrder.company._id : "",
      supplierDetails: purchaseOrder.supplierDetails,
      projectName:
        purchaseOrder.projectName?._id || purchaseOrder.projectName || "",
      poNumber: purchaseOrder.poNumber,
      poDate: purchaseOrder.poDate ? purchaseOrder.poDate.slice(0, 10) : "",
      materialName:
        purchaseOrder.materialName?._id || purchaseOrder.materialName || "",
      unit: purchaseOrder.unit,
      qtyToOrder: parseFloat(purchaseOrder.qtyToOrder || 0),
      rate: parseFloat(purchaseOrder.rate || 0),
      amount: parseFloat(purchaseOrder.amount || 0),
      paymentTerms: purchaseOrder.paymentTerms,
      otherTerms: purchaseOrder.otherTerms,
      taxDetails: {
        cgst: parseFloat(purchaseOrder.taxDetails.cgst || 0),
        sgst: parseFloat(purchaseOrder.taxDetails.sgst || 0),
        igst: parseFloat(purchaseOrder.taxDetails.igst || 0),
      },
      otherCharges: parseFloat(purchaseOrder.otherCharges || 0),
      totalAmount: parseFloat(purchaseOrder.totalAmount || 0),
    });
    setEditingId(purchaseOrder._id);
    setShowForm(true);
    setViewingId(null);
  };

  const handleView = (purchaseOrder) => {
    setFormData({
      ...purchaseOrder,
      company: purchaseOrder.company ? purchaseOrder.company._id : "",
      supplierDetails: purchaseOrder.supplierDetails,
      projectName: purchaseOrder.projectName
        ? purchaseOrder.projectName._id
        : "",
      poNumber: purchaseOrder.poNumber,
      poDate: purchaseOrder.poDate ? purchaseOrder.poDate.slice(0, 10) : "",
      materialName: purchaseOrder.materialName
        ? purchaseOrder.materialName._id
        : "",
      unit: purchaseOrder.unit,
      qtyToOrder: parseFloat(purchaseOrder.qtyToOrder || 0),
      rate: parseFloat(purchaseOrder.rate || 0),
      amount: parseFloat(purchaseOrder.amount || 0),
      paymentTerms: purchaseOrder.paymentTerms,
      otherTerms: purchaseOrder.otherTerms,
      taxDetails: {
        cgst: parseFloat(purchaseOrder.taxDetails.cgst || 0),
        sgst: parseFloat(purchaseOrder.taxDetails.sgst || 0),
        igst: parseFloat(purchaseOrder.taxDetails.igst || 0),
      },
      otherCharges: parseFloat(purchaseOrder.otherCharges || 0),
      totalAmount: parseFloat(purchaseOrder.totalAmount || 0),
    });
    setViewingId(purchaseOrder._id);
    setEditingId(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this Purchase Order?")
    ) {
      setLoading(true);
      setError("");
      try {
        await axios.delete(`${PURCHASE_ORDER_API_BASE}/delete/${id}`);
        setSuccess("Purchase Order deleted successfully");
        fetchPurchaseOrders();
        setTimeout(() => setSuccess(""), 2000);
      } catch (err) {
        setError("Failed to delete Purchase Order");
      }
      setLoading(false);
    }
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

  const getCompanyName = (companyObjOrId) => {
    if (!companyObjOrId) return "";
    if (typeof companyObjOrId === "object" && companyObjOrId.name)
      return companyObjOrId.name;
    const company = companyOptions.find((c) => c._id === companyObjOrId);
    return company ? company.name : companyObjOrId;
  };

  const getProjectName = (projectObjOrId) => {
    if (!projectObjOrId) return "";
    if (typeof projectObjOrId === "object" && projectObjOrId.projectName)
      return projectObjOrId.projectName;
    const workorder = workordersOptions.find((wo) => wo._id === projectObjOrId);
    return workorder ? workorder.projectName : projectObjOrId;
  };

  const getMaterialName = (materialObjOrId) => {
    if (!materialObjOrId) return "";
    if (typeof materialObjOrId === "object" && materialObjOrId.materialName)
      return materialObjOrId.materialName;
    const material = materialOptions.find((m) => m._id === materialObjOrId);
    return material ? material.materialName : materialObjOrId;
  };

  // Summary
  const totalPurchaseOrders = purchaseOrders.length;
  const totalQty = purchaseOrders.reduce(
    (sum, po) => sum + (parseFloat(po.qtyToOrder) || 0),
    0
  );
  const total_Amount = purchaseOrders.reduce(
    (sum, po) =>
      sum + (parseFloat(po.qtyToOrder) || 0) * (parseFloat(po.rate) || 0),
    0
  );

  return (
    <div className="purchaseOrders-container flex flex-col md:flex-row">
      {/* Modal for add/edit/view */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  {viewingId
                    ? "View Purchase Order"
                    : editingId
                    ? "Edit Purchase Order"
                    : "Add Purchase Order"}
                </h2>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={handleCancel}
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company *
                    </label>
                    <select
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Company</option>
                      {companyOptions.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.company_id} - {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Supplier Details *
                    </label>
                    <input
                      type="text"
                      name="supplierDetails"
                      value={formData.supplierDetails}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Project Name *
                    </label>
                    <select
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Project</option>
                      {workordersOptions.map((workorder) => (
                        <option key={workorder._id} value={workorder._id}>
                          {workorder.projectName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      PO Number *
                    </label>
                    <input
                      type="text"
                      name="poNumber"
                      value={formData.poNumber}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      PO Date *
                    </label>
                    <input
                      type="date"
                      name="poDate"
                      value={
                        formData.poDate
                          ? new Date(formData.poDate).toISOString().slice(0, 10)
                          : ""
                      }
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Material Name *
                    </label>
                    <select
                      name="materialName"
                      value={formData.materialName}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Material</option>
                      {materialOptions.map((material) => (
                        <option key={material._id} value={material._id}>
                          {material.materialName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Unit *
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Qty to Order *
                    </label>
                    <input
                      type="number"
                      name="qtyToOrder"
                      value={formData.qtyToOrder}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {qtyError && (
                      <p className="text-red-500 text-sm mt-1">{qtyError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Rate *
                    </label>
                    <input
                      type="number"
                      name="rate"
                      value={formData.rate}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Amount *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Payment Terms *
                    </label>
                    <input
                      type="text"
                      name="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Other Terms *
                    </label>
                    <input
                      type="text"
                      name="otherTerms"
                      value={formData.otherTerms}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      CGST
                    </label>
                    <input
                      type="number"
                      name="cgst"
                      value={formData.taxDetails.cgst}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      SGST
                    </label>
                    <input
                      type="number"
                      name="sgst"
                      value={formData.taxDetails.sgst}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      IGST
                    </label>
                    <input
                      type="number"
                      name="igst"
                      value={formData.taxDetails.igst}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Other Charges
                    </label>
                    <input
                      type="number"
                      name="otherCharges"
                      value={formData.otherCharges}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div
                  className={`flex justify-end ${
                    viewingId ? "hidden" : editingId ? "visible" : "flex"
                  }`}
                >
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FaSave className="inline mr-1" />
                    {editingId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="ml-3 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <FaTimes className="inline mr-1" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <div className={showForm ? "hidden md:block" : "block"}>
        <Sidebar title={"Purchase Orders"} />
      </div>

      {/* Main Content */}
      <main className="purchaseOrders-main flex-1 px-2 sm:px-4 md:px-8 py-6">
        <div className="max-w-300 mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">
              Manage Purchase Orders
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Add, update, view, and delete Purchase Orders.
            </p>
          </div>
          {/* Success/Error Messages */}
          {success && (
            <div className="status-message success-message">{success}</div>
          )}
          {error && <div className="status-message error-message">{error}</div>}
        </div>

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
              <FaPlus /> Add New Purchase Order
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
              placeholder="Search Purchase Orders..."
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
                  <th className="px-2 py-3 min-w-[140px]">
                    <button
                      onClick={() => handleSort("poNumber")}
                      className="flex mx-auto items-center gap-1 hover:text-blue-600"
                    >
                      PO Number
                      {sortBy === "poNumber" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-2 py-3 min-w-[140px] text-center">
                    <button
                      onClick={() => handleSort("supplierDetails")}
                      className="flex mx-auto items-center gap-1 hover:text-blue-600"
                    >
                      Supplier Details
                      {sortBy === "supplierDetails" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-2 py-3 min-w-[140px] text-center">
                    <button
                      onClick={() => handleSort("company")}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Company Name
                      {sortBy === "company" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-2 py-3 min-w-[140px] text-center">
                    <button
                      onClick={() => handleSort("projectName")}
                      className="flex mx-auto items-center gap-1 hover:text-blue-600"
                    >
                      Project Name
                      {sortBy === "projectName" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-2 py-3 min-w-[80px] text-center">
                    <button
                      onClick={() => handleSort("poDate")}
                      className="flex mx-auto items-center gap-1 hover:text-blue-600"
                    >
                      PO Date
                      {sortBy === "poDate" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-2 py-3 min-w-[140px] text-center">
                    <button
                      onClick={() => handleSort("materialName")}
                      className="flex mx-auto items-center gap-1 hover:text-blue-600"
                    >
                      Material Name
                      {sortBy === "meterialName" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-2 py-3 min-w-[100px] text-center">Unit</th>
                  <th className="px-2 py-3 min-w-[100px] text-center">
                    Qty to Order
                  </th>
                  <th className="px-2 py-3 min-w-[100px] text-center">Rate</th>
                  <th className="px-2 py-3 min-w-[100px] text-center">
                    Amount
                  </th>
                  <th className="px-2 py-3 min-w-[100px] text-center">
                    Payment Terms
                  </th>
                  <th className="px-2 py-3 min-w-[100px] text-center">
                    Other Terms
                  </th>
                  <th className="px-2 py-3 min-w-[100px] text-center">CGST</th>
                  <th className="px-2 py-3 min-w-[100px] text-center">SGST</th>
                  <th className="px-2 py-3 min-w-[100px] text-center">IGST</th>
                  <th className="px-2 py-3 min-w-[100px] text-center">
                    Other Charges
                  </th>
                  <th className="px-2 py-3 min-w-[100px] text-center">
                    Total Amount
                  </th>
                  <th className="px-2 py-3 min-w-[100px] text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2">Loading...</p>
                    </td>
                  </tr>
                ) : currentPurchaseOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      {searchTerm
                        ? "No Purchase Orders found matching your search."
                        : "No Purchase Orders found."}
                    </td>
                  </tr>
                ) : (
                  currentPurchaseOrders.map((poc) => (
                    <tr
                      key={poc._id}
                      className={
                        "purchaseOrders-row border-b border-gray-100 hover:bg-gray-50 odd:bg-white even:bg-gray-100"
                      }
                    >
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.poNumber}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.supplierDetails}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {getCompanyName(poc.company)}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {getProjectName(poc.projectName)}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.poDate
                          ? new Date(poc.poDate).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {getMaterialName(poc.materialName)}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.unit}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.qtyToOrder}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.rate}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.amount}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.paymentTerms}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.otherTerms}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.taxDetails.cgst}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.taxDetails.sgst}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.taxDetails.igst}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.otherCharges}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-center">
                        {poc.totalAmount}
                      </td>
                      <td className="px-2 py-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleView(poc)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(poc)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(poc._id)}
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
        <div className=" justify-center text-center mt-6 bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalPurchaseOrders}
              </div>
              <div className="text-gray-600">Total Purchase Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalQty}
              </div>
              <div className="text-gray-600">Total Quantity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ₹{total_Amount.toFixed(2)}
              </div>
              <div className="text-gray-600">Total Amount</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PurchaseOrder;
