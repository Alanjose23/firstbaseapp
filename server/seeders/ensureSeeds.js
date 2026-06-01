const { User } = require('../models');
const profileSeeds = require('./profileSeeds.json');

const SEED_EMAILS = profileSeeds.map((u) => u.email);

async function ensureSeeds() {
  const existing = await User.find({ email: { $in: SEED_EMAILS } }).select('email');
  const existingEmails = new Set(existing.map((u) => u.email));

  const missing = profileSeeds.filter((u) => !existingEmails.has(u.email));
  if (missing.length === 0) {
    console.log('Seed users already present — skipping.');
    return;
  }

  // User.create triggers the pre-save bcrypt hook so passwords are hashed correctly
  await User.create(missing);
  console.log(`Seeded ${missing.length} missing user(s): ${missing.map((u) => u.name).join(', ')}`);
}

module.exports = ensureSeeds;
