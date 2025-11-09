// export default LoginPage;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// import './LoginPage.css'; // optional

const LoginPage = ({ onLogin }) => {
  const [phone, setphone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Save token & user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      // localStorage.setItem("adminUser", username);

      if (onLogin) onLogin();

      // Redirect
      navigate("/detailspage");
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">
      <div className="login-card">
        <img
          src="/img/marketinglogo.png"
          alt="Logo"
          className="login-logo"
        />
        <h4 className="login-welcome">Welcome, please sign in</h4>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>
              <span className="text-danger">*</span> Phone
            </label>
            <input
              type="text"
              className="form-control"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label>
              <span className="text-danger">*</span> Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link to="/forgot-password" className="forgot-link">Forgot your password?</Link>
          </div>

          <button type="submit" className="btn button btn-magento w-100 mb-3" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
