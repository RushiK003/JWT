const login = ( email, password ) => {
    if (
        email === "admin@gmail.com" && 
        password === "123456"
    ) {
        return {
            success : true,
            message : "Login successful"
        };
    }

    return {
        success : false,
        message : "Invalid Credentials"
    };
};

// export default login;         // exported itself as login function not object

export default { login };  //EcmaScript 
// exporting login function as sub-function of object
// to use we write Object.login()
