const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  phone: { type: Number, unique: true },
  age: { type: Number },
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};

module.exports = mongoose.model("User", userSchema);
