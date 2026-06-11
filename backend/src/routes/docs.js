const express = require('express');
const router = express.Router();
const docController = require('../controllers/docController');

router.post('/generate-pdf', docController.generateLegalDocumentPdf);

module.exports = router;
