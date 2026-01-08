const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const authController = require('../controllers/authController');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../config/database'); // Your MySQL connection

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/change-password', authenticateToken, authController.changePassword);

//authroutes--added this functionality for forgot password and reset password

// Configure email transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

// Forgot Password - Send reset email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const [rows] = await db.sequelize.query('SELECT * FROM users WHERE email = ?', {
      replacements: [email],
      type: db.sequelize.QueryTypes.SELECT,
    });
    const users = rows;

    console.log('Query result (users):', users);

    if (users.length === 0) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    const user = users;

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to database
    await db.sequelize.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      {
        replacements: [resetTokenHash, resetTokenExpiry, user.id],
        type: db.sequelize.QueryTypes.UPDATE,
      }
    );

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - Medicore',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested to reset your password for your Medicore account. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Medicore Healthcare Management System</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process password reset request' });
  }
});

// Validate Reset Token
router.get('/validate-reset-token/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const [users] = await db.sequelize.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      {
        replacements: [resetTokenHash],
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ message: 'Failed to validate token' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const [users] = await db.sequelize.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      {
        replacements: [resetTokenHash],
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const user = users;

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await db.sequelize.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      {
        replacements: [hashedPassword, user.id],
        type: db.sequelize.QueryTypes.UPDATE,
      }
    );
    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Successfully Reset - Medicore',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Successful</h2>
          <p>Hello ${user.name},</p>
          <p>Your password has been successfully reset. You can now log in with your new password.</p>
          <p style="color: #666; font-size: 14px;">If you didn't make this change, please contact our support team immediately.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Medicore Healthcare Management System</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

module.exports = router;