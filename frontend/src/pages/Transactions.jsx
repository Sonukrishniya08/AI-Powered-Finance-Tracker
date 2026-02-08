import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchData = async () => {
    const t = await api.get("/transactions");
    const c = await api.get("/categories");
    setTransactions(t.data);
    setCategories(c.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CREATE
  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    if (file) fd.append("receipt", file);

    await api.post("/transactions", fd);
    setForm({});
    setFile(null);
    fetchData();
  };

  // DELETE
  const deleteTransaction = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    await api.delete(`/transactions/${id}`);
    fetchData();
  };

  // START EDIT
  const startEdit = (t) => {
    setEditingId(t.id);
    setEditData({
      amount: t.amount,
      description: t.description || "",
    });
  };

  // UPDATE
  const updateTransaction = async (id) => {
    await api.put(`/transactions/${id}`, editData);
    setEditingId(null);
    fetchData();
  };

  return (
    <div className="card">
      <h2>Transactions</h2>

      {/* CREATE FORM */}
      <form onSubmit={submit}>
        <select
          required
          onChange={(e) =>
            setForm({ ...form, category_id: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          required
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <select
          onChange={(e) =>
            setForm({ ...form, currency: e.target.value })
          }
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        <input
          type="date"
          required
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <input
          placeholder="Description"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">Add Transaction</button>
      </form>

      <hr />

      {/* TRANSACTION TABLE */}
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Date</th>
            <th>Description</th>
            <th>Receipt</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.category_name}</td>

              <td>
                {editingId === t.id ? (
                  <input
                    value={editData.amount}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        amount: e.target.value,
                      })
                    }
                  />
                ) : (
                  t.amount
                )}
              </td>

              <td>{t.currency}</td>
              <td>{t.date}</td>

              <td>
                {editingId === t.id ? (
                  <input
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        description: e.target.value,
                      })
                    }
                  />
                ) : (
                  t.description
                )}
              </td>

              <td>
                {t.receipt_url && (
                  <a
                    href={`${import.meta.env.VITE_API_BASE_URL.replace(
                      "/api",
                      ""
                    )}/${t.receipt_url}`}
                    target="_blank"
                  >
                    View
                  </a>
                )}
              </td>

              <td>
                {editingId === t.id ? (
                  <>
                    <button
                      onClick={() => updateTransaction(t.id)}
                    >
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(t)}>
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        deleteTransaction(t.id)
                      }
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

