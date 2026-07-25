export type SupportedLanguage = 'en' | 'hi' | 'ml';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' }
] as const;

type Translations = {
  [key in SupportedLanguage]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    'home.trigger': 'Get Help Now',
    'home.caregiver': 'Caregiver Mode',
    'home.memory': 'My History',
    'session.placeholder': 'Type your message...',
    'session.send': 'Send',
    'session.listening': 'Listening...',
    'session.speak': 'Tap to Speak',
    'emergency.title': 'Emergency Help Needed',
    'emergency.desc': 'We detected that you might be in immediate danger. Please contact professional help immediately.',
    'emergency.call': 'Call Emergency Hotline (911)',
    'emergency.back': 'I am safe, return to session',
    'caregiver.title': 'Caregiver Guidance',
    'caregiver.desc': 'Describe the situation and get suggested calming scripts and next actions.',
    'caregiver.submit': 'Get Guidance',
    'caregiver.placeholder': 'E.g., He is very agitated and wants to drink...',
    'home.mood.title': 'How are you feeling today?',
    'home.mood.great': 'Great',
    'home.mood.okay': 'Okay',
    'home.mood.struggling': 'Struggling',
    'home.resources.title': 'Helpful Resources',
    'home.resources.mindfulness': 'Mindfulness Exercises',
    'home.resources.cbt': 'CBT Techniques',
    'memory.plan.button': 'Generate Recovery Plan',
    'memory.plan.title': 'Personalized Plan',
  },
  hi: {
    'home.trigger': 'अभी मदद लें',
    'home.caregiver': 'देखभाल मोड',
    'home.memory': 'मेरा इतिहास',
    'session.placeholder': 'अपना संदेश टाइप करें...',
    'session.send': 'भेजें',
    'session.listening': 'सुन रहा हूँ...',
    'session.speak': 'बोलने के लिए टैप करें',
    'emergency.title': 'आपातकालीन सहायता की आवश्यकता है',
    'emergency.desc': 'हमने पाया है कि आप तत्काल खतरे में हो सकते हैं। कृपया तुरंत पेशेवर मदद से संपर्क करें।',
    'emergency.call': 'आपातकालीन हॉटलाइन पर कॉल करें',
    'emergency.back': 'मैं सुरक्षित हूँ, वापस जाएँ',
    'caregiver.title': 'देखभाल मार्गदर्शन',
    'caregiver.desc': 'स्थिति का वर्णन करें और शांत करने वाले सुझाव प्राप्त करें।',
    'caregiver.submit': 'मार्गदर्शन प्राप्त करें',
    'caregiver.placeholder': 'उदाहरण के लिए, वह बहुत उत्तेजित है...',
    'home.mood.title': 'आज आप कैसा महसूस कर रहे हैं?',
    'home.mood.great': 'बहुत अच्छा',
    'home.mood.okay': 'ठीक है',
    'home.mood.struggling': 'संघर्ष कर रहा हूँ',
    'home.resources.title': 'उपयोगी संसाधन',
    'home.resources.mindfulness': 'माइंडफुलनेस व्यायाम',
    'home.resources.cbt': 'सीबीटी तकनीक',
    'memory.plan.button': 'रिकवरी योजना बनाएं',
    'memory.plan.title': 'व्यक्तिगत योजना',
  },
  ml: {
    'home.trigger': 'ഇപ്പോൾ സഹായം നേടുക',
    'home.caregiver': 'പരിചരണ മോഡ്',
    'home.memory': 'എന്റെ ചരിത്രം',
    'session.placeholder': 'നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക...',
    'session.send': 'അയക്കുക',
    'session.listening': 'കേൾക്കുന്നു...',
    'session.speak': 'സംസാരിക്കാൻ ടാപ്പുചെയ്യുക',
    'emergency.title': 'അടിയന്തര സഹായം ആവശ്യമാണ്',
    'emergency.desc': 'നിങ്ങൾ അപകടത്തിലാണെന്ന് ഞങ്ങൾ കണ്ടെത്തി. ദയവായി ഉടൻ തന്നെ പ്രൊഫഷണൽ സഹായം തേടുക.',
    'emergency.call': 'എമർജൻസി നമ്പറിൽ വിളിക്കുക',
    'emergency.back': 'ഞാൻ സുരക്ഷിതനാണ്, തിരികെ പോകുക',
    'caregiver.title': 'പരിചരണ മാർഗ്ഗനിർദ്ദേശം',
    'caregiver.desc': 'സാഹചര്യം വിവരിക്കുകയും നിർദ്ദേശങ്ങൾ നേടുകയും ചെയ്യുക.',
    'caregiver.submit': 'നിർദ്ദേശം നേടുക',
    'caregiver.placeholder': 'ഉദാഹരണത്തിന്, അയാൾ വളരെ അസ്വസ്ഥനാണ്...',
    'home.mood.title': 'നിങ്ങൾക്ക് ഇന്ന് എങ്ങനെയുണ്ട്?',
    'home.mood.great': 'വളരെ നല്ലത്',
    'home.mood.okay': 'കുഴപ്പമില്ല',
    'home.mood.struggling': 'ബുദ്ധിമുട്ടുന്നു',
    'home.resources.title': 'സഹായകരമായ ഉറവിടങ്ങൾ',
    'home.resources.mindfulness': 'മൈൻഡ്ഫുൾനെസ് വ്യായാമങ്ങൾ',
    'home.resources.cbt': 'സിബിടി സാങ്കേതികവിദ്യകൾ',
    'memory.plan.button': 'വീണ്ടെടുക്കൽ പ്ലാൻ സൃഷ്ടിക്കുക',
    'memory.plan.title': 'വ്യക്തിഗതമാക്കിയ പ്ലാൻ',
  }
};

export function t(key: string, lang: SupportedLanguage): string {
  return translations[lang][key] || key;
}
