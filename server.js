import express from "express";
import AuthRouter from "./routes/Auth.js";
import QuoteRouter from "./routes/Quote.js";
import session from "express-session";

// Express related
const app = express();

// active sessions
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 * 5 } // could be 5 minutes
}))

// Use ejs as the templeting engine
app.set('view engine', 'ejs')

// Middleware

function checkSession(req, res, next) {
  console.log("session", req.session);

  next();
}

// tell app to use middleware function everywhere
app.use(checkSession);

// Make sure the express server is using correct middleware to process information correctly
// middleware can be seen as pre-work before doing the actuall request/response process
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(AuthRouter);
app.use(QuoteRouter);

app.listen(3000, function () {
  console.log("Listening on 3000");
});