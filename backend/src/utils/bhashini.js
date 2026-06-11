/**
 * Bhashini Translation & TTS/STT Simulation Layer
 * Supports vernacular speech inputs and text-to-speech queries for:
 * - Hindi (hi)
 * - Kannada (kn)
 * - Tamil (ta)
 * - Telugu (te)
 */

const translations = {
  hi: {
    welcome: "नमस्ते, मैं विरासत मित्र हूँ। मैं आपके दिवंगत परिवार के सदस्यों की संपत्ति पुनर्प्राप्ति में आपकी सहायता करूँगा।",
    ask_name: "कृपया अपना पूरा नाम बताएं जो आपके आधार कार्ड पर है।",
    ask_deceased: "दिवंगत परिवार के सदस्य का नाम क्या था?",
    ask_assets: "उनके पास किस प्रकार की संपत्ति थी? बैंक खाता, एलआईसी पॉलिसी या म्यूचुअल फंड?",
    success: "बधाई हो! आपका दावा सफलतापूर्वक दर्ज हो गया है।"
  },
  kn: {
    welcome: "ನಮಸ್ತೆ, ನಾನು ವಾರಸಾತ್ ಮಿತ್ರ. ನಿಮ್ಮ ಕುಟುಂಬದ ದಿವಂಗತ ಸದಸ್ಯರ ಆಸ್ತಿಯನ್ನು ಮರಳಿ ಪಡೆಯಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
    ask_name: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್‌ನಲ್ಲಿರುವಂತೆ ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ತಿಳಿಸಿ.",
    ask_deceased: "ದಿವಂಗತ ಕುಟುಂಬದ ಸದಸ್ಯರ ಹೆಸರೇನು?",
    ask_assets: "ಅವರ ಬಳಿ ಯಾವ ರೀತಿಯ ಆಸ್ತಿ ಇತ್ತು? ಬ್ಯಾಂಕ್ ಖಾತೆ, ಎಲ್ಐಸಿ ಪಾಲಿಸಿ ಅಥವಾ ಮ್ಯೂಚುವಲ್ ಫಂಡ್?",
    success: "ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಹಕ್ಕು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ."
  },
  ta: {
    welcome: "வணக்கம், நான் வராசத் மித்ரா. உங்கள் குடும்பத்தில் காலமானவர்களின் சொத்துக்களை மீட்டெடுக்க நான் உங்களுக்கு உதவுவேன்.",
    ask_name: "உங்கள் ஆதார் அட்டையில் உள்ளவாறு உங்கள் முழுப் பெயரைச் சொல்லுங்கள்.",
    ask_deceased: "காலமான குடும்ப உறுப்பினரின் பெயர் என்ன?",
    ask_assets: "அவர்களிடம் என்ன வகையான சொத்துக்கள் இருந்தன? வங்கி கணக்கு, எல்ஐசி பாலிசி அல்லது பரஸ்பர நிதி?",
    success: "வாழ்த்துகள்! உங்கள் கோரிக்கை வெற்றிகரமாகப் பதிவு செய்யப்பட்டுள்ளது."
  },
  te: {
    welcome: "నమస్తే, నేను వారాసత్ మిత్ర. మీ కుటుంబంలో మరణించిన సభ్యుల ఆస్తులను తిరిగి పొందడంలో నేను మీకు సహాయం చేస్తాను.",
    ask_name: "దయచేసి మీ ఆధార్ కార్డ్‌లో ఉన్నట్లుగా మీ పూర్తి పేరును చెప్పండి.",
    ask_deceased: "మరణించిన కుటుంబ సభ్యుడి పేరు ఏమిటి?",
    ask_assets: "వారి వద్ద ఎటువంటి ఆస్తులు ఉండేవి? బ్యాంక్ ఖాతా, ఎల్‌ఐసి పాలసీ లేదా మ్యూచువల్ ఫండ్స్?",
    success: "అభినందనలు! మీ క్లెయిమ్ విజయవంతంగా నమోదైంది."
  },
  en: {
    welcome: "Hello, I am Varasat Mitra. I will help you recover the assets of your deceased family members.",
    ask_name: "Please state your full name as it appears on your Aadhaar card.",
    ask_deceased: "What was the name of the deceased family member?",
    ask_assets: "What assets did they hold? Bank Deposit, LIC Policy, or Mutual Funds?",
    success: "Congratulations! Your claim has been successfully registered."
  }
};

/**
 * Simulates transcribing audio input from the user (Speech-To-Text)
 * @param {string} base64Audio - Audio recording file
 * @param {string} targetLang - Language code ('hi', 'kn', 'ta', 'te', 'en')
 */
async function speechToText(base64Audio, targetLang = 'en') {
  // Mock STT translation based on common phrases
  const texts = {
    hi: "मेरे पिता रमेश कुमार का बैंक खाता था",
    kn: "ನನ್ನ ತಂದೆ ರಮೇಶ್ ಕುಮಾರ್ ಅವರ ಬ್ಯಾಂಕ್ ಖಾತೆ ಇತ್ತು",
    ta: "என் தந்தை ரமேஷ் குமார் வங்கி கணக்கு வைத்திருந்தார்",
    te: "మా తండ్రి రమేష్ కుమార్ గారి బ్యాంక్ ఖాతా ఉండేది",
    en: "My father Ramesh Kumar had a bank account"
  };

  return {
    transcript: texts[targetLang] || texts['en'],
    language: targetLang,
    confidence: 0.96
  };
}

/**
 * Translates input text into the target Indian language using Bhashini
 */
async function translateText(text, sourceLang = 'en', targetLang = 'hi') {
  // Check mock database translations
  const langPack = translations[targetLang];
  if (langPack) {
    // Basic pattern matcher for demo
    if (text.toLowerCase().includes('welcome')) return langPack.welcome;
    if (text.toLowerCase().includes('name')) return langPack.ask_name;
    if (text.toLowerCase().includes('deceased')) return langPack.ask_deceased;
    if (text.toLowerCase().includes('assets')) return langPack.ask_assets;
    if (text.toLowerCase().includes('congratulations')) return langPack.success;
  }
  
  // Return input if translation dictionary does not hit, simulating standard translation
  return `[Translated to ${targetLang}]: ${text}`;
}

/**
 * Simulates Text-To-Speech (TTS) generating an audio playback link
 */
async function textToSpeech(text, targetLang = 'en') {
  // Returns a mock audio response payload
  return {
    audioUrl: `/audio/mock_${targetLang}_speech.mp3`,
    text: text,
    language: targetLang
  };
}

module.exports = {
  speechToText,
  translateText,
  textToSpeech
};
