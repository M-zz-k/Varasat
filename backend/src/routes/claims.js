const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/apportion', claimController.apportionHeirs);
router.post('/route', claimController.routeClaim);
router.post('/create', authenticateToken, claimController.createClaim);
router.get('/list', claimController.listClaims);
router.get('/details/:id', claimController.getClaimDetails);
router.post('/verify-doc', claimController.verifyDocument);

module.exports = router;
