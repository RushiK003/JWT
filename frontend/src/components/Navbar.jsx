import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    } 

    return (
        <nav className="flex item-center justify-between border-b p-4">
            <h1 className="font-bold">
                MERN Auth 
            </h1>
            {
                user  && 
                <div className="flex item-center gap-4">
                    <span>
                        {user.email}
                    </span>
                    <button 
                        onClick={handleLogout}
                        className="rounded bg-red-500 px-3 py-2 text-white"
                    >
                        Logout
                    </button>
                </div>
            }
        </nav>
    )
}

export default Navbar;

