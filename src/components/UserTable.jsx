import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import Spinner from "./Spinner";
const userData = [
  {
    username: "anil",
    phone: "00000000",
    email: "anil@gmail.com",
  },
  {
    username: "anil",
    phone: "00000000",
    email: "anil@gmail.com",
  },
  {
    username: "anil",
    phone: "00000000",
    email: "anil@gmail.com",
  },
  {
    username: "anil",
    phone: "00000000",
    email: "xyz@gmail.com",
  },
];

const UserTable = () => {
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(userData);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;
  const totalUsers = 10;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const handelEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };
  const handleAddNew = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://jsonplaceholder.typicode.com/users?_page=${currentPage}&_limit=${usersPerPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setUsers(data);
      });
  }, [currentPage]);

  const filteredMessages = users.filter((message) => {
    const matchesSearch =
      message.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  return (
    <div className="user">
      <div className="create">
        <input
          type="text"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          placeholder="Search username, email"
        />
        <button className="btn" onClick={handleAddNew}>
          Create
        </button>
      </div>
      <div className="userlist">
        {!loading ? (
          <table>
            <tr>
              <th>UserName</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
            {filteredMessages.map((e) => {
              return (
                <tr key={e.id}>
                  <td>{e.username}</td>
                  <td>{e.email}</td>
                  <td>+91 {e.phone}</td>
                  <td>
                    <button onClick={() => handelEdit(e)}>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>
              );
            })}
          </table>
        ) : (
          <Spinner />
        )}
        <UserModel
          user={editingUser}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={(Data) => {
            if (editingUser) {
              setUsers(
                users.map((u) =>
                  u.id === editingUser.id
                    ? {
                        ...Data,
                        id: editingUser.id,
                        username: Data.username,
                        phone: Data.phone,
                        email: Data.email,
                      }
                    : u
                )
              );
              toast.success(`${editingUser.username} User Edited!`);
            } else {
              const newUser = {
                ...Data,
                id: Date.now(),
                username: Data.username,
                phone: Data.phone,
                email: Data.email,
              };
              setUsers([...users, newUser]);
              toast.success("New User Added!");
            }
            setShowModal(false);
          }}
        />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserTable;

const UserModel = ({ isOpen = false, onClose, user, onSave }) => {
  const [userdata, setUserData] = useState({
    username: "",
    phone: "",
    email: "",
  });
  const handleChange = (e) => {
    setUserData({ ...userdata, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(userdata);
  };
  useEffect(() => {
    if (user) {
      setUserData(user);
    }
    if (!user) {
      setUserData({
        username: "",
        phone: "",
        email: "",
      });
    }
  }, [user, isOpen, onClose]);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={user ? "Edit User" : "Add New User"}
        size="medium"
      >
        <form className="user-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">User Information</h3>

            <div className="form-group">
              <label className="form-label">User Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Username...."
                name="username"
                onChange={handleChange}
                value={userdata?.username}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                placeholder="example@gmail.com"
                name="email"
                onChange={handleChange}
                value={userdata?.email}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="text"
                className="form-input"
                placeholder="0000000000 10 digit"
                name="phone"
                onChange={handleChange}
                value={userdata?.phone}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              {user ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
