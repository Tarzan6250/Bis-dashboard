const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const app = express();

// MongoDB URI and Port
const MONGODB_URI = 'mongodb://localhost:27017/bisDashboard';
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Adjust as needed for frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// MongoDB connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// Set up multer storage for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // store files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Use current timestamp as the file name
  }
});

const upload = multer({ storage: storage });

// User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  city: { type: String, required: true },
  profilePic: { type: String },
});

const User = mongoose.model('User', UserSchema);

// Login route (POST)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret', {
      expiresIn: '1h', // You can adjust the expiration time
    });

    res.json({ message: 'Login successful', token }); // Send token in response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Registration route (POST)
app.post('/api/register', async (req, res) => {
  const { username, email, password, dob, gender, city } = req.body;

  // Validate input
  if (!username || !email || !password || !dob || !gender || !city) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      dob,
      gender,
      city,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile route to fetch user data by email (GET)
app.get('/api/users', async (req, res) => {
  const { email } = req.query;  // Fetch email from the query params
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });  // Query by email field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // Return the found user data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile route to update user data by email (PUT)
app.put('/api/users', upload.single('profilePic'), async (req, res) => {
  const { email } = req.query; // Fetch email from the query params
  const { username, dob, gender, city, password } = req.body;
  const profilePic = req.file ? `/uploads/${req.file.filename}` : undefined; // Handle file upload

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });  // Query by email field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (username) user.username = username;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;
    if (city) user.city = city;
    if (profilePic) user.profilePic = profilePic;

    // If password is provided, hash it before storing
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
