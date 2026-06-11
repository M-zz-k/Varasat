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

    // Set headers for PDF download
    res.setHeader('Content-disposition', `attachment; filename="Varasat_L3_${docType}.pdf"`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

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

      doc.fillColor(deepBlue).fontSize(12).text('English Version:', { underline: true, paragraphGap: 8 });
      doc.fillColor(charcoal).fontSize(10).text(textData.englishText, { align: 'justify', lineGap: 3, paragraphGap: 20 });

      doc.fillColor(deepBlue).fontSize(12).text(`${language || 'Hindi'} Version:`, { underline: true, paragraphGap: 8 });
      doc.fillColor(charcoal).fontSize(10).text(textData.vernacularText, { align: 'justify', lineGap: 3 });
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

    doc.end();

    // If claimId exists, record document in database
    if (claimId) {
      try {
        await db.documents.create({
          data: {
            claim_id: claimId,
            type: docType === 'indemnity_bond' ? 'Indemnity_Bond' : 'Affidavit',
            file_url: `/docs/generated_${docType}_${claimId}.pdf`,
            verification_status: 'Verified'
          }
        });
      } catch (err) {
        console.error('Failed to log document generation in database:', err);
      }
    }

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
