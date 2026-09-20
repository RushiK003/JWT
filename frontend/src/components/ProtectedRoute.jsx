import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ children }) => {


    const { isAuthenticated , loading } = useAuth();

    if(loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Checking authentication...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    // const token = localStorage.getItem("token");
    // if(!token){
    //     return <Navigate to="/login" replace />
    // }

    return children;
}

export default ProtectedRoute;