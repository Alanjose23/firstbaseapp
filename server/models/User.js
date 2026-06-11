const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must use a valid email address'],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    default: '',
    trim: true,
  },
  age: {
    type: Number,
    min: 18,
    max: 100,
  },
  ageRangeMin: { type: Number, default: 18 },
  ageRangeMax: { type: Number, default: 99 },
  bio: {
    type: String,
    default: '',
    maxlength: 300,
  },
  gender: {
    type: String,
    enum: ['man', 'woman', 'nonbinary', 'other'],
  },
  lookingFor: [{
    type: String,
    enum: ['man', 'woman', 'nonbinary', 'other'],
  }],
  photos: {
    type: [String],
    default: [],
    validate: [(arr) => arr.length <= 6, 'You can have at most 6 photos.'],
  },
  interests:     [{ type: String, trim: true }],
  favoriteShows: [{ type: String, trim: true }],
  connections:      [{ type: Schema.Types.ObjectId, ref: 'User' }],
  sentRequests:     [{ type: Schema.Types.ObjectId, ref: 'User' }],
  pendingRequests:  [{ type: Schema.Types.ObjectId, ref: 'User' }],
  socialMedia: {
    instagram: { type: String, default: '' },
    twitter:   { type: String, default: '' },
    tiktok:    { type: String, default: '' },
  },
  tier: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free',
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isCorrectPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);
module.exports = User;
