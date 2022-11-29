const { Schema, model } = require('mongoose');


const dateSchema = new Schema({
  locations: {
  type: String
  },
  Exp: {
  type: String,
  }
  });

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    unique: true,
  },
  zipcode: {
    type: String,
  },
  Date: [dateSchema]
});

const User = model('User', userSchema);

module.exports = User;
