/**
 * VoteWise India — Static Election Data
 * Comprehensive election education content for Indian voters
 */

/** Voting process steps — used in VotingSimulator */
export const VOTING_STEPS = [
  {
    id: 1,
    title: "Check Your Eligibility",
    titleHi: "अपनी पात्रता जांचें",
    description: "You must be an Indian citizen aged 18 or above on the qualifying date. You should not be disqualified under any law and must be of sound mind.",
    descriptionHi: "आपको भारतीय नागरिक होना चाहिए, योग्यता तिथि पर 18 वर्ष या उससे अधिक आयु का होना चाहिए।",
    icon: "👤",
    tip: "The qualifying date is January 1 of the year of electoral roll revision.",
    documents: ["Age proof (Birth certificate, School certificate)", "Address proof (Aadhaar, Utility bill)", "Identity proof (Passport, PAN Card)"],
  },
  {
    id: 2,
    title: "Register as a Voter",
    titleHi: "मतदाता के रूप में पंजीकरण करें",
    description: "Apply for voter registration using Form 6 on the NVSP portal (voters.eci.gov.in) or visit your nearest Electoral Registration Office.",
    descriptionHi: "NVSP पोर्टल पर फॉर्म 6 का उपयोग करके मतदाता पंजीकरण के लिए आवेदन करें।",
    icon: "📝",
    tip: "You can also register through the Voter Helpline App available on Android and iOS.",
    documents: ["Form 6 (filled)", "2 passport-size photos", "Address proof", "Age proof"],
  },
  {
    id: 3,
    title: "Get Your Voter ID (EPIC)",
    titleHi: "अपना वोटर आईडी (EPIC) प्राप्त करें",
    description: "After verification by the BLO (Booth Level Officer), you will receive your EPIC (Electors Photo Identity Card). You can also download the e-EPIC.",
    descriptionHi: "BLO द्वारा सत्यापन के बाद, आपको EPIC कार्ड प्राप्त होगा।",
    icon: "🪪",
    tip: "Download e-EPIC from voters.eci.gov.in for a digital copy on your phone.",
    documents: ["EPIC Card or e-EPIC (digital version)"],
  },
  {
    id: 4,
    title: "Know Your Polling Booth",
    titleHi: "अपना मतदान केंद्र जानें",
    description: "Before election day, find your assigned polling station. Use the ECI website or Voter Helpline App to search by your EPIC number.",
    descriptionHi: "चुनाव के दिन से पहले, अपना निर्धारित मतदान केंद्र खोजें।",
    icon: "📍",
    tip: "Your polling booth is assigned based on your registered address. Check it well in advance!",
    documents: [],
  },
  {
    id: 5,
    title: "Election Day — Arrive & Verify",
    titleHi: "चुनाव का दिन — पहुंचें और सत्यापित करें",
    description: "On election day, go to your polling booth during voting hours (7 AM - 6 PM typically). Carry your Voter ID or any of the 12 approved photo IDs. The polling officer will verify your identity.",
    descriptionHi: "चुनाव के दिन, मतदान समय के दौरान अपने मतदान केंद्र पर जाएं।",
    icon: "🏛️",
    tip: "12 alternate ID documents are accepted: Passport, Driving License, Aadhaar, PAN, etc.",
    documents: ["Voter ID (EPIC)", "Or any of 12 approved photo IDs"],
  },
  {
    id: 6,
    title: "Get Inked & Receive Slip",
    titleHi: "स्याही लगवाएं और पर्ची प्राप्त करें",
    description: "After verification, indelible ink is applied on your left index finger. You receive a voter slip with your serial number to proceed to the EVM.",
    descriptionHi: "सत्यापन के बाद, आपकी बाईं तर्जनी पर अमिट स्याही लगाई जाती है।",
    icon: "✋",
    tip: "The indelible ink prevents duplicate voting and typically lasts 2-4 weeks.",
    documents: [],
  },
  {
    id: 7,
    title: "Cast Your Vote on EVM",
    titleHi: "EVM पर अपना वोट डालें",
    description: "Enter the voting compartment. Press the button next to your chosen candidate's name and symbol on the EVM (Electronic Voting Machine). A beep confirms your vote, and the VVPAT slip is displayed for 7 seconds.",
    descriptionHi: "मतदान कक्ष में प्रवेश करें और EVM पर अपनी पसंद के उम्मीदवार के बटन को दबाएं।",
    icon: "🗳️",
    tip: "NOTA (None of the Above) is the last option if you don't support any candidate.",
    documents: [],
  },
  {
    id: 8,
    title: "VVPAT Verification",
    titleHi: "VVPAT सत्यापन",
    description: "The VVPAT (Voter Verifiable Paper Audit Trail) displays a printed slip showing the candidate you voted for. Verify it matches your choice. The slip is visible for 7 seconds before dropping into a sealed box.",
    descriptionHi: "VVPAT एक मुद्रित पर्ची दिखाता है जो आपके चुने हुए उम्मीदवार को दर्शाती है।",
    icon: "✅",
    tip: "If the VVPAT slip doesn't match your vote, immediately inform the Presiding Officer.",
    documents: [],
  },
];

