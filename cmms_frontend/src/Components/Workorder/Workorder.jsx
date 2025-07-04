import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaEye } from "react-icons/fa";
import "./WorkorderStyle.css";

const WorkOrder = () => {
  const [workorders, setWorkorders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("woNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const [boqOptions, setBoqOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  // Form state
  const [formData, setFormData] = useState({
    clientName: "",
    clientNickName: "",
    woNumber: "",
    woDate: "",
    projectName: "",
    boqNumber: "",
    company: "",
    workorderAmount: "",
    woValidityDate: "",
    woCompletionDate: "",
    retentionPercentage: "",
    pbgPercentage: "",
    pbgDuration: "",
  });

  const workorderPerPage = 6;
  const filteredWorkorders = workorders.filter(workorder =>
    workorder.woNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workorder.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workorder.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedWorkorders = [...filteredWorkorders].sort((a, b) => {
    const aValue = a[sortBy]?.toString().toLowerCase();
    const bValue = b[sortBy]?.toString().toLowerCase();
    return sortOrder === "asc" 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const totalPages = Math.ceil(sortedWorkorders.length / workorderPerPage);
  const currentWorkorders = sortedWorkorders.slice(
    currentPage * workorderPerPage,
    currentPage * workorderPerPage + workorderPerPage
  );

  // Fetch all workorder data
  const fetchWorkorders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:3000/api/workorder/getAll");
      setWorkorders(res.data);
    } catch (err) {
      setError("Failed to fetch workorders");
      console.error(err);
    }
    setLoading(false);
  };

  // Fetch single workorder for editing
  const fetchWorkorder = async (workorderId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/workorder/get/${workorderId}`);
      const data = res.data;
      setFormData({
        clientName: data.clientName || "",
        clientNickName: data.clientNickName || "",
        woNumber: data.woNumber || "",
        woDate: data.woDate ? data.woDate.slice(0, 10) : "",
        projectName: data.projectName || "",
        boqNumber: data.boqNumber || "",
        company: typeof data.company === "object" && data.company !== null ? data.company._id : data.company || "",
        workorderAmount: data.workorderAmount || "",
        woValidityDate: data.woValidityDate ? data.woValidityDate.slice(0, 10) : "",
        woCompletionDate: data.woCompletionDate ? data.woCompletionDate.slice(0, 10) : "",
        retentionPercentage: data.retentionPercentage || "",
        pbgPercentage: data.pbgPercentage || "",
        pbgDuration: data.pbgDuration || "",
      });
    } catch (err) {
      setError("Failed to fetch workorder details");
      console.error(err);
    }
  };

  // Fetch dropdown options
  const fetchOptions = async () => {
    try {
      const [boqRes, companyRes] = await Promise.all([
        axios.get("http://localhost:3000/api/boq/getAll"),
        axios.get("http://localhost:3000/api/company/getCompany")
      ]);
      setBoqOptions(boqRes.data);
      setCompanyOptions(companyRes.data);
    } catch (err) {
      console.error("Failed to fetch options:", err);
    }
  };

  useEffect(() => {
    fetchWorkorders();
    fetchOptions();
    if (id) {
      setEditingId(id);
      fetchWorkorder(id);
      setShowForm(true);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/api/workorder/update/${editingId}`, formData);
        setSuccess("Workorder updated successfully!");
      } else {
        await axios.post("http://localhost:3000/api/workorder/add", formData);
        setSuccess("Workorder created successfully!");
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({
        clientName: "",
        clientNickName: "",
        woNumber: "",
        woDate: "",
        projectName: "",
        boqNumber: "",
        company: "",
        workorderAmount: "",
        woValidityDate: "",
        woCompletionDate: "",
        retentionPercentage: "",
        pbgPercentage: "",
        pbgDuration: "",
      });
      fetchWorkorders();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
      console.error(err);
    }
    setLoading(false);
  };

  const handleEdit = (workorder) => {
    setFormData({
      clientName: workorder.clientName || "",
      clientNickName: workorder.clientNickName || "",
      woNumber: workorder.woNumber || "",
      woDate: workorder.woDate ? workorder.woDate.slice(0, 10) : "",
      projectName: workorder.projectName || "",
      boqNumber: workorder.boqNumber || "",
      company: typeof workorder.company === "object" && workorder.company !== null ? workorder.company._id : workorder.company || "",
      workorderAmount: workorder.workorderAmount || "",
      woValidityDate: workorder.woValidityDate ? workorder.woValidityDate.slice(0, 10) : "",
      woCompletionDate: workorder.woCompletionDate ? workorder.woCompletionDate.slice(0, 10) : "",
      retentionPercentage: workorder.retentionPercentage || "",
      pbgPercentage: workorder.pbgPercentage || "",
      pbgDuration: workorder.pbgDuration || "",
    });
    setEditingId(workorder._id);
    setShowForm(true);
    setViewingId(null);
  };

  const handleView = (workorder) => {
    setFormData({
      clientName: workorder.clientName || "",
      clientNickName: workorder.clientNickName || "",
      woNumber: workorder.woNumber || "",
      woDate: workorder.woDate ? workorder.woDate.slice(0, 10) : "",
      projectName: workorder.projectName || "",
      boqNumber: workorder.boqNumber || "",
      company: workorder.company || "",
      workorderAmount: workorder.workorderAmount || "",
      woValidityDate: workorder.woValidityDate ? workorder.woValidityDate.slice(0, 10) : "",
      woCompletionDate: workorder.woCompletionDate ? workorder.woCompletionDate.slice(0, 10) : "",
      retentionPercentage: workorder.retentionPercentage || "",
      pbgPercentage: workorder.pbgPercentage || "",
      pbgDuration: workorder.pbgDuration || "",
    });
    setViewingId(workorder._id);
    setEditingId(null);
    setShowForm(true);
  };

  const handleDelete = async (workorderId) => {
    if (!window.confirm("Are you sure you want to delete this workorder?")) return;
    
    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:3000/api/workorder/delete/${workorderId}`);
      setSuccess("Workorder deleted successfully!");
      fetchWorkorders();
    } catch (err) {
      setError("Failed to delete workorder");
      console.error(err);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setViewingId(null);
    setFormData({
      clientName: "",
      clientNickName: "",
      woNumber: "",
      woDate: "",
      projectName: "",
      boqNumber: "",
      company: "",
      workorderAmount: "",
      woValidityDate: "",
      woCompletionDate: "",
      retentionPercentage: "",
      pbgPercentage: "",
      pbgDuration: "",
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

  // Helper functions
  const getBoqNumberLabel = (boqId) => {
    const id = Array.isArray(boqId) ? boqId[0] : boqId;
    const boq = boqOptions.find((b) => b._id === id);
    return boq ? boq.boqNumber : id;
  };

  const getCompanyName = (companyObjOrId) => {
    if (!companyObjOrId) return "";
    if (typeof companyObjOrId === "object" && companyObjOrId.name)
      return companyObjOrId.name;
    const company = companyOptions.find((c) => c._id === companyObjOrId);
    return company ? company.name : companyObjOrId;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Modal should be here to overlay everything */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {viewingId ? "View Workorder" : editingId ? "Edit Workorder" : "Add New Workorder"}
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
                      Company *
                    </label>
                    <select
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select Company</option>
                      {companyOptions.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      BOQ Number *
                    </label>
                    <select
                      name="boqNumber"
                      value={formData.boqNumber}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select BOQ</option>
                      {boqOptions.map((boq) => (
                        <option key={boq._id} value={boq._id}>
                          {boq.boqNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WO Number *
                    </label>
                    <input
                      type="text"
                      name="woNumber"
                      value={formData.woNumber}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Nickname
                    </label>
                    <input
                      type="text"
                      name="clientNickName"
                      value={formData.clientNickName}
                      onChange={handleInputChange}
                      disabled={viewingId}
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
                      WO Date *
                    </label>
                    <input
                      type="date"
                      name="woDate"
                      value={formData.woDate}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WO Validity Date *
                    </label>
                    <input
                      type="date"
                      name="woValidityDate"
                      value={formData.woValidityDate}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WO Completion Date
                    </label>
                    <input
                      type="date"
                      name="woCompletionDate"
                      value={formData.woCompletionDate}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Work Order Amount *
                    </label>
                    <input
                      type="number"
                      name="workorderAmount"
                      value={formData.workorderAmount}
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
                      Retention % *
                    </label>
                    <input
                      type="number"
                      name="retentionPercentage"
                      value={formData.retentionPercentage}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PBG % *
                    </label>
                    <input
                      type="number"
                      name="pbgPercentage"
                      value={formData.pbgPercentage}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PBG Duration (Months) *
                    </label>
                    <input
                      type="number"
                      name="pbgDuration"
                      value={formData.pbgDuration}
                      onChange={handleInputChange}
                      disabled={viewingId}
                      required
                      min="0"
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
      {/* <Sidebar title="Manage Workorder" /> */}
      {/* Sidebar: hidden on small/medium when modal is open */}
      <div className={showForm ? "hidden md:block" : "block"}>
        <Sidebar title="Manage Workorder" />
      </div>

      {/* Main Content */}
      <main className="workorder-main flex-1 px-2 sm:px-4 md:px-8 py-6">
        <div className="max-w-250 mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">
              Manage Workorder
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Add, update, and delete Work Orders
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
            <div className="flex flex-col sm:flex-row gap-4 sm:w-auto">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <FaPlus /> Add New Workorder
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
                placeholder="Search workorders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Workorder List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-200 border-b border-gray-200">
                  <tr>
                    <th className="px-2 py-3 min-w-[140px] text-center">
                      <button onClick={() => handleSort('woNumber')} className="flex items-center gap-1 hover:text-blue-600">
                    WO Number
                        {sortBy === 'woNumber' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                    </th>
                    <th className="px-2 py-3 min-w-[160px] text-center">
                      <button onClick={() => handleSort('clientName')} className="flex items-center gap-1 hover:text-blue-600">
                    Client Name
                        {sortBy === 'clientName' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                      </button>
                    </th>
                    <th className="px-2 py-3 min-w-[140px] text-center">Client Nickname</th>
                    <th className="px-2 py-3 min-w-[160px] text-center">Company</th>
                    <th className="px-2 py-3 min-w-[180px] text-center">
                      <button onClick={() => handleSort('projectName')} className="flex items-center gap-1 hover:text-blue-600">
                        Project Name
                        {sortBy === 'projectName' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                    </th>
                    <th className="px-2 py-3 min-w-[120px] text-center">BOQ</th>
                    <th className="px-2 py-3 min-w-[120px] text-center">WO Date</th>
                    <th className="px-2 py-3 min-w-[140px] text-center">WO Validity Date</th>
                    <th className="px-2 py-3 min-w-[160px] text-center">WO Completion Date</th>
                    <th className="px-2 py-3 min-w-[170px] text-center">
                      <button onClick={() => handleSort('workorderAmount')} className="flex items-center gap-1 hover:text-blue-600">
                    Work Order Amount
                        {sortBy === 'workorderAmount' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                    </th>
                    <th className="px-2 py-3 min-w-[100px] text-center">Retention %</th>
                    <th className="px-2 py-3 min-w-[100px] text-center">PBG %</th>
                    <th className="px-2 py-3 min-w-[120px] text-center">PBG Duration</th>
                    <th className="px-2 py-3 min-w-[120px] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
            {loading ? (
                    <tr>
                      <td colSpan={14} className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2">Loading...</p>
                      </td>
                    </tr>
            ) : currentWorkorders.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="p-8 text-center text-gray-500">
                {searchTerm ? "No workorders found matching your search." : "No workorders found."}
                      </td>
                    </tr>
            ) : (
                    currentWorkorders.map((workorder) => (
                      <tr key={workorder._id} className={"border-b border-gray-100 hover:bg-gray-50 odd:bg-white even:bg-gray-100"}>
                        <td className="px-2 py-2 font-medium text-blue-600 text-center">{workorder.woNumber}</td>
                        <td className="px-2 py-2 text-gray-700 text-center">{workorder.clientName}</td>
                        <td className="px-2 py-2 text-gray-700 text-center">{workorder.clientNickName}</td>
                        <td className="px-2 py-2 text-gray-600 text-center">{getCompanyName(workorder.company)}</td>
                        <td className="px-2 py-2 text-gray-700 text-center">{workorder.projectName}</td>
                        <td className="px-2 py-2 text-gray-600 text-center">{getBoqNumberLabel(workorder.boqNumber)}</td>
                        <td className="px-2 py-2 text-gray-700 text-center">{workorder.woDate ? workorder.woDate.slice(0, 10) : ""}</td>
                        <td className="px-2 py-2 text-gray-700 text-center">{workorder.woValidityDate ? workorder.woValidityDate.slice(0, 10) : ""}</td>
                        <td className="px-2 py-2 text-gray-700 text-center">{workorder.woCompletionDate ? workorder.woCompletionDate.slice(0, 10) : ""}</td>
                        <td className="px-2 py-2 font-semibold text-center text-green-600">₹{workorder.workorderAmount}</td>
                        <td className="px-2 py-2 text-gray-700 text-center">{workorder.retentionPercentage}</td>
                        <td className="px-2 py-2 text-gray-700 text-center">{workorder.pbgPercentage}</td>
                        <td className="px-2 py-2 text-gray-700 text-center">{workorder.pbgDuration}</td>
                        <td className="px-2 py-2 flex justify-center gap-2">
                          <button onClick={() => handleView(workorder)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="View"><FaEye size={16} /></button>
                          <button onClick={() => handleEdit(workorder)} className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors" title="Edit"><FaEdit size={16} /></button>
                          <button onClick={() => handleDelete(workorder._id)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><FaTrash size={16} /></button>
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
                <div className="text-2xl font-bold text-blue-600">{workorders.length}</div>
                <div className="text-gray-600">Total Workorders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{workorders.reduce((sum, wo) => sum + (parseFloat(wo.workorderAmount) || 0), 0).toFixed(2)}
                </div>
                <div className="text-gray-600">Total Amount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(workorders.map(wo => wo.company)).size}
                </div>
                <div className="text-gray-600">Active Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(workorders.map(wo => wo.clientName)).size}
                </div>
                <div className="text-gray-600">Unique Clients</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkOrder;