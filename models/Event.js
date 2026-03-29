const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
    },
    location: {
      type: String,
      default: "TBD",
      trim: true,
    },
    eligibleDepartments: {
      type: [String],
      default: ["All"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
