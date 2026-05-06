import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../services/session";

function ProtectedRoute({ children, allowedRoles }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length) {
    const user = getUser();
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
