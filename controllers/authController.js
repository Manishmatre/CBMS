import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.js";

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Helper function to send user response
const sendUserResponse = (user, token) => {
  return {
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  };
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: "Account is inactive. Please contact administrator."
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token and send response
    const token = generateToken(user);
    res.json(sendUserResponse(user, token));

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

export const register = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  // Input validation
  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "All fields are required"
    });
  }

  try {
    console.log("Starting registration process for:", email);
    
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ 
        success: false,
        error: "User already exists with this email" 
      });
    }

    // Hash the password
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    console.log("Creating new user...");
    const newUser = new UserModel({
      name: fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'employee',
      status: 'active'
    });

    // Save the user to the database
    console.log("Saving user to database...");
    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser._id);

    // Generate a JWT token
    console.log("Generating JWT token...");
    const token = generateToken(savedUser);

    console.log("Registration successful for:", email);
    return res.status(201).json(sendUserResponse(savedUser, token));
  } catch (error) {
    console.error("Registration error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Email already exists"
      });
    }

    return res.status(500).json({ 
      success: false,
      error: "Internal server error",
      details: error.message 
    });
  }
};