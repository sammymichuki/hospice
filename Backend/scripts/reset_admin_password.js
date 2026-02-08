/* eslint-disable no-console */
const User = require('../models/User');

const EMAIL_DEFAULT = 'admin@hospital.com';
const PASSWORD_DEFAULT = 'password123';

const run = async () => {
  try {
    const email = process.argv[2] || EMAIL_DEFAULT;
    const newPassword = process.argv[3] || PASSWORD_DEFAULT;

    if (!newPassword || newPassword.length < 6) {
      console.error('Password must be at least 6 characters.');
      process.exit(1);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error(`User not found: ${email}`);
      process.exit(1);
    }

    user.password = newPassword; // hashed by model hook
    await user.save();

    console.log(`Password updated for ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to reset password:', err);
    process.exit(1);
  }
};

run();
