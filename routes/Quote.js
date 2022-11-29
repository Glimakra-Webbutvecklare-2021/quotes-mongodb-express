import { Router } from "express";
import QuoteController from "../controllers/Quote.js";

const QuoteRouter = Router();

// I need to protect my routes
// these should only be accessable by authenticate users!
// I make a middlare function that checks this!
function ensureAuth(req,res,next) {
    // Check the session object for custom varible
    // we set in AuthController.login
    if (req.session.isAuth) {
        console.log("User is authenticated. Continue to request");
        next();
    } else {
        console.log("User is NOT authenticated. Redirect to login");
        const q = (new URLSearchParams({type: "fail", message: "You must login to access content"})).toString();
        res.redirect(`/login?${q}`)
    }
}

// Make sure the routes below are protected from unauthenticated users
QuoteRouter.use(ensureAuth);

QuoteRouter.get("/quotes", QuoteController.getAllQuotes);
QuoteRouter.put("/quotes/:id", QuoteController.updateQuote);
QuoteRouter.post("/quotes", QuoteController.addQuote);
QuoteRouter.delete("/quotes/:id", QuoteController.deleteQuote);


export default QuoteRouter;