const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./db");

//init app and middleware
const app = express();
app.use(express.json())


//db connection
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
    db = getDb();
  }
});

//routes

app.get("/castles", (req, res) => {
  let castles = [];

  db.collection("Castlenames")
    .find() //this gets a cursor - use methods to view. toArray and ForEach.
    .sort({ castle: 1 })
    .forEach((castle) => castles.push(castle))
    .then(() => {
      res.status(200).json(castles);
    })
    .catch(() => {
      res.status(500).json({ error: "could not fetch" });
    });
});

app.get("/castles/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("Castlenames")
      .findOne({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "could not fetch" });
      });
  } else {
    res.status(500).json({error: "ID not valid"})
  }
});


app.post('/castles', (req, res) => {
    const sentData = req.body

  db.collection("Castlenames")
    .insertOne(sentData)
    .then(result => {
      res.status(201).json(result)
    })
    .catch(err => {
      res.status(500).json({error: "could not create"})
    })

})


app.delete('/castles/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("Castlenames")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "could not delete" });
      });
  } else {
    res.status(500).json({error: "ID not valid"})
  }
})

app.patch('/castles/:id', (req, res) => {
  const updateData = req.body
  if (ObjectId.isValid(req.params.id)) {
    db.collection("Castlenames")
      .updateOne({ _id: ObjectId(req.params.id) }, {$set: updateData})
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "could not delete" });
      });
  } else {
    res.status(500).json({error: "ID not valid"})
  }

})