import axios from "axios";


{/* Axios is simply a messenger. Without axios(or fetch), 
    your frontend cannot talk to your backend. */}

const API = axios.create({
    baseURL: "http://localhost:3000/"
});

API.interceptors.request.use(              // Attach Authorization header
    (config) => {
        const token = localStorage.getItem("token");
        
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
);

export default API;
