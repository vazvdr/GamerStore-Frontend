import { Navigate } from "react-router-dom";
import { useAuth } from "../data/contexts/AuthContext";

export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <p className="pt-32 text-center">Carregando...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
