const crypto = require('crypto');

// Secret key for AES-256 must be exactly 32 bytes (256 bits).
// We retrieve it from env, using a fallback for local testing if not set.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'; 
const IV_LENGTH = 12; // Standard 12-byte IV for GCM

/**
 * Encrypts a string using AES-256-GCM
 * @param {string} text - The clear text to encrypt
 * @returns {string} - Formatted as iv:encryptedData:authTag (all hex encoded)
 */
function encrypt(text) {
  if (!text) return '';
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Internal encryption error');
  }
}

/**
 * Decrypts a string encrypted with AES-256-GCM
 * @param {string} encryptedText - Formatted as iv:encryptedData:authTag
 * @returns {string} - The decrypted clear text
 */
function decrypt(encryptedText) {
  if (!encryptedText) return '';
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid ciphertext format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedData = parts[1];
    const authTag = Buffer.from(parts[2], 'hex');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Internal decryption error');
  }
}

module.exports = {
  encrypt,
  decrypt
};
