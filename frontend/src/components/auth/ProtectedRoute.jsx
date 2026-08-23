import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import PageSkeleton from "../common/PageSkeleton";

function ProtectedRoute({ children }) {
  const {
    token,
    initialized,
  } = useAuthStore();

  // Wait for /api/auth/me
  if (!initialized) {
    return <PageSkeleton />;
  }

  if (!token) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;