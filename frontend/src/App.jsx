import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { useEffect } from "react";

import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

import PublicContact from "./pages/PublicContact";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

import useAuthStore from "./store/authStore";
import Profile from "./pages/Profile";

import LeadDetails from "./pages/LeadDetails";

import Register from "./pages/Register";

import PublicHomeRoute from "./components/auth/PublicHomeRoute";


function App() {

  const loadUser = useAuthStore(
    (state) => state.loadUser
  );

  useEffect(() => {
    loadUser();
  }, [loadUser]);


  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <PublicHomeRoute>
              <Home />
            </PublicHomeRoute>
          }
        />

        <Route
          path="/contact"
          element={<PublicContact />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<Admin />}
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="leads"
            element={<Leads />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />
          <Route
            path="profile"
            element={<Profile />}
          />
          <Route
            path="leads/:id"
            element={<LeadDetails />}
          />

        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;