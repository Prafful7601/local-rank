// ─── Seeded RNG ───────────────────────────────────────────────
function seededRandom(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = ((s << 5) - s + seed.charCodeAt(i)) | 0;
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function pickN(arr, n, rng) {
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, n);
}

// ─── Constants ────────────────────────────────────────────────
export const NICHES = [
  "Plumbing", "HVAC", "Electrical", "Roofing", "Landscaping",
  "Dental", "Chiropractic", "Auto Repair", "Physical Therapy",
];

const COMPETITOR_PREFIXES = {
  Plumbing:          ["Premier","FastFlow","Pro","Elite","Reliable","Capital","Metro","AllStar","Rapid","Superior"],
  HVAC:              ["CoolBreeze","AirPro","Climate","Arctic","Comfort","TempRight","AllSeason","PureAir","ChillMaster","HeatWave"],
  Electrical:        ["BrightWire","PowerPro","SparkMaster","VoltEdge","CurrentFlow","LiveWire","CircuitPro","AmpUp","PrimeElectric","TrueVolt"],
  Dental:            ["Bright Smile","Pearl","Summit","Gentle Care","Family First","Radiant","ClearView","Premier","Sunshine","HealthySmile"],
  Roofing:           ["TopShield","StormGuard","SkyLine","PeakPro","SolidRoof","IronClad","ApexRoof","TrueTop","ShieldPro","CrownRoof"],
  Landscaping:       ["GreenScape","NaturePro","LeafMaster","PrimeLawn","EverGreen","TerraPro","BloomCraft","FreshCut","VerdantPro","EdenScape"],
  Chiropractic:      ["SpineAlign","CoreHealth","BackBalance","FlexLife","AlignWell","PureMotion","BodyWorks","VitalSpine","ActiveAlign","WellAdjusted"],
  "Auto Repair":     ["FastLane","PrecisionAuto","TrueWrench","MotorPro","DriveRight","AutoCare","GearHead","PeakAuto","TrustMech","SpeedWorks"],
  "Physical Therapy":["MoveWell","ActiveLife","FlexPoint","MotionPro","RecoverRight","PeakPhysio","BodyBalance","VitalStep","CoreMotion","AgileRehab"],
  default:           ["Premier","Elite","ProService","TopChoice","TrustWorthy","AllStar","NextLevel","PrimePick","BestLocal","GoldStar"],
};

const NICHE_SUFFIXES = {
  Plumbing:          ["Plumbing","Plumbing Co","Pipe & Drain","Plumbing Services","Plumbers"],
  HVAC:              ["HVAC","Heating & Air","Climate Control","AC Services","Heating & Cooling"],
  Electrical:        ["Electric","Electrical Services","Electric Co","Electricians","Power Solutions"],
  Dental:            ["Dental","Dentistry","Dental Care","Dental Group","Dental Studio"],
  Roofing:           ["Roofing","Roof & Repair","Roofing Co","Roofing Solutions","Roofing Pros"],
  Landscaping:       ["Landscaping","Lawn Care","Landscape Design","Yard Services","Outdoor Living"],
  Chiropractic:      ["Chiropractic","Chiro Center","Wellness Center","Spinal Care","Health Center"],
  "Auto Repair":     ["Auto Repair","Auto Service","Car Care","Automotive","Auto Shop"],
  "Physical Therapy":["Physical Therapy","PT Center","Rehabilitation","Therapy Center","Movement Clinic"],
  default:           ["Services","Solutions","Pros","Experts","Co"],
};

