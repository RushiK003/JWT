import jwt from "jsonwebtoken";

const generateToken = (user) => {

    // jwt.sign(
    //     payload,       // This is information we want to put inside the token.
    //     secret,        // The backend uses this secret to create the signature.  
    //     options        // Expiration - This means the token is valid for given time .
    // );

    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );
    return token;
};

export default generateToken;