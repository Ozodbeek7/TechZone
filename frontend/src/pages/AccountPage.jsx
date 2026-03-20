import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaEnvelope, FaSpinner } from "react-icons/fa";

import {
  selectIsAuthenticated,
  selectUser,
  fetchProfile,
  selectProfileLoading,
} from "../store/slices/authSlice";

export default function AccountPage() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const profileLoading = useSelector(selectProfileLoading);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <main className="account-page">
        <div className="account-page__card">
          <h1>Account</h1>
          <p>Sign in to view your profile and orders.</p>
          <Link to="/login" className="account-page__cta">
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  if (profileLoading && !user) {
    return (
      <main className="account-page account-page--center">
        <FaSpinner className="spinner" /> Loading profile…
      </main>
    );
  }

  return (
    <main className="account-page">
      <div className="account-page__card">
        <h1>
          <FaUser /> Your account
        </h1>
        <dl className="account-page__dl">
          <dt>Name</dt>
          <dd>
            {user?.first_name} {user?.last_name}
          </dd>
          <dt>
            <FaEnvelope /> Email
          </dt>
          <dd>{user?.email}</dd>
          <dt>Username</dt>
          <dd>{user?.username}</dd>
          <dt>Role</dt>
          <dd>{user?.role}</dd>
        </dl>
        <div className="account-page__actions">
          <Link to="/products">Continue shopping</Link>
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        </div>
      </div>
    </main>
  );
}
