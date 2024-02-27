import { NextFunction } from "express";
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    unique: true,
    required: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    // 5m
    expires: 60 * 5, 
  },
});

// methods

async function sendVerificationEmail(email:any, otp:string) {}

// run on save()
otpSchema.pre('save', async function(next: any) {
  console.log('new otp was saved.');
  // only when doc is new
  if (this.isNew) {
    // send email or sms
  }
  next();
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;