/** Key election concepts — used in KnowledgeCards */
export const ELECTION_CONCEPTS = [
  {
    id: "evm",
    title: "Electronic Voting Machine (EVM)",
    titleHi: "इलेक्ट्रॉनिक वोटिंग मशीन",
    category: "Technology",
    description: "EVMs are used in Indian elections since 1982. They consist of a Control Unit and a Ballot Unit. The machine can record up to 64 candidates and runs on a single battery, making it usable in remote areas.",
    facts: ["First used in 1982 in Kerala", "Cannot be hacked — standalone, no network", "Records up to 3,840 votes", "Battery operated — works without electricity"],
  },
  {
    id: "vvpat",
    title: "VVPAT",
    titleHi: "वोटर वेरिफिएबल पेपर ऑडिट ट्रेल",
    category: "Technology",
    description: "Voter Verifiable Paper Audit Trail is an independent system attached to the EVM that allows voters to verify their vote. A printed slip is displayed for 7 seconds showing the candidate and symbol.",
    facts: ["Introduced in 2013", "Mandatory since 2019 general elections", "Slip visible for 7 seconds", "5 random VVPAT verifications per constituency"],
  },
  {
    id: "nota",
    title: "NOTA (None of the Above)",
    titleHi: "नोटा (इनमें से कोई नहीं)",
    category: "Rights",
    description: "NOTA allows voters to officially reject all candidates. It was introduced by the Supreme Court in 2013 (PUCL vs Union of India). While NOTA votes are counted, they don't currently affect the result.",
    facts: ["SC ruling in September 2013", "Placed last on the ballot", "Does not invalidate election if NOTA wins majority", "Over 1.5 crore NOTA votes in 2019"],
  },
  {
    id: "mcc",
    title: "Model Code of Conduct (MCC)",
    titleHi: "आदर्श आचार संहिता",
    category: "Rules",
    description: "The MCC is a set of guidelines issued by the ECI for political parties and candidates to ensure free and fair elections. It comes into effect from the date of election announcement.",
    facts: ["Governs conduct of parties & candidates", "Restricts use of government machinery", "Controls election spending", "Monitored by ECI observers"],
  },
  {
    id: "eci",
    title: "Election Commission of India",
    titleHi: "भारत निर्वाचन आयोग",
    category: "Institution",
    description: "The ECI is an autonomous constitutional body responsible for conducting elections in India. Established on January 25, 1950, it ensures free and fair elections at all levels.",
    facts: ["Established: January 25, 1950", "Constitutional body under Article 324", "Headed by Chief Election Commissioner", "Conducts Lok Sabha, Rajya Sabha, State Assembly, and Presidential elections"],
  },
  {
    id: "fptp",
    title: "First Past the Post (FPTP)",
    titleHi: "सबसे अधिक मत प्राप्त करने वाला जीतता है",
    category: "System",
    description: "India uses the FPTP electoral system where the candidate with the highest number of votes in a constituency wins. No minimum vote percentage is required — a simple plurality is sufficient.",
    facts: ["Used for Lok Sabha & State Assembly elections", "543 constituencies in Lok Sabha", "Simple majority wins", "Different from proportional representation"],
  },
  {
    id: "postal",
    title: "Postal Ballot",
    titleHi: "डाक मतपत्र",
    category: "Methods",
    description: "Certain categories of voters can vote via postal ballot instead of visiting the polling booth. This includes service voters (armed forces), election duty personnel, and voters above 80 years of age.",
    facts: ["For armed forces personnel", "Voters above 80 years eligible", "PwD voters can opt for postal ballot", "Electronically Transmitted Postal Ballot System (ETPBS) for service voters"],
  },
  {
    id: "delimitation",
    title: "Delimitation",
    titleHi: "परिसीमन",
    category: "Process",
    description: "Delimitation is the process of fixing boundaries of constituencies for elections. The Delimitation Commission is appointed by the President and works with the ECI to ensure fair representation based on population.",
    facts: ["Done by Delimitation Commission", "Based on latest Census data", "Cannot be challenged in court", "Last major delimitation in 2008"],
  },
];

