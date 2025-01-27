import React, { useState, useEffect } from "react";
import UserForm from "./UserForm";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const usersPerPage = 5;

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch users");
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch(() => setError("Failed to fetch users. Please try again."));
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleAddUser = () => {
    setEditUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete user");
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch(() => setError("Failed to delete user."));
  };

  const handleFormSubmit = (user) => {
    const method = user.id ? "PUT" : "POST";
    const url = user.id
      ? `https://jsonplaceholder.typicode.com/users/${user.id}`
      : "https://jsonplaceholder.typicode.com/users";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to ${user.id ? "update" : "add"} user`);
        return response.json();
      })
      .then((data) => {
        if (user.id) {
          setUsers(users.map((u) => (u.id === user.id ? user : u)));
        } else {
          setUsers([...users, { ...user, id: data.id }]);
        }
        setShowForm(false);
      })
      .catch(() => setError(`Failed to ${user.id ? "update" : "add"} user.`));
  };

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h1>User List</h1>
      <button className="btn btn-primary mb-3" onClick={handleAddUser}>
        Add User
      </button>
      {showForm && (
        <UserForm
          user={editUser}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name.split(" ")[0]}</td>
              <td>{user.name.split(" ")[1] || ""}</td>
              <td>{user.email}</td>
              <td>{user.department || "N/A"}</td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn ${currentPage === i + 1 ? "btn-primary" : "btn-secondary"} me-1`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserList;