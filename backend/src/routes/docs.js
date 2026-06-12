const express = require('express');
const router = express.Router();
const docController = require('../controllers/docController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/generate-pdf', authenticateToken, docController.generateLegalDocumentPdf);

module.exports = router;