/** Voter registration checklist */
export const VOTER_CHECKLIST = [
  { id: 1, text: "I am an Indian citizen", textHi: "मैं भारतीय नागरिक हूं", required: true },
  { id: 2, text: "I am 18 years or older (as of Jan 1 of current year)", textHi: "मैं 18 वर्ष या उससे अधिक उम्र का हूं", required: true },
  { id: 3, text: "I have valid address proof", textHi: "मेरे पास वैध पता प्रमाण है", required: true },
  { id: 4, text: "I have valid age proof", textHi: "मेरे पास वैध आयु प्रमाण है", required: true },
  { id: 5, text: "I have 2 passport-size photographs", textHi: "मेरे पास 2 पासपोर्ट साइज फोटो हैं", required: true },
  { id: 6, text: "I have filled Form 6 online/offline", textHi: "मैंने फॉर्म 6 भरा है", required: true },
  { id: 7, text: "I know my polling booth location", textHi: "मुझे अपने मतदान केंद्र का पता है", required: false },
  { id: 8, text: "I have downloaded the Voter Helpline App", textHi: "मैंने वोटर हेल्पलाइन ऐप डाउनलोड किया है", required: false },
];

/** Election timeline phases */
export const ELECTION_PHASES = [
  {
    id: 1,
    phase: "Announcement",
    phaseHi: "घोषणा",
    description: "ECI announces election dates, MCC comes into effect",
    icon: "📢",
    details: "The Election Commission announces the schedule including dates for nomination filing, scrutiny, withdrawal, and polling for each phase.",
  },
  {
    id: 2,
    phase: "Nomination",
    phaseHi: "नामांकन",
    description: "Candidates file nominations with returning officers",
    icon: "📋",
    details: "Candidates file their nomination papers along with a security deposit. They must provide details of assets, criminal cases, and educational qualifications.",
  },
  {
    id: 3,
    phase: "Scrutiny",
    phaseHi: "जांच",
    description: "Returning officers verify nomination papers",
    icon: "🔍",
    details: "The Returning Officer examines all nomination papers to ensure they meet requirements. Invalid nominations are rejected.",
  },
  {
    id: 4,
    phase: "Withdrawal",
    phaseHi: "नाम वापसी",
    description: "Last date for candidates to withdraw from election",
    icon: "↩️",
    details: "Candidates have until this date to withdraw their candidature. After this, the final list of contesting candidates is published.",
  },
  {
    id: 5,
    phase: "Campaigning",
    phaseHi: "प्रचार",
    description: "Political campaigns, rallies, and door-to-door outreach",
    icon: "📣",
    details: "Parties and candidates campaign through rallies, advertisements, social media, and door-to-door canvassing. Campaign must stop 48 hours before polling.",
  },
  {
    id: 6,
    phase: "Silence Period",
    phaseHi: "मौन अवधि",
    description: "48-hour campaign ban before polling day",
    icon: "🤫",
    details: "No campaigning allowed 48 hours before polling. This gives voters time to reflect on their choices without external influence.",
  },
  {
    id: 7,
    phase: "Polling Day",
    phaseHi: "मतदान दिवस",
    description: "Voters cast their votes at assigned polling stations",
    icon: "🗳️",
    details: "Voters go to their assigned polling booths to cast their vote. Polling typically happens from 7 AM to 6 PM. It's a public holiday.",
  },
  {
    id: 8,
    phase: "Counting & Results",
    phaseHi: "मतगणना और परिणाम",
    description: "Votes are counted and results declared",
    icon: "📊",
    details: "EVM votes are counted at designated counting centers. VVPAT slips from 5 random booths per constituency are matched. Results are declared progressively.",
  },
];

