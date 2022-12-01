const { Schema, model } = require('mongoose');

const dateSchema = new Schema(
{
  user_id:[{
type: Schema.Types.ObjectId, ref: 'User' //multiple users_id to one date
}],

locations: {
type: String,
required: true
},


});

const Date = model('Date', dateSchema);

module.exports = Date;