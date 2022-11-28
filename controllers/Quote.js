import QuoteModel from "../models/Quote.js";
// import qs from "querystring";
import { ObjectId } from "mongodb";
import UserModel from "../models/User.js";

async function getAllQuotes(req, res) {
  // DONE: Get quotes from MongoDB Atlas.
  // const quotes = await quotesCollection.find().toArray();
  const publicQuotes =
    (await QuoteModel.find({ visibility: "public" })
      .populate("postedBy", "username")
      .exec()) || [];
  const privateQuotes =
    (await QuoteModel.find({
      visibility: "private",
      postedBy: ObjectId(req.session.userId),
    })) || [];

  const locals = {
    quotes: publicQuotes,
    privateQuotes,
    serverMessage: req.query,
    pageTitle: "Quotes",
    isAuth: req.session.isAuth,
  };
  res.render("quotes", locals);
}

async function updateQuote(req, res) {
  try {
    // get the id of the request
    const id = req.params.id;

    const { name, quote, visibility } = req.body;

    // validate user input
    const quoteDoc = new QuoteModel({ name, quote, visibility });
    await quoteDoc.validate();

    // find old quote and replace doc from collection
    await QuoteModel.updateOne(
      { _id: ObjectId(id) },
      { name, quote, visibility }
    );
  } catch (err) {
    console.error(err.message);
  } finally {
    res.redirect("/quotes");
  }
}

async function addQuote(req, res) {
  let query = null;

  try {
    // collect data from body
    console.log(req.body);

    const { name, quote, visibility } = req.body;
    const postedBy = ObjectId(req.session.userId);

    // create Quote document instance locally
    const quoteDoc = new QuoteModel({ name, quote, visibility, postedBy });

    // validation
    await quoteDoc.validate();

    // save to database
    quoteDoc.save();

    // create message that operation was successfull
    query = new URLSearchParams({
      type: "success",
      message: "Successfully created quote!",
    });
  } catch (err) {
    // create message that operation was unsuccessfull
    query = new URLSearchParams({ type: "fail", message: err.message });
    console.error(err.message);
  } finally {
    const queryStr = query.toString();
    res.redirect(`/quotes?${queryStr}`);
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
      throw { message: "No deletion was made" };
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    res.redirect("/quotes");
  }
}

export default {
  getAllQuotes,
  updateQuote,
  addQuote,
  deleteQuote,
};
