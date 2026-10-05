import { UserProfile, StartupIdea, MarketResearchData, MarketCompetitor, MarketNewsItem, MarketPricingSignal, MarketLocalCompetitor, MarketSourceItem } from "./src/types";

const SERPAPI_BASE_URL = "https://serpapi.com/search.json";
const REQUEST_TIMEOUT_MS = 12000;

/**
 * Universal blacklist of tech giants and unrelated web platforms that
 * should NEVER be labeled as direct startup competitors.
 */
const MEGA_PLATFORMS_BLACKLIST = new Set([
  "shopify", "alibaba", "tiktok", "etsy", "google", "amazon", "meta",
  "facebook", "instagram", "twitter", "x", "netflix", "apple", "microsoft",
  "walmart", "ebay", "pinterest", "reddit", "wikipedia", "linkedin", "youtube",
  "quora", "glassdoor", "indeed", "wordpress", "wix", "canva", "uber", "airbnb"
]);

/**
 * Domains that host user forums, social media, or encyclopedias.
 * These may contain discussion signals, but are NEVER competitors.
 */
const JUNK_DOMAINS = new Set([
  "trustpilot.com", "yelp.com", "reddit.com", "merriam-webster.com",
  "dictionary.com", "facebook.com", "twitter.com", "x.com", "instagram.com",
  "wikipedia.org", "youtube.com", "tiktok.com", "pinterest.com",
  "linkedin.com", "quora.com", "glassdoor.com", "indeed.com", "github.com",
  "gitlab.com", "stackoverflow.com", "medium.com", "vocal.media", "substack.com"
]);

/**
 * Media, news, and research publishers.
 * Articles from these domains represent general market evidence / sources,
 * and the publisher name must NEVER be labeled as a software competitor.
 */
const MEDIA_PUBLISHER_DOMAINS = new Set([
  "economictimes.indiatimes.com", "timesofindia.indiatimes.com", "forbes.com",
  "investopedia.com", "livemint.com", "techcrunch.com", "moneycontrol.com",
  "cnbctv18.com", "business-standard.com", "thehindu.com", "financialexpress.com",
  "nerdwallet.com", "bankrate.com", "geeksforgeeks.org", "mudrex.com",
  "cleartax.in", "paisabazaar.com", "bankbazaar.com", "trak.in",
  "yourstory.com", "inc42.com", "entrackr.com", "hindustantimes.com",
  "indiatvnews.com", "zeenews.india.com", "businesstoday.in", "thequint.com",
  "outlookindia.com", "reuters.com", "bloomberg.com", "wsj.com", "vitmora.com",
  "glance.com", "fintechdeepak.com"
]);

/**
 * Regex to detect generic listicle or guide headlines.
 */
const ARTICLE_TITLE_REGEX = /^(how\s+to|why\s+|what\s+is\s+|\d+\s+best|top\s+\d+|best\s+\d+|a\s+guide\s+to|understanding\s+|tips\s+for|ways\s+to|thinking\s+of|the\s+\d+|should\s+you|everything\s+you|reasons\s+to|a\s+study\s+on|best\s+monthly\s+expense|discover\s+how|best\s+expense\s+tracker|top\s+picks|top\s+10|top\s+7)/i;

interface VentureContext {
  ventureName: string;
  category: string;
  geography: string;
  gl: string;
  hl: string;
  categoryKeywords: string[];
  problemKeywords: string[];
  audienceKeywords: string[];
  geoKeywords: string[];
  negativeKeywords: string[];
  focusedOrganicQueries: string[];
  newsQuery: string;
  isLocal: boolean;
  isPhysicalProduct: boolean;
}

/**
 * Analyzes the complete startup context to build a rich semantic profile
 * and generate focused search queries.
 */
