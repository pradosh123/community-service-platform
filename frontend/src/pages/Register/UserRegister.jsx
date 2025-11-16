import React, { useState } from "react";
import "./UserRegister.css";

export default function UserRegister() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    skills: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register Data:", form);

    // TODO: call API
    // await axios.post("/api/register", form);
  };

  return (
      <div className="register-wrapper">
          <div className="register-card">
              <div className="register-logo-tiny">
                  <svg viewBox="0 0 100 100" className="window-icon-tiny">
                      <rect x="25" y="25" width="50" height="50" rx="8" fill="#fbbf24" stroke="#78350f" strokeWidth="5" />
                      <line x1="50" y1="25" x2="50" y2="75" stroke="#78350f" strokeWidth="5" />
                      <line x1="25" y1="50" x2="75" y2="50" stroke="#78350f" strokeWidth="5" />
                  </svg>
              </div>
        <h2 className="register-title">Create Your JanaLa Account</h2>
        <p className="register-subtitle">
          Join Kerala’s trusted people marketplace
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="Kasaragod / Kochi / Trivandrum..."
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Skills / Profession</label>
            <input
              type="text"
              name="skills"
              placeholder="Plumber, Electrician, Cook..."
              value={form.skills}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="register-btn" type="submit">
            Register
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  );
}
