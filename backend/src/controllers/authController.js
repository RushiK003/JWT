// const authService = require("../services/authService");
import authService from "../services/authService.js"
const login = (req, res) => {
    const { email, password } = req.body;
    const result = authService.login(email,password);
    // Which approach should you use?
    // For your current structure,the object approach if you expect to add more authentication functions later:
    //     authService
    //     ├── login()
    //     ├── register()
    //     ├── logout()
    //     └── resetPassword()
    // Then authService.login(), authService.register(), etc. make sense.

    // const result = authService(email,password); // used when login exported itself as function

    if(!result.success) {
        return res.status(401).json({
            message : result.message
        });
    }

    return res.json({
        message: result.message
    });
};

// module.export = {
//     login
// };

export default login;

    // SERVICE
    // authService.js
    //         └── exports OBJECT
    //             {
    //                 login,
    //                 register,
    //                 logout
    //             }
    // CONTROLLER
    // authController.js
    //         └── exports FUNCTION
    //              login(req, res)