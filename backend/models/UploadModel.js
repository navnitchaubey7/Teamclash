const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  fileName: String,
  originalName: String,
  mimeType: String,
  roomId: String,
  cardId: String,
  uploadedBy: String,
  uploadDate: Date,
});

module.exports = mongoose.model('Upload', UploadSchema);
