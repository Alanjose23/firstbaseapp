const { Schema, model } = require('mongoose');
const Date = require("./Dates").schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  zipcode: {
    type: String,
  },
  date:[Date]
});

const User = model('User', userSchema);

module.exports = User;
