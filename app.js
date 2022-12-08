const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./db");
const cors = require("cors");
require('dotenv').config()


//init app and middleware
const app = express();
app.use(express.json());
app.use(cors());

//db connection
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(process.env.PORT || 3000, () => {
      console.log("listening on port 3000");
    });
    db = getDb();
  }
});

//routes

//get all castles plan to visit with pagination

app.get("/castles/plan/all/p", (req, res) => {
  const page = req.query.pg || 0;
  const castlesPerPage = 6;

  let castles = [];

  db.collection("castles")
    .find({ addtovisit: "yes" })
    .sort({ castle: 1 })
    .skip(page * castlesPerPage)
    .limit(castlesPerPage)
    .forEach((element) => castles.push(element))
    .then(() => {
      res.status(200).json(castles);
    })
    .catch(() => {
      res.status(500).json({ error: "could not fetch" });
    });
});

//get all castles visited with pagination

app.get("/castles/visit/all/p", (req, res) => {
  const page = req.query.pg || 0;
  const castlesPerPage = 6;

  let castles = [];

  db.collection("castles")

    .find({ visited: "yes" })
    .sort({ castle: 1 })
    .skip(page * castlesPerPage)
    .limit(castlesPerPage)
    .forEach((castle) => castles.push(castle))
    .then(() => {
      res.status(200).json(castles);
    })
    .catch(() => {
      res.status(500).json({ error: "could not fetch" });
    });
});

//get all castles

app.get("/castles/all", (req, res) => {
  let castles = [];

  db.collection("castles")
    .find()
    .sort({ castle: 1 })
    .forEach((element) => castles.push(element))
    .then(() => {
      res.status(200).json(castles);
    })
    .catch(() => {
      res.status(500).json({ error: "could not fetch" });
    });
});

//get all castles and paginate

app.get("/castles/p/", (req, res) => {
  const page = req.query.pg || 0;
  const castlesPerPage = 6;

  let castles = [];

  db.collection("castles")

    .find()
    .sort({ castle: 1 })
    .skip(page * castlesPerPage)
    .limit(castlesPerPage)
    .forEach((castle) => castles.push(castle))
    .then(() => {
      res.status(200).json(castles);
    })
    .catch(() => {
      res.status(500).json({ error: "could not fetch" });
    });
});

//get a single document (castle) by id

app.get("/castles/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("castles")
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "could not fetch" });
      });
  } else {
    res.status(500).json({ error: "ID not valid" });
  }
});

//post requests

app.post("/castles", (req, res) => {
  const sentData = req.body;

  db.collection("castles")
    .insertOne(sentData)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: "could not create" });
    });
});

//delete request

app.delete("/castles/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("castles")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "could not delete" });
      });
  } else {
    res.status(500).json({ error: "ID not valid" });
  }
});

//patch request

app.patch("/castles/:id", (req, res) => {
  const updateData = req.body;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("castles")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updateData })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "could not update" });
      });
  } else {
    res.status(500).json({ error: "ID not valid" });
  }
});
