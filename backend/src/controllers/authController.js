const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'varasat_secret_key_12345';

// L1: Aadhaar eKYC verification simulation
async function verifyAadhaarEkyc(req, res) {
  try {
    const { aadhaarNumber, otp } = req.body;
    
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      return res.status(400).json({ success: false, message: 'Invalid Aadhaar number. Must be 12 digits.' });
    }

    if (otp !== '123456') { // Mock OTP verification
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Use test code 123456.' });
    }

    // Success Mock response
    return res.status(200).json({
      success: true,
      message: 'Aadhaar eKYC L1 Verification successful.',
      data: {
        name: 'Ramesh Kumar Junior',
        gender: 'Male',
        dob: '1990-05-15',
        address: 'H.No 44, Rampur Village, Uttar Pradesh, 201301',
        ekycRefId: 'EKYC-' + Math.random().toString(36).substring(3, 9).toUpperCase()
      }
    });
  } catch (error) {
    console.error('eKYC error:', error);
    return res.status(500).json({ success: false, message: 'Aadhaar verification service error' });
  }
}

// L2: DigiLocker Certificate retrieve simulation
async function fetchDigilockerDeathCertificate(req, res) {
  try {
    const { certificateId } = req.body;

    if (!certificateId) {
      return res.status(400).json({ success: false, message: 'Certificate ID is required' });
    }

    // DigiLocker simulation: no manual uploads allowed.
    // Fetch directly from government servers.
    const mockCertificates = {
      'DEATH-2026-9081': {
        deceasedName: 'Ramesh Kumar Senior',
        dateOfDeath: '2026-02-14',
        placeOfDeath: 'District Hospital, Lucknow',
        registrationNumber: 'REG-LH-99210-2026',
        informantName: 'Ramesh Kumar Junior'
      },
      'DEATH-2026-1122': {
        deceasedName: 'Suresh Chandra',
        dateOfDeath: '2025-11-30',
        placeOfDeath: 'Metro Clinic, Kanpur',
        registrationNumber: 'REG-KC-44122-2025',
        informantName: 'Sunita Chandra'
      }
    };

    const certData = mockCertificates[certificateId];
    if (!certData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Death Certificate not found in government database. For testing, use certificate ID: DEATH-2026-9081 or DEATH-2026-1122.' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Government death certificate fetched directly from DigiLocker API.',
      certificate: certData
    });
  } catch (error) {
    console.error('DigiLocker error:', error);
    return res.status(500).json({ success: false, message: 'DigiLocker API service error' });
  }
}

// User registration with AES encrypted identifiers
async function register(req, res) {
  try {
    const { name, phone, email, aadhaar, pan, language } = req.body;

    if (!name || !phone || !email || !aadhaar || !pan) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Encrypt Aadhaar & PAN using AES-256-GCM
    const encryptedAadhaar = encrypt(aadhaar);
    const encryptedPan = encrypt(pan);

    const user = await db.users.create({
      data: {
        name,
        phone,
        email,
        aadhaar_hash: encryptedAadhaar,
        pan_hash: encryptedPan,
        language: language || 'English'
      }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: 'Claimant registered successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Phone or Email already registered.' });
    }
    return res.status(500).json({ success: false, message: 'Registration failed.' });
  }
}

// User Login simulation
async function login(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }

    let user = await db.users.findUnique({
      where: { phone }
    });

    if (!user) {
      // For demo convenience, let's auto-register or return error
      return res.status(404).json({ success: false, message: 'User not found. Please register first.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        language: user.language
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed.' });
  }
}

// Get user profile details
async function getProfile(req, res) {
  try {
    const userId = req.userId;
    const user = await db.users.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Decrypt Aadhaar and PAN to show we can read them securely
    const decryptedAadhaar = decrypt(user.aadhaar_hash);
    const decryptedPan = decrypt(user.pan_hash);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        language: user.language,
        aadhaar: `XXXX-XXXX-${decryptedAadhaar.slice(-4)}`,
        pan: `XXXXX${decryptedPan.slice(-4)}`
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
}

module.exports = {
  register,
  login,
  getProfile,
  verifyAadhaarEkyc,
  fetchDigilockerDeathCertificate
};