const ISSUE_TEMPLATES = [
  { t:"Missing {{n}} relevant business categories",                s:"HIGH",   i:"You're invisible for searches in these categories. Competitors list {{avg}} categories.",                               gen:(r)=>({n:Math.floor(r()*6)+4,avg:Math.floor(r()*5)+9})},
  { t:"Only {{n}} photos uploaded",                                s:"HIGH",   i:"Businesses with 100+ photos get 520% more calls. Your top competitor has {{comp}} photos.",                            gen:(r)=>({n:Math.floor(r()*6)+2,comp:Math.floor(r()*30)+25})},
  { t:"No Google Posts in {{n}}+ days",                            s:"HIGH",   i:"Active posting improves local ranking by up to 14%. {{pct}}% of top competitors post weekly.",                         gen:(r)=>({n:Math.floor(r()*60)+60,pct:Math.floor(r()*20)+60})},
  { t:"Business description is only {{n}} characters",             s:"HIGH",   i:"You have 750 characters available. A complete description with local keywords helps Google match you with searches.",  gen:(r)=>({n:Math.floor(r()*80)+20})},
  { t:"Only {{n}} reviews (top competitor has {{comp}})",          s:"MEDIUM", i:"Review count is a top-3 local ranking signal. You need a systematic review generation strategy.",                     gen:(r)=>({n:Math.floor(r()*15)+5,comp:Math.floor(r()*70)+50})},
  { t:"Not responding to {{pct}}% of reviews",                     s:"MEDIUM", i:"Google tracks response rate as an engagement signal. Responding to all reviews shows active management.",              gen:(r)=>({pct:Math.floor(r()*40)+50})},
  { t:"No products or services listed in profile",                  s:"MEDIUM", i:"The services section helps Google match your listing with specific search queries like '{{example}}'.",               gen:(r,niche)=>({example:niche.toLowerCase()+" near me"})},
  { t:"Q&A section is empty",                                       s:"MEDIUM", i:"Pre-populating Q&A with common questions improves engagement and provides keyword signals to Google.",                gen:()=>({})},
  { t:"Missing {{n}} business attributes",                          s:"MEDIUM", i:"Attributes help you show up in filtered searches. Competitors average {{avg}} attributes.",                           gen:(r)=>({n:Math.floor(r()*8)+4,avg:Math.floor(r()*6)+8})},
  { t:"Holiday hours not configured",                               s:"LOW",    i:"Customers may visit or call when you're closed, leading to negative experiences and potentially bad reviews.",        gen:()=>({})},
  { t:"No appointment or booking link set",                         s:"LOW",    i:"A direct booking link removes friction. Competitors with booking links see {{pct}}% more conversions.",               gen:(r)=>({pct:Math.floor(r()*15)+15})},
  { t:"Website UTM tracking not configured",                        s:"LOW",    i:"Without UTM parameters, you can't track which leads come from your Google listing vs other sources.",                gen:()=>({})},
  { t:"Cover photo is low resolution",                              s:"LOW",    i:"Your cover photo is the first thing customers see. A professional, high-res image builds immediate trust.",           gen:()=>({})},
  { t:"Business name doesn't match signage exactly",                s:"LOW",    i:"NAP (Name-Address-Phone) consistency across all platforms is a confirmed ranking factor.",                           gen:()=>({})},
];

const FIX_TEMPLATES = [
  {
    week: "Week 1 — Quick Wins (2 hours total)",
    items: [
      { t:"Add all missing business categories",    d:"Log into Google Business Profile → Edit Profile → Business Category. Add every relevant category for your {{niche}} business. Your competitors in {{city}} list 9-14 categories on average. This takes 10 minutes and has immediate impact." },
      { t:"Write a complete business description",  d:"Go to Edit Profile → Description. Write 500-750 characters describing your services, years in business, service area, and what makes you different. Mention '{{city}}' naturally 2-3 times. Include your main services as keywords." },
      { t:"Set holiday and special hours",          d:"Edit Profile → Hours → Special Hours. Add all upcoming holidays. This prevents customers from showing up when you're closed and protects against negative reviews." },
    ],
  },
  {
    week: "Week 2 — Photos & Media (spread across the week)",
    items: [
      { t:"Upload 20+ high-quality photos",              d:"Take photos of: your team at work (3-5), your equipment or workspace (3-5), completed jobs showing results (10+), and your storefront (2-3). Name files descriptively: '{{niche_lower}}-{{city_lower}}.jpg'. Google reads filenames." },
      { t:"Add a professional cover photo and logo",     d:"Your cover photo is the first thing customers see on your listing. Use a high-res image (1024x576px minimum) that represents your {{niche}} business. Upload your logo separately." },
    ],
  },
  {
    week: "Week 3-4 — Reviews & Activity",
    items: [
      { t:"Start a review collection system",    d:"After each completed job, send a text or email: 'Thanks for choosing us! If you were happy with our work, a Google review helps other people in {{city}} find us: [your review link]'. Aim for 5-10 new reviews per month." },
      { t:"Post to Google weekly",               d:"Every Monday, create a Google Post: share a completed job photo, a seasonal tip, or a special offer. Keep it 150-300 words with a photo. This signals to Google that your business is active and engaged." },
      { t:"Respond to every existing review",    d:"Reply to all reviews — positive and negative. Thank positive reviewers by name. For negative reviews, apologize professionally and offer to resolve the issue offline. Response rate is a ranking signal." },
    ],
  },
  {
    week: "Ongoing — Monthly Maintenance (30 min/month)",
    items: [
      { t:"List all services with descriptions",     d:"Add every {{niche}} service you offer with a description and price range. This helps Google match you with specific searches like '{{niche_lower}} repair near me' or '{{niche_lower}} installation {{city}}'." },
      { t:"Pre-populate your Q&A section",           d:"Add and answer 5-10 common questions: pricing, service area, emergency availability, licensing, insurance, payment methods. This gives Google more keyword content and helps customers find answers instantly." },
    ],
  },
];

