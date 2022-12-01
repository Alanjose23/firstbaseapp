const { Schema, model } = require('mongoose');


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
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'E-mail address does not match any of our users!'],
  },
});

const User = model('User', userSchema);

module.exports = User;
