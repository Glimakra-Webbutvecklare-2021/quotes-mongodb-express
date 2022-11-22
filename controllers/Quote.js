import QuoteModel from "../models/Quote.js";
// import qs from "querystring";
import { ObjectId } from "mongodb";

// const client = await dbConnect();
// const db = client.db("quotes-cluster");
// const quotesCollection = db.collection("quotes");

async function getAllQuotes(req, res) {
  // DONE: Get quotes from MongoDB Atlas.
  // const quotes = await quotesCollection.find().toArray();
  const quotes = await QuoteModel.find();

  // console.log(req.query);

  const locals = { quotes, serverMessage: req.query };
  res.render("index", locals);
}

async function updateQuote(req, res) {
  try {
    // get the id of the request
    const id = req.params.id;

    const { name, quote}  = req.body;
    
    // validate user input
    const quoteDoc = new QuoteModel({ name, quote});
    await quoteDoc.validate()

    // find old quote and replace doc from collection
    await QuoteModel.updateOne(
      { _id: ObjectId(id) },
      { name, quote }
    );

  } catch(err) {
    console.error(err.message);
  } finally {
    res.redirect("/");
  }
}

async function addQuote(req, res) {
  let query = null;

  try {
    // collect data from body
    const {name, quote} = req.body;

    // create Quote document instance locally
    const quoteDoc = new QuoteModel({name , quote})
    
    // validation
    await quoteDoc.validate();

    // save to database
    quoteDoc.save();

    // create message that operation was successfull
    query = new URLSearchParams({type: "success", message: "Successfully created quote!"});
  } catch (err) {
    // create message that operation was unsuccessfull
    query = new URLSearchParams({type: "fail", message: err.message});
    console.error(err.message);
  } finally {
    const queryStr = query.toString();
    res.redirect(`/?${queryStr}`);
  }
}

async function deleteQuote(req, res) {
  try {
    // get id from params /quotes/<this-part>
    const { id } = req.params;
  
    // get result from deletion
    const result = await QuoteModel.deleteOne({ _id: id });
    
    // make sure there was a deletion otherwise raise exception
    if (result.deletedCount == 0) {
      throw {message: "No deletion was made"};
    }

  } catch (err) {
    console.error(err.message);
  } finally {
    res.redirect("/");
  }
}

export default {
  getAllQuotes,
  updateQuote,
  addQuote,
  deleteQuote,
};
