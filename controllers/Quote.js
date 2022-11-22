import dbConnect from "../mongoDbClient.js";
import { ObjectId } from "mongodb";

import QuoteModel from "../models/Quote.js";

// const client = await dbConnect();
// const db = client.db("quotes-cluster");
// const quotesCollection = db.collection("quotes");

async function getAllQuotes(req, res) {
  // DONE: Get quotes from MongoDB Atlas.
  const quotes = await QuoteModel.find();
  const locals = { quotes };
  res.render("index", locals);
}

async function updateQuote(req, res) {
  try {
  const id = req.params.id;

  const name = req.body.name;
  const quote = req.body.quote;
  const validationObj = await QuoteModel.validate({name, quote});
  if (validationObj) {
    throw validationObj;
  }

  await QuoteModel.updateOne(
    { _id: ObjectId(id) },
    { name, quote }
  );
  } catch (err) {
    console.log(err.message);
  } finally {
    res.redirect("/");
  }

}

async function addQuote(req, res) {
  try {
    const {name, quote} = req.body;
    const quoteDoc = new QuoteModel({name, quote});

    const validationObj = await quoteDoc.validate();
    if (validationObj) {
      throw validationObj;
    }

    quoteDoc.save();
  } catch (err) {
    console.error(err.message);
  } finally {
    res.redirect("/");
  }
}

async function deleteQuote(req, res) {
  const id = req.params.id;

  const result = await QuoteModel.deleteOne({ _id: ObjectId(id) });
  console.log(result);
  res.redirect("/");
}

export default {
  getAllQuotes,
  updateQuote,
  addQuote,
  deleteQuote,
};
