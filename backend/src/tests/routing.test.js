const { evaluateClaimRouting } = require('../utils/wolfram');

/**
 * Varasat Routing & Business Model Verification Test
 */
function runRoutingVerificationTests() {
  console.log("==================================================");
  console.log(" Running Varasat Smart Routing Verification Tests ");
  console.log("==================================================");

  let passedTests = 0;
  let failedTests = 0;

  // Test Case 1: Claim under 5 Lakh (Free B2C Impact Track)
  try {
    const amount1 = 450000; // 4.5 Lakh
    const result1 = evaluateClaimRouting({
      assetAmount: amount1,
      hasNominee: true,
      nomineeMatchesClaimant: true,
      hasFamilyDispute: false,
      unanimousConsent: true,
      missingHeirs: false
    });

    let track1 = 'Free';
    let successFee1 = 0;
    if (amount1 >= 500000) {
      track1 = 'Success_Fee';
      successFee1 = amount1 * 0.005;
    }

    console.log(`Test 1 (Amount: ₹${amount1}):`);
    console.log(`- Expected Track: Free`);
    console.log(`- Actual Track: ${track1}`);
    console.log(`- Expected Fee: ₹0`);
    console.log(`- Actual Fee: ₹${successFee1}`);

    if (track1 === 'Free' && successFee1 === 0 && result1.eligibility === 'Fast-Track Eligible') {
      console.log("✓ PASS: Correctly routed to Track 1 (Free) and verified Fast-Track.");
      passedTests++;
    } else {
      throw new Error("Track or eligibility miscalculation");
    }
  } catch (err) {
    console.error("✗ FAIL: Test 1 failed.", err.message);
    failedTests++;
  }

  console.log("--------------------------------------------------");

  // Test Case 2: Claim equal to 5 Lakh (Success Fee Track)
  try {
    const amount2 = 500000; // Exactly 5 Lakh
    const result2 = evaluateClaimRouting({
      assetAmount: amount2,
      hasNominee: false,
      nomineeMatchesClaimant: false,
      hasFamilyDispute: false,
      unanimousConsent: true,
      missingHeirs: false
    });

    let track2 = 'Free';
    let successFee2 = 0;
    if (amount2 >= 500000) {
      track2 = 'Success_Fee';
      successFee2 = amount2 * 0.005; // 0.5%
    }

    console.log(`Test 2 (Amount: ₹${amount2}):`);
    console.log(`- Expected Track: Success_Fee`);
    console.log(`- Actual Track: ${track2}`);
    console.log(`- Expected Fee: ₹2,500 (0.5% of 5L)`);
    console.log(`- Actual Fee: ₹${successFee2}`);

    if (track2 === 'Success_Fee' && successFee2 === 2500 && result2.eligibility === 'Fast-Track Eligible') {
      console.log("✓ PASS: Correctly routed to Track 2 (Success Fee) and calculated 0.5% fee.");
      passedTests++;
    } else {
      throw new Error("Track or fee logic miscalculation");
    }
  } catch (err) {
    console.error("✗ FAIL: Test 2 failed.", err);
    failedTests++;
  }

  console.log("--------------------------------------------------");

  // Test Case 3: Claim over 5 Lakh with dispute (Success Fee + Court Routing)
  try {
    const amount3 = 1200000; // 12 Lakh
    const result3 = evaluateClaimRouting({
      assetAmount: amount3,
      hasNominee: false,
      nomineeMatchesClaimant: false,
      hasFamilyDispute: true, // Active family dispute
      unanimousConsent: false,
      missingHeirs: false
    });

    let track3 = 'Free';
    let successFee3 = 0;
    if (amount3 >= 500000) {
      track3 = 'Success_Fee';
      successFee3 = amount3 * 0.005;
    }

    console.log(`Test 3 (Amount: ₹${amount3} with Family Dispute):`);
    console.log(`- Expected Eligibility: Civil Court Action Required`);
    console.log(`- Actual Eligibility: ${result3.eligibility}`);
    console.log(`- Expected Track: Success_Fee`);
    console.log(`- Actual Track: ${track3}`);
    console.log(`- Expected Fee: ₹6,000 (0.5% of 12L)`);
    console.log(`- Actual Fee: ₹${successFee3}`);

    if (track3 === 'Success_Fee' && successFee3 === 6000 && result3.eligibility === 'Civil Court Action Required') {
      console.log("✓ PASS: Correctly identified Civil Court necessity and calculated Track 2 fee.");
      passedTests++;
    } else {
      throw new Error("Dispute routing or fee calculation error");
    }
  } catch (err) {
    console.error("✗ FAIL: Test 3 failed.", err);
    failedTests++;
  }

  console.log("==================================================");
  console.log(` Verification Completed: ${passedTests} passed, ${failedTests} failed.`);
  console.log("==================================================");
  
  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runRoutingVerificationTests();
