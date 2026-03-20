import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaShieldAlt } from "react-icons/fa";

import { selectIsAuthenticated, selectUser } from "../store/slices/authSlice";

export default function AdminPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <main className="admin-page">
        <div className="admin-page__card">
          <h1>Admin</h1>
          <p>Administrator access required.</p>
          <Link to="/login">Sign in as admin</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-page__card">
        <h1>
          <FaShieldAlt /> Admin dashboard
        </h1>
        <p>
          Use the REST API (<code>/api/admin/*</code>) or connect a dedicated admin UI later.
          Demo admin: <strong>admin@techzone.com</strong> / <strong>Admin123!</strong>
        </p>
        <ul className="admin-page__list">
          <li>
            <Link to="/products">Manage catalog (via API)</Link>
          </li>
          <li>
            <Link to="/">Back to store</Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
