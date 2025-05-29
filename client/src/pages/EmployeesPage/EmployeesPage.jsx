import { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import Filter from "../../components/Filter/Filter.jsx";
import Button from "../../components/Button/Button.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import EmployeeForm from "../../components/EmployeeForm/EmployeeForm.jsx";
import { MoreVertical, Edit, Trash2 } from "react-feather";
import axios from "axios";
import "./EmployeesPage.css";

const EmployeesPage = () => {
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch employees on component mount
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/v1/employees",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Data", response.data);
      setEmployees(response.data.data || response.data.employees || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  const positionOptions = [
    { value: "", label: "All Positions" },
    { value: "Intern", label: "Intern" },
    { value: "Full Time", label: "Full Time" },
    { value: "Junior", label: "Junior" },
    { value: "Senior", label: "Senior" },
    { value: "Team Lead", label: "Team Lead" },
  ];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase());
    const matchesPosition =
      !positionFilter || employee.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  const handleEditEmployee = (employeeId) => {
    const employee = employees.find(
      (e) => e.id === employeeId || e._id === employeeId
    );
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleUpdateSuccess = (updatedEmployee) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === updatedEmployee.id || emp._id === updatedEmployee._id
          ? {...emp, ...updatedEmployee }
          : emp
      )
    );
    setIsModalOpen(false);
    setSelectedEmployee(null);
    fetchEmployees();
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`/api/v1/employees/${employeeId}`);
        setEmployees(
          employees.filter(
            (employee) =>
              employee.id !== employeeId && employee._id !== employeeId
          )
        );
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete employee");
      }
    }
  };

  if (loading && employees.length === 0) {
    return <div className="main-content">Loading employees...</div>;
  }

  if (error) {
    return <div className="main-content">Error: {error}</div>;
  }

  return (
    <div className="main-content">
      <Header title="Employee Management" />

      <div className="employees-filters">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
        />

        <Filter
          label="Position"
          options={positionOptions}
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
        />

        {/* <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Add Employee
        </Button> */}
      </div>

      <div className="employees-table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              {/* <th>Department</th> */}
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id || employee.id}>
                <td>
                  <div className="employee-profile">
                    <div className="profile-avatar">
                      {employee.name.charAt(0)}
                    </div>
                  </div>
                </td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.position}</td>
                {/* <td>{employee.department}</td> */}
                <td>
                  {new Date(employee.joinedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td>
                  <div className="dropdown">
                    <button className="dropdown-toggle">
                      <MoreVertical size={18} />
                    </button>
                    <div className="dropdown-menu-employees">
                      <button
                        onClick={() =>
                          handleEditEmployee(employee._id || employee.id)
                        }
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteEmployee(employee._id || employee.id)
                        }
                        className="delete"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        title={
          selectedEmployee
            ? `Edit Employee: ${selectedEmployee.name}`
            : "Add New Employee"
        }
      >
        <EmployeeForm
          employee={selectedEmployee}
          onSubmitSuccess={(newEmployee) => {
            if (selectedEmployee) {
              handleUpdateSuccess(newEmployee);
            } else {
              setEmployees([...employees, newEmployee]);
              setIsModalOpen(false);
            }
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedEmployee(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default EmployeesPage;