/** Important election links */
export const IMPORTANT_LINKS = [
  { title: "Election Commission of India", url: "https://eci.gov.in", icon: "🏛️" },
  { title: "National Voters' Service Portal", url: "https://voters.eci.gov.in", icon: "📝" },
  { title: "Voter Helpline App", url: "https://play.google.com/store/apps/details?id=com.eci.citizen", icon: "📱" },
  { title: "Know Your Candidate", url: "https://affidavit.eci.gov.in", icon: "👤" },
  { title: "Check Voter Registration", url: "https://voters.eci.gov.in/search", icon: "🔍" },
];

/** Quiz questions — base set, AI generates more */
export const BASE_QUIZ_QUESTIONS = [
  {
    question: "What is the minimum voting age in India?",
    questionHi: "भारत में मतदान की न्यूनतम आयु क्या है?",
    options: ["16 years", "18 years", "21 years", "25 years"],
    correct: 1,
    explanation: "Article 326 of the Indian Constitution sets the minimum voting age at 18 years. This was reduced from 21 years by the 61st Amendment Act, 1988.",
  },
  {
    question: "What does EVM stand for?",
    questionHi: "EVM का पूरा नाम क्या है?",
    options: ["Electronic Vote Manager", "Electronic Voting Machine", "Election Verification Module", "Electoral Vote Mechanism"],
    correct: 1,
    explanation: "EVM stands for Electronic Voting Machine, used in Indian elections since 1982.",
  },
  {
    question: "What is NOTA?",
    questionHi: "NOTA क्या है?",
    options: ["A political party", "None of the Above option on ballot", "A type of ballot paper", "An election rule"],
    correct: 1,
    explanation: "NOTA (None of the Above) was introduced by the Supreme Court in 2013, allowing voters to reject all candidates.",
  },
  {
    question: "How long is the VVPAT slip displayed?",
    questionHi: "VVPAT पर्ची कितने समय तक दिखाई जाती है?",
    options: ["3 seconds", "5 seconds", "7 seconds", "10 seconds"],
    correct: 2,
    explanation: "The VVPAT (Voter Verifiable Paper Audit Trail) slip is displayed for 7 seconds before it drops into a sealed box.",
  },
  {
    question: "Which article of the Constitution establishes the Election Commission?",
    questionHi: "संविधान का कौन सा अनुच्छेद चुनाव आयोग की स्थापना करता है?",
    options: ["Article 280", "Article 324", "Article 356", "Article 370"],
    correct: 1,
    explanation: "Article 324 of the Indian Constitution vests the superintendence, direction, and control of elections in the Election Commission of India.",
  },
  {
    question: "How many constituencies are there in the Lok Sabha?",
    questionHi: "लोक सभा में कितने निर्वाचन क्षेत्र हैं?",
    options: ["435", "500", "543", "550"],
    correct: 2,
    explanation: "There are 543 constituencies in the Lok Sabha, each electing one member through direct election.",
  },
  {
    question: "When does the Model Code of Conduct come into effect?",
    questionHi: "आदर्श आचार संहिता कब लागू होती है?",
    options: ["On polling day", "When election dates are announced", "One month before elections", "When nominations start"],
    correct: 1,
    explanation: "The Model Code of Conduct comes into effect immediately when the Election Commission announces the election schedule.",
  },
  {
    question: "How many hours before polling must campaigning stop?",
    questionHi: "मतदान से कितने घंटे पहले प्रचार बंद होना चाहिए?",
    options: ["24 hours", "36 hours", "48 hours", "72 hours"],
    correct: 2,
    explanation: "All election campaigning must cease 48 hours before the polling day. This silent period allows voters to make their decision without influence.",
  },
  {
    question: "Which finger is marked with indelible ink?",
    questionHi: "किस उंगली पर अमिट स्याही लगाई जाती है?",
    options: ["Right index finger", "Left index finger", "Right thumb", "Left thumb"],
    correct: 1,
    explanation: "Indelible ink is applied on the left index finger of the voter after identity verification to prevent duplicate voting.",
  },
  {
    question: "What is the full form of EPIC?",
    questionHi: "EPIC का पूरा नाम क्या है?",
    options: ["Election Photo Identity Card", "Electors Photo Identity Card", "Electoral Permanent Identity Card", "Election Permanent ID Certificate"],
    correct: 1,
    explanation: "EPIC stands for Electors Photo Identity Card, commonly known as Voter ID Card.",
  },
];

/** State & UT data for constituency finder */
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

/** Lok Sabha seats per state */
export const STATE_SEATS = {
  "Uttar Pradesh": 80, "Maharashtra": 48, "West Bengal": 42, "Bihar": 40,
  "Tamil Nadu": 39, "Madhya Pradesh": 29, "Karnataka": 28, "Gujarat": 26,
  "Rajasthan": 25, "Andhra Pradesh": 25, "Odisha": 21, "Kerala": 20,
  "Telangana": 17, "Jharkhand": 14, "Assam": 14, "Punjab": 13,
  "Chhattisgarh": 11, "Haryana": 10, "Delhi": 7, "Jammu & Kashmir": 5,
  "Uttarakhand": 5, "Himachal Pradesh": 4, "Tripura": 2, "Meghalaya": 2,
  "Manipur": 2, "Goa": 2, "Arunachal Pradesh": 2, "Nagaland": 1,
  "Mizoram": 1, "Sikkim": 1, "Andaman & Nicobar Islands": 1,
  "Chandigarh": 1, "Dadra & Nagar Haveli and Daman & Diu": 2,
  "Lakshadweep": 1, "Puducherry": 1, "Ladakh": 1,
};

/** Rajya Sabha seats per state */
export const RAJYA_SABHA_SEATS = {
  "Uttar Pradesh": 31, "Maharashtra": 19, "Tamil Nadu": 18, "Bihar": 16,
  "West Bengal": 16, "Karnataka": 12, "Andhra Pradesh": 11, "Madhya Pradesh": 11,
  "Gujarat": 11, "Odisha": 10, "Rajasthan": 10, "Kerala": 9,
  "Punjab": 7, "Assam": 7, "Telangana": 7, "Jharkhand": 6,
  "Chhattisgarh": 5, "Haryana": 5, "Jammu & Kashmir": 4, "Himachal Pradesh": 3,
  "Uttarakhand": 3, "Delhi": 3, "Tripura": 1, "Meghalaya": 1,
  "Manipur": 1, "Goa": 1, "Arunachal Pradesh": 1, "Nagaland": 1,
  "Mizoram": 1, "Sikkim": 1, "Puducherry": 1
};

/** Vidhan Sabha (State Assembly) seats per state */
export const VIDHAN_SABHA_SEATS = {
  "Uttar Pradesh": 403, "West Bengal": 294, "Maharashtra": 288, "Bihar": 243,
  "Tamil Nadu": 234, "Madhya Pradesh": 230, "Karnataka": 224, "Rajasthan": 200,
  "Gujarat": 182, "Andhra Pradesh": 175, "Odisha": 147, "Kerala": 140,
  "Assam": 126, "Telangana": 119, "Punjab": 117, "Chhattisgarh": 90,
  "Haryana": 90, "Jammu & Kashmir": 90, "Jharkhand": 81, "Uttarakhand": 70,
  "Delhi": 70, "Himachal Pradesh": 68, "Tripura": 60, "Meghalaya": 60,
  "Manipur": 60, "Nagaland": 60, "Arunachal Pradesh": 60, "Mizoram": 40,
  "Goa": 40, "Sikkim": 32, "Puducherry": 30
};
