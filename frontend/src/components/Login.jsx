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
            setMessage(error.response.data.message);
        }
    };
    const connect = async () => {
        const response = await API.get('/checkapi')
        console.log(response);
    };

    return (
        <div className="flex justify-center items-right h-screen p-4">
            <div className="border p-8 rounded w-80 h-90" >
                <h1 className="text-2xl mb-5">Login</h1>
                <input
                    onClick={connect}
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
                <p className="mt-2">
                    Backend response : 
                    <br /> 
                    {message}
                </p>

            </div>
        </div>
    );

}

export default Login;