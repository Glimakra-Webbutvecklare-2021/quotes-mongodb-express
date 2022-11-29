import QuoteModel from "../models/Quote.js";
// import qs from "querystring";
import { ObjectId } from "mongodb";

async function getAllQuotes(req, res) {
  // get all public quotes
  // make sure that postedBy gets populated with the user
  const publicQuotes = await QuoteModel.find({visibility: 'public'}).populate("postedBy", "username").exec(); // I want user.username to populate postedBy 

  // get all quotes posted by logged in user
  // session should have userId
  // because it is added in AuthController.login
  const {userId} = req.session 
  const userQuotes = await QuoteModel.find( {postedBy: ObjectId(userId)});

  const locals = { publicQuotes, userQuotes, serverMessage: req.query };
  res.render("quotes", locals);
}

async function updateQuote(req, res) {
  try {
    // get the id of the request
    const id = req.params.id;

    const { name, quote, visibility}  = req.body;
    
    // find old quote and replace doc from collection
    // validation happens as we update
    await QuoteModel.updateOne(
      { _id: ObjectId(id) },
      { name, quote, visibility }
    );

  } catch(err) {
    console.error(err.message);
    const q = new URLSearchParams({type: "success", message: err.message});
    return res.redirect(`/quotes?${q}`);
  } finally {
    const q = new URLSearchParams({type: "success", message: "Successfully updated quote!"});
    res.redirect(`/quotes?${q}`);
  }
}

async function addQuote(req, res) {
  let query = null;

  try {
    // collect data from body
    const {name, quote, visibility} = req.body;

    const postedBy = ObjectId(req.session.userId);

    // create Quote document instance locally
    const quoteDoc = new QuoteModel({name , quote, visibility, postedBy})
    
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
