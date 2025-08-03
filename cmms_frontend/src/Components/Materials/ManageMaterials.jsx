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
import "./ManageMaterials.css";
import { useNavigate } from "react-router-dom";

const initialForm = {
  materialName: "",
  make: "",
  packSize: "",
  coefficient: "",
  totalQuantity: "",
  totalQuantityNos: "",
  rateFreezed: "",
  boq: "",
};

const ManageMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("materialName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [boqOptions, setBoqOptions] = useState([]);
  const navigate = useNavigate();

  const materialsPerPage = 6;
  const filteredMaterials = materials.filter(
    (m) =>
      m.materialName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.make?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    const aValue = a[sortBy]?.toString().toLowerCase();
    const bValue = b[sortBy]?.toString().toLowerCase();
    return sortOrder === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });
  const totalPages = Math.ceil(sortedMaterials.length / materialsPerPage);
  const currentMaterials = sortedMaterials.slice(
    currentPage * materialsPerPage,
    currentPage * materialsPerPage + materialsPerPage
  );

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:3000/api/material/getAll");
      setMaterials(res.data);
    } catch {
      setError("Failed to fetch materials");
    }
    setLoading(false);
  };

  const fetchMaterial = async (id) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `http://localhost:3000/api/material/get/${id}`
      );
      const data = res.data;
      setFormData({
        ...data,
        boq: data.boq ? data.boq._id : "",
      });
    } catch {
      setError("Failed to fetch material details");
    }
    setLoading(false);
  };

  const fetchOptions = async () => {
    try {
      const [boqRes] = await Promise.all([
        axios.get("http://localhost:3000/api/boq/getAll"),
      ]);
      setBoqOptions(boqRes.data);
    } catch (err) {
      console.error("Failed to fetch options:", err);
    }
  };

  useEffect(() => {
    fetchOptions();
    if (viewingId) {
      fetchMaterial(viewingId);
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
          `http://localhost:3000/api/material/update/${editingId}`,
          formData
        );
        setSuccess("Material updated successfully!");
      } else {
        await axios.post("http://localhost:3000/api/material/create", formData);
        setSuccess("Material created successfully!");
      }
      setShowForm(false);
      setEditingId(null);
      setViewingId(null);
      setFormData(initialForm);
      fetchMaterials();
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setError("Operation failed");
    }
    setLoading(false);
  };

  const handleEdit = (material) => {
    setFormData({
      ...material,
      boq: material.boq ? material.boq._id : "",
    });
    setEditingId(material._id);
    setShowForm(true);
    setViewingId(null);
  };

  const handleView = (material) => {
    setFormData(material);
    setViewingId(material._id);
    setEditingId(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?"))
      return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:3000/api/material/delete/${id}`);
      setSuccess("Material deleted successfully!");
      fetchMaterials();
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setError("Failed to delete material");
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

  const getBoqNumber = (boqObjOrId) => {
    if (!boqObjOrId) return "";
    if (typeof boqObjOrId === "object" && boqObjOrId.boqNumber)
      return boqObjOrId.boqNumber;
    const boq = boqOptions.find((b) => b._id === boqObjOrId);
    return boq ? boq.boqNumber : boqObjOrId;
  };

  // Summary
  const totalMaterials = materials.length;
  const totalQuantity = materials.reduce(
    (sum, m) => sum + (parseFloat(m.totalQuantity) || 0),
    0
  );
  const totalValue = materials.reduce(
    (sum, m) =>
      sum +
      (parseFloat(m.totalQuantity) || 0) * (parseFloat(m.rateFreezed) || 0),
    0
  );
  const uniqueMakes = new Set(materials.map((m) => m.make)).size;

  return (
    <div className="manage-materials-container flex flex-col md:flex-row">
      {/* Modal for add/edit/view */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {viewingId
                    ? "View Material"
                    : editingId
                    ? "Edit Material"
                    : "Add New Material"}
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
                      Material Name *
                    </label>
                    <input
                      type="text"
                      name="materialName"
                      value={formData.materialName}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Make *
                    </label>
                    <input
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pack Size *
                    </label>
                    <input
                      type="number"
                      name="packSize"
                      value={formData.packSize}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coefficient *
                    </label>
                    <input
                      type="number"
                      name="coefficient"
                      value={formData.coefficient}
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
                      Total Quantity *
                    </label>
                    <input
                      type="number"
                      name="totalQuantity"
                      value={formData.totalQuantity}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Quantity (Nos) *
                    </label>
                    <input
                      type="number"
                      name="totalQuantityNos"
                      value={formData.totalQuantityNos}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate Freezed *
                    </label>
                    <input
                      type="number"
                      name="rateFreezed"
                      value={formData.rateFreezed}
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
                      BOQ Number *
                    </label>
                    <select
                      name="boq"
                      value={formData.boq}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select BOQ Number</option>
                      {boqOptions.map((boq) => (
                        <option key={boq._id} value={boq._id}>
                          {boq.boqNumber}
                        </option>
                      ))}
                    </select>
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
        <Sidebar title="Manage Materials" />
      </div>
      {/* Main Content */}
      <main className="manage-materials-main flex-1 px-2 sm:px-4 md:px-8 py-6">
        <div className="max-w-300 mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">
              Manage Materials
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Add, update, view, and delete Materials
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
                <FaPlus /> Add New Material
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
                placeholder="Search materials..."
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
                        onClick={() => handleSort("materialName")}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        Material Name
                        {sortBy === "materialName" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      <button
                        onClick={() => handleSort("make")}
                        className="text-centerflex items-center gap-1 hover:text-blue-600"
                      >
                        Make
                        {sortBy === "make" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-2 py-3 min-w-[100px] text-center">
                      Pack Size
                    </th>
                    <th className="px-2 py-3 min-w-[100px] text-center">
                      Coefficient
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      Total Quantity
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      Total Quantity (Nos)
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">
                      Rate Freezed
                    </th>
                    <th className="px-2 py-3 min-w-[80px] text-center">
                      BOQ No.
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
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2">Loading...</p>
                      </td>
                    </tr>
                  ) : currentMaterials.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        {searchTerm
                          ? "No materials found matching your search."
                          : "No materials found."}
                      </td>
                    </tr>
                  ) : (
                    currentMaterials.map((material) => (
                      <tr
                        key={material._id}
                        className={
                          "materials-row border-b border-gray-100 hover:bg-gray-50 odd:bg-white even:bg-gray-100"
                        }
                      >
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {material.materialName}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {material.make}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {material.packSize}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {material.coefficient}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {material.totalQuantity}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {material.totalQuantityNos}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          ₹{material.rateFreezed}
                        </td>
                        <td className="px-2 py-2 text-gray-700 text-center">
                          {getBoqNumber(material.boq)}
                        </td>
                        <td className="px-2 py-2 flex justify-center gap-2">
                          <button
                            onClick={() => handleView(material)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(material)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(material._id)}
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
                  {totalMaterials}
                </div>
                <div className="text-gray-600">Total Materials</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {totalQuantity}
                </div>
                <div className="text-gray-600">Total Quantity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ₹{totalValue.toFixed(2)}
                </div>
                <div className="text-gray-600">Total Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {uniqueMakes}
                </div>
                <div className="text-gray-600">Unique Makes</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageMaterials;
