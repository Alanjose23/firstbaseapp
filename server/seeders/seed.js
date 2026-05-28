const db = require('../config/connection');
const { User } = require('../models');
const profileSeeds = require('./profileSeeds.json');

db.once('open', async () => {
  try {
    await User.deleteMany({});
    await User.create(profileSeeds);
    console.log('Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
