import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Setup mongodb Client
if (!process.env.MONGO_CONNECTION_STR) {
    console.error("MONGO_CONNECTION_STR is not defined in .env file");
    exit();
}

mongoose.connect(process.env.MONGO_CONNECTION_STR);

const QuoteSchema = {
    name: {type: String, required: "Name cannot be empty"},
    quote: {type: String, required: "Quote cannot be empty"}
}

const QuoteModel = mongoose.model('Quote', QuoteSchema)

export default QuoteModel;