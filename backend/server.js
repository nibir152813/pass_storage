const express = require("express");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");

dotenv.config();

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "Pass_storage";
const app = express();
const port = 3000;
app.use(bodyParser.json());

client.connect();

app.get("/", async (req, res) => {
  const db = client.db(dbName);
  const Collection = db.collection("documents");
  const findResult = await Collection.find({}).toArray();
  res.json(findResult);
});

app.post("/", async (req, res) => {
  const db = client.db(dbName);
  const Collection = db.collection("documents");
  const findResult = await Collection.find({}).toArray();
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
