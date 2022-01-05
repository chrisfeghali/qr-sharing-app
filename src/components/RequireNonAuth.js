import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireNonAuth({ children }) {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/home" />;
}
