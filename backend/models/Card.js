const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  text: String,
  roomId: String,
  status: { type: String, default: "todo" },
  checked: Boolean,
  createdBy: String,
  description : String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

cardSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Card', cardSchema);


// const mongoose = require('mongoose');

// const cardSchema = new mongoose.Schema({
//   text: String,
//   status: { type: String, default: "todo" }, // todo | doing | done
//   roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
//   userId: { type: String },
// });

// module.exports = mongoose.model("Card", cardSchema);
