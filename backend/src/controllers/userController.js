const getProfile = (req, res) => {
    console.log("/profile accessed")
    return res.json({
        message: "Profile accessed successfully",
        user: req.user
    });

};

export default {
    getProfile
};  