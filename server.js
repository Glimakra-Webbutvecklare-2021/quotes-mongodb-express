import express from "express";
import session from "express-session";
import AuthRouter from "./routes/Auth.js";
import QuoteRouter from "./routes/Quote.js";

// Express related
const app = express();

// Use ejs as the templeting engine
app.set('view engine', 'ejs')


// Sessions - Give server memory regarding users
app.use(
  session({
      secret: "Hommus is the best",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 360000 },
  })
);

// Make sure the express server is using correct middleware to process information correctly
// middleware can be seen as pre-work before doing the actuall request/response process
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function sessionCheck(req,res,next) {
     // oneliner if condition - ternary operator  ? :  ;
    //  req.session.views ? req.session.views++ : req.session.views = 1;
    
     // show number of times users navigates before session been destroyed
    //  console.log("req.session.views", req.session.views);
 
     // authenticated user...should be a property "username" i req.session
    //  console.log(req.session.isAuth, req.session.userId);
     
     next();
}

// app.use(sessionCheck);

app.use(QuoteRouter);
app.use(AuthRouter);

app.listen(3000, function () {
  console.log("Listening on 3000");
});