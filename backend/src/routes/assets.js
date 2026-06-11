const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

router.post('/project', assetController.projectAssetGrowth);

module.exports = router;
