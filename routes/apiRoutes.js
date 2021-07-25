// Javascript file to handle routing for the server
// ===========================================================

// Models
const db = require("../models");

module.exports = function (app) {
  // Getting all messages from database
  app.get("/message", (req, res) => {
    db.Message.find({}).then((dbMessages) => {
      res.send(dbMessages);
    });
  });

  // Getting all requests from database
  app.get("/request", (req, res) => {
    db.Request.find({}).then((dbRequests) => {
      res.send(dbRequests);
    });
  });

  // Saving chat messages to database
  app.post("/message", ({ body }, res) => {
    db.Message.create(body)
      .then((dbMessage) => {
        res.json(dbMessage);
      })
      .catch((err) => {
        res.json(err);
      });
    console.log(`${body.user}: ${body.message}`);
  });

  // Saving request to database
  app.post("/request", ({ body }, res) => {
    db.Request.create(body)
      .then((dbRequest) => {
        res.json(dbRequest);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  // Deleting request from database
  app.delete("/request/:user", (req, res) => {
    let name = req.params.user;
    db.Request.deleteOne({ user: name }).catch((err) => {
      console.log(err);
      res.json(err);
    });
  });
};
