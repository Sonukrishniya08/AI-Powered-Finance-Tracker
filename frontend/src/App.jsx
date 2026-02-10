import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import OAuthSuccess from "./pages/OAuthSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔥 IMPORTANT: OAuth should be PUBLIC */}
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Protected Layout */}
        <Route element={<PrivateRoute><Navbar /></PrivateRoute>}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;







// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Categories from "./pages/Categories";
// import Transactions from "./pages/Transactions";
// import Budgets from "./pages/Budgets";
// import Reports from "./pages/Reports";
// import Profile from "./pages/Profile";
// import Navbar from "./components/Navbar";
// import PrivateRoute from "./components/PrivateRoute";
// import OAuthSuccess from "./pages/OAuthSuccess";

// function App() {
//   return (
//     <BrowserRouter>

//       <Routes>

//         {/* Public Routes */}
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/oauth-success" element={<OAuthSuccess />} />

//         {/* Protected Routes */}
//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute>
//               <>
//                 <Navbar />
//                 <Dashboard />
//               </>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/categories"
//           element={
//             <PrivateRoute>
//               <>
//                 <Navbar />
//                 <Categories />
//               </>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/transactions"
//           element={
//             <PrivateRoute>
//               <>
//                 <Navbar />
//                 <Transactions />
//               </>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/budgets"
//           element={
//             <PrivateRoute>
//               <>
//                 <Navbar />
//                 <Budgets />
//               </>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/reports"
//           element={
//             <PrivateRoute>
//               <>
//                 <Navbar />
//                 <Reports />
//               </>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/profile"
//           element={
//             <PrivateRoute>
//               <>
//                 <Navbar />
//                 <Profile />
//               </>
//             </PrivateRoute>
//           }
//         />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;






// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Categories from "./pages/Categories";
// import Transactions from "./pages/Transactions";
// import Budgets from "./pages/Budgets";
// import Reports from "./pages/Reports";
// import Profile from "./pages/Profile";
// import Navbar from "./components/Navbar";
// import PrivateRoute from "./components/PrivateRoute";
// import OAuthSuccess from "./pages/OAuthSuccess";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Public Routes */}
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Protected Dashboard Layout */}
//         <Route element={<PrivateRoute><Navbar /></PrivateRoute>}>

//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/categories" element={<Categories />} />
//           <Route path="/transactions" element={<Transactions />} />
//           <Route path="/budgets" element={<Budgets />} />
//           <Route path="/reports" element={<Reports />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/oauth-success" element={<OAuthSuccess />} />


//         </Route>

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
