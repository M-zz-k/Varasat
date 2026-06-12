/**
 * Claude AI Legal Drafting Utility
 * Generates bilingual legal affidavit contents and indemnity bond clauses.
 */

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || null;

/**
 * Generates a draft of a bilingual legal affidavit
 */
async function draftAffidavit(claimantName, relation, deceasedName, assetsList, language = 'Hindi') {
  const assetsString = assetsList.map(a => `${a.type} at ${a.institution} (Value: ₹${a.amount})`).join(', ');

  // Implement the real Claude API call if key is set
  if (CLAUDE_API_KEY) {
    try {
      const prompt = `Draft a bilingual legal inheritance affidavit in English and ${language}. The claimant name is "${claimantName}" who is the "${relation}" of the deceased "${deceasedName}". The deceased left the following assets: ${assetsString}. Output your response strictly as a JSON object containing "englishText" and "vernacularText" fields. Do not output any other text or markdown formatting.`;
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.content[0].text.trim();
        const parsed = JSON.parse(text);
        return {
          englishText: parsed.englishText,
          vernacularText: parsed.vernacularText,
          languageUsed: language,
          generatedAt: new Date().toISOString()
        };
      } else {
        console.warn(`Claude API error status: ${response.status}`);
      }
    } catch (err) {
      console.warn("Claude API call failed. Falling back to static templates.", err);
    }
  }

  // Fallback Templates
  const englishDraft = `
AFFIDAVIT OF INHERITANCE
I, ${claimantName}, daughter/son/spouse of deceased ${deceasedName}, aged about ____ years, residing at __________________________, do hereby solemnly affirm and state as follows:
1. That the deceased ${deceasedName} passed away on _____________ leaving behind the following assets: ${assetsString}.
2. That I am the rightful Class I heir under the Hindu Succession Act, related to the deceased as ${relation}.
3. That I declare there are no disputes or conflicting claims regarding the apportionment of these assets.
4. I request the release of the aforementioned assets to the lawful heirs.
  `.trim();

  let localLanguageDraft = '';

  if (language.toLowerCase() === 'hindi') {
    localLanguageDraft = `
उत्तराधिकार का शपथ पत्र
मैं, ${claimantName}, दिवंगत ${deceasedName} के ${relation}, उम्र लगभग ____ वर्ष, निवासी __________________________, एतद्द्वारा सत्यनिष्ठा से प्रतिज्ञा करता हूँ और निम्नानुसार बयान करता हूँ:
1. यह कि दिवंगत ${deceasedName} का निधन _____________ को हो गया था, वे अपने पीछे निम्नलिखित संपत्ति छोड़ गए हैं: ${assetsString}।
2. यह कि मैं हिंदू उत्तराधिकार अधिनियम के तहत वैध श्रेणी-1 का उत्तराधिकारी हूँ, और मृतक से मेरा संबंध ${relation} का है।
3. यह कि मैं घोषणा करता हूँ कि इन संपत्तियों के विभाजन के संबंध में कोई विवाद या परस्पर विरोधी दावे नहीं हैं।
4. मैं कानून सम्मत उत्तराधिकारियों को उक्त संपत्तियों को जारी करने का अनुरोध करता हूँ।
    `.trim();
  } else if (language.toLowerCase() === 'kannada') {
    localLanguageDraft = `
ವಾರಸ್ದಾರಿಕೆ ಪ್ರಮಾಣ ಪತ್ರ
ನಾನು, ${claimantName}, ದಿವಂಗತ ${deceasedName} ರವರ ${relation}, ವಯಸ್ಸು ಸುಮಾರು ____ ವರ್ಷ, ವಾಸಸ್ಥಳ __________________________, ಈ ಮೂಲಕ ಪ್ರಮಾಣೀಕರಿಸುವುದೇನೆಂದರೆ:
1. ದಿವಂಗತ ${deceasedName} ರವರು ದಿನಾಂಕ _____________ ರಂದು ನಿಧನರಾಗಿದ್ದು, ತಮ್ಮ ಹಿಂದೆ ಈ ಕೆಳಗಿನ ಆಸ್ತಿಗಳನ್ನು ಬಿಟ್ಟುಹೋಗಿರುತ್ತಾರೆ: ${assetsString}.
2. ನಾನು ಹಿಂದೂ ಉತ್ತರಾಧಿಕಾರ ಕಾಯ್ದೆಯಡಿ ಕಾನೂನುಬದ್ಧ 1ನೇ ದರ್ಜೆಯ ವಾರಸ್ದಾರನಾಗಿದ್ದು, ಮೃತರೊಂದಿಗೆ ನನ್ನ ಸಂಬಂಧ ${relation} ಆಗಿರುತ್ತದೆ.
3. ಈ ಆಸ್ತಿಗಳ ಹಂಚಿಕೆಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಯಾವುದೇ ವಿವಾದಗಳು ಅಥವಾ ವಿರುದ್ಧ ಹಕ್ಕುಗಳು ಇರುವುದಿಲ್ಲ ಎಂದು ನಾನು ಘೋಷಿಸುತ್ತೇನೆ.
4. ಸದರಿ ಆಸ್ತಿಗಳನ್ನು ಕಾನೂನುಬದ್ಧ ವಾರಸ್ದಾರರಿಗೆ ಬಿಡುಗಡೆ ಮಾಡಲು ನಾನು ವಿನಂತಿಸುತ್ತೇನೆ.
    `.trim();
  } else {
    localLanguageDraft = `[Bilingual content in ${language} will be generated here by Claude AI]`;
  }

  return {
    englishText: englishDraft,
    vernacularText: localLanguageDraft,
    languageUsed: language,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generates an Indemnity Bond legal clause to protect partner banks
 */
async function draftIndemnityBond(claimantName, deceasedName, assetType, institution, amount) {
  if (CLAUDE_API_KEY) {
    try {
      const prompt = `Draft an Indemnity Bond clause for claim release. Claimant: "${claimantName}", Deceased: "${deceasedName}", Asset Type: "${assetType}", Institution: "${institution}", Amount: "₹${amount}". Output only the legal text clauses.`;
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.content[0].text.trim();
      } else {
        console.warn(`Claude API error status: ${response.status}`);
      }
    } catch (err) {
      console.warn("Claude API call failed. Falling back to static templates.", err);
    }
  }

  // Fallback Template
  return `
INDEMNITY BOND FOR CLAIM RELEASE
THIS INDEMNITY BOND is executed by ${claimantName} (hereinafter referred to as the Obligor/Claimant) in favor of ${institution} (hereinafter referred to as the Bank/Institution).

WHEREAS ${deceasedName} was holding an account/policy of type ${assetType} with a balance of ₹${amount}.
AND WHEREAS the Deceased died intestate on _____________ leaving the Obligor as a Class I heir.
AND WHEREAS the Bank/Institution has agreed to pay the sum of ₹${amount} without production of a court Succession Certificate, upon the Obligor executing this indemnity.

NOW THIS DEED WITNESSETH that in consideration of the payment of the said sum of ₹${amount}, the Obligor hereby agrees to indemnify and keep indemnified the Bank/Institution, its officers and successors from any claims, suits, costs, damages, or losses raised by any other claimant or heir in respect of the said money.
  `.trim();
}

module.exports = {
  draftAffidavit,
  draftIndemnityBond
};
