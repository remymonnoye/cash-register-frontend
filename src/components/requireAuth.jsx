import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    // Redirige vers /login si pas de token
    return <Navigate to="/login" replace />;
  }
  // Sinon, affiche la page protégée
  return children;
}