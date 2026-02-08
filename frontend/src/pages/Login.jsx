import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const backendBase = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
    : "";

  return (
    <div className="card">
      <h2>Login</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} autoComplete="on">
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>

      {backendBase && (
        <a href={`${backendBase}/api/auth/google`}>
          <button className="google">
            Login with Google
          </button>
        </a>
      )}
    </div>
  );
}


