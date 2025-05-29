import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../Button/Button";
import "./LeaveForm.css";
import { useAuth } from "../../context/AuthContext";

const LeaveForm = ({ leave, onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    employee: "",
    startDate: "",
    endDate: "",
    type: "Sick",
    reason: "",
    status: "Pending",
  });
  const [document, setDocument] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchActiveEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/v1/employees?status=Active",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployees(response.data.data);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };

    fetchActiveEmployees();

    if (leave) {
      setFormData({
        employee: leave.employee?._id || leave.employee || "",
        startDate: leave.startDate ? formatDateForInput(leave.startDate) : "",
        endDate: leave.endDate ? formatDateForInput(leave.endDate) : "",
        type: leave.type || "Sick",
        reason: leave.reason || "",
        status: leave.status || "Pending",
      });
    }
  }, [leave]);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.employee ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason
    ) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("employee", formData.employee);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    data.append("type", formData.type);
    data.append("reason", formData.reason);
    data.append("status", formData.status);
    if (document) {
      data.append("document", document);
    }

    try {
      const token = localStorage.getItem("token");
      let response;

      if (leave) {
        // Update existing leave
        response = await axios.put(
          `http://localhost:5000/api/v1/leaves/${leave._id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new leave
        response = await axios.post(
          "http://localhost:5000/api/v1/leaves",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      onSubmitSuccess(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to process leave request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-form-container">
      <form onSubmit={handleSubmit} className="leave-form">
        {error && <p className="form-error">{error}</p>}

        <div className="form-group-leave">
          <label>Employee*</label>
          <select
            name="employee"
            value={formData.employee}
            onChange={handleInputChange}
            required
            disabled={loading || (leave && leave.status !== "Pending")}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.position})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group-leave">
          <label>Leave Type*</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            disabled={loading || (leave && leave.status !== "Pending")}
          >
            <option value="Sick">Sick Leave</option>
            <option value="Vacation">Vacation</option>
            <option value="Personal">Personal</option>
            <option value="Maternity">Maternity</option>
            <option value="Paternity">Paternity</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group-leave">
          <label>Start Date*</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
            disabled={loading || (leave && leave.status !== "Pending")}
          />
        </div>

        <div className="form-group-leave">
          <label>End Date*</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            required
            disabled={loading || (leave && leave.status !== "Pending")}
          />
        </div>

        <div className="form-group-leave">
          <label>Reason*</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="Enter reason for leave"
            required
            disabled={loading || (leave && leave.status !== "Pending")}
          />
        </div>

        <div className="form-group-leave">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>


        <div className="form-actions-leave">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="purple" disabled={loading}>
            {loading
              ? leave
                ? "Updating..."
                : "Submitting..."
              : leave
              ? "Update"
              : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
