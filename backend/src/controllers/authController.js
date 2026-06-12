const db = require('../config/db');
const { encrypt } = require('../utils/crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// L1: Aadhaar eKYC verification simulation
async function verifyAadhaarEkyc(req, res) {
  try {
    const { aadhaarNumber, otp } = req.body;
    
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      return res.status(400).json({ success: false, message: 'Invalid Aadhaar number. Must be 12 digits.' });
    }

    if (process.env.NODE_ENV !== 'development') {
      return res.status(501).json({ 
        success: false, 
        message: 'Real Aadhaar eKYC integration required in production.' 
      });
    }
    // TODO: Replace with real UIDAI/MeitY sandbox API call

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
    const { name, phone, email, password, aadhaar, pan, language, role } = req.body;

    if (!name || !phone || !email || !password || !aadhaar || !pan) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Encrypt Aadhaar & PAN using AES-256-GCM
    const encryptedAadhaar = encrypt(aadhaar);
    const encryptedPan = encrypt(pan);

    // Get last-4 digits of identifiers
    const aadhaarLast4 = aadhaar.slice(-4);
    const panLast4 = pan.slice(-4);

    // Hash the password with bcrypt
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.users.create({
      data: {
        name,
        phone,
        email,
        passwordHash,
        aadhaarHash: encryptedAadhaar,
        panHash: encryptedPan,
        aadhaarLast4,
        panLast4,
        role: role || 'claimant',
        language: language || 'English'
      }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: 'Claimant registered successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        language: user.language,
        role: user.role
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
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'Phone number and password are required.' });
    }

    let user = await db.users.findUnique({
      where: { phone }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Please register first.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid phone number or password.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        language: user.language,
        role: user.role
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

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        language: user.language,
        aadhaar: `XXXX-XXXX-${user.aadhaarLast4}`,
        pan: `XXXXX${user.panLast4}`
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
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
