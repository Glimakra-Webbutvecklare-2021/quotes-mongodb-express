import { Router } from "express";
import QuoteController from "../controllers/Quote.js";

const QuoteRouter = Router();

QuoteRouter.get("/", QuoteController.getAllQuotes);
QuoteRouter.put("/quotes/:id", QuoteController.updateQuote);
QuoteRouter.post("/quotes", QuoteController.addQuote);
QuoteRouter.delete("/quotes/:id", QuoteController.deleteQuote);

export default QuoteRouter;