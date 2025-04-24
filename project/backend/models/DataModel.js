const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  items: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  images: [
    {
      url: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const DataModel = mongoose.model("DataModel", dataSchema);

module.exports = DataModel;
