const { MongoClient } = require("mongodb")
require('dotenv').config()

let dbConnection
let connectURI = "mongodb+srv://Paul2:hH4SGJ6D3alx7T1O@cluster0.uyp9qij.mongodb.net/castles?retryWrites=true&w=majority"
let localURI = "mongodb://0.0.0.0:27017/Castles"


    module.exports = {
        connectToDb: (cb) => {
            MongoClient.connect(process.env.MONGODBSTRING)
            .then((client) => {
              dbConnection =  client.db()
              return cb()
            })
            .catch(err => {
                console.log(err)
                return cb(err)
            })
        },
        getDb: () => dbConnection
    }

