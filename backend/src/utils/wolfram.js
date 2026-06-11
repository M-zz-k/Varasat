/**
 * Wolfram Computational Layer Integration Utility
 * 
 * Provides:
 * 1. Smart Claim Routing (RBI DBR Master Circular axioms)
 * 2. Heir Apportionment (Hindu Succession Act Class I heirs graph calculations)
 * 3. Financial Projections (Compounding interest and inflation adjustment)
 * 
 * Includes equivalent Wolfram Language (WL) code expressions for execution in
 * Wolfram Cloud/Enterprise API, and local high-fidelity JS implementations.
 */

const axios = require('axios');

const WOLFRAM_API_URL = process.env.WOLFRAM_API_URL || null;
const WOLFRAM_APP_ID = process.env.WOLFRAM_APP_ID || null;

/**
 * 1. SMART CLAIM ROUTING ENGINE
 * Evaluates whether a claim is Fast-Track or requires Civil Court (Succession Certificate).
 */
function evaluateClaimRouting(payload) {
  const {
    assetAmount,
    hasNominee,
    nomineeMatchesClaimant,
    hasFamilyDispute,
    unanimousConsent,
    missingHeirs
  } = payload;

  // Wolfram Language code representation of this logic
  const wlCode = `
    (* Smart Claim Routing Axioms *)
    EvaluateRouting[amount_, nominee_, nomineeMatches_, dispute_, consent_, missingHeirs_] := 
      Which[
        dispute === True, "Civil Court Action Required (Family Dispute)",
        missingHeirs === True, "Civil Court Action Required (Missing Heirs)",
        nominee === True && nomineeMatches === True, "Fast-Track Eligible (Direct Nominee)",
        amount <= 100000 && consent === True, "Fast-Track Eligible (Under Limit & Consented)",
        consent === True, "Fast-Track Eligible (Unified Consent)",
        True, "Civil Court Action Required (Standard Procedure)"
      ];
    EvaluateRouting[${assetAmount}, ${hasNominee}, ${nomineeMatchesClaimant}, ${hasFamilyDispute}, ${unanimousConsent}, ${missingHeirs}]
  `;

  // Local evaluation logic
  let eligibility = '';
  let reason = '';

  if (hasFamilyDispute) {
    eligibility = 'Civil Court Action Required';
    reason = 'Active dispute reported among family members. A Succession Certificate is legally mandated.';
  } else if (missingHeirs) {
    eligibility = 'Civil Court Action Required';
    reason = 'One or more Class I heirs could not be contacted or are missing. Court representation required.';
  } else if (hasNominee && nomineeMatchesClaimant) {
    eligibility = 'Fast-Track Eligible';
    reason = 'Claimant is the registered nominee. Direct bank payout authorized under RBI circular.';
  } else if (assetAmount <= 100000 && unanimousConsent) {
    eligibility = 'Fast-Track Eligible';
    reason = 'Asset value is under the ₹1 Lakh simplified claim threshold, and all available heirs consented.';
  } else if (unanimousConsent) {
    eligibility = 'Fast-Track Eligible';
    reason = 'All Class I heirs have executed joint claims and signed consent waivers.';
  } else {
    eligibility = 'Civil Court Action Required';
    reason = 'No registered nominee, and unanimous consent could not be verified.';
  }

  return {
    eligibility,
    reason,
    wolframCode: wlCode.trim()
  };
}

/**
 * 2. HEIR APPORTIONMENT (Hindu Succession Act Class I Heirs Graph Engine)
 * Renders graph relations and calculates exact inheritance percentages.
 */
