const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/project', authenticateToken, assetController.projectAssetGrowth);

module.exports = router;