// ─── Core Generator ───────────────────────────────────────────
export function generateAudit(business, city, niche) {
  const rng = seededRandom(business + city + niche);
  const score = Math.floor(rng() * 25) + 25;

  const numIssues = 10 + Math.floor(rng() * 4);
  const selectedIssues = pickN(ISSUE_TEMPLATES, numIssues, rng).map(tmpl => {
    const vars = tmpl.gen(rng, niche);
    let title = tmpl.t, impact = tmpl.i;
    Object.entries(vars).forEach(([k, v]) => {
      title = title.replaceAll(`{{${k}}}`, v);
      impact = impact.replaceAll(`{{${k}}}`, v);
    });
    return { title, severity: tmpl.s, impact };
  });
  selectedIssues.sort((a, b) => ({ HIGH: 0, MEDIUM: 1, LOW: 2 }[a.severity] - { HIGH: 0, MEDIUM: 1, LOW: 2 }[b.severity]));

  const prefixes = COMPETITOR_PREFIXES[niche] || COMPETITOR_PREFIXES.default;
  const suffixes = NICHE_SUFFIXES[niche] || NICHE_SUFFIXES.default;
  const picked = pickN(prefixes, 4, rng);
  const competitors = [
    { name: business, reviews: Math.floor(rng()*18)+5, rating: (3.8+rng()*0.5).toFixed(1), photos: Math.floor(rng()*6)+2, categories: Math.floor(rng()*3)+3, posts:"None", isYou:true },
    ...picked.map((p, i) => ({
      name: p + " " + suffixes[Math.floor(rng() * suffixes.length)],
      reviews: Math.floor(rng()*60)+30+(3-i)*15,
      rating: (4.2+rng()*0.7).toFixed(1),
      photos: Math.floor(rng()*30)+12+(3-i)*5,
      categories: Math.floor(rng()*5)+7,
      posts: ["Weekly","Monthly","Monthly","Quarterly"][i],
    })),
  ];

  const cityLower = city.toLowerCase()
    .replace(/,?\s*(tx|ca|fl|ny|az|co|ga|nc|oh|pa|il|wa|ma|nj|va|md|or|mn|wi|mo|in|tn|sc|al|la|ky|ok|ct|ia|ms|ar|ks|nv|nm|ne|wv|id|hi|nh|me|ri|mt|de|sd|nd|ak|vt|wy|dc)$/i, "")
    .trim();

  const fixes = FIX_TEMPLATES.map(group => ({
    week: group.week,
    items: group.items.map(item => ({
      title: item.t,
      description: item.d
        .replaceAll("{{niche}}", niche)
        .replaceAll("{{niche_lower}}", niche.toLowerCase())
        .replaceAll("{{city}}", city)
        .replaceAll("{{city_lower}}", cityLower),
    })),
  }));

  return { business, city, niche, score, issues: selectedIssues, competitors, fixes };
}
