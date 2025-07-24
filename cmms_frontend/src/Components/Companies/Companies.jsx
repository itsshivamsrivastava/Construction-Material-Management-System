import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Companies.css";
import Sidebar from "../Sidebar/Sidebar";

const API_BASE = "http://localhost:3000/api/company";
const WORKORDER_API_BASE = "http://localhost:3000/api/workorder";

const initialForm = { company_id: "", name: "", gstNumber: "", address: "" };

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 5;

  // State for Workorder Modal
  const [ShowTablePopUp, setShowTablePopUp] = useState(false);
  const [workorders, setWorkorders] = useState([]);
  const [showWorkordersModal, setShowWorkordersModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyWorkorders, setCompanyWorkorders] = useState([]);
  const [workordersLoading, setWorkordersLoading] = useState(false);
  const [workordersError, setWorkordersError] = useState("");
  const [workordersSuccess, setWorkordersSuccess] = useState("");

  const navigate = useNavigate();

  // Fetch companies
  const fetchCompanies = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/getCompany`);
      const data = await res.json();
      setCompanies(data);
      setCurrentPage(1); // Reset to first page on fetch
    } catch (err) {
      setError("Failed to fetch companies");
      console.error("Fetch companies error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        // Update
        const res = await fetch(`${API_BASE}/updateCompany/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Update failed");
        setSuccess("Company updated successfully");
      } else {
        // Add
        const res = await fetch(`${API_BASE}/addCompany`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Add failed");
        setSuccess("Company added successfully");
      }
      setForm(initialForm);
      setEditingId(null);
      fetchCompanies();
    } catch (err) {
      setError(err.message || "Operation failed");
    }
    setLoading(false);
  };

  // Handle edit
  const handleEdit = (company) => {
    setForm({
      company_id: company.company_id,
      name: company.name,
      gstNumber: company.gstNumber,
      address: company.address,
    });
    setEditingId(company._id);
    setSuccess("");
    setError("");
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/deleteCompany/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setSuccess("Company deleted successfully");
      fetchCompanies();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
    setLoading(false);
  };

  // Handle cancel edit
  const handleCancel = () => {
    setShowTablePopUp(false);
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  // Pagination logic
  const totalPages = Math.ceil(companies.length / recordsPerPage);
  const paginatedCompanies = companies.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Fetch workorders by company
  const fetchWorkordersByCompany = async (companyId) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${WORKORDER_API_BASE}/byCompany/${companyId}`);
      const data = await res.json();
      setWorkorders(data);
      setShowTablePopUp(true);
    } catch (err) {
      setError("Failed to fetch workorders");
      console.error("Fetch workorders error:", err);
    }
    setLoading(false);
  };

  // Handle click on company name to show workorders
  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    fetchWorkordersByCompany(company._id);
    setShowTablePopUp(true);
  };

  // Handle edit workorder (redirect to Workorder page)
  const handleEditWorkorder = (workorderId) => {
    setShowWorkordersModal(false); // Close the modal
    navigate(`/workorders/${workorderId}`);
  };

  // Handle delete workorder
  const handleDeleteWorkorder = async (workorderId) => {
    if (!window.confirm("Are you sure you want to delete this workorder?"))
      return;
    setWorkordersLoading(true);
    setWorkordersError("");
    setWorkordersSuccess("");
    try {
      const res = await fetch(`${WORKORDER_API_BASE}/delete/${workorderId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setWorkordersSuccess("Workorder deleted successfully");
      fetchWorkordersByCompany(selectedCompany._id);
    } catch (err) {
      setWorkordersError(err.message || "Delete failed");
    }
    setWorkordersLoading(false);
  };

  return (
    <div className="companies-page-container flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Modal for showing workorders by company */}
      {ShowTablePopUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6">
            <div className="">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Work Orders for{" "}
                  {selectedCompany
                    ? `${selectedCompany.name} (${selectedCompany.company_id})`
                    : "<company_name> (<company_id>)"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {workordersSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-fadeIn">
                  {workordersSuccess}
                </div>
              )}
              {workordersError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-fadeIn">
                  {workordersError}
                </div>
              )}

              {/* Workorder Table */}
              <div className="overflow-x-auto rounded-lg shadow-lg bg-white/90 border border-blue-100">
                <table className="w-full divide-y divide-blue-200">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                    <tr>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[140px]">
                        WO Number
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[160px]">
                        Company ID
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[160px]">
                        Client Name
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[140px]">
                        Client Nick Name
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[180px]">
                        Project Name
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[120px]">
                        WO Date
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[140px]">
                        WO Validity Date
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[160px]">
                        WO Completion Date
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[100px]">
                        Retention %
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[100px]">
                        PBG %
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[120px]">
                        PBG Duration
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[120px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    {workordersLoading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-blue-500">Loading Workorders...</td>
                    </tr>
                  ) : workorders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-400">No workorders found.</td>
                    </tr>
                  ) : (
                    workorders.map((wo) => (
                      <tr
                        key={wo._id}
                        className="hover:bg-blue-50 transition text-center"
                      >
                        <td className="py-3 px-4 text-gray-800 font-medium">
                          {wo.woNumber}
                        </td>
                        <td className="py-3 px-4 text-gray-800 font-medium">
                          {wo.company.company_id}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {wo.clientName}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {wo.clientNickName}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {wo.projectName}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {wo.woDate ? wo.woDate.slice(0, 10) : ""}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {wo.woValidityDate
                            ? wo.woValidityDate.slice(0, 10)
                            : ""}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {wo.woCompletionDate
                            ? wo.woCompletionDate.slice(0, 10)
                            : ""}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {wo.retentionPercentage}%
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {wo.pbgPercentage}%
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {wo.pbgDuration} months
                        </td>
                        <td className="py-3 px-4 text-center flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEditWorkorder(wo._id)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                            title="Edit Workorder"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteWorkorder(wo._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete Workorder"
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
          </div>
        </div>
      )}

      {/* Sidebar */}
      {/* Sidebar */}
      <div className={ShowTablePopUp ? "hidden md:block" : "block md:block"}>
        <Sidebar title="Company" />
      </div>


      {/* Main Content */}
      <main className="companies-main flex-1 px-2 sm:px-4 md:px-8 py-6">
        <div className="mb-8 mt-10 text-center main-container">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">
            Company Management
          </h2>
          <p className="text-gray-500 text-base md:text-lg">
            Add, view, and manage all your companies easily.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 shadow-xl rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row gap-4 md:gap-6 items-center border border-blue-100"
        >
          <input
            type="text"
            name="company_id"
            value={form.company_id}
            onChange={handleChange}
            placeholder="Company ID"
            className="w-full md:w-1/4 px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400 text-gray-700 shadow-sm"
            disabled
          />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full md:w-1/4 px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400 text-gray-700 shadow-sm"
            required
          />
          <input
            type="text"
            name="gstNumber"
            value={form.gstNumber}
            onChange={handleChange}
            placeholder="GST Number"
            className="w-full md:w-1/4 px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400 text-gray-700 shadow-sm"
            required
          />
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full md:w-1/4 px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400 text-gray-700 shadow-sm"
            required
          />
          <div className="flex gap-2 w-full md:w-auto justify-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60"
              disabled={loading}
            >
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gradient-to-r from-gray-400 to-gray-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-gray-500 hover:to-gray-700 transition disabled:opacity-60"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && (
          <div className="text-red-600 mb-4 text-center font-medium animate-pulse">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 mb-4 text-center font-medium animate-pulse">
            {success}
          </div>
        )}
        <div className="companies-table-wrapper overflow-x-auto rounded-2xl shadow-lg bg-white/90 border border-blue-100">
          <table className="companies-table w-full divide-y divide-blue-200">
            <thead className="text-center bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <tr>
                <th className="py-3 px-4 font-semibold tracking-wide">
                  Comapny ID
                </th>
                <th className="py-3 px-4 font-semibold tracking-wide">Name</th>
                <th className="py-3 px-4 font-semibold tracking-wide">
                  GST Number
                </th>
                <th className="py-3 px-4 font-semibold tracking-wide">
                  Address
                </th>
                <th className="py-3 px-4 font-semibold tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-8 text-blue-500 font-semibold animate-pulse"
                  >
                    Loading...
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    No companies found.
                  </td>
                </tr>
              ) : (
                paginatedCompanies.map((company) => (
                  <tr
                    key={company._id}
                    className="hover:bg-blue-50 transition text-center"
                  >
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      {company.company_id}
                    </td>
                    <td
                      className="py-3 px-4 text-gray-800 font-medium cursor-pointer hover:underline"
                      onClick={() => {
                        setShowTablePopUp(true);
                        handleCompanyClick(company);
                      }}
                    >
                      {company.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {company.gstNumber}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {company.address}
                    </td>
                    <td className="py-3 px-4 text-center flex flex-col sm:flex-row gap-2 justify-center items-center">
                      <button
                        onClick={() => handleEdit(company)}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-1.5 rounded-lg font-semibold shadow hover:from-yellow-500 hover:to-yellow-600 transition disabled:opacity-60"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(company._id)}
                        className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-1.5 rounded-lg font-semibold shadow hover:from-red-600 hover:to-red-800 transition disabled:opacity-60"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls flex flex-wrap justify-center items-center gap-2 py-4">
              <button
                className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded font-semibold border transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
