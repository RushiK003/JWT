import axios from "axios";
{/* Axios is simply a messenger. Without axios(or fetch), 
    your frontend cannot talk to your backend. */}

const API = axios.create({
    baseURL: "http://localhost:3000/"
});

export default API;
