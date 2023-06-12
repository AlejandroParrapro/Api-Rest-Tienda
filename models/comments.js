const { Schema, model } = require("mongoose");

const CommentSchema = Schema ({
    id: {
      type: String,
      required: true
    },
    productId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    dateCreated: {
      type: Date,
      required: true
    }
  });

module.exports = model("Comment", CommentSchema, "comments");
  