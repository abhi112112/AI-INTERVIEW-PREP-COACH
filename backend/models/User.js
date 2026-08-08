// Mongoose schema definition library for MongoDB models
const mongoose = require('mongoose');
// Bcryptjs is a library to hash passwords securely using salted hashing algorithms
const bcrypt = require('bcryptjs');

// Define schema structure for User document in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true, // Guarantees unique user accounts per email
      lowercase: true, // Normalizes email to lowercase
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Prevents password hash from being sent in API query results by default
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Pre-save hook: Hashes the password before saving user to database if it was modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  // Generate salt factor of 10 for password hashing
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Helper instance method to compare candidate password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export Mongoose User model
module.exports = mongoose.model('User', userSchema);
