const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const {
  isValidImageBuffer,
  uploadAvatarStream,
  safeDeleteAvatar,
} = require('../config/cloudinary');

module.exports = (authenticateToken) => {
  const router = express.Router();
  const User = mongoose.model('User');

  // Multer Memory Storage Configuration
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB max
      files: 1,
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedMimes.includes(file.mimetype)) {
        const err = new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
        err.code = 'INVALID_FILE_TYPE';
        return cb(err, false);
      }
      cb(null, true);
    },
  });

  // Multer Error Handling Wrapper
  const handleUploadMiddleware = (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'Image size exceeds the 5 MB limit.' });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  };

  // Helper: Profile Serializer (Enforces privacy rules)
  const serializeUserProfile = (user, isOwner = false) => {
    const profile = {
      id: user._id,
      username: user.username,
      name: user.name || '',
      avatar: (user.avatar && !user.avatar.includes('unsplash')) ? user.avatar : '/default-avatar.png',
      skills: user.skills || [],
      points: user.points || 0,
      rank: user.rank || 0,
      challengesSolved: user.challengesSolved || 0,
      battlesWon: user.battlesWon || 0,
      totalBattles: user.totalBattles || 0,
      socialLinks: user.socialLinks || { linkedin: '', github: '', leetcode: '', other: [] },
      createdAt: user.createdAt,
    };

    if (isOwner) {
      profile.email = user.email;
      profile.phone = user.phone || null;
      profile.phoneVisibility = user.phoneVisibility || 'private';
      profile.usernameLastChangedAt = user.usernameLastChangedAt || null;
      profile.avatarPublicId = user.avatarPublicId || null;
    } else if (user.phoneVisibility === 'public' && user.phone) {
      profile.phone = user.phone;
    }

    return profile;
  };

  // 1. GET /api/users/me/profile — Fetch current user's profile
  router.get('/me/profile', authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json({ user: serializeUserProfile(user, true) });
    } catch (err) {
      console.error('Profile fetch error:', err);
      return res.status(500).json({ message: 'Failed to fetch profile' });
    }
  });

  // 2. POST /api/users/me/avatar — Upload Profile Picture to Cloudinary
  router.post('/me/avatar', authenticateToken, handleUploadMiddleware, async (req, res) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ success: false, message: 'No image file uploaded.' });
      }

      // Verify real image magic bytes (not just file extension or client MIME)
      if (!isValidImageBuffer(req.file.buffer)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid image format. File content does not match JPEG, PNG, or WebP.',
        });
      }

      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const oldPublicId = user.avatarPublicId;

      // Upload buffer to Cloudinary in dedicated folder with 400x400 face crop
      const uploadResult = await uploadAvatarStream(req.file.buffer, req.userId.toString());

      // Update MongoDB atomically
      try {
        user.avatar = uploadResult.secure_url;
        user.avatarPublicId = uploadResult.public_id;
        await user.save();
      } catch (dbErr) {
        // If DB update fails, clean up the newly uploaded image from Cloudinary
        await safeDeleteAvatar(uploadResult.public_id);
        throw dbErr;
      }

      // Only delete old Cloudinary image if database update succeeded
      if (oldPublicId && oldPublicId !== uploadResult.public_id) {
        await safeDeleteAvatar(oldPublicId);
      }

      return res.status(200).json({
        success: true,
        message: 'Profile picture updated successfully',
        avatar: {
          url: user.avatar,
          publicId: user.avatarPublicId,
        },
        user: serializeUserProfile(user, true),
      });
    } catch (err) {
      console.error('Avatar upload error:', err?.message || err);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload profile picture to Cloudinary.',
      });
    }
  });

  // 3. DELETE /api/users/me/avatar — Remove Custom Avatar (Restore Default Robot)
  router.delete('/me/avatar', authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const oldPublicId = user.avatarPublicId;
      const defaultAvatar = '/default-avatar.png';

      user.avatar = defaultAvatar;
      user.avatarPublicId = null;
      await user.save();

      // Clean up previous custom Cloudinary image
      if (oldPublicId) {
        await safeDeleteAvatar(oldPublicId);
      }

      return res.status(200).json({
        success: true,
        message: 'Profile picture removed successfully',
        avatar: {
          url: defaultAvatar,
          publicId: null,
        },
        user: serializeUserProfile(user, true),
      });
    } catch (err) {
      console.error('Avatar removal error:', err?.message || err);
      return res.status(500).json({ success: false, message: 'Failed to remove profile picture.' });
    }
  });

  // 4. PATCH /api/users/me/profile — Update Name, Social Links, Skills
  router.patch('/me/profile', authenticateToken, async (req, res) => {
    try {
      const { name, socialLinks, skills } = req.body;
      const updateFields = {};

      if (name !== undefined) {
        if (typeof name !== 'string') return res.status(400).json({ message: 'Name must be a string' });
        const trimmedName = name.trim();
        if (trimmedName.length > 60) return res.status(400).json({ message: 'Name cannot exceed 60 characters' });
        updateFields.name = trimmedName;
      }

      if (skills !== undefined) {
        if (!Array.isArray(skills)) return res.status(400).json({ message: 'Skills must be an array' });
        if (skills.length > 30) return res.status(400).json({ message: 'Cannot exceed 30 skills' });

        const seen = new Set();
        const cleanedSkills = [];
        for (const s of skills) {
          if (typeof s === 'string' && s.trim()) {
            const clean = s.trim();
            const lower = clean.toLowerCase();
            if (!seen.has(lower)) {
              seen.add(lower);
              cleanedSkills.push(clean);
            }
          }
        }
        updateFields.skills = cleanedSkills;
      }

      if (socialLinks !== undefined) {
        if (typeof socialLinks !== 'object' || socialLinks === null) {
          return res.status(400).json({ message: 'Invalid social links format' });
        }
        const cleanedSocial = {
          linkedin: '',
          github: '',
          leetcode: '',
          other: [],
        };

        const validateHttps = (url) => {
          if (!url || typeof url !== 'string') return true;
          const trimmed = url.trim();
          if (!trimmed) return true;
          try {
            const parsed = new URL(trimmed);
            return parsed.protocol === 'https:';
          } catch {
            return false;
          }
        };

        if (socialLinks.linkedin) {
          if (!validateHttps(socialLinks.linkedin)) return res.status(400).json({ message: 'LinkedIn URL must start with https://' });
          cleanedSocial.linkedin = socialLinks.linkedin.trim();
        }
        if (socialLinks.github) {
          if (!validateHttps(socialLinks.github)) return res.status(400).json({ message: 'GitHub URL must start with https://' });
          cleanedSocial.github = socialLinks.github.trim();
        }
        if (socialLinks.leetcode) {
          if (!validateHttps(socialLinks.leetcode)) return res.status(400).json({ message: 'LeetCode URL must start with https://' });
          cleanedSocial.leetcode = socialLinks.leetcode.trim();
        }

        if (Array.isArray(socialLinks.other)) {
          if (socialLinks.other.length > 10) return res.status(400).json({ message: 'Maximum 10 custom links allowed' });
          for (const item of socialLinks.other) {
            if (item && item.url) {
              if (!validateHttps(item.url)) return res.status(400).json({ message: `URL for ${item.name || 'custom link'} must start with https://` });
              cleanedSocial.other.push({
                name: (item.name || '').trim().slice(0, 40),
                url: item.url.trim(),
              });
            }
          }
        }

        updateFields.socialLinks = cleanedSocial;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $set: updateFields },
        { new: true, runValidators: true }
      ).select('-password');

      return res.status(200).json({
        message: 'Profile updated successfully',
        user: serializeUserProfile(updatedUser, true),
      });
    } catch (err) {
      console.error('Profile update error:', err);
      return res.status(500).json({ message: 'Failed to update profile' });
    }
  });

  // 5. PATCH /api/users/me/username — 30-Day limit & uniqueness check
  router.patch('/me/username', authenticateToken, async (req, res) => {
    try {
      const { username } = req.body;
      if (!username || typeof username !== 'string') {
        return res.status(400).json({ message: 'Username is required' });
      }

      const trimmed = username.trim();
      if (!/^[a-zA-Z0-9_]{3,24}$/.test(trimmed)) {
        return res.status(400).json({ message: 'Username must be 3-24 characters (letters, numbers, and underscores only)' });
      }

      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (user.username.toLowerCase() === trimmed.toLowerCase()) {
        return res.status(400).json({ message: 'New username cannot be identical to current username' });
      }

      // Enforce 30-day cooldown
      if (user.usernameLastChangedAt) {
        const msSinceChange = Date.now() - new Date(user.usernameLastChangedAt).getTime();
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
        if (msSinceChange < thirtyDaysMs) {
          const nextEligible = new Date(new Date(user.usernameLastChangedAt).getTime() + thirtyDaysMs);
          const daysRemaining = Math.ceil((thirtyDaysMs - msSinceChange) / (1000 * 60 * 60 * 24));
          return res.status(400).json({
            message: `You can change your username again on ${nextEligible.toLocaleDateString()}. (${daysRemaining} day${daysRemaining > 1 ? 's' : ''} remaining).`,
            nextEligibleDate: nextEligible,
          });
        }
      }

      // Case-insensitive uniqueness check
      const conflict = await User.findOne({
        username: { $regex: new RegExp(`^${trimmed}$`, 'i') },
        _id: { $ne: req.userId },
      });
      if (conflict) {
        return res.status(409).json({ message: 'Username is already taken. Please choose a different username.' });
      }

      user.username = trimmed;
      user.usernameLastChangedAt = new Date();
      await user.save();

      return res.status(200).json({
        message: 'Username updated successfully',
        username: user.username,
        usernameLastChangedAt: user.usernameLastChangedAt,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ message: 'Username is already taken. Please choose a different username.' });
      }
      console.error('Username change error:', err);
      return res.status(500).json({ message: 'Failed to update username' });
    }
  });

  // 6. POST /api/users/me/phone — First-write only (Immutable once saved)
  router.post('/me/phone', authenticateToken, async (req, res) => {
    try {
      const { phone, phoneVisibility } = req.body;
      if (!phone || typeof phone !== 'string') {
        return res.status(400).json({ message: 'Phone number is required' });
      }

      const normalizedPhone = phone.trim();
      const cleanDigits = normalizedPhone.replace(/[\s\-()]/g, '');
      if (!/^\+?[1-9]\d{6,14}$/.test(cleanDigits)) {
        return res.status(400).json({ message: 'Invalid phone number format (e.g., +1 555 123 4567)' });
      }

      const visibility = phoneVisibility === 'public' ? 'public' : 'private';

      const updatedUser = await User.findOneAndUpdate(
        {
          _id: req.userId,
          $or: [{ phone: null }, { phone: '' }, { phone: { $exists: false } }],
        },
        {
          $set: {
            phone: normalizedPhone,
            phoneVisibility: visibility,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(400).json({
          message: 'Your phone number has already been permanently set and cannot be changed or removed.',
        });
      }

      return res.status(200).json({
        message: 'Phone number saved successfully',
        phone: updatedUser.phone,
        phoneVisibility: updatedUser.phoneVisibility,
      });
    } catch (err) {
      console.error('Phone setup error:', err);
      return res.status(500).json({ message: 'Failed to save phone number' });
    }
  });

  // 7. PATCH /api/users/me/phone-visibility — Update privacy preference
  router.patch('/me/phone-visibility', authenticateToken, async (req, res) => {
    try {
      const { phoneVisibility } = req.body;
      if (phoneVisibility !== 'private' && phoneVisibility !== 'public') {
        return res.status(400).json({ message: "phoneVisibility must be either 'private' or 'public'" });
      }

      const user = await User.findByIdAndUpdate(
        req.userId,
        { $set: { phoneVisibility } },
        { new: true }
      );

      if (!user) return res.status(404).json({ message: 'User not found' });

      return res.status(200).json({
        message: `Phone visibility updated to ${phoneVisibility}`,
        phoneVisibility: user.phoneVisibility,
      });
    } catch (err) {
      console.error('Phone visibility error:', err);
      return res.status(500).json({ message: 'Failed to update phone visibility' });
    }
  });

  // 8. GET /api/users/:username — Public profile (respects phone privacy)
  router.get('/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const user = await User.findOne({
        username: { $regex: new RegExp(`^${username.trim()}$`, 'i') },
      }).select('-password');

      if (!user) return res.status(404).json({ message: 'User not found' });

      return res.status(200).json({ user: serializeUserProfile(user, false) });
    } catch (err) {
      console.error('Public profile fetch error:', err);
      return res.status(500).json({ message: 'Failed to fetch developer profile' });
    }
  });

  return router;
};
