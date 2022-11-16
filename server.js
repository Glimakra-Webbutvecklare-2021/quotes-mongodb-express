import express from "express";
import { MongoClient } from "mongodb";
import { exit } from "process";
import dotenv from "dotenv";

// Read .env file and store the varibles in process.env
dotenv.config();

// Check if MONGO_CONNECTION_STR is logging
console.log(process.env.MONGO_CONNECTION_STR);

// console.log(MongoClient);

// Just a trick to make __dirname work using ecma 2015
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// Mongodb connection
// OLD DEPRECATED WAY
// MongoClient.connect(mongodbConnectinStr, (err, client) => {
// ... do something
// })

// console.log("May the node be with you!");

// Mongo DB related
if (!process.env.MONGO_CONNECTION_STR) {
  console.error("MONGO_CONNECTION_STR is not defined in .env file");
  exit();
}
const mongoDbClient = new MongoClient(process.env.MONGO_CONNECTION_STR);

// Express related
const app = express();

// Use ejs as the templeting engine
app.set('view engine', 'ejs')

// Make sure the express server is using correct middleware to process information correctly
// middleware can be seen as pre-work before doing the actuall request/response process
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function main() {
  try {
    // Setup the whole app with db connection DONE
    // TODO: rewrite using await
    const client = await mongoDbClient.connect();

    console.log("Successfully connected to database");

    const db = client.db("quotes-cluster");
    const quotesCollection = db.collection("quotes");
    // quotesCollection
    //   .find()
    //   .toArray()
    //   .then((quotes) => {
    //     console.log(quotes);
    //   });
    
    // DONE: Setup routes
    app.get("/", async function (req, res) {
      // DONE: Get quotes from MongoDB Atlas.
      const quotes = await quotesCollection.find().toArray();
      console.log(quotes);

      // DONE: Rendering the quotes in HTML with a template engine

      // res.sendFile(`${__dirname}/index.html`);
      // res.send(`This is a change`);
      const locals = { quotes };
      res.render("index", locals);
    });

    // TODO: add endpoint for editing quote
    app.put("/quotes/:id", async function (req, res) {
      // DONE: get the id of the request
      const id = req.params.id;

      // get the name and quote from request
      console.log(req.body);
      // find old quote doc from collection

      // replace doc values

      // save doc

      // redirect user
    })

    // Endpoint for /quotes using POST method
    app.post("/quotes", async function (req, res) {
      console.log(
        "Hello, user just submitted a form pointing to /quotes, Here is the data:"
      );
      console.log(req.body);
      // DONE: store user defined data into quotes collection
      // we want this to work with async-await
      // quotesCollection
      //   .insertOne(req.body)
      //   .then((result) => console.log(result))
      //   .catch((err) => console.error(err));
      try {
        if (!req.body.quote) {
          throw "Please set a quote before submitting";
        }

        // TODO: set more checks to remove invalid data insertions

        const result = await quotesCollection.insertOne(req.body);
        console.log(result);
      } catch(err) {
        console.error(err);
      } finally {
        res.redirect("/");
      }
    });
  
    app.listen(3000, function () {
      console.log("Listening on 3000");
    });


    // and then start listen
  } finally {
    // Just log that the app is ready
    console.log("Server is ready!");
  }

  
}

main().catch((err) => console.error(err));
