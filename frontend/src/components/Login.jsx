import { useState } from "react";
import API from "../services/api"

function Login() {
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const handleLogin = async () => {
        try {
            const response = await API.post("/login",{
                email,
                password
            });
            setMessage(response.data.message);

        } catch (error) {
            setMessage("Backend not connected");
        }
    };


    return (
        <div className="">
            <div className="">
                <h1 className="">Login</h1>
                <input
                    type="text" 
                    className="" 
                    placeholder="" 
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password"
                    className=""
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    className="" 
                    onClick={handleLogin}
                > 
                    Login 
                </button>

                <p className="">
                    {message}
                </p>

            </div>
        </div>
    );

}

export default Login;