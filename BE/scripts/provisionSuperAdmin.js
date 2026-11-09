const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { ALL_PERMISSION_KEYS, logAuditEvent } = require('../middleware/authMiddleware');

const SUPERADMIN_EMAIL = (process.env.SUPERADMIN_EMAIL || 'superadmin@acceptdefeat.com').toLowerCase().trim();
const SUPERADMIN_USERNAME = (process.env.SUPERADMIN_USERNAME || 'superadmin').trim();
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@2026!';
const SUPERADMIN_NAME = (process.env.SUPERADMIN_NAME || 'Super Administrator').trim();

async function provisionSuperAdmin() {
  console.log('--- Super Admin Provisioning Script ---');
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    console.error('Error: MONGO_URL not defined in BE/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB successfully.');

    // Look for existing User model
    const User = mongoose.model(
      'User',
      new mongoose.Schema({}, { strict: false, collection: 'users' })
    );

    let user = await User.findOne({
      $or: [{ email: SUPERADMIN_EMAIL }, { username: SUPERADMIN_USERNAME }],
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, salt);

    if (user) {
      console.log(`User found (${user.email}). Updating to Super Administrator...`);
      user.role = 'superadmin';
      user.status = 'active';
      user.isDeleted = false;
      user.statusReason = null;
      user.permissions = ALL_PERMISSION_KEYS;
      user.password = hashedPassword; // Set or reset to confirmed password
      if (!user.name) user.name = SUPERADMIN_NAME;
      await user.save();

      console.log('Super Administrator account updated successfully!');
    } else {
      console.log(`Creating new Super Administrator account: ${SUPERADMIN_EMAIL}...`);
      user = await User.create({
        name: SUPERADMIN_NAME,
        username: SUPERADMIN_USERNAME,
        email: SUPERADMIN_EMAIL,
        password: hashedPassword,
        role: 'superadmin',
        status: 'active',
        permissions: ALL_PERMISSION_KEYS,
        isDeleted: false,
        createdAt: new Date(),
      });
      console.log('Super Administrator account created successfully!');
    }

    await logAuditEvent({
      actor: user,
      action: 'superadmin.provisioned',
      targetEntity: 'User',
      targetId: user._id,
      targetName: user.name || user.username,
      reason: 'Provisioned Super Administrator via backend script',
      metadata: { email: user.email, username: user.username },
    });

    console.log('\n=============================================');
    console.log('Super Admin Credentials:');
    console.log(`  Login URL: http://localhost:5173/superadmin/login`);
    console.log(`  Email/Identifier: ${user.email}`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Password: ${SUPERADMIN_PASSWORD}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Permissions: ${user.permissions.length} total granted`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Provisioning failed:', err);
    process.exit(1);
  }
}

provisionSuperAdmin();
