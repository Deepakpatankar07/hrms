import { useState } from "react";
import Button from "../Button/Button";
import "./LeaveForm.css";

const LeaveForm = ({ onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    employeeName: "",
    designation: "",
    startDate: "",
    reason: "",
    document: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.employeeName || !formData.startDate || !formData.reason) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const newLeave = {
        ...formData,
        id: Date.now().toString(),
        status: "pending",
        document: formData.document ? formData.document.name : null,
      };
      onSubmitSuccess(newLeave);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="form-container">
      {/* <h3>Add New Leave</h3> */}
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Full Name*</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleInputChange}
            placeholder="Employee Name"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Designation*</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            placeholder="Enter designation"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Leave Date*</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Documents</label>
          <div className="file-upload">
            <input
              type="file"
              onChange={handleFileChange}
              disabled={loading}
              id="leave-document"
            />
            <label htmlFor="leave-document">Choose file</label>
            {formData.document && <span>{formData.document.name}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Reason*</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="Enter reason for leave"
            disabled={loading}
            rows={1}
          />
        </div>
      </form>
      <div className="form-actions">
        <Button type="submit" disabled={loading} variant="purple">
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default LeaveForm;
