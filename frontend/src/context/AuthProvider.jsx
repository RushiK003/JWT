import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import API from "../services/api";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        const restoreAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await API.get("/profile");
                setUser(response.data.user);
            } catch {
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreAuth();
    }, []);

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider 
            value={{
                user,
                login,
                logout,
                isAuthenticated,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
