const { Schema, model } = require('mongoose');

const dateSchema = new Schema({
id:[{
        type: Schema.Types.ObjectId, ref: 'User'
} ],
locations: {
type: String
},
Exp: {
type: String,
}
});

const Date = model('Date', dateSchema);

module.exports = Date;