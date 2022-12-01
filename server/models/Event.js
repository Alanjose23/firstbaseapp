const { Schema, model } = require('mongoose');

const eventSchema = new Schema(
{
  user_id:[{
type: Schema.Types.ObjectId, ref: 'User' //multiple users_ids to one event outing
}],

locations: {
type: String,
required: true
},


});

const Event = model('Event', eventSchema);

module.exports = Event;