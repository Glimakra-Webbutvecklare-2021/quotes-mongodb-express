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
const mongoDbClient = new MongoClient(process.env.MONGO_CONNECTION_STR);

if (!process.env.MONGO_CONNECTION_STR) {
    console.error("Error: MONGO_CONNECTION_STR is not defined in .env file");
    exit();
}

async function main() {
  try {

    // DONE: rewrite using await
    await mongoDbClient.connect();
    console.log("Successfully connected to database");

    const db = mongoDbClient.db("quotes-cluster");
    const quotesCollection = db.collection("quotes");
    const quotes = await quotesCollection.find().toArray();

    console.log(quotes);

    const app = express();

    // Make sure the express server is using correct middleware to process information correctly
    // middleware can be seen as pre-work before doing the actuall request/response process
    app.use(express.urlencoded({ extended: true }));

    app.get("/", function (req, res) {
      res.sendFile(`${__dirname}/index.html`);
      // res.send(`This is a change`);
    });

    // Endpoint for /quotes using POST method
    app.post("/quotes", async function (req, res) {
      console.log(
        "Hello, user just submitted a form pointing to /quotes, Here is the data:"
      );
      console.log(req.body);
      // TODO: store user defined data into quotes collection
      await quotesCollection.insertOne(req.body);
      console.log("New quote has been added", req.body)
      res.sendFile(`${__dirname}/index.html`);
    });

    app.listen(3000, function () {
      console.log("Listening on 3000");
    });
  } finally {
    // await mongoDbClient.close();
    console.log("App is ready to receive requests");
  }
}

main().catch((err) => console.error(err));

mongoDbClient.close();