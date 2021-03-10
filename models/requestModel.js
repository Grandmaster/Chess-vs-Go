// Code to construct schema for game requests, so that anyone entering the site can
// see requests of other players
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const requestSchema = new Schema({
  user: {
    type: String,
  },
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
