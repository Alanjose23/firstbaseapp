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
    unique: true,
  },
  zipcode: {
    type: String,
  },
  date:[{
    type: Schema.Types.ObjectId, ref: 'Date'
    } ]
});

const User = model('User', userSchema);

module.exports = User;
