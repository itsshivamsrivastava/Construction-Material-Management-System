import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManageWorkorder.css";
import Sidebar from "../Sidebar/Sidebar";

const initialFormState = {
  company: "",
  boqNumber: "",
  woNumber: "",
  clientName: "",
  projectName: "",
  woDate: "",
  woValidityDate: "",
  woCompletionDate: "",
  workorderAmount: "",
  retentionPercentage: "",
  pbgPercentage: "",
  pbgDuration: ""
};

const ManageWorkorder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [companies, setCompanies] = useState([]);
  const [boqOptions, setBoqOptions] = useState([]);
  const isEditMode = Boolean(id);

  // Fetch companies and BOQ options always, fetch workorder only in edit mode
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [companiesRes, boqRes] = await Promise.all([
          axios.get("http://localhost:3000/api/company/getCompany"),
          axios.get("http://localhost:3000/api/boq/getAll")
        ]);
        setCompanies(companiesRes.data);
        setBoqOptions(boqRes.data);
      } catch {
        setError("Failed to fetch company or BOQ data");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Fetch workorder if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      axios.get(`http://localhost:3000/api/workorder/get/${id}`)
        .then(res => {
          setForm(res.data);
        })
        .catch(() => {
          setError("Failed to fetch workorder data");
        })
        .finally(() => setLoading(false));
    } else {
      setForm(initialFormState);
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:3000/api/workorder/update/${id}`, form);
        setSuccess("Workorder updated successfully!");
      } else {
        await axios.post("http://localhost:3000/api/workorder/add", form);
        setSuccess("Workorder created successfully!");
        setForm(initialFormState);
      }
      setTimeout(() => {
        setSuccess("");
        navigate("/workorders");
      }, 1500);
    } catch {
      setError(isEditMode ? "Failed to update workorder" : "Failed to create workorder");
      setLoading(false);
    }
  };

  return (
    <div className="workorder-page-container flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Sidebar title="Workorder Dashboard" />
      
      <main className="workorder-main flex-1 px-2 sm:px-4 md:px-8 py-6">
        <div className="mb-8 mt-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">
            {isEditMode ? "Edit Work Order" : "Add Work Order"}
          </h2>
          <p className="text-gray-500 text-base md:text-lg">
            {isEditMode ? "Update the existing work order details below." : "Enter the new work order details below."}
          </p>
          <div className="mb-8 mt-10 text-center">
            <button
              type="button"
              className="w-42 mx-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
            <button
              type="button"
              className="w-44 mx-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60 cursor-pointer"
              onClick={() => {
                setForm(initialFormState);
                if(isEditMode){navigate("/manage-workorder");}
                else{navigate("/workorders");}
              }}
            >
              {isEditMode ? "Add Workorder" : "View Workorders" }
              
            </button>
          </div>
        </div>

        {loading && (
          <div className="status-message loading-message">
            Loading...
          </div>
        )}
        {error && (
          <div className="status-message error-message">
            {error}
          </div>
        )}
        {success && (
          <div className="status-message success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/90 shadow-xl rounded-2xl p-6 md:p-8 mb-10 flex flex-col gap-4 border border-blue-100">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <select
                id="company"
                name="company"
                value={form.company || ""}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="boqNumber">BOQ Number</label>
              <select
                id="boqNumber"
                name="boqNumber"
                value={form.boqNumber || ""}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select BOQ Number</option>
                {boqOptions.map((boq) => (
                  <option key={boq._id} value={boq._id}>
                    {boq.boqNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="woNumber">Work Order Number</label>
              <input
                type="text"
                id="woNumber"
                name="woNumber"
                value={form.woNumber || ""}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="clientName">Client Name</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={form.clientName || ""}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectName">Project Name</label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={form.projectName || ""}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="woDate">Work Order Date</label>
              <input
                type="date"
                id="woDate"
                name="woDate"
                value={form.woDate ? form.woDate.slice(0,10) : ""}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="woValidityDate">Work Order Validity</label>
              <input
                type="date"
                id="woValidityDate"
                name="woValidityDate"
                value={form.woValidityDate ? form.woValidityDate.slice(0,10) : ""}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="woCompletionDate">Work Order Completion</label>
              <input
                type="date"
                id="woCompletionDate"
                name="woCompletionDate"
                value={form.woCompletionDate ? form.woCompletionDate.slice(0,10) : ""}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="workorderAmount">Work Order Amount</label>
              <input
                type="number"
                id="workorderAmount"
                name="workorderAmount"
                value={form.workorderAmount || ""}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="retentionPercentage">Retention Percentage</label>
              <input
                type="number"
                id="retentionPercentage"
                name="retentionPercentage"
                value={form.retentionPercentage || ""}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pbgPercentage">PBG Percentage</label>
              <input
                type="number"
                id="pbgPercentage"
                name="pbgPercentage"
                value={form.pbgPercentage || ""}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pbgDuration">PBG Duration</label>
              <input
                type="text"
                id="pbgDuration"
                name="pbgDuration"
                value={form.pbgDuration || ""}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/workorders")}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition-colors disabled:opacity-50"
            >
              {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Work Order" : "Create Work Order")}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ManageWorkorder; 