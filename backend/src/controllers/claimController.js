const db = require('../config/db');
const { evaluateClaimRouting, calculateApportionment } = require('../utils/wolfram');

/**
 * Calculates heir inheritance percentages using Graph theory HSA models
 * POST /api/claims/apportion
 */
async function apportionHeirs(req, res) {
  try {
    const { familyMembers, deceasedName } = req.body;

    if (!familyMembers || !Array.isArray(familyMembers) || !deceasedName) {
      return res.status(400).json({ 
        success: false, 
        message: 'familyMembers list and deceasedName are required.' 
      });
    }

    const apportionment = calculateApportionment(familyMembers, deceasedName);

    return res.status(200).json({
      success: true,
      apportionment
    });
  } catch (error) {
    console.error('Apportionment error:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate heir apportionment.' });
  }
}

/**
 * Evaluates smart claim routing and assigns business tracks
 * POST /api/claims/route
 */
async function routeClaim(req, res) {
  try {
    const { 
      assetAmount, 
      hasNominee, 
      nomineeMatchesClaimant, 
      hasFamilyDispute, 
      unanimousConsent,
      missingHeirs,
      isEnterprise
    } = req.body;

    if (assetAmount === undefined) {
      return res.status(400).json({ success: false, message: 'assetAmount is required.' });
    }

    // Evaluate Routing via Wolfram circular axioms
    const routingResult = evaluateClaimRouting({
      assetAmount: parseFloat(assetAmount),
      hasNominee,
      nomineeMatchesClaimant,
      hasFamilyDispute,
      unanimousConsent,
      missingHeirs
    });

    // Business Routing Logic:
    // Track 1 (Free): Claims under ₹5 Lakh routed for B2C social impact.
    // Track 2 (Success Fee): Claims over/equal to ₹5 Lakh trigger a 0.5% post-payout fee logic.
    // Track 3 (Enterprise): Bank partner dashboard.
    let track = 'Free';
    let successFee = 0;
    
    if (isEnterprise) {
      track = 'Enterprise';
    } else if (parseFloat(assetAmount) >= 500000) {
      track = 'Success_Fee';
      successFee = parseFloat(assetAmount) * 0.005; // 0.5% success fee
    }

    return res.status(200).json({
      success: true,
      eligibility: routingResult.eligibility,
      reason: routingResult.reason,
      wolframCode: routingResult.wolframCode,
      track,
      successFee
    });
  } catch (error) {
    console.error('Routing check error:', error);
    return res.status(500).json({ success: false, message: 'Failed to evaluate routing logic.' });
  }
}

/**
 * Registers a completed claim into database with assets, deceased data, and family tree
 * POST /api/claims/create
 */
async function createClaim(req, res) {
  try {
    const claimantId = req.userId;
    const { 
      deceasedName, 
      deathDate, 
      certificateId,
      assetType,
      institution,
      amount,
      familyMembers, // Array of { name, relation, isLiving }
      routingData // { hasNominee, nomineeMatchesClaimant, hasFamilyDispute, unanimousConsent, missingHeirs }
    } = req.body;

    if (!deceasedName || !deathDate || !certificateId || !assetType || !institution || !amount) {
      return res.status(400).json({ success: false, message: 'Required claim fields are missing.' });
    }

    // Create Deceased Record
    const deceased = await db.deceasedRecords.create({
      data: {
        user_id: claimantId,
        death_date: new Date(deathDate),
        certificate_id: certificateId
      }
    });

    // Create Asset Record
    const asset = await db.assets.create({
      data: {
        deceased_id: deceased.id,
        type: assetType,
        institution: institution,
        amount: parseFloat(amount),
        status: 'Verified'
      }
    });

    // Save Family Members (link to Claimant User for demographic mapping)
    if (familyMembers && familyMembers.length > 0) {
      await db.familyMembers.createMany({
        data: familyMembers.map(fm => ({
          user_id: claimantId,
          name: fm.name,
          relation: fm.relation
        }))
      });
    }

    // Evaluate Routing & Business model track
    const routingInfo = evaluateClaimRouting({
      assetAmount: parseFloat(amount),
      hasNominee: routingData?.hasNominee,
      nomineeMatchesClaimant: routingData?.nomineeMatchesClaimant,
      hasFamilyDispute: routingData?.hasFamilyDispute,
      unanimousConsent: routingData?.unanimousConsent || true,
      missingHeirs: routingData?.missingHeirs || false
    });

    let track = 'Free';
    if (parseFloat(amount) >= 500000) {
      track = 'Success_Fee';
    }

    // Create Claim
    const claim = await db.claims.create({
      data: {
        asset_id: asset.id,
        claimant_id: claimantId,
        eligibility: routingInfo.eligibility,
        status: 'Submitted',
        track: track
      }
    });

    // Auto-create initial L1/L2 verified documents
    await db.documents.create({
      data: {
        claim_id: claim.id,
        type: 'Aadhaar_eKYC',
        file_url: `/docs/ekyc_${claimantId}.pdf`,
        verification_status: 'Verified'
      }
    });

    await db.documents.create({
      data: {
        claim_id: claim.id,
        type: 'Death_Certificate',
        file_url: `/docs/death_cert_${certificateId}.pdf`,
        verification_status: 'Verified'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Inheritance claim registered successfully.',
      claimId: claim.id,
      track,
      eligibility: claim.eligibility
    });
  } catch (error) {
    console.error('Create claim error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save inheritance claim.' });
  }
}

/**
 * Retrieves claims list
 * GET /api/claims/list
 */
async function listClaims(req, res) {
  try {
    const claims = await db.claims.findMany();
    return res.status(200).json({
      success: true,
      claims
    });
  } catch (error) {
    console.error('List claims error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch claims.' });
  }
}

/**
 * Retrieves a single claim with nested assets and documents
 * GET /api/claims/:id
 */
async function getClaimDetails(req, res) {
  try {
    const { id } = req.params;
    const claim = await db.claims.findUnique({
      where: { id }
    });

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found.' });
    }

    return res.status(200).json({
      success: true,
      claim
    });
  } catch (error) {
    console.error('Get claim details error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch claim details.' });
  }
}

/**
 * Updates a document's verification status (Bank portal approval)
 * POST /api/claims/verify-doc
 */
async function verifyDocument(req, res) {
  try {
    const { docId, status } = req.body; // status: 'Verified' or 'Rejected'
    
    if (!docId || !status) {
      return res.status(400).json({ success: false, message: 'docId and status are required.' });
    }

    const doc = await db.documents.update({
      where: { id: docId },
      data: { verification_status: status }
    });

    // If all documents for this claim are verified, update claim status
    const claimDocs = await db.documents.findMany({
      where: { claim_id: doc.claim_id }
    });

    const allVerified = claimDocs.every(d => d.verification_status === 'Verified');
    if (allVerified) {
      await db.claims.update({
        where: { id: doc.claim_id },
        data: { status: 'Approved' }
      });
    }

    return res.status(200).json({
      success: true,
      message: `Document status updated to ${status}.`,
      doc
    });
  } catch (error) {
    console.error('Document verification error:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify document.' });
  }
}

module.exports = {
  apportionHeirs,
  routeClaim,
  createClaim,
  listClaims,
  getClaimDetails,
  verifyDocument
};
