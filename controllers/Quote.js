import dbConnect from "../mongoDbClient.js";
import { ObjectId } from "mongodb";

const client = await dbConnect();
const db = client.db("quotes-cluster");
const quotesCollection = db.collection("quotes");

async function getAllQuotes(req, res) {
  // DONE: Get quotes from MongoDB Atlas.
  const quotes = await quotesCollection.find().toArray();
  const locals = { quotes };
  res.render("index", locals);
}

async function updateQuote(req, res) {
  // DONE: get the id of the request
  const id = req.params.id;

  const name = req.body.name;
  const quote = req.body.quote;

  // TODO: validate user input

  // DONE: find old quote and replace doc from collection
  const result = await quotesCollection.replaceOne(
    { _id: ObjectId(id) },
    { name, quote }
  );

  res.redirect("/");
}

async function addQuote(req, res) {
  try {
    if (!req.body.quote) {
      throw "Please set a quote before submitting";
    }

    // TODO: set more checks to remove invalid data insertions

    const result = await quotesCollection.insertOne(req.body);
    console.log(result);
  } catch (err) {
    console.error(err);
  } finally {
    res.redirect("/");
  }
}

async function deleteQuote(req, res) {
  const id = req.params.id;
  // const { id } = req.params;

  console.log("request for deletion of id", id);
  const result = await quotesCollection.deleteOne({ _id: ObjectId(id) });

  console.log("result of deletion", result);

  res.redirect("/");
}

export default {
  getAllQuotes,
  updateQuote,
  addQuote,
  deleteQuote,
};
