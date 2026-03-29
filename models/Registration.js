const mongoose = require("mongoose");
const crypto = require("crypto");

const registrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    submittedName: {
      type: String,
      required: true,
      trim: true,
    },
    submittedRegisterNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    submittedDepartment: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    submittedEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    submittedPhoneNumber: {
      type: String,
      default: null,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Verified", "Rejected"],
      required: true,
    },

    rejectionReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Registration", registrationSchema);
