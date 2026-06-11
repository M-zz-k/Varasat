const { calculateFinancialProjections } = require('../utils/wolfram');

/**
 * Calculates compound interest projections and inflation impact for a dormant asset
 * POST /api/assets/project
 */
async function projectAssetGrowth(req, res) {
  try {
    const { principal, interestRate, yearsDormant, assetType } = req.body;

    if (!principal || !interestRate || !yearsDormant || !assetType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required inputs: principal, interestRate, yearsDormant, and assetType are required.' 
      });
    }

    const principalNum = parseFloat(principal);
    const rateNum = parseFloat(interestRate);
    const yearsNum = parseInt(yearsDormant);

    const projections = calculateFinancialProjections(
      principalNum,
      rateNum,
      yearsNum,
      assetType
    );

    return res.status(200).json({
      success: true,
      projections
    });
  } catch (error) {
    console.error('Asset projection error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to calculate financial projections.' 
    });
  }
}

module.exports = {
  projectAssetGrowth
};