function extractVentureContext(profile: UserProfile, startup: StartupIdea): VentureContext {
  const corpus = `${startup.startupName || ""} ${startup.idea || ""} ${startup.problemSolved || ""} ${startup.targetUsers || ""} ${startup.revenueModel || ""} ${profile.country || ""}`.toLowerCase();

  // 1. Detect Geography
  let geography = profile.country && profile.country.toLowerCase() !== "unspecified" ? profile.country : "";
  let gl = "us";
  let geoKeywords: string[] = [];

  if (/\b(india|indian|inr|rupee|₹|upi|delhi|mumbai|bangalore|bengaluru|hyderabad|pune)\b/i.test(corpus)) {
    geography = "India";
    gl = "in";
    geoKeywords = ["india", "indian", "inr", "rupee", "₹", "upi", ".in"];
  } else if (/\b(uk|united kingdom|london|england|britain|gbp|£)\b/i.test(corpus)) {
    geography = "United Kingdom";
    gl = "uk";
    geoKeywords = ["uk", "united kingdom", "london", "gbp", "£", ".co.uk"];
  } else if (/\b(us|usa|united states|america|dollar|\$)\b/i.test(corpus)) {
    geography = "United States";
    gl = "us";
    geoKeywords = ["us", "usa", "united states", "dollar", "$"];
  } else if (geography) {
    geoKeywords = [geography.toLowerCase()];
  }

  // 2. Detect Category / Domain
  const isFinance = /\b(budget|budgeting|expense|expenses|spending|money|allowance|upi|personal finance|finance|saving|savings|fintech|pocket money|micro-expense|cashbook|passbook|wallet|investment)\b/i.test(corpus);
  const isEdTech = /\b(edtech|tutor|course|study|exam|curriculum|upskilling|learning platform|lms)\b/i.test(corpus);
  const isHealth = /\b(health|fitness|workout|diet|nutrition|mental health|therapy|clinic|telehealth)\b/i.test(corpus);
  const isB2B = /\b(crm|saas|workflow|invoicing|field service|scheduling|contractor|landscaping|plumbing|inventory)\b/i.test(corpus);

  let category = "Software Application";
  let categoryKeywords: string[] = [];
  let problemKeywords: string[] = [];
  let audienceKeywords: string[] = [];
  let negativeKeywords: string[] = [];
  let focusedOrganicQueries: string[] = [];
  let newsQuery = "";

  if (isFinance) {
    category = "Personal Finance & Budgeting";
    categoryKeywords = [
      "budget", "budgeting", "expense", "expenses", "spending", "money",
      "allowance", "personal finance", "upi", "saving", "savings", "fintech",
      "pocket money", "micro-expense", "finance app", "tracker", "cashbook"
    ];
    problemKeywords = [
      "overspending", "allowance", "pocket money", "upi", "micro-expense",
      "daily expense", "tracking", "sms tracker", "spending habits", "money management",
      "transactions", "cashflow"
    ];
    audienceKeywords = ["student", "students", "college", "young adult", "youth", "campus", "teen", "freshers"];
    negativeKeywords = [
      "shopify", "alibaba", "dropshipping", "ecommerce store", "wholesale",
      "t-shirt", "tiktok", "etsy", "assistant superintendent", "school committee",
      "municipal", "bmc budget", "civil engineering", "rental assistance"
    ];

    if (geography === "India") {
      focusedOrganicQueries = [
        "best expense tracker app for students in India",
        "student budgeting app India UPI",
        "track daily UPI expenses app India"
      ];
      newsQuery = "personal finance budgeting app India UPI";
    } else {
      focusedOrganicQueries = [
        `best expense tracker app for college students ${geography}`.trim(),
        `student budgeting app ${geography}`.trim(),
        `personal finance app track daily expenses ${geography}`.trim()
      ];
      newsQuery = `student budgeting personal finance app ${geography}`.trim();
    }
  } else if (isEdTech) {
    category = "EdTech & Learning";
    categoryKeywords = ["learning", "course", "study", "tutor", "education", "edtech", "student", "curriculum", "skill"];
    problemKeywords = ["exam prep", "learning pace", "tutoring", "homework", "retention"];
    audienceKeywords = ["student", "students", "college", "learners", "kids", "teachers"];
    negativeKeywords = ["shopify", "alibaba", "dropshipping", "wholesale"];
    focusedOrganicQueries = [
      `best learning platform for students ${geography}`.trim(),
      `edtech tools apps ${geography}`.trim()
    ];
    newsQuery = `edtech startup education trends ${geography}`.trim();
  } else if (isHealth) {
    category = "Health & Wellness";
    categoryKeywords = ["health", "fitness", "workout", "wellness", "diet", "nutrition", "mental health", "clinic"];
    problemKeywords = ["weight loss", "anxiety", "habit tracking", "doctor booking", "routine"];
    audienceKeywords = ["patients", "athletes", "adults", "seniors", "professionals"];
    negativeKeywords = ["shopify", "alibaba", "dropshipping"];
    focusedOrganicQueries = [
      `best health fitness app ${geography}`.trim(),
      `wellness digital health platforms ${geography}`.trim()
    ];
    newsQuery = `digital health wellness startup ${geography}`.trim();
  } else if (isB2B) {
    category = "B2B SaaS & Operations";
    categoryKeywords = ["saas", "software", "workflow", "management", "scheduling", "invoicing", "crm", "contractor"];
    problemKeywords = ["scheduling lag", "invoicing delays", "manual paperwork", "client management"];
    audienceKeywords = ["contractors", "small business", "teams", "freelancers", "agencies"];
    negativeKeywords = ["consumer video", "tiktok", "alibaba dropshipping"];
    focusedOrganicQueries = [
      `software platform for ${startup.targetUsers || "businesses"} ${geography}`.trim(),
      `best tools for ${startup.problemSolved ? startup.problemSolved.slice(0, 30) : "workflow"} ${geography}`.trim()
    ];
    newsQuery = `b2b saas software startup ${geography}`.trim();
  } else {
    // Dynamic extraction for arbitrary ventures
    const cleanWords = (startup.idea || "").replace(/[^\w\s]/gi, " ").split(/\s+/).filter(w => w.length > 3).slice(0, 4).join(" ");
    category = "Digital Product";
    categoryKeywords = cleanWords.toLowerCase().split(/\s+/);
    problemKeywords = (startup.problemSolved || "").toLowerCase().replace(/[^\w\s]/gi, " ").split(/\s+/).filter(w => w.length > 3).slice(0, 4);
    audienceKeywords = (startup.targetUsers || "").toLowerCase().replace(/[^\w\s]/gi, " ").split(/\s+/).filter(w => w.length > 3).slice(0, 3);
    negativeKeywords = ["shopify", "alibaba", "dropshipping", "wholesale"];
    focusedOrganicQueries = [
      `best ${cleanWords} software ${geography}`.trim(),
      `${cleanWords} alternatives competitors ${geography}`.trim()
    ];
    newsQuery = `${cleanWords} startup trends ${geography}`.trim();
  }

  // Detect local business or physical product
  const localKeywords = ["local", "neighborhood", "city", "clinic", "restaurant", "store", "salon", "plumbing", "landscaping", "gym", "in-person", "contractor", "maintenance", "trade", "field service"];
  const isLocal = localKeywords.some(kw => corpus.includes(kw));

  const physicalKeywords = ["physical", "hardware", "device", "ecommerce", "e-commerce", "apparel", "wearable", "d2c", "consumer product", "bottle", "gadget", "equipment", "manufacturing"];
  const isPhysicalProduct = physicalKeywords.some(kw => corpus.includes(kw));

  return {
    ventureName: startup.startupName || "Startup",
    category,
    geography,
    gl,
    hl: "en",
    categoryKeywords,
    problemKeywords,
    audienceKeywords,
    geoKeywords,
    negativeKeywords,
    focusedOrganicQueries: focusedOrganicQueries.slice(0, 3),
    newsQuery,
    isLocal,
    isPhysicalProduct
  };
}

