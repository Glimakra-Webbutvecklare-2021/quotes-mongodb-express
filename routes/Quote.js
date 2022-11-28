import { Router } from "express";
import QuoteController from "../controllers/Quote.js";
import {ensureAuth} from "../middleware/Auth.js";

const QuoteRouter = Router();

QuoteRouter.get("/quotes", ensureAuth, QuoteController.getAllQuotes);
QuoteRouter.put("/quotes/:id", ensureAuth, QuoteController.updateQuote);
QuoteRouter.post("/quotes", ensureAuth, QuoteController.addQuote);
QuoteRouter.delete("/quotes/:id", ensureAuth, QuoteController.deleteQuote);


export default QuoteRouter;