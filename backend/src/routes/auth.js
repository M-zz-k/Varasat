const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/ekyc', authController.verifyAadhaarEkyc);
router.post('/digilocker', authController.fetchDigilockerDeathCertificate);
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
