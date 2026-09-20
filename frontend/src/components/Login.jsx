import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";


import API from "../services/api"

function Login() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post("/auth/login",{
                email, 
                password
            });

            // Avoid storing JWTs in localStorage if possible, 
            // because an XSS attack can read them.
            localStorage.setItem(
                "token",
                 response.data.token
            );

            login(response.data.token);

            setMessage(response.data.message);

            console.log(response);               // remove before production

            navigate("/profile");

        } catch (error) {       
            setMessage(error.response?.data?.message || "Login failed");
        }
    };


    return (
        <div className="flex justify-center items-center h-screen p-4">
            <form 
                // onSubmit={handleLogin}    '
                // In HTML forms, clicking a button inside a <form> automatically triggers the form's onSubmit. 
                // Having onClick on <button/> as well causes handleLogin to execute twice per click
                className="border p-8 rounded w-80 h-100" 
            >
                <h1 className="text-2xl mb-5">
                    Login
                </h1>
                <input
                    type="text"
                    className="border p-2 w-full mb-3 rounded" 
                    defaultValue="admin@gmail.com_"
                    placeholder="example@gmail.com" 
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password"
                    className="border p-2 w-full mb-3 rounded"
                    defaultValue="123456_"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    className="bg-blue-500 text-white px-4 py-2 w-full rounded" 
                    onClick={handleLogin}
                >
                Login 
                </button>
                <div className="mt-2">
                    <b>Backend response : </b>
                    <br /> 
                    <i>
                        {message && (
                            <div className="mt-4">
                                {message}
                            </div>
                        )}
                    </i> 
                </div>

            </form>
        </div>
    );
}

export default Login;