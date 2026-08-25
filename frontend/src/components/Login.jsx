import { useState } from "react";
import API from "../services/api"

function Login() {
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginMessage, setloginMessage] = useState("");
    const [Message, setMessage] = useState("");
    // const [token, setToken] = useState("");

    const handleLogin = async () => {
        try {
            const response = await API.post("/auth/login",{
                email,
                password
            });
            setloginMessage(response.data.message);
            console.log(response);               // remove before production

            // setToken(response.data.token)

            const token = response.data.token;

            // Avoid storing JWTs in localStorage if possible, 
            // because an XSS attack can read them.
            localStorage.setItem("token", token);

        } catch (error) {       
            setloginMessage(error.response.data.message);
        }
    };
    const handleProfile = async () => {
        try {
            const profileResponse = await API.get("/profile", {
                headers: {
                    // Authorization: `Bearer ${token}`
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setMessage(profileResponse.data.message);
            console.log(profileResponse.data);      
        } catch (error) {
            console.error("Error fetching profile:", error.response.data.message);
            setMessage(error.response.data.message);    
        }
    }
    
    

    return (
        <div className="flex justify-center items-right h-screen p-4">
            <div className="border p-8 rounded w-80 h-100" >
                <h1 className="text-2xl mb-5">Login</h1>
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
                <p className="mt-2">
                    <b>Backend response : </b>
                    <br /> 
                    <i>{loginMessage}</i> 
                </p>
                <button className="bg-yellow-300 text-black px-4 py-2 my-2 w-full rounded" onClick={handleProfile}>
                    Profile
                </button>
                <p>
                    <i>{Message}</i>
                </p>
            </div>
        </div>
    );

}

export default Login;