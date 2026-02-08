import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", type: "EXPENSE" });

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (e) => {
    e.preventDefault();
    await api.post("/categories", form);
    setForm({ name: "", type: "EXPENSE" });
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="card">
      <h2>Categories</h2>

      <form onSubmit={createCategory}>
        <input
          placeholder="Category Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />
        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <ul>
        {categories.map((c) => (
          <li key={c.id}>
            {c.name} ({c.type})
            <button onClick={() => deleteCategory(c.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
