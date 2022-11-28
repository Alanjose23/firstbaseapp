const { Schema, model } = require('mongoose');

const dateSchema = new Schema({
id:[
        {type: Schema.Types.ObjectId, ref: 'User'} ],
locations: {
type: String
},
Exp: {
type: Text,
}
});

const Dates = model('Dates', dateSchema);

module.exports = Dates;