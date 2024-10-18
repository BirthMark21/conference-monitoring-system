import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "./MyContext";
import { FaEllipsisH } from "react-icons/fa";
import { Link } from "react-router-dom";

function Users() {
  const [eventUsers, setEventUsers] = useState(null);
  const { eventUsers: contextEventUsers, toggleUserIsStaffById } = useContext(EventContext);

  // Fetch initial user data
  useEffect(() => {
    setEventUsers(contextEventUsers);
  }, [contextEventUsers]);

  const handleAddAdmin = async (userId) => {
    try {
      await toggleUserIsStaffById(
        userId,
        () => {
          console.log("User is_staff toggled successfully");
          // Update user status locally after successful toggle
          setEventUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId ? { ...user, is_staff: !user.is_staff } : user
            )
          );
        },
        () => {
          console.error("Failed to toggle user is_staff status");
        }
      );
    } catch (error) {
      console.error("Error toggling user is_staff status:", error);
    }
  };

  return (
    <div>
      <table className="table caption-top rounded mt-2 bg-white">
        <caption className="text-white fs-4">Site Users</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {eventUsers !== null ? (
            eventUsers.map((user) => (
              <tr key={user.id}>
                <th scope="row">{user.id}</th>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td> {/* Display user role */}
                <td>
                  <div className="dropup">
                    <a
                      className=""
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FaEllipsisH />
                    </a>

                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item pointer"
                          onClick={() => handleAddAdmin(user.id)}
                        >
                          {user.is_staff === true ? "Remove Admin" : "Add Admin"}
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                User not found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* <Link to="/users/add" className="btn btn-success fw-bold">
        <i className="bi bi-plus-circle"></i> Add User
      </Link> */}
    </div>
  );
}

export default Users;