function calculateApportionment(familyMembers, deceasedName) {
  // familyMembers: array of { name, relation, isLiving, children: [ { name, relation, isLiving } ] }
  // Class I Heirs: Mother, Widow, Son, Daughter.
  // If a Son or Daughter is deceased, their share passes to their children (and widow for deceased son).

  // Build Wolfram Graph Theory Code
  // e.g. Graph[{Deceased -> Widow, Deceased -> Son}]
  let graphEdges = [];
  let immediateHeirs = []; // { id, name, relation, shareFraction, sharePercentage, children: [...] }

  // Extract immediate Class I candidates
  const mothers = familyMembers.filter(m => m.relation.toLowerCase() === 'mother');
  const widows = familyMembers.filter(m => m.relation.toLowerCase() === 'widow' || m.relation.toLowerCase() === 'wife');
  const sons = familyMembers.filter(m => m.relation.toLowerCase() === 'son');
  const daughters = familyMembers.filter(m => m.relation.toLowerCase() === 'daughter');

  // We assign 1 share to each living Class I heir (Mother, Widow, Son, Daughter).
  // If a Son/Daughter is deceased, they still hold a "branch" if they have living children/widow.
  let branches = [];

  // 1. Mother (gets 1 share if alive)
  mothers.forEach(m => {
    if (m.isLiving !== false) {
      branches.push({ type: 'mother', member: m, subheirs: [] });
      graphEdges.push(`"${deceasedName}" -> "${m.name} (Mother)"`);
    }
  });

  // 2. Widow (gets 1 share if alive. If multiple widows, they share 1 share collectively, but usually 1)
  widows.forEach(w => {
    if (w.isLiving !== false) {
      branches.push({ type: 'widow', member: w, subheirs: [] });
      graphEdges.push(`"${deceasedName}" -> "${w.name} (Widow)"`);
    }
  });

  // 3. Sons
  sons.forEach(s => {
    if (s.isLiving !== false) {
      branches.push({ type: 'son', member: s, subheirs: [] });
      graphEdges.push(`"${deceasedName}" -> "${s.name} (Son)"`);
    } else if (s.children && s.children.length > 0) {
      // Deceased son's branch
      branches.push({ type: 'deceased_son', member: s, subheirs: s.children });
      graphEdges.push(`"${deceasedName}" -> "${s.name} (Deceased Son)"`);
      s.children.forEach(c => {
        graphEdges.push(`"${s.name} (Deceased Son)" -> "${c.name} (${c.relation}) "`);
      });
    }
  });

  // 4. Daughters
  daughters.forEach(d => {
    if (d.isLiving !== false) {
      branches.push({ type: 'daughter', member: d, subheirs: [] });
      graphEdges.push(`"${deceasedName}" -> "${d.name} (Daughter)"`);
    } else if (d.children && d.children.length > 0) {
      // Deceased daughter's branch
      branches.push({ type: 'deceased_daughter', member: d, subheirs: d.children });
      graphEdges.push(`"${deceasedName}" -> "${d.name} (Deceased Daughter)"`);
      d.children.forEach(c => {
        graphEdges.push(`"${d.name} (Deceased Daughter)" -> "${c.name} (${c.relation}) "`);
      });
    }
  });

  const totalShares = branches.length;
  let results = [];

  if (totalShares > 0) {
    const baseShare = 1 / totalShares;
    
    branches.forEach(b => {
      if (b.type === 'mother' || b.type === 'widow' || b.type === 'son' || b.type === 'daughter') {
        results.push({
          name: b.member.name,
          relation: b.member.relation,
          shareFraction: `1/${totalShares}`,
          sharePercentage: Number((baseShare * 100).toFixed(2))
        });
      } else if (b.type === 'deceased_son') {
        // Share of deceased son goes to his widow and children equally
        const subCount = b.subheirs.length;
        const subShare = baseShare / subCount;
        results.push({
          name: `${b.member.name} (Deceased)`,
          relation: 'Son',
          shareFraction: `0 (Passed to children)`,
          sharePercentage: 0
        });
        b.subheirs.forEach(sh => {
          results.push({
            name: sh.name,
            relation: `${sh.relation} of ${b.member.name}`,
            shareFraction: `1/${totalShares} * 1/${subCount}`,
            sharePercentage: Number((subShare * 100).toFixed(2))
          });
        });
      } else if (b.type === 'deceased_daughter') {
        // Share of deceased daughter goes to her children equally
        const subCount = b.subheirs.length;
        const subShare = baseShare / subCount;
        results.push({
          name: `${b.member.name} (Deceased)`,
          relation: 'Daughter',
          shareFraction: `0 (Passed to children)`,
          sharePercentage: 0
        });
        b.subheirs.forEach(sh => {
          results.push({
            name: sh.name,
            relation: `${sh.relation} of ${b.member.name}`,
            shareFraction: `1/${totalShares} * 1/${subCount}`,
            sharePercentage: Number((subShare * 100).toFixed(2))
          });
        });
      }
    });
  }

  // Construct Wolfram graph calculation script
  const wlCode = `
    (* Heir Apportionment via Graph Path Routing under Hindu Succession Act *)
    familyEdges = {${graphEdges.join(', ')}};
    g = Graph[familyEdges, VertexLabels -> "Name"];
    totalShares = ${totalShares};
    baseShare = 1.0 / totalShares;
    Print["Calculated Class I shares: ", baseShare];
  `;

  return {
    shares: results,
    graphEdges,
    wolframCode: wlCode.trim()
  };
}

/**
 * 3. FINANCIAL PROJECTIONS (Compounding Interest & Inflation adjustments)
 */
function calculateFinancialProjections(principal, interestRate, yearsDormant, assetType) {
  // Compounding parameters:
  // Banks compound quarterly (n=4). LIC pays standard simple or quarterly compounding. Mutual Funds compound annually (n=1).
  let compoundingFrequency = 4; // default quarterly
  if (assetType.toLowerCase().includes('mutual')) {
    compoundingFrequency = 1; // annual
  }

  // Formula: A = P * (1 + r/n)^(n*t)
  const r = interestRate / 100;
  const n = compoundingFrequency;
  const t = yearsDormant;

  const totalWealth = principal * Math.pow(1 + r / n, n * t);
  const accruedInterest = totalWealth - principal;

  // Simple inflation adjustment mockup using average Indian inflation rate of 5.8% over the period
  const averageInflation = 0.058;
  const inflationAdjustedPurchasingPower = totalWealth / Math.pow(1 + averageInflation, t);

  // Wolfram code equivalent
  const wlCode = `
    (* Financial Projections with TimeValue *)
    principal = ${principal};
    rate = ${r};
    n = ${n};
    t = ${t};
    accruedWealth = principal * (1 + rate/n)^(n*t);
    inflationAdjusted = TimeValue[accruedWealth, ${averageInflation}, -t];
    {accruedWealth, accruedWealth - principal, inflationAdjusted}
  `;

  return {
    principal: Math.round(principal),
    accruedInterest: Math.round(accruedInterest),
    totalWealth: Math.round(totalWealth),
    inflationAdjustedValue: Math.round(inflationAdjustedPurchasingPower),
    interestRate,
    compoundingFrequency: n === 4 ? 'Quarterly' : 'Annually',
    yearsDormant,
    wolframCode: wlCode.trim()
  };
}

module.exports = {
  evaluateClaimRouting,
  calculateApportionment,
  calculateFinancialProjections
};
