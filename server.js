import express from "express";
import QuoteRouter from "./routes/Quote.js";

// Express related
const app = express();

// Use ejs as the templeting engine
app.set('view engine', 'ejs')

// Make sure the express server is using correct middleware to process information correctly
// middleware can be seen as pre-work before doing the actuall request/response process
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(QuoteRouter);

app.listen(3000, function () {
  console.log("Listening on 3000");
});