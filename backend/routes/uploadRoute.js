const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Card = require("../models/Card")
const UploadModel = require('../models/UploadModel');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, 'D:\\learn\\teamclash\\UploadedFiles\\');
    const uploadPath = path.join(__dirname, '..', 'UploadedFiles');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  const allowed = ['.png', '.jpg', '.jpeg', '.pdf', '.xls', '.xlsx', '.csv'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { roomId, cardId, uploadedBy } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newUpload = new UploadModel({
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      roomId,
      cardId,
      uploadedBy,
      uploadDate: new Date()
    });

    await newUpload.save();
    res.status(200).json({ message: 'File uploaded', file: req.file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});
router.get('/getByCard/:cardId', async (req, res) => {
  const files = await UploadModel.find({ cardId: req.params.cardId });
  const msg = await Card.find({ _id: req.params.cardId });
  res.json({ files, msg });
});
module.exports = router;
