import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'admin' }
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});


userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
