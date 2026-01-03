// backend/controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// --- Register a new user ---
export const registerUser = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      fullName,
      password: hashedPassword,
      role: 'student', // All new users default to 'student'
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// --- Log in a user ---
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create the token payload
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
      },
    };

    // Sign the token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Token lasts for 24 hours
    );

    res.json({ token, user: payload.user });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};