const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  twitter: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  telegram: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  avatar: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  tags: { 
    type: Array,
    required: true,
    default: [],
  },
  holdings: {
    type: Array,
    required: true,
    default: [],
  },
  trades: {
    type: Array,
    required: true,
    default: [],
  },
  activities: {
    type: Array,
    required: false,
    default: [],
  },
  historicalPnL: {
    type: Array,
    required: false,
    default: [],
  },
  lastUpdated: {
    type: Number,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
