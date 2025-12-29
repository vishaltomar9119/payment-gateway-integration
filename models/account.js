const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    googleId: {type: String,unique: true},
    name: {type: String,required: true},
    email: {type: String, required: true,unique: true,lowercase: true},
    provider: {type: String,default: 'google'},
    isEmailVerified: {type: Boolean,default: true},
    is_deleted:{type:Boolean , default:false},
    lastLogin: {type: Date,default: Date.now}},
    { timestamps: true}
);

module.exports = mongoose.model('Account', accountSchema);
