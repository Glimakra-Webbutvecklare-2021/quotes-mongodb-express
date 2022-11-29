import UserModel from "../models/User.js";

async function getLogin(req, res) {
    res.render("login", {serverMessage: req.query});
}

async function login(req, res) {
    try {
        // collect data from body
        const {username, password} = req.body;

        // find user
        const user = await UserModel.findOne({username});

        if (!user) {
            throw new Error("No user found with that username");
        }

        // compare password with user input
        const isAuth = await user.comparePassword(password, user.password);


        if (!isAuth) {
            throw new Error("Not authenticated");
        }

        // when successfull login set custom variables on to the session object
        // this is used to check if authenticated and when we want to search
        // for user specific information
        req.session.isAuth = true;
        req.session.userId = user._id;

    } catch (err) {
        console.error(err);
        const q = (new URLSearchParams({type: "fail", message: "failed to login"})).toString();
        return res.redirect(`/login${q}`)
    } finally {
        const q = (new URLSearchParams({type: "success", message: "successfully logged in"})).toString();
        return res.redirect(`/quotes?${q}`);
    }
}


export default {
    getLogin,
    login
}