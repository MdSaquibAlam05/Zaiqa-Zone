// // // const mongoose = require('mongoose');
// // // const bcrypt = require('bcryptjs');

// // // const userSchema = new mongoose.Schema({
// // //   name: {
// // //     type: String,
// // //     required: [true, 'Name is required'],
// // //     trim: true
// // //   },
// // //   email: {
// // //     type: String,
// // //     required: [true, 'Email is required'],
// // //     unique: true,
// // //     lowercase: true,
// // //     trim: true
// // //   },
// // //   password: {
// // //     type: String,
// // //     required: [true, 'Password is required'],
// // //     minlength: 6
// // //   },
// // //   phone: String,
// // //   role: {
// // //     type: String,
// // //     enum: ['user', 'admin'],
// // //     default: 'user'
// // //   },
// // //   address: {
// // //     street: String,
// // //     city: String,
// // //     pincode: String
// // //   }
// // // }, { timestamps: true });

// // // userSchema.pre('save', async function(next) {
// // //   if (!this.isModified('password')) return next();
// // //   const salt = await bcrypt.genSalt(12);
// // //   this.password = await bcrypt.hash(this.password, salt);
// // //   next();
// // // });

// // // userSchema.methods.matchPassword = async function(password) {
// // //   return await bcrypt.compare(password, this.password);
// // // };

// // // module.exports = mongoose.model('User', userSchema);


// // const mongoose = require('mongoose');
// // const bcrypt = require('bcryptjs');

// // const userSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: [true, 'Name is required'],
// //     trim: true
// //   },
// //   email: {
// //     type: String,
// //     required: [true, 'Email is required'],
// //     unique: true,
// //     lowercase: true,
// //     trim: true
// //   },
// //   password: {
// //     type: String,
// //     required: [true, 'Password is required'],
// //     minlength: 6
// //   },
// //   phone: {
// //     type: String,
// //     default: ''
// //   },
// //   role: {
// //     type: String,
// //     enum: ['user', 'admin'],
// //     default: 'user'
// //   },
// //   address: {
// //     street: { type: String, default: '' },
// //     city: { type: String, default: '' },
// //     pincode: { type: String, default: '' }
// //   }
// // }, {
// //   timestamps: true
// // });

// // // Hash password before saving
// // userSchema.pre('save', async function(next) {
// //   if (!this.isModified('password')) {
// //     return next();
// //   }
// //   const salt = await bcrypt.genSalt(10);
// //   this.password = await bcrypt.hash(this.password, salt);
// //   next();
// // });

// // // Compare password method
// // userSchema.methods.matchPassword = async function(enteredPassword) {
// //   return await bcrypt.compare(enteredPassword, this.password);
// // };

// // const User = mongoose.model('User', userSchema);

// // module.exports = User;

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: 6
//   },
//   phone: {
//     type: String,
//     default: ''
//   },
//   role: {
//     type: String,
//     enum: ['user', 'admin'],
//     default: 'user'
//   }
// }, {
//   timestamps: true
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Match password
// userSchema.methods.matchPassword = async function(enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);





const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: '' },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  label: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  addresses: [addressSchema],
  defaultAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);