require('dotenv').config();
const { connectDB } = require('./config/db');
const { createApp } = require('./app');
const User = require('./models/User');
const Package = require('./models/Package');

async function seedPackages() {
  const defaults = [
    {
      name: 'basic',
      price: 2000,
      duration: 30,
      rank: 1,
      features: [
        'Profile listing in your category',
        'Limited visibility',
        'Basic analytics'
      ]
    },
    {
      name: 'standard',
      price: 5000,
      duration: 30,
      rank: 2,
      features: [
        'Higher ranking in listings',
        'More profile exposure',
        'Call/WhatsApp click tracking'
      ]
    },
    {
      name: 'premium',
      price: 10000,
      duration: 30,
      rank: 3,
      features: [
        'Top rank in listings',
        'Featured placement',
        'Full analytics'
      ]
    }
  ];

  for (const p of defaults) {
    await Package.updateOne({ name: p.name }, { $set: p }, { upsert: true });
  }
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@easy.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const existing = await User.findOne({ email });
  if (existing) return;
  const passwordHash = await User.hashPassword(password);
  await User.create({ email, passwordHash, role: 'admin' });
  // eslint-disable-next-line no-console
  console.log(`Seeded admin user: ${email} / ${password}`);
}

async function main() {
  const port = process.env.PORT || 5000;
  const mongo = process.env.MONGODB_URI;
  if (!mongo) {
    throw new Error('MONGODB_URI is required in .env');
  }

  await connectDB(mongo);
  await seedPackages();
  await seedAdmin();

  const app = createApp();
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`EASY backend running on http://localhost:${port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
