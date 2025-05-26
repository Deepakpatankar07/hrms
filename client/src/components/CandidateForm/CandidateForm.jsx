import { useState } from 'react';
import axios from 'axios';
import Button from '../Button/Button';
import './CandidateForm.css';

const CandidateForm = ({ onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    status: 'pending',
    experience: '',
  });
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.position) {
      setError('Name, Email, Phone Number, and Position are required.');
      setLoading(false);
      return;
    }

    // Prepare form data for submission
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('position', formData.position);
    data.append('status', formData.status);
    data.append('experience', formData.experience);
    if (resume) {
      data.append('resume', resume);
    }

    try {
      // Send POST request to backend
      const response = await axios.post('http://localhost:5000/api/candidates', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // On success, call the onSubmitSuccess callback and close the modal
      onSubmitSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create candidate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="candidate-form">
      {error && <p className="form-error">{error}</p>}
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter candidate name"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter candidate email"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter phone number"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Position</label>
        <select name="position" value={formData.position} onChange={handleInputChange} disabled={loading}>
          <option value="">Select Position</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="HR Manager">HR Manager</option>
          <option value="Product Manager">Product Manager</option>
          <option value="Designer">Designer</option>
        </select>
      </div>
      <div className="form-group">
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleInputChange} disabled={loading}>
          <option value="pending">Pending</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="form-group">
        <label>Experience (years)</label>
        <input
          type="text"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          placeholder="Enter years of experience"
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Resume (optional)</label>
        <input type="file" onChange={handleFileChange} disabled={loading} />
      </div>
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default CandidateForm;