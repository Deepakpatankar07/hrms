import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
import CandidatesPage from "./pages/CandidatesPage/CandidatesPage.jsx";
import EmployeesPage from "./pages/EmployeesPage/EmployeesPage.jsx";
import AttendancePage from "./pages/AttendancePage/AttendancePage.jsx";
import LeavesPage from "./pages/LeavesPage/LeavesPage.jsx";
import "./App.css";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// // const App = () => {
// //   return (
// //     <>
// //       <Router>
// //         <Routes>
// //           <Route path="/login" element={<LoginPage />} />
// //           <Route
// //             path="/*"
// //             element={
// //               <>
// //                 <Sidebar />
// //                 <div className="container">
// //                   <Routes>
// //                     <Route path="/" element={<DashboardPage />} />
// //                     <Route path="/dashboard" element={<DashboardPage />} />
// //                     <Route path="/candidates" element={<CandidatesPage />} />
// //                     <Route path="/employees" element={<EmployeesPage />} />
// //                     <Route path="/attendance" element={<AttendancePage />} />
// //                     <Route path="/leaves" element={<LeavesPage />} />
// //                   </Routes>
// //                 </div>
// //               </>
// //             }
// //           />
// //         </Routes>
// //       </Router>
// //     </>
// //   );
// // };

// // const App = () => {
// //   return (
// <Router>
//   <Routes>
//     <Route path="/login" element={<LoginPage />} />
//     <Route path="/register" element={<RegisterPage />} />
//     <Route
//       element={
//         <div className="app-layout">
//           <Sidebar />
//           <div className="container">
//             <Outlet />
//           </div>
//         </div>
//       }
//     >
//       <Route path="/" element={<DashboardPage />} />
//       <Route path="/dashboard" element={<DashboardPage />} />
//       <Route path="/candidates" element={<CandidatesPage />} />
//       <Route path="/employees" element={<EmployeesPage />} />
//       <Route path="/attendance" element={<AttendancePage />} />
//       <Route path="/leaves" element={<LeavesPage />} />
//     </Route>
//   </Routes>
// </Router>;
// //   );
// // };

// // export default App;

function App() {
  return (
      <Router>
    <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <div className="app-layout">
                <Sidebar />
                <div className="container">
                  <Outlet />
                </div>
              </div>
            }
          >
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidates"
              element={
                <ProtectedRoute>
                  <CandidatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <EmployeesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <AttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves"
              element={
                <ProtectedRoute>
                  <LeavesPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
    </AuthProvider>
      </Router>
  );
}

export default App;
