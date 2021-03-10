// Code to construct schema for chat messages, that will go into database
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    user: {
      type: String,
    },

    message: {
      type: String,
    },
  },
  {
    capped: {
      size: 1024,
      max: 500,
      autoIndexId: true,
    },
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
