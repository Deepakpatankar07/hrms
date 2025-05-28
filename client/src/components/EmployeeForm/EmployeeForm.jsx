import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../Button/Button';
import './EmployeeForm.css';

const EmployeeForm = ({ employee, onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    experience: '',
    salary: '',
    status: 'Active',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Populate form with employee data when component mounts or employee prop changes
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        position: employee.position || '',
        department: employee.department || '',
        experience: employee.experience || '',
        salary: employee.salary || '',
        status: employee.status || 'Active',
        role: employee.role || 'employee'
      });
    }
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.position) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/v1/employees/${employee._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // console.log('Employee updated successfully:', response.data);
      onSubmitSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-form-container">
      <form onSubmit={handleSubmit} className="employee-form">
        {error && <p className="form-error">{error}</p>}
        
        <div className="form-group-employee">
          <label>Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter employee name"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group-employee">
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter employee email"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group-employee">
          <label>Phone*</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group-employee">
          <label>Position*</label>
          <select
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
            disabled={loading}
          >
            <option value="">Select Position</option>
            <option value="Human Resource Lead">Human Resource Lead</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Designer">Designer</option>
          </select>
        </div>
        
        {/* <div className="form-group-employee">
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            placeholder="Enter department"
            disabled={loading}
          />
        </div> */}
        
        <div className="form-group-employee">
          <label>Experience (years)</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            placeholder="Enter years of experience"
            min="0"
            step="0.5"
            disabled={loading}
          />
        </div>
        
        {/* <div className="form-group-employee">
          <label>Salary</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            placeholder="Enter salary"
            min="0"
            disabled={loading}
          />
        </div> */}
        
        <div className="form-group-employee">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>
        
        {/* <div className="form-group-employee">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div> */}
        
        <div className="form-actions-employee">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="purple"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;