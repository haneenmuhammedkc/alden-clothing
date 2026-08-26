import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  addressType: {
    type: String,
    enum: ["Home", "Office", "Work", "Other"],
    default: "Home",
  },
  address: {
    line: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    authProvider: { type: String, default: "local" },
    password: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
      select: false,
    },
    status: { type: String, enum: ["Active", "Blocked"], default: "Active" },
    ordersCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    emailOtp: { type: String, select: false },
    emailOtpExpiry: { type: Date, select: false },
    resetOtp: { type: String, select: false },
    resetOtpExpire: { type: Date, select: false },
    profileImage: { type: String },
    addresses: [addressSchema],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
