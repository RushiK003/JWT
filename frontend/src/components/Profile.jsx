import { useEffect, useState } from "react";
import API from "../services/api";

const Profile = () => {

    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {

        const getProfile = async () => {

            try {

                const response = await API.get("/profile");

                setUser(response.data.user);

            } catch (error) {

                setMessage(

                    error.response?.data?.message ||
                    "Failed to load profile"

                );

            }

        };

        getProfile();

    }, []);

    return (
        <div className="p-8">

            <h1 className="text-2xl font-bold mb-4">
                Profile
            </h1>

            {message && (
                <p>{message}</p>
            )}

            {user && (
                <div>
                    <p>
                        User ID: {user.userId}
                    </p>

                    <p>
                        Email: {user.email}
                    </p>
                </div>
            )}

        </div>
    );
};

export default Profile;