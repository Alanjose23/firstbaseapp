const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  sender:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content:   { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true });

module.exports = model('Message', messageSchema);
