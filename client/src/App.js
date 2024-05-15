import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./App.css";

// Set the base URL for Axios
axios.defaults.baseURL = "http://localhost:8080";

function App() {
  // State variables
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    date_of_birth: "",
  });
  const [formDataEdit, setFormDataEdit] = useState({
    name: "",
    email: "",
    mobile: "",
    date_of_birth: "",
    _id: "",
  });
  const [dataList, setDataList] = useState([]);
  const [dateFormatError, setDateFormatError] = useState(false);

  // Handle form input changes
  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "date_of_birth") {
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      setDateFormatError(!dateRegex.test(value));
    }
  };

  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { date_of_birth } = formData;
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (dateRegex.test(date_of_birth)) {
      const data = await axios.post("/create", formData);
      if (data.data.success) {
        setAddSection(false);
        alert(data.data.message);
        getFetchData();
        setFormData({ name: "", email: "", mobile: "", date_of_birth: "" });
        setDateFormatError(false);
      }
    } else {
      setDateFormatError(true);
    }
  };

  // Fetch data from the server
  const getFetchData = async () => {
    const data = await axios.get("/");
    if (data.data.success) {
      setDataList(data.data.data);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    getFetchData();
  }, []);

  // Handle delete operation
  const handleDelete = async (id) => {
    if (id !== undefined) {
      if (window.confirm("Are you sure you want to delete this entry?")) {
        try {
          const data = await axios.delete(`/delete/${id}`);

          if (data.data.success) {
            getFetchData();
            alert(data.data.message);
          }
        } catch (error) {
          console.error("Error deleting data:", error);
        }
      }
    }
  };

  // Handle update operation
  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = await axios.put("/update", formDataEdit);
    if (data.data.success) {
      getFetchData();
      alert(data.data.message);
      setEditSection(false);
    }
  };

  // Handle form input changes for edit section
  const handleEditOnChange = (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => ({ ...prev, [name]: value }));
  };

  // Handle edit button click
  const handleEdit = (el) => {
    const formattedDateOfBirth = new Date(el.date_of_birth).toLocaleDateString(
      "en-GB"
    );
    setFormDataEdit({
      ...el,
      date_of_birth: formattedDateOfBirth,
    });
    setEditSection(true);
  };

  // Render component
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="content">
           {/* Table to display data */}
          <div className="tableContainer">
             {/* Table */}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>date_of_birth</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataList[0] ? (
                  dataList.map((el) => (
                    <tr key={el.id}>
                      <td>{el.name}</td>
                      <td>{el.email}</td>
                      <td>{el.mobile}</td>
                      <td>{el.formatted_date}</td>
                      <td>
                        <button
                          className="btn btn-edit"
                          onClick={() => handleEdit(el)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(el.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add button */}
          <button className="btn btn-add" onClick={() => setAddSection(true)}>
            Add
          </button>

          {/* Add section */}
          {addSection && (
            <div className="addContainer">
               {/* Add form */}
              <form onSubmit={handleSubmit}>
                <div className="form-header">
                  <h2>Add User</h2>
                  <div
                    className="close-btn"
                    onClick={() => setAddSection(false)}
                  >
                    &times;
                  </div>
                </div>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleOnChange}
                />
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleOnChange}
                />
                <label>Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleOnChange}
                />
                <label>Date of Birth (dd/mm/yyyy)</label>
                <input
                  type="text"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleOnChange}
                />
                {dateFormatError && (
                  <p style={{ color: "red" }}>
                    Please enter the date in the format dd/mm/yyyy
                  </p>
                )}
                <button type="submit" disabled={dateFormatError}>
                  Add
                </button>
              </form>
            </div>
          )}

          {/* Edit section */}
          {editSection && (
            <div className="addContainer">
               {/* Edit form */}
              <form onSubmit={handleUpdate}>
                <div className="form-header">
                  <h2>Edit User</h2>
                  <div
                    className="close-btn"
                    onClick={() => setEditSection(false)}
                  >
                    &times;
                  </div>
                </div>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formDataEdit.name}
                  onChange={handleEditOnChange}
                />
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formDataEdit.email}
                  onChange={handleEditOnChange}
                />
                <label>Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formDataEdit.mobile}
                  onChange={handleEditOnChange}
                />
                <label>Date of Birth (dd/mm/yyyy)</label>
                <input
                  type="text"
                  name="date_of_birth"
                  value={formDataEdit.date_of_birth}
                  onChange={handleEditOnChange}
                />
                {dateFormatError && (
                  <p style={{ color: "red" }}>
                    Please enter the date in the format dd/mm/yyyy
                  </p>
                )}
                <button type="submit">Update</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
