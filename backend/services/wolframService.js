const axios = require('axios');

class WolframService {
  constructor() {
    this.apiUrl = process.env.WOLFRAM_CLOUD_API_URL || null;
  }

  /**
   * Task 1.2: Evaluate JSON payloads against RBI master circulars.
   * Rules:
   * - Fast-Track if nominee exists and matches.
   * - Fast-Track if amount <= 1,00,000 INR (simplified claim circular).
   * - Otherwise, requires Civil Court Succession Certificate.
   */
  async evaluateClaimRouting(assetType, amount, hasNominee) {
    const payload = { assetType, amount, hasNominee };
    
    try {
      if (this.apiUrl) {
        const response = await axios.post(`${this.apiUrl}/evaluate-routing`, payload, { timeout: 4000 });
        if (response.data && response.data.eligibility) {
          return response.data;
        }
      }
      throw new Error("Wolfram Cloud connection unavailable. Executing local circular routing engine.");
    } catch (error) {
      console.warn(`[WolframService] evaluateClaimRouting fallback: ${error.message}`);
      
      const amt = parseFloat(amount);
      let eligibility = "Civil Court Action Required";
      let reason = "No nominee registered and amount exceeds simplified claim threshold. Succession Certificate required.";

      if (hasNominee === true || hasNominee === 'true') {
        eligibility = "Fast-Track Eligible";
        reason = "Registered nominee present. Direct settlement authorized under RBI DBR master circular.";
      } else if (amt <= 100000) {
        eligibility = "Fast-Track Eligible";
        reason = "Asset amount is under the ₹1 Lakh threshold. Fast-track simplified settlement allowed without court certificate.";
      }

      return {
        eligibility,
        reason,
        ruleChecked: "RBI DBR Master Circular - Simplified Claims & Nominee Rights",
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Task 1.3: Calculate compound interest and present-day value.
   * Rates:
   * - Bank Deposit: 6% compounding quarterly (n=4)
   * - LIC Policy: 5.5% compounding annually (n=1)
   * - Mutual Fund: 9.5% compounding annually (n=1)
   */
  async calculateAccruals(principalAmount, holdingPeriodYears, assetClass) {
    const payload = { principalAmount, holdingPeriodYears, assetClass };
    
    try {
      if (this.apiUrl) {
        const response = await axios.post(`${this.apiUrl}/calculate-accruals`, payload, { timeout: 4000 });
        if (response.data && response.data.totalValue) {
          return response.data;
        }
      }
      throw new Error("Wolfram Cloud connection unavailable. Executing local accruals math engine.");
    } catch (error) {
      console.warn(`[WolframService] calculateAccruals fallback: ${error.message}`);
      
      const p = parseFloat(principalAmount);
      const t = parseFloat(holdingPeriodYears);
      const type = (assetClass || "").toLowerCase();
      
      let rate = 0.06; // default 6%
      let n = 4; // default quarterly

      if (type.includes("lic")) {
        rate = 0.055;
        n = 1;
      } else if (type.includes("mutual") || type.includes("fund")) {
        rate = 0.095;
        n = 1;
      }

      // Formula: A = P * (1 + r/n)^(n*t)
      const totalValue = p * Math.pow(1 + rate / n, n * t);
      const accruedInterest = totalValue - p;
      
      // Calculate real present value discounting by 5.5% average historic inflation
      const inflationRate = 0.055;
      const realValue = totalValue / Math.pow(1 + inflationRate, t);

      return {
        principal: Math.round(p),
        accruedInterest: Math.round(accruedInterest),
        totalValue: Math.round(totalValue),
        realPurchasingPower: Math.round(realValue),
        rate: rate * 100,
        compounding: n === 4 ? "Quarterly" : "Annually",
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Task 1.4: Map family tree and apportion inheritance shares based on Class I heirs.
   */
  generateSuccessionGraph(familyMembersArray) {
    // Class I: Widow, Mother, Son, Daughter
    const livingHeirs = familyMembersArray.filter(f => f.isLiving !== false && ['widow', 'wife', 'mother', 'son', 'daughter'].includes(f.relation.toLowerCase()));
    const totalCount = livingHeirs.length;
    const basePct = totalCount > 0 ? Number((100 / totalCount).toFixed(2)) : 100;

    const shares = livingHeirs.map(h => ({
      name: h.name,
      relation: h.relation,
      sharePercentage: basePct,
      shareFraction: `1/${totalCount}`
    }));

    const edges = familyMembersArray.map(h => `Deceased -> ${h.name} (${h.relation})`);

    return {
      shares,
      graphEdges: edges,
      auditRule: "Hindu Succession Act (HSA) Class I Heir Apportionment Axioms",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new WolframService();
