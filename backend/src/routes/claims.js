const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.post('/apportion', authenticateToken, claimController.apportionHeirs);
router.post('/route', authenticateToken, claimController.routeClaim);
router.post('/create', authenticateToken, claimController.createClaim);
router.get('/list', authenticateToken, claimController.listClaims);
router.get('/details/:id', authenticateToken, claimController.getClaimDetails);
router.post('/verify-doc', authenticateToken, requireRole('bank_officer'), claimController.verifyDocument);

module.exports = router;
