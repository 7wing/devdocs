const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  pendingEmail: { type: String },              
  emailVerificationToken: { type: String },  
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
