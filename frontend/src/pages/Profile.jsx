import { useState, useEffect } from "react";
import axios from "../api/axios";

export default function Profile() {

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Fetch Profile from backend
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/auth/profile");
      setUser(res.data);
      setName(res.data.name);
    } catch (err) {
      console.log(err);
    }
  };

  const updateProfile = async () => {
    try {
      await axios.put("/auth/update-profile", { name });

      setMessage("Profile updated successfully!");
      fetchProfile();   // refresh data

    } catch {
      setMessage("Update failed");
    }
  };

  if (!user) return <div className="card">Loading...</div>;

  return (
    <div className="card profile-card">

      <h2>👤 Manage Profile</h2>

      <div className="profile-field">
        <label>User ID</label>
        <input value={user.id} disabled />
      </div>

      <div className="profile-field">
        <label>Name</label>
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="profile-field">
        <label>Email</label>
        <input value={user.email} disabled />
      </div>

      <div className="profile-field">
        <label>Account Created</label>
        <input 
          value={new Date(user.created_at).toLocaleDateString()}
          disabled
        />
      </div>

      <button onClick={updateProfile}>
        Update Profile
      </button>

      {message && <p className="success-msg">{message}</p>}
    </div>
  );
}