/**
 * Execute a single SerpApi request with strict timeout and sanitization.
 */
async function fetchSerpApi(params: Record<string, string>, apiKey: string): Promise<any> {
  const url = new URL(SERPAPI_BASE_URL);
  url.searchParams.set("api_key", apiKey);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      signal: controller.signal,
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`SerpApi HTTP ${response.status}: ${errText.slice(0, 120)}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

function extractDomain(urlStr?: string): string {
  if (!urlStr) return "";
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getBrandNameFromDomain(domain: string): string {
  const parts = domain.split(".");
  const main = parts[0].replace(/[^a-zA-Z0-9]/g, "");
  if (!main) return domain;
  return main.charAt(0).toUpperCase() + main.slice(1);
}

/**
 * Determines whether a URL or title is an article/editorial vs. a direct product homepage/app.
 */
function isArticle(urlStr: string, title: string, domain: string): boolean {
  if (MEDIA_PUBLISHER_DOMAINS.has(domain)) return true;

  try {
    const url = new URL(urlStr);
    const path = url.pathname.toLowerCase();
    const blogPathMarkers = [
      "/blog", "/article", "/post", "/news", "/guide", "/learn",
      "/story", "/stories", "/trends", "/feed", "/tips", "/how-to",
      "/pages/blog", "/category", "/tag"
    ];
    if (blogPathMarkers.some(m => path.includes(m))) return true;
    if (url.hostname.startsWith("blog.") || url.hostname.startsWith("trends.")) return true;
    if (/\/(best|top|\d+)-[\w-]+/.test(path)) return true;
    if (/\/(how|why|what)-[\w-]+/.test(path)) return true;
  } catch {}

  return ARTICLE_TITLE_REGEX.test(title.trim());
}

/**
 * Extract clean product brand from App Store / Google Play links or standard titles.
 */
function cleanProductName(rawTitle: string, domain: string): string {
  if (!rawTitle) return "";
  let name = rawTitle.split(/[-|:–—]/)[0].trim();

  // Strip generic review or ranking prefixes
  name = name.replace(/^(read\s+customer\s+reviews|customer\s+reviews|reviews\s+of)\s+/i, "");
  name = name.replace(/^(\d+\s+best\s+[\w\s]+\s+in\s+\d+|top\s+\d+\s+[\w\s]+)\s*/i, "");
  name = name.replace(/^(best\s+free|best|free)\s+/i, "");
  name = name.replace(/\s+(app\s+store|google\s+play|apk\s+download|official\s+site|website)$/i, "");

  // If domain is Google Play or Apple App Store, clean up title
  if (domain.includes("play.google.com") || domain.includes("apps.apple.com")) {
    const match = rawTitle.match(/([a-zA-Z0-9\s]+)(?:[:–—-]|\s+–)/);
    if (match && match[1] && match[1].trim().length > 2 && match[1].trim().length < 30) {
      return match[1].trim();
    }
  }

  // If title was too generic or descriptive, fallback to domain brand
  if (name.length > 28 || /^(expense\s+tracker|budget\s+app|personal\s+finance|money\s+manager)/i.test(name)) {
    const brand = getBrandNameFromDomain(domain);
    if (brand.length > 2) return brand;
  }

  return name.trim();
}

interface RelevanceResult {
  score: number;
  isDirect: boolean;
  categoryMatches: number;
  rejected: boolean;
  rejectReason?: string;
}

/**
 * Multi-dimensional relevance scoring engine.
 * Validates category match, audience match, problem match, and geography.
 * Strictly penalizes unrelated commercial models (dropshipping, mega platforms).
 */
function scoreCandidate(
  title: string,
  snippet: string,
  domain: string,
  ctx: VentureContext
): RelevanceResult {
  const text = `${title} ${snippet} ${domain}`.toLowerCase();

  // 1. Blacklist check: If it mentions a mega tech giant unrelated to the category
  for (const bad of MEGA_PLATFORMS_BLACKLIST) {
    if (text.includes(bad)) {
      const hasCoreCategory = ctx.categoryKeywords.some(kw => text.includes(kw));
      if (!hasCoreCategory) {
        return { score: 0, isDirect: false, categoryMatches: 0, rejected: true, rejectReason: `Blacklisted platform: ${bad}` };
      }
    }
  }

  // 2. Negative keyword check
  for (const neg of ctx.negativeKeywords) {
    if (text.includes(neg)) {
      return { score: 0, isDirect: false, categoryMatches: 0, rejected: true, rejectReason: `Negative keyword: ${neg}` };
    }
  }

  // 3. Category match count (MUST have at least 1 match)
  let categoryMatches = 0;
  for (const kw of ctx.categoryKeywords) {
    if (text.includes(kw)) categoryMatches++;
  }
  if (categoryMatches === 0) {
    return { score: 0, isDirect: false, categoryMatches: 0, rejected: true, rejectReason: "No category match" };
  }

  // 4. Problem / Feature match count
  let problemMatches = 0;
  for (const kw of ctx.problemKeywords) {
    if (text.includes(kw)) problemMatches++;
  }

  // 5. Target Audience match count
  let audienceMatches = 0;
  for (const kw of ctx.audienceKeywords) {
    if (text.includes(kw)) audienceMatches++;
  }

  // 6. Geography match count
  let geoMatches = 0;
  for (const kw of ctx.geoKeywords) {
    if (text.includes(kw)) geoMatches++;
  }

  // Compute final score (0 - 100)
  let score = Math.min(40, categoryMatches * 15);
  score += Math.min(25, problemMatches * 12);
  score += Math.min(20, audienceMatches * 10);
  score += Math.min(15, geoMatches * 10);

  const isDirect = score >= 55 && geoMatches > 0;
  const rejected = score < 35;

  return {
    score,
    isDirect,
    categoryMatches,
    rejected,
    rejectReason: rejected ? `Low relevance score (${score})` : undefined
  };
}

/**
 * Server-side Market Research Engine.
 * Conducts real-time market grounding using SerpApi with semantic relevance filtering.
 */
export async function conductMarketResearch(
  profile: UserProfile,
  startup: StartupIdea
): Promise<MarketResearchData> {
  const rawKey = process.env.SERPAPI_API_KEY;
  const apiKey = rawKey ? rawKey.trim().replace(/^["']|["']$/g, "") : "";
  const isKeyConfigured = Boolean(apiKey && apiKey.length > 0);

  console.log(`[MarketResearch] SERPAPI_API_KEY configured: ${isKeyConfigured}`);

  if (!isKeyConfigured) {
    console.warn("[MarketResearch] SERPAPI_API_KEY not configured. Falling back gracefully to pure model synthesis.");
    return {
      enabled: false,
      limitations: [
        "Live web research was bypassed because SERPAPI_API_KEY is not configured on the server.",
        "Analysis generated using foundation model knowledge benchmarks."
      ]
    };
  }

  const ctx = extractVentureContext(profile, startup);
  const executedQueries: string[] = [];

  const directCompetitors: MarketCompetitor[] = [];
  const alternatives: Array<{ title: string; link?: string; snippet?: string }> = [];
  const news: MarketNewsItem[] = [];
  const pricingSignals: MarketPricingSignal[] = [];
  const localCompetitors: MarketLocalCompetitor[] = [];
  const sources: MarketSourceItem[] = [];
  const rawKeySignals: Array<{ text: string; score: number }> = [];
  const keySignals: string[] = [];
  const limitations: string[] = [];
  let filteredCount = 0;

  const tasks: Promise<void>[] = [];

  // Known personal finance & fintech apps for extracting verified products from listicles/benchmarks
  const KNOWN_FINTECH_APPS = [
    { name: "Axio (formerly Walnut)", match: /\b(axio|walnut)\b/i, domain: "axio.co.in" },
    { name: "Fold Money", match: /\b(fold\s*money|fold\.money)\b/i, domain: "fold.money" },
    { name: "Jupiter Money", match: /\b(jupiter\s*money|jupiter\.money)\b/i, domain: "jupiter.money" },
    { name: "Mera Kharcha", match: /\b(mera\s*kharcha)\b/i, domain: "merakharcha.in" },
    { name: "PocketClear", match: /\b(pocketclear)\b/i, domain: "pocketclear.app" },
    { name: "EduWallet", match: /\b(eduwallet)\b/i, domain: "lazybyte.in" },
    { name: "Kedil Money", match: /\b(kedil)\b/i, domain: "kedil.money" },
    { name: "Monefy", match: /\b(monefy)\b/i, domain: "monefy.me" },
    { name: "Spendee", match: /\b(spendee)\b/i, domain: "spendee.com" },
    { name: "Money Lover", match: /\b(money\s*lover)\b/i, domain: "moneylover.me" },
    { name: "CashBook", match: /\b(cashbook)\b/i, domain: "cashbook.in" },
    { name: "FamApp (FamPay)", match: /\b(famapp|fampay)\b/i, domain: "famapp.in" },
    { name: "Junio", match: /\b(junio)\b/i, domain: "junio.in" },
    { name: "GPay / PhonePe Built-in Insights", match: /\b(phonepe|google pay|gpay)\b/i, domain: "phonepe.com" }
  ];

  // 1. Google Organic Search Queries
  for (const q of ctx.focusedOrganicQueries) {
    executedQueries.push(q);
    tasks.push(
      fetchSerpApi({ engine: "google", q, gl: ctx.gl, hl: ctx.hl, num: "8" }, apiKey)
        .then(data => {
          if (data?.organic_results && Array.isArray(data.organic_results)) {
            for (const r of data.organic_results) {
              if (!r.title || !r.link) continue;
              const domain = extractDomain(r.link);
              const snippet = r.snippet || "";

              // Skip junk and non-software social media domains
              if (JUNK_DOMAINS.has(domain)) {
                filteredCount++;
                continue;
              }

              // Relevance scoring
              const scoring = scoreCandidate(r.title, snippet, domain, ctx);
              if (scoring.rejected) {
                filteredCount++;
                continue;
              }

              // Always record verified source for citation
              if (!sources.some(s => s.link === r.link)) {
                sources.push({
                  title: r.title,
                  link: r.link,
                  domain,
                  snippet,
                  type: "search"
                });
              }

              // Determine if result is an article/editorial vs dedicated product
              const resultIsArticle = isArticle(r.link, r.title, domain);

              if (resultIsArticle) {
                // Check if the article highlights known products in this domain
                for (const app of KNOWN_FINTECH_APPS) {
                  const combined = `${r.title} ${snippet}`;
                  if (app.match.test(combined) && !directCompetitors.some(c => c.name === app.name)) {
                    directCompetitors.push({
                      name: app.name,
                      domain: app.domain,
                      link: r.link,
                      snippet: `Discovered via industry benchmark in ${domain}: "${snippet.slice(0, 160)}"`,
                      sourceType: "Google Search (Market Benchmark)"
                    });
                  }
                }
              } else {
                // Direct product app or website
                const cleanName = cleanProductName(r.title, domain);
                const lowerName = cleanName.toLowerCase();

                if (!cleanName || MEGA_PLATFORMS_BLACKLIST.has(lowerName)) {
                  filteredCount++;
                  continue;
                }

                if (!directCompetitors.some(c => c.name.toLowerCase() === lowerName || c.domain === domain)) {
                  if (scoring.isDirect) {
                    directCompetitors.push({
                      name: cleanName,
                      link: r.link,
                      domain,
                      snippet,
                      sourceType: "Google Search (Direct Product)"
                    });
                  } else {
                    alternatives.push({
                      title: cleanName,
                      link: r.link,
                      snippet
                    });
                  }
                }
              }
            }
          }

          // Parse and score customer questions
          if (data?.related_questions && Array.isArray(data.related_questions)) {
            for (const qItem of data.related_questions) {
              const qText = qItem.question || "";
              const lowerQ = qText.toLowerCase();

              // Require direct match to category keywords
              const isRel = ctx.categoryKeywords.some(kw => lowerQ.includes(kw)) &&
                !ctx.negativeKeywords.some(neg => lowerQ.includes(neg)) &&
                !MEGA_PLATFORMS_BLACKLIST.has(lowerQ);

              if (isRel) {
                let qScore = 1;
                // Boost score if question addresses target audience or core problem
                if (ctx.audienceKeywords.some(kw => lowerQ.includes(kw))) qScore += 2;
                if (ctx.problemKeywords.some(kw => lowerQ.includes(kw))) qScore += 2;
                if (ctx.geoKeywords.some(kw => lowerQ.includes(kw))) qScore += 1;

                if (!rawKeySignals.some(s => s.text === qText)) {
                  rawKeySignals.push({ text: qText, score: qScore });
                }
              }
            }
          }
        })
        .catch(err => {
          const isTimeout = err?.name === "AbortError" || err?.message?.includes("aborted");
          console.warn(`[MarketResearch] Organic query error ("${q}"):`, isTimeout ? "Request timed out" : (err?.message || err));
          limitations.push(`Query "${q}" encountered a temporary network delay.`);
        })
    );
  }

  // 2. Google News Queries (Industry news & regulatory updates)
  if (ctx.newsQuery) {
    executedQueries.push(`[News] ${ctx.newsQuery}`);
    tasks.push(
      fetchSerpApi({ engine: "google_news", q: ctx.newsQuery, gl: ctx.gl, hl: ctx.hl, num: "8" }, apiKey)
        .then(data => {
          const newsResults = data?.news_results || [];
          if (Array.isArray(newsResults)) {
            for (const item of newsResults) {
              if (!item.title) continue;
              const titleText = item.title.toLowerCase();
              const snippetText = (item.snippet || "").toLowerCase();
              const combined = `${titleText} ${snippetText}`;

              // Ensure news is strictly relevant to the category
              const isRel = ctx.categoryKeywords.some(kw => combined.includes(kw));
              const isNegative = ctx.negativeKeywords.some(neg => combined.includes(neg));
              if (!isRel || isNegative) continue;

              const sourceName = typeof item.source === "object" ? item.source?.name : String(item.source || "News Source");
              const link = item.link || "";
              const domain = extractDomain(link);

              if (!news.some(n => n.title === item.title)) {
                news.push({
                  title: item.title,
                  source: sourceName,
                  link,
                  date: item.date || undefined,
                  snippet: item.snippet || undefined
                });

                if (link && !sources.some(s => s.link === link)) {
                  sources.push({
                    title: item.title,
                    link,
                    domain: domain || sourceName,
                    snippet: item.snippet,
                    type: "news"
                  });
                }
              }
            }
          }
        })
        .catch(err => {
          console.warn("[MarketResearch] News search query error:", err.message || err);
          limitations.push("Recent industry news lookup encountered a temporary network timeout.");
        })
    );
  }

  // 3. Conditional Google Shopping Queries (for physical products only)
  if (ctx.isPhysicalProduct) {
    const shopQ = `${ctx.ventureName} ${ctx.category} price buy`;
    executedQueries.push(`[Shopping] ${shopQ}`);
    tasks.push(
      fetchSerpApi({ engine: "google_shopping", q: shopQ, gl: ctx.gl, hl: ctx.hl, num: "4" }, apiKey)
        .then(data => {
          const shoppingResults = data?.shopping_results || [];
          if (Array.isArray(shoppingResults)) {
            for (const p of shoppingResults.slice(0, 4)) {
              if (!p.title) continue;
              pricingSignals.push({
                title: p.title,
                price: p.price || undefined,
                merchant: p.source || undefined,
                link: p.link || undefined
              });
              if (p.link && !sources.some(s => s.link === p.link)) {
                sources.push({
                  title: p.title,
                  link: p.link,
                  domain: extractDomain(p.link) || p.source || "Merchant",
                  type: "shopping"
                });
              }
            }
          }
        })
        .catch(err => {
          console.warn("[MarketResearch] Shopping query error:", err.message || err);
        })
    );
  }

  // 4. Conditional Google Maps Queries (for local service startups only)
  if (ctx.isLocal) {
    const mapQ = `${ctx.category} ${ctx.geography} local`;
    executedQueries.push(`[Maps] ${mapQ}`);
    tasks.push(
      fetchSerpApi({ engine: "google_maps", q: mapQ, type: "search", num: "4" }, apiKey)
        .then(data => {
          const localResults = data?.local_results || [];
          if (Array.isArray(localResults)) {
            for (const loc of localResults.slice(0, 4)) {
              if (!loc.title) continue;
              localCompetitors.push({
                name: loc.title,
                address: loc.address || undefined,
                rating: typeof loc.rating === "number" ? loc.rating : undefined,
                reviews: typeof loc.reviews === "number" ? loc.reviews : undefined,
                link: loc.website || loc.link || undefined
              });
              if (loc.website && !sources.some(s => s.link === loc.website)) {
                sources.push({
                  title: `${loc.title} (Local Provider)`,
                  link: loc.website,
                  domain: extractDomain(loc.website),
                  type: "local"
                });
              }
            }
          }
        })
        .catch(err => {
          console.warn("[MarketResearch] Maps query error:", err.message || err);
        })
    );
  }

  // Wait for all planned queries concurrently
  await Promise.allSettled(tasks);

  // Rank customer questions by relevance score
  rawKeySignals.sort((a, b) => b.score - a.score);
  const prioritizedQuestions = rawKeySignals.slice(0, 5).map(s => `Customer Concern: "${s.text}"`);

  // Derive top competitor names for key signals
  if (directCompetitors.length > 0) {
    const topCompetitorNames = directCompetitors.slice(0, 4).map(c => c.name).join(", ");
    keySignals.push(`Incumbent Market Competitors: ${topCompetitorNames}`);
  } else {
    limitations.push("No direct incumbent software matches this exact narrow niche; broader market alternatives and verified evidence sources are highlighted.");
  }
  keySignals.push(...prioritizedQuestions);

  if (filteredCount > 0) {
    limitations.push(`Filtered out ${filteredCount} generic web pages, e-commerce stores, and unrelated tech platforms to guarantee relevance to ${ctx.category}.`);
  }

  const hasSuccessfulData = directCompetitors.length > 0 || news.length > 0 || sources.length > 0;

  if (!hasSuccessfulData && limitations.length > 0) {
    return {
      enabled: false,
      queries: executedQueries,
      limitations: [
        "Live market research queries failed to return usable results. Falling back to foundation model reasoning.",
        ...limitations
      ]
    };
  }

  return {
    enabled: true,
    searchedAt: new Date().toISOString(),
    queries: executedQueries,
    competitors: directCompetitors.slice(0, 6),
    alternatives: alternatives.slice(0, 4),
    news: news.slice(0, 5),
    pricingSignals: pricingSignals.slice(0, 4),
    localCompetitors: localCompetitors.slice(0, 4),
    sources: sources.slice(0, 8),
    keySignals: keySignals.slice(0, 6),
    limitations: limitations.length > 0 ? limitations : [
      "SerpApi web results represent a snapshot of indexed public web data.",
      "Private stealth ventures and unreleased apps may not appear in public search indexes."
    ]
  };
}
