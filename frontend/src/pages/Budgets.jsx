// import { useEffect, useState } from "react";
// import api from "../api/axios";

// export default function Budgets() {
//     const [categories, setCategories] = useState([]);
//     const [form, setForm] = useState({
//         category_id: "",
//         limit_amount: "",
//         month: "",
//         year: "",
//     });

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const fetchCategories = async () => {
//         const res = await api.get("/categories");
//         setCategories(res.data);
//     };

//     const submit = async (e) => {
//         e.preventDefault();
//         await api.post("/budgets", form);
//         alert("Budget Set Successfully");
//         setForm({
//             category_id: "",
//             limit_amount: "",
//             month: "",
//             year: "",
//         });
//     };

//     return (
//         <div className="card">
//             <h2>Set Budget</h2>

//             <form onSubmit={submit}>

//                 {/* Category Dropdown */}
//                 <select
//                     required
//                     value={form.category_id}
//                     onChange={(e) =>
//                         setForm({ ...form, category_id: e.target.value })
//                     }
//                 >
//                     <option value="">Select Category</option>

//                     {categories.map((c) => (
//                         <option key={c.id} value={c.id}>
//                             {c.name} ({c.type})
//                         </option>
//                     ))}
//                 </select>



//                 <input
//                     type="number"
//                     placeholder="Budget Limit"
//                     required
//                     value={form.limit_amount}
//                     onChange={(e) =>
//                         setForm({ ...form, limit_amount: e.target.value })
//                     }
//                 />

//                 <input
//                     type="number"
//                     placeholder="Month (1-12)"
//                     required
//                     value={form.month}
//                     onChange={(e) =>
//                         setForm({ ...form, month: e.target.value })
//                     }
//                 />

//                 <input
//                     type="number"
//                     placeholder="Year"
//                     required
//                     value={form.year}
//                     onChange={(e) =>
//                         setForm({ ...form, year: e.target.value })
//                     }
//                 />

//                 <button type="submit">Set Budget</button>
//             </form>
//         </div>
//     );
// }
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Budgets() {
    const [categories, setCategories] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [form, setForm] = useState({
        category_id: "",
        limit_amount: "",
        month: "",
        year: "",
    });

    useEffect(() => {
        fetchCategories();
        fetchBudgets();
    }, []);

    const fetchCategories = async () => {
        const res = await api.get("/categories");
        setCategories(res.data);
    };

    const fetchBudgets = async () => {
        const res = await api.get("/budgets");
        setBudgets(res.data);
    };

    const submit = async (e) => {
        e.preventDefault();
        await api.post("/budgets", form);
        alert("Budget Set Successfully");
        setForm({
            category_id: "",
            limit_amount: "",
            month: "",
            year: "",
        });
        fetchBudgets(); // 🔥 refresh list
    };

    return (
        <div className="card">
            <h2>Set Budget</h2>

            {/* Create Budget Form */}
            <form onSubmit={submit}>
                <select
                    required
                    value={form.category_id}
                    onChange={(e) =>
                        setForm({ ...form, category_id: e.target.value })
                    }
                >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name} ({c.type})
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Budget Limit"
                    required
                    value={form.limit_amount}
                    onChange={(e) =>
                        setForm({ ...form, limit_amount: e.target.value })
                    }
                />

                <input
                    type="number"
                    placeholder="Month (1-12)"
                    required
                    value={form.month}
                    onChange={(e) =>
                        setForm({ ...form, month: e.target.value })
                    }
                />

                <input
                    type="number"
                    placeholder="Year"
                    required
                    value={form.year}
                    onChange={(e) =>
                        setForm({ ...form, year: e.target.value })
                    }
                />

                <button type="submit">Set Budget</button>
            </form>

            <hr />

            {/* Show Existing Budgets */}
            <h3>Existing Budgets</h3>

            {budgets.length === 0 ? (
                <p>No budgets set yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Limit</th>
                            <th>Spent</th>
                            <th>Status</th>
                            <th>Month</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgets.map((b) => {
                            const over =
                                parseFloat(b.total_spent) >
                                parseFloat(b.limit_amount);

                            return (
                                <tr key={b.id}>
                                    <td>{b.category_name}</td>

                                    <td>{b.limit_amount}</td>

                                    <td>{b.total_spent}</td>

                                    <td>
                                        {over ? (
                                            <span
                                                style={{
                                                    color: "red",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                🔴 Over Budget
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    color: "green",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                🟢 Safe
                                            </span>
                                        )}
                                    </td>

                                    <td>{b.month}</td>
                                    <td>{b.year}</td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            )}
        </div>
    );
}
