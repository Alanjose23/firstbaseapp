const { Schema, model } = require('mongoose');

const dateSchema = new Schema({
userId:[{
type: Schema.Types.ObjectId, ref: 'User'
}],
future: {
type: String
},
journal: {
type: String,
}
});

const Date = model('Date', dateSchema);

module.exports = Date;