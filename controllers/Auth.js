import UserModel from "../models/User.js";
import QuoteModel from "../models/Quote.js";
import { ObjectId } from "mongodb";
import { successUrlEncode, failUrlEncode } from "../utils.js";

async function getHome(req, res) {
  const publicQuotes = await QuoteModel.find({visibility: 'public'}).populate('postedBy', 'username').exec();
  res.render("home", {
    serverMessage: req.query || {},
    pageTitle: "Home",
    isAuth: req.session.isAuth,
    quotes: publicQuotes
  });
}

async function getLogin(req, res) {
  res.render("login", {
    serverMessage: req.query,
    pageTitle: "Login",
    isAuth: req.session.isAuth,
  });
}

async function login(req, res) {
  try {
    // collect data from body
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username: username });

    if (!user) {
      throw new Error("No user found with that username");
    }

    await user.comparePassword(password, user.password);

    req.session.isAuth = true;
    req.session.userId = user._id;
  } catch (err) {
    console.error(err.message);
    const q = failUrlEncode(err.message);
    return res.redirect(`/login?${q}`);
  } finally {
    const q = successUrlEncode("Successfully logged in");
    return res.redirect(`/quotes?${q}`);
  }
}

async function getRegister(req, res) {
  res.render("register", {
    serverMessage: {},
    pageTitle: "Register",
    isAuth: req.session.isAuth,
  });
}

async function register(req, res) {
  try {
    // collect data from body
    const { username, email, password, password2 } = req.body;

    if (password !== password2) {
      throw new Error("Password fields does not match");
    }

    // create User document instance locally
    const userDoc = new UserModel({ username, email, password });

    // validation
    await userDoc.validate();

    // save to database
    userDoc.save();
  } catch (err) {
    // create message that operation was unsuccessfull
    console.error(err.message);
    const q = failUrlEncode(err.message);
    return res.redirect(`/register?${q}`);
  } finally {
    // create message that operation was successfull
    const q = successUrlEncode("Successfully registered user");
    res.redirect(`/login?${q}`);
  }
}

async function logout(req, res) {
  try {
    req.session.destroy();
  } catch (err) {
    const q = successUrlEncode("Failed logged out");
    res.redirect(`/quotes?${q}`);
  } finally {
    const q = successUrlEncode("Successfully logged out");
    res.redirect(`/?${q}`);
  }
}

export default {
  getHome,
  getLogin,
  login,
  getRegister,
  register,
  logout,
};
