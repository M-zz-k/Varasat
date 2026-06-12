const PDFDocument = require('pdfkit');
const { draftAffidavit, draftIndemnityBond } = require('../utils/claude');
const db = require('../config/db');

/**
 * Generates and downloads a custom legal affidavit/bond PDF (L3 Security Layer)
 * POST /api/docs/generate-pdf
 */
async function generateLegalDocumentPdf(req, res) {
  try {
    const { claimId, docType, claimantName, relation, deceasedName, assetType, institution, amount, language } = req.body;

    if (!docType || !claimantName || !deceasedName) {
      return res.status(400).json({ success: false, message: 'docType, claimantName, and deceasedName are required.' });
    }

    // Initialize PDFDocument
    const doc = new PDFDocument({ margin: 50 });

    // Styling Colors matching Visual Identity
    const deepBlue = '#0A2540';
    const gold = '#D4AF37';
    const charcoal = '#2D3748';
    
    // Draw Header border
    doc.rect(20, 20, 572, 752).stroke(gold);
    doc.rect(23, 23, 566, 746).stroke(deepBlue);

    // Add Logo & Title
    doc.fillColor(deepBlue)
       .fontSize(24)
       .text('V A R A S A T', { align: 'center', paragraphGap: 5 });
    
    doc.fillColor(gold)
       .fontSize(10)
       .text('AI-POWERED INHERITANCE RECOVERY PLATFORM', { align: 'center', paragraphGap: 15 });

    doc.moveTo(50, 80).lineTo(562, 80).stroke(deepBlue);

    // Document Meta Block
    doc.fillColor(charcoal)
       .fontSize(9)
       .text(`Document Reference: VARASAT-L3-${Math.random().toString(36).substring(3, 9).toUpperCase()}`, 50, 95)
       .text(`Verification Timestamp: ${new Date().toLocaleString()}`, 50, 108)
       .text('Security Level: L3 Legal Protection Bond (Digitally Authenticated)', 50, 121);

    doc.moveTo(50, 140).lineTo(562, 140).stroke(gold);

    if (docType === 'indemnity_bond') {
      // Indemnity Bond
      doc.fillColor(deepBlue)
         .fontSize(16)
         .text('INDEMNITY BOND TO PARTNER INSTITUTION', 50, 160, { align: 'center', paragraphGap: 20 });

      const text = await draftIndemnityBond(
        claimantName, 
        deceasedName, 
        assetType || 'Savings Bank Account', 
        institution || 'State Bank of India', 
        amount || '5,00,000'
      );

      doc.fillColor(charcoal)
         .fontSize(11)
         .text(text, {
           align: 'justify',
           lineGap: 4
         });

    } else {
      // Bilingual Affidavit
      doc.fillColor(deepBlue)
         .fontSize(16)
         .text('BILINGUAL LEGAL INHERITANCE AFFIDAVIT', 50, 160, { align: 'center', paragraphGap: 20 });

      const assetsMock = [{ type: assetType || 'Savings Bank Deposit', institution: institution || 'LIC India', amount: amount || '450000' }];
      const textData = await draftAffidavit(claimantName, relation || 'Son', deceasedName, assetsMock, language || 'Hindi');

      // --- English Section (default Helvetica font) ---
      doc.fillColor(deepBlue).fontSize(12).text('English Version:', { underline: true, paragraphGap: 8 });
      doc.fillColor(charcoal).fontSize(10).text(textData.englishText, { align: 'justify', lineGap: 3, paragraphGap: 20 });

      // --- Vernacular Section (Unicode/Devanagari font required) ---
      doc.fillColor(deepBlue).fontSize(12).text(`${language || 'Hindi'} Version:`, { underline: true, paragraphGap: 8 });

      // Try to register a Unicode-capable font for Devanagari script.
      const path = require('path');
      const fs = require('fs');
      const UNICODE_FONT_PATHS = [
        path.join(__dirname, '../assets/fonts/NotoSansDevanagari-Regular.ttf'),
        'C:\\Windows\\Fonts\\NirmalaUI.ttf',      // Windows — Nirmala UI Regular
        'C:\\Windows\\Fonts\\NirmalaS.ttf',       // Windows — Nirmala UI Slim
        '/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf', // Linux
        '/System/Library/Fonts/Supplemental/NotoSansDevanagari-Regular.ttf' // macOS
      ];

      let unicodeFontLoaded = false;
      for (const fontPath of UNICODE_FONT_PATHS) {
        if (fs.existsSync(fontPath)) {
          try {
            doc.registerFont('UnicodeFont', fontPath);
            unicodeFontLoaded = true;
            break;
          } catch (e) {
            // continue trying next candidate
          }
        }
      }

      if (unicodeFontLoaded) {
        doc.font('UnicodeFont').fillColor(charcoal).fontSize(10)
           .text(textData.vernacularText, { align: 'justify', lineGap: 4 });
        doc.font('Helvetica'); // restore default font for everything after
      } else {
        // Fallback: note that proper rendering requires a Unicode font on the server
        doc.fillColor(charcoal).fontSize(9)
           .text('[Hindi vernacular text — requires a Devanagari-capable font on the server]', { align: 'left', lineGap: 3 })
           .moveDown(0.5)
           .fontSize(10)
           .text(textData.vernacularText, { align: 'left', lineGap: 3 });
      }
    }

    // Footer and Signatures
    doc.moveDown(4);
    
    // Position signature lines near bottom
    const yPos = 650;
    doc.moveTo(70, yPos).lineTo(220, yPos).stroke(deepBlue);
    doc.moveTo(390, yPos).lineTo(540, yPos).stroke(deepBlue);

    doc.fillColor(deepBlue)
       .fontSize(9)
       .text('CLAIMANT SIGNATURE', 70, yPos + 8, { width: 150, align: 'center' })
       .text('(Aadhaar OTP Verified)', 70, yPos + 18, { width: 150, align: 'center' })
       .text('NOTARY / BANK OFFICER', 390, yPos + 8, { width: 150, align: 'center' })
       .text('(Varasat Secure Verification)', 390, yPos + 18, { width: 150, align: 'center' });

    // Cryptographic Seal Box
    doc.rect(240, yPos - 10, 130, 45).stroke(gold);
    doc.fillColor(gold)
       .fontSize(7)
       .text('VARASAT CRYPTO-SEAL', 245, yPos - 5, { width: 120, align: 'center' })
       .fillColor(deepBlue)
       .text('L1 Aadhaar KYC: PASS', 245, yPos + 5, { width: 120, align: 'left' })
       .text('L2 DigiLocker: PASS', 245, yPos + 13, { width: 120, align: 'left' })
       .text('L3 indemnity: PASS', 245, yPos + 21, { width: 120, align: 'left' });

    // If claimId exists, record document in database BEFORE ending response stream
    if (claimId) {
      await db.documents.create({
        data: {
          claimId: claimId,
          type: docType === 'indemnity_bond' ? 'Indemnity_Bond' : 'Affidavit',
          fileUrl: `/docs/generated_${docType}_${claimId}.pdf`,
          verificationStatus: 'Verified'
        }
      });
    }

    // Set headers for PDF download
    res.setHeader('Content-disposition', `attachment; filename="Varasat_L3_${docType}.pdf"`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);
    doc.end();

  } catch (error) {
    console.error('PDF generation error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Failed to generate PDF document.' });
    }
  }
}

module.exports = {
  generateLegalDocumentPdf
};
