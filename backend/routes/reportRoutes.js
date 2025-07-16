const express = require('express');
const router = express.Router();
const { generateDownloadReport } = require('../controllers/generateReport');

router.get('/download-report', generateDownloadReport);

module.exports = router;
