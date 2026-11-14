// =====================
// CONFIGURATION
// =====================
const FB_MESSENGER_LINK = "https://m.me/synt.production";

// Visitor log endpoint (PHP). Kapag walang PHP hosting, tahimik lang itong mabibigo.
const TRACK_URL = "track.php";

const trackSid = (() => {
  try {
    let s = sessionStorage.getItem("zyntSid");
    if (!s) {
      s = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      sessionStorage.setItem("zyntSid", s);
    }
    return s;
  } catch (e) { return "nosession"; }
})();

function trackEvent(type, info = {}) {
  try {
    if (location.protocol === "file:") return;
    if (localStorage.getItem("zyntNoTrack") === "1") return;   // admin browser
    let ref = "";
    try { ref = document.referrer ? new URL(document.referrer).hostname : ""; } catch (e) {}
    const payload = JSON.stringify({
      type,
      sid: trackSid,
      page: info.page || "",
      extra: info.extra || null,
      screen: `${screen.width}x${screen.height}`,
      vp: `${window.innerWidth}x${window.innerHeight}`,
      lang: navigator.language || "",
      tz: (Intl.DateTimeFormat().resolvedOptions().timeZone) || "",
      ref,
      theme: getTheme(),
      touch: (navigator.maxTouchPoints || 0) > 1
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(TRACK_URL, new Blob([payload], { type: "text/plain" }));
    } else {
      fetch(TRACK_URL, { method: "POST", body: payload, keepalive: true }).catch(() => {});
    }
  } catch (e) { /* huwag guluhin ang website kapag may error */ }
}

// =====================
// ACCOUNT PACKAGES
// =====================
const accountPackages = [
  { id:901, name:"CPM Service", price:59,  specs:"Starter Account Deal",   tags:["Top-up","Boost HP", "Customize"],image:"services/CPM1_service.png" },
  { id:902, name:"Set 1 Account",   price:99,  specs:"Standard Account Deal",  tags:["Standard","Popular"],image:"accounts/Set1_account.png" },
  { id:903, name:"Set 2 Account",   price:199, specs:"Advanced Account Deal",  tags:["Advanced","More Features"],image:"accounts/Set2_account.png" },
  { id:904, name:"Set 3 Account",   price:299, specs:"Premium Account Deal",   tags:["Premium","Best Value"],image:"accounts/Set3_account.png" },
  { id:905, name:"Set 4 Account",   price:399, specs:"Elite Account Deal",     tags:["Elite","Full Access"],image:"accounts/Set4_account.png" },
  { id:906, name:"Set 5 Account",   price:99,  specs:"Exlusive Clean Deal",     tags:["Clean","Good formain"],image:"accounts/Set5_account.png"},   
  { id:907, name:"Set 6 Account",   price:99,  specs:"Premium Clean Deal",     tags:["Exclusive","Sulit"],image:"accounts/Set6_account.png"},
  { id:908, name:"Set 7 Account",   price:99,  specs:"Max Vip Deals",     tags:["VIP","Max"],image:"accounts/Set7_account.png" },
];

// =====================
// CPM1 SERVICES  (ids 1001+)  -- palitan ang presyo / pangalan / image ayon sa offer mo
// =====================
const cpm1Services = [
  { id:1001, name:"CPM1 Money Top-up",      price:49, specs:"CPM1 · In-game cash",        tags:["Top-up","Fast"],          image:"services/cpm1_money.png" },
  { id:1002, name:"CPM1 Gold Top-up",       price:79, specs:"CPM1 · In-game gold",        tags:["Top-up","Gold"],          image:"services/cpm1_gold.png" },
  { id:1003, name:"CPM1 Engine & HP Boost", price:59, specs:"CPM1 · Performance tuning",  tags:["Boost HP","Tuning"],      image:"services/cpm1_hp.png" },
  { id:1004, name:"CPM1 Car Customization", price:69, specs:"CPM1 · Paint, wheels & body",tags:["Customize","Livery"],     image:"services/cpm1_custom.png" },
  { id:1005, name:"CPM1 Level Up Boost",    price:89, specs:"CPM1 · Rank & level",        tags:["Level","Boost"],          image:"services/cpm1_level.png" },
  { id:1006, name:"CPM1 Account Recovery",  price:99, specs:"CPM1 · Account help",        tags:["Support","Recovery"],     image:"services/cpm1_recovery.png" },
];

// =====================
// CPM2 SERVICES  (ids 2001+)
// =====================
const cpm2Services = [
  { id:2001, name:"CPM2 Money Top-up",      price:59, specs:"CPM2 · In-game cash",        tags:["Top-up","Fast"],          image:"services/cpm2_money.png" },
  { id:2002, name:"CPM2 Gold Top-up",       price:89, specs:"CPM2 · In-game gold",        tags:["Top-up","Gold"],          image:"services/cpm2_gold.png" },
  { id:2003, name:"CPM2 Engine & HP Boost", price:69, specs:"CPM2 · Performance tuning",  tags:["Boost HP","Tuning"],      image:"services/cpm2_hp.png" },
  { id:2004, name:"CPM2 Car Customization", price:79, specs:"CPM2 · Paint, wheels & body",tags:["Customize","Livery"],     image:"services/cpm2_custom.png" },
  { id:2005, name:"CPM2 Level Up Boost",    price:99, specs:"CPM2 · Rank & level",        tags:["Level","Boost"],          image:"services/cpm2_level.png" },
  { id:2006, name:"CPM2 Account Recovery",  price:109,specs:"CPM2 · Account help",        tags:["Support","Recovery"],     image:"services/cpm2_recovery.png" },
];

// =====================
// ANIME CARS  (ids 3001+, default ₱30)
// 👇 PALITAN ng totoong anime cars mo. Ilagay ang images sa folder na "anime/".
// Pwede kang magdagdag ng price: 50 kung iba ang presyo.
// =====================
const animeCars = [
  { name: "Anime Car Sample 1", specs: "Anime Livery · Itasha", tags: ["Anime", "Itasha"], image: "anime/anime1.png" },
  { name: "Anime Car Sample 2", specs: "Anime Livery · Custom", tags: ["Anime", "Custom"], image: "anime/anime2.png" },
  { name: "Anime Car Sample 3", specs: "Anime Livery · Custom", tags: ["Anime", "Custom"], image: "anime/anime3.png" },
].map((c, i) => ({ id: 3001 + i, price: 30, category: "anime", ...c }));

// =====================
// CAR DATA — All ₱30
// =====================
const cars = [
  // ── NISSAN / DATSUN & 400Z ───────────
  { id: 1,  name: "240z", category: "jdm", price: 30, specs: "Classic JDM · Sports Coupe", tags: ["JDM", "Classic"], image: "cars/240z.png" },
  { id: 2,  name: "400z", category: "sports", price: 30, specs: "Modern Sports Coupe", tags: ["Sports", "Nissan"], image: "cars/400z.png" },
  { id: 3,  name: "400z V1", category: "sports", price: 30, specs: "Custom Variant 1", tags: ["Sports", "Nissan"], image: "cars/400z(1).png" },
  { id: 4,  name: "400z V2", category: "sports", price: 30, specs: "Custom Variant 2", tags: ["Sports", "Nissan"], image: "cars/400z(2).png" },

  // ── ABARTH & ALFA ROMEO ──────────────
  { id: 5,  name: "Abarth", category: "sports", price: 30, specs: "Compact Hot Hatch", tags: ["Sports", "Hatch"], image: "cars/Abarth.png" },
  { id: 6,  name: "Alfa Romeo", category: "luxury", price: 30, specs: "Italian Luxury Sedan", tags: ["Luxury", "Sedan"], image: "cars/Alfa_Romeo.png" },
  { id: 7,  name: "Alfa Romeo Aguila", category: "luxury", price: 30, specs: "Custom Aguila Edition", tags: ["Luxury", "Custom"], image: "cars/Alfa_Romeo_Aguila.png" },

  // ── TOYOTA (Altezza) ─────────────────
  { id: 8,  name: "Altezza", category: "jdm", price: 30, specs: "Sport Sedan · JDM Spec", tags: ["JDM", "Toyota"], image: "cars/Altezza.png" },
  { id: 9,  name: "Altezza V1", category: "jdm", price: 30, specs: "Custom Altezza Variant 1", tags: ["JDM", "Toyota"], image: "cars/Altezza(1).png" },
  { id: 10, name: "Altezza V2", category: "jdm", price: 30, specs: "Custom Altezza Variant 2", tags: ["JDM", "Toyota"], image: "cars/Altezza(2).png" },

  // ── ASTON MARTIN ─────────────────────
  { id: 11, name: "Aston Martin", category: "supercar", price: 30, specs: "British Supercar", tags: ["Supercar", "Luxury"], image: "cars/Aston.png" },
  { id: 12, name: "Aston Martin V1", category: "supercar", price: 30, specs: "Custom Variant 1", tags: ["Supercar", "Luxury"], image: "cars/Aston(1).png" },

  // ── AUDI ─────────────────────────────
  { id: 13, name: "Audi R8", category: "supercar", price: 30, specs: "V10 Supercar", tags: ["Supercar", "Audi"], image: "cars/Audi_R8.png" },
  { id: 14, name: "Audi RS2 Avant", category: "sports", price: 30, specs: "Classic Wagon", tags: ["Wagon", "Audi"], image: "cars/Audi_RS2_Avant.png" },
  { id: 15, name: "Audi RS5", category: "sports", price: 30, specs: "Performance Coupe", tags: ["Sports", "Audi"], image: "cars/Audi_RS5.png" },
  { id: 16, name: "Audi RS6", category: "sports", price: 30, specs: "High Performance Wagon", tags: ["Wagon", "Audi"], image: "cars/Audi_RS6.png" },
  { id: 17, name: "Audi RS6 Avant", category: "sports", price: 30, specs: "Aggressive Wagon Build", tags: ["Wagon", "Audi"], image: "cars/Audi_RS6_Avant.png" },
  { id: 18, name: "Audi RS8", category: "luxury", price: 30, specs: "Executive Luxury Sedan", tags: ["Luxury", "Audi"], image: "cars/Audi_RS8.png" },

  // ── BENTLEY & MERCEDES BENZ ──────────
  { id: 19, name: "Bentley", category: "luxury", price: 30, specs: "Ultra Luxury Cruiser", tags: ["Luxury"], image: "cars/Bentley.png" },
  { id: 20, name: "Bentley V1", category: "luxury", price: 30, specs: "Custom Variant 1", tags: ["Luxury"], image: "cars/Bentley(1).png" },
  { id: 21, name: "Mercedes Benz 6x6", category: "truck", price: 30, specs: "Off-Road Monster Truck", tags: ["Truck", "Benz"], image: "cars/benz_6x6.png" },
  { id: 22, name: "Mercedes Benz C63", category: "sports", price: 30, specs: "AMG Performance Sedan", tags: ["Sports", "Benz"], image: "cars/Benz_c63.png" },
  { id: 23, name: "Mercedes Benz C63 Pro", category: "sports", price: 30, specs: "Custom AMG Setup", tags: ["Sports", "Benz"], image: "cars/Benz_C63.png" },
  { id: 24, name: "Mercedes Benz GT4", category: "supercar", price: 30, specs: "Track Spec GT4", tags: ["Supercar", "Benz"], image: "cars/Benz_GT4.png" },
  { id: 25, name: "Mercedes Benz GT63", category: "sports", price: 30, specs: "Four-Door Coupe", tags: ["Sports", "Benz"], image: "cars/Benz_GT63.png" },
  { id: 26, name: "Mercedes Benz GT63S", category: "sports", price: 30, specs: "Biturbo V8 Performance", tags: ["Sports", "Benz"], image: "cars/Benz_GT63s.png" },
  { id: 27, name: "Mercedes Benz GT63S V1", category: "sports", price: 30, specs: "Custom Variant 1", tags: ["Sports", "Benz"], image: "cars/Benz_GT63s(1).png" },
  { id: 28, name: "Mercedes Benz W124", category: "classic", price: 30, specs: "Classic Benz Sedan", tags: ["Classic", "Benz"], image: "cars/Benz_w124.png" },
  { id: 29, name: "Mercedes Benz W204", category: "sports", price: 30, specs: "Compact Executive", tags: ["Sports", "Benz"], image: "cars/Benz_w204.png" },
  { id: 30, name: "Mercedes Benz W124 Pro", category: "classic", price: 30, specs: "Custom Classic Build", tags: ["Classic", "Benz"], image: "cars/Benz_W124.png" },
  { id: 31, name: "Mercedes Benz W124 V1", category: "classic", price: 30, specs: "Variant 1", tags: ["Classic", "Benz"], image: "cars/Benz_W124(1).png" },
  { id: 32, name: "Mercedes Benz W210", category: "classic", price: 30, specs: "Executive Sedan", tags: ["Classic", "Benz"], image: "cars/Benz_W210.png" },
  { id: 33, name: "Mercedes Benz W221", category: "luxury", price: 30, specs: "S-Class Luxury", tags: ["Luxury", "Benz"], image: "cars/Benz_W221.png" },

  // ── BMW ──────────────────────────────
  { id: 34, name: "BMW 8 Series E31", category: "sports", price: 30, specs: "Classic Grand Tourer", tags: ["Sports", "BMW"], image: "cars/Bmw_8_E31.png" },
  { id: 35, name: "BMW E30", category: "jdm", price: 30, specs: "Classic Euro Drift Spec", tags: ["JDM", "Drift", "BMW"], image: "cars/Bmw_E30.png" },
  { id: 36, name: "BMW E36", category: "jdm", price: 30, specs: "Track Drift Setup", tags: ["JDM", "Drift", "BMW"], image: "cars/Bmw_E36.png" },
  { id: 37, name: "BMW F82", category: "sports", price: 30, specs: "M4 Coupe Generation", tags: ["Sports", "BMW"], image: "cars/Bmw_F82.png" },
  { id: 38, name: "BMW G90", category: "luxury", price: 30, specs: "New Gen M5 Setup", tags: ["Luxury", "BMW"], image: "cars/Bmw_G90.png" },
  { id: 39, name: "BMW G90 V1", category: "luxury", price: 30, specs: "Custom Variant 1", tags: ["Luxury", "BMW"], image: "cars/Bmw_G90(1).png" },
  { id: 40, name: "BMW G90 V2", category: "luxury", price: 30, specs: "Custom Variant 2", tags: ["Luxury", "BMW"], image: "cars/Bmw_G90(2).png" },
  { id: 41, name: "BMW G90 V3", category: "luxury", price: 30, specs: "Custom Variant 3", tags: ["Luxury", "BMW"], image: "cars/Bmw_G90(3).png" },
  { id: 42, name: "BMW i7", category: "luxury", price: 30, specs: "Electric Luxury Flagship", tags: ["Luxury", "Electric"], image: "cars/Bmw_I7.png" },
  { id: 43, name: "BMW i7 V1", category: "luxury", price: 30, specs: "Custom Variant 1", tags: ["Luxury", "Electric"], image: "cars/Bmw_I7(1).png" },
  { id: 44, name: "BMW i7 V2", category: "luxury", price: 30, specs: "Custom Variant 2", tags: ["Luxury", "Electric"], image: "cars/Bmw_I7(2).png" },
  { id: 45, name: "BMW M4 G82", category: "sports", price: 30, specs: "Aggressive Aero Kit", tags: ["Sports", "BMW"], image: "cars/Bmw_m4_G82.png" },
  { id: 46, name: "BMW M4 G82 V1", category: "sports", price: 30, specs: "Custom Variant 1", tags: ["Sports", "BMW"], image: "cars/Bmw_m4_G82(1).png" },
  { id: 47, name: "BMW M2 G82", category: "sports", price: 30, specs: "Compact Powerhouse", tags: ["Sports", "BMW"], image: "cars/Bmw_M2_G82.png" },
  { id: 48, name: "BMW M2 G82 V1", category: "sports", price: 30, specs: "Variant 1", tags: ["Sports", "BMW"], image: "cars/Bmw_M2_G82(1).png" },
  { id: 49, name: "BMW M2 G82 V2", category: "sports", price: 30, specs: "Variant 2", tags: ["Sports", "BMW"], image: "cars/Bmw_M2_G82(2).png" },
  { id: 50, name: "BMW M2 G82 V3", category: "sports", price: 30, specs: "Variant 3", tags: ["Sports", "BMW"], image: "cars/Bmw_M2_G82(3).png" },
  { id: 51, name: "BMW M2 G82 V4", category: "sports", price: 30, specs: "Variant 4", tags: ["Sports", "BMW"], image: "cars/Bmw_M2_G82(4).png" },
  { id: 52, name: "BMW M2 G82 V5", category: "sports", price: 30, specs: "Variant 5", tags: ["Sports", "BMW"], image: "cars/Bmw_M2_G82(5).png" },
  { id: 53, name: "BMW M2 G82 V6", category: "sports", price: 30, specs: "Variant 6", tags: ["Sports", "BMW"], image: "cars/Bmw_M2_G82(6).png" },
  { id: 54, name: "BMW M3 E46", category: "jdm", price: 30, specs: "Legendary E46 M3", tags: ["JDM", "Classic", "BMW"], image: "cars/Bmw_M3_E46.png" },
  { id: 55, name: "BMW M3 G81", category: "sports", price: 30, specs: "Touring Wagon Spec", tags: ["Sports", "Wagon", "BMW"], image: "cars/Bmw_M3_G81.png" },
  { id: 56, name: "BMW M3 G81 V1", category: "sports", price: 30, specs: "Touring Variant 1", tags: ["Sports", "Wagon", "BMW"], image: "cars/Bmw_M3_G81(1).png" },
  { id: 57, name: "BMW M3 G81 V2", category: "sports", price: 30, specs: "Touring Variant 2", tags: ["Sports", "Wagon", "BMW"], image: "cars/Bmw_M3_G81(2).png" },
  { id: 58, name: "BMW M4 F82", category: "sports", price: 30, specs: "M4 Coupe Tune", tags: ["Sports", "BMW"], image: "cars/Bmw_M4_F82.png" },
  { id: 59, name: "BMW M4 F82 V1", category: "sports", price: 30, specs: "M4 Coupe Variant 1", tags: ["Sports", "BMW"], image: "cars/Bmw_M4_F82(1).png" },
  { id: 60, name: "BMW M4 G81", category: "sports", price: 30, specs: "Custom Build", tags: ["Sports", "BMW"], image: "cars/Bmw_M4_G81.png" },
  { id: 61, name: "BMW M5 E28", category: "classic", price: 30, specs: "First Gen M5 Sedan", tags: ["Classic", "BMW"], image: "cars/Bmw_M5_E28.png" },
  { id: 62, name: "BMW M5 E39", category: "classic", price: 30, specs: "V8 Legend E39", tags: ["Classic", "BMW"], image: "cars/Bmw_M5_E39.png" },
  { id: 63, name: "BMW M5 F10", category: "sports", price: 30, specs: "Twin-Turbo V8 Sedan", tags: ["Sports", "BMW"], image: "cars/Bmw_M5_F10.png" },

  // ── SUBARU, BUGATTI & CADILLAC ───────
  { id: 64, name: "Subaru BRZ", category: "jdm", price: 30, specs: "Clean Street Spec", tags: ["JDM", "Subaru"], image: "cars/Brz.png" },
  { id: 65, name: "Bugatti", category: "supercar", price: 30, specs: "Hypercar Speed Spec", tags: ["Supercar", "Bugatti"], image: "cars/Bugatti.png" },
  { id: 66, name: "Cadillac", category: "luxury", price: 30, specs: "Luxury American Sedan", tags: ["Luxury", "Cadillac"], image: "cars/Cadillac.png" },
  { id: 67, name: "Cadillac V1", category: "luxury", price: 30, specs: "Custom Variant 1", tags: ["Luxury", "Cadillac"], image: "cars/Cadillac(1).png" },
  { id: 68, name: "Cadillac Escalade", category: "suv", price: 30, specs: "Full Size Luxury SUV", tags: ["SUV", "Cadillac"], image: "cars/Cadillac_Escalade.png" },
  { id: 69, name: "Cadillac Escalade V1", category: "suv", price: 30, specs: "Custom Escalade Variant", tags: ["SUV", "Cadillac"], image: "cars/Cadillac_Escalade(1).png" },

  // ── DODGE ────────────────────────────
  { id: 70, name: "Dodge Challenger V3", category: "muscle", price: 30, specs: "Widebody Muscle V3", tags: ["Muscle", "Dodge"], image: "cars/Dodge_Challenger(3).png" },
  { id: 71, name: "Dodge Challenger V4", category: "muscle", price: 30, specs: "Drag Setup V4", tags: ["Muscle", "Dodge"], image: "cars/Dodge_Challenger(4).png" },
  { id: 72, name: "Dodge Challenger V5", category: "muscle", price: 30, specs: "Track Spec V5", tags: ["Muscle", "Dodge"], image: "cars/Dodge_Challenger(5).png" },
  { id: 73, name: "Dodge Durango", category: "suv", price: 30, specs: "HEMI Powered SUV", tags: ["SUV", "Dodge"], image: "cars/Dodge_duranggo.png" },
  { id: 74, name: "Dodge SRT", category: "muscle", price: 30, specs: "SRT Performance Build", tags: ["Muscle", "Dodge"], image: "cars/Dodge_Srt.png" },
  { id: 75, name: "Dodge SRT10", category: "truck", price: 30, specs: "V10 Pickup Monster", tags: ["Truck", "Muscle", "Dodge"], image: "cars/Dodge_Srt10.png" },
  { id: 76, name: "Dodge SRT V1", category: "muscle", price: 30, specs: "Variant 1", tags: ["Muscle", "Dodge"], image: "cars/Dodge_Srt(1).png" },
  { id: 77, name: "Dodge SRT V2", category: "muscle", price: 30, specs: "Variant 2", tags: ["Muscle", "Dodge"], image: "cars/Dodge_Srt(2).png" },
  { id: 78, name: "Dodge SRT V3", category: "muscle", price: 30, specs: "Variant 3", tags: ["Muscle", "Dodge"], image: "cars/Dodge_Srt(3).png" },
  { id: 79, name: "Dodge SRT V4", category: "muscle", price: 30, specs: "Variant 4", tags: ["Muscle", "Dodge"], image: "cars/Dodge_Srt(4).png" },
  { id: 80, name: "Dodge SRT V5", category: "muscle", price: 30, specs: "Variant 5", tags: ["Muscle", "Dodge"], image: "cars/Dodge_Srt(5).png" },
  { id: 81, name: "Dodge SRT V6", category: "muscle", price: 30, specs: "Variant 6", tags: ["Muscle", "Dodge"], image: "cars/Dodge_Srt(6).png" },

  // ── FERRARI ──────────────────────────
  { id: 82, name: "Ferrari 250GT", category: "classic", price: 30, specs: "Vintage Italian Masterpiece", tags: ["Classic", "Ferrari"], image: "cars/Ferrari_250GT.png" },
  { id: 83, name: "Ferrari 458", category: "supercar", price: 30, specs: "Italia V8 Supercar", tags: ["Supercar", "Ferrari"], image: "cars/Ferrari_458.png" },
  { id: 84, name: "Ferrari 458 V1", category: "supercar", price: 30, specs: "Variant 1", tags: ["Supercar", "Ferrari"], image: "cars/Ferrari_458(1).png" },
  { id: 85, name: "Ferrari 458 V2", category: "supercar", price: 30, specs: "Variant 2", tags: ["Supercar", "Ferrari"], image: "cars/Ferrari_458(2).png" },
  { id: 86, name: "Ferrari 458 V3", category: "supercar", price: 30, specs: "Variant 3", tags: ["Supercar", "Ferrari"], image: "cars/Ferrari_458(3).png" },
  { id: 87, name: "Ferrari 458 V4", category: "supercar", price: 30, specs: "Variant 4", tags: ["Supercar", "Ferrari"], image: "cars/Ferrari_458(4).png" },
  { id: 88, name: "Ferrari F12", category: "supercar", price: 30, specs: "V12 Grand Tourer", tags: ["Supercar", "Ferrari"], image: "cars/Ferrari_F12.png" },
  { id: 89, name: "Ferrari F12 V1", category: "supercar", price: 30, specs: "Variant 1", tags: ["Supercar", "Ferrari"], image: "cars/Ferrari_F12(1).png" },
  { id: 90, name: "Ferrari F40", category: "supercar", price: 30, specs: "Legendary Twin-Turbo Icon", tags: ["Supercar", "Ferrari"], image: "cars/Ferrari_F40.png" },
  { id: 91, name: "Ferrari F40 V1", category: "supercar", price: 30, specs: "Variant 1", tags: ["Supercar", "Ferrari"], image: "cars/Ferrari_F40(1).png" },
  { id: 92, name: "Ferrari F40 V2", category: "supercar", price: 30, specs: "Variant 2", tags: ["Supercar", "Ferrari"], image: "cars/Ferrari_F40(2).png" },
  { id: 93, name: "Ferrari F40 V3", category: "supercar", price: 30, specs: "Variant 3", tags: ["Supercar", "Ferrari"], image: "cars/Ferrari_F40(3).png" },
  { id: 94, name: "Ferrari Inspired", category: "supercar", price: 30, specs: "Custom Concept Build", tags: ["Supercar", "Ferrari"], image: "cars/Ferrari_inspired.png" },

  // ── FIAT & FAST AND FURIOUS (FNF) ────
  { id: 95, name: "Fiat", category: "sports", price: 30, specs: "Italian City Car", tags: ["Compact", "Fiat"], image: "cars/Fiat.png" },
  { id: 96, name: "F&F Car", category: "fnf", price: 30, specs: "Movie Inspired Street Build", tags: ["FNF", "Custom"], image: "cars/Fnf.png" },
  { id: 97, name: "F&F Car V2", category: "fnf", price: 30, specs: "Movie Build V2", tags: ["FNF", "Custom"], image: "cars/Fnf(2).png" },
  { id: 98, name: "F&F Car V3", category: "fnf", price: 30, specs: "Movie Build V3", tags: ["FNF", "Custom"], image: "cars/Fnf(3).png" },
  { id: 99, name: "F&F Car V4", category: "fnf", price: 30, specs: "Movie Build V4", tags: ["FNF", "Custom"], image: "cars/Fnf(4).png" },
  { id: 100, name: "F&F Car V5", category: "fnf", price: 30, specs: "Movie Build V5", tags: ["FNF", "Custom"], image: "cars/Fnf(5).png" },
  { id: 101, name: "F&F Car V6", category: "fnf", price: 30, specs: "Movie Build V6", tags: ["FNF", "Custom"], image: "cars/Fnf(6).png" },
  { id: 102, name: "F&F Car V7", category: "fnf", price: 30, specs: "Movie Build V7", tags: ["FNF", "Custom"], image: "cars/Fnf(7).png" },
  { id: 103, name: "F&F Car V1", category: "fnf", price: 30, specs: "Movie Build Alt", tags: ["FNF", "Custom"], image: "cars/FnF(1).png" },

  // ── FORD ─────────────────────────────
  { id: 104, name: "Ford Boss 429", category: "muscle", price: 30, specs: "Classic Mustang Boss 429", tags: ["Muscle", "Ford"], image: "cars/Ford_Boss429.png" },
  { id: 105, name: "Ford Bronco", category: "suv", price: 30, specs: "Off-Road Trail SUV", tags: ["SUV", "Offroad", "Ford"], image: "cars/Ford_Bronco.png" },
  { id: 106, name: "Ford Explorer", category: "suv", price: 30, specs: "Family SUV Build", tags: ["SUV", "Ford"], image: "cars/Ford_Explorer.png" },
  { id: 107, name: "Ford Explorer V1", category: "suv", price: 30, specs: "Explorer Variant 1", tags: ["SUV", "Ford"], image: "cars/Ford_Explorer(1).png" },
  { id: 108, name: "Ford F650", category: "truck", price: 30, specs: "Massive Heavy Duty Truck", tags: ["Truck", "Ford"], image: "cars/Ford_F650.png" },
  { id: 109, name: "Ford Focus", category: "sports", price: 30, specs: "Hot Hatch ST Spec", tags: ["Sports", "Ford"], image: "cars/Ford_Focus.png" },
  { id: 110, name: "Ford Focus V1", category: "sports", price: 30, specs: "Focus Variant 1", tags: ["Sports", "Ford"], image: "cars/Ford_Focus(1).png" },
  { id: 111, name: "Ford Gladiator", category: "truck", price: 30, specs: "Off-Road Pickup", tags: ["Truck", "Ford"], image: "cars/Ford_Glardiator.png" },
  { id: 112, name: "Ford Impala", category: "classic", price: 30, specs: "Classic American Cruiser", tags: ["Classic", "Ford"], image: "cars/Ford_Impala.png" },
  { id: 113, name: "Ford Silverado", category: "truck", price: 30, specs: "Full Size Pickup", tags: ["Truck", "Ford"], image: "cars/Ford_Silverado.png" },
  { id: 114, name: "Ford Silverado V1", category: "truck", price: 30, specs: "Silverado Variant 1", tags: ["Truck", "Ford"], image: "cars/Ford_Silverado(1).png" },
  { id: 115, name: "Ford Truck", category: "truck", price: 30, specs: "Custom Utility Truck", tags: ["Truck", "Ford"], image: "cars/Ford_truck.png" },
  { id: 116, name: "Ford Van", category: "van", price: 30, specs: "Custom Transport Van", tags: ["Van", "Ford"], image: "cars/Ford_Van.png" },
  { id: 117, name: "Fortuner Inspired", category: "suv", price: 30, specs: "Custom Off-Road SUV Setup", tags: ["SUV", "Custom"], image: "cars/Fortuner_inspired.png" },

  // ── HAWK & HONDA ─────────────────────
  { id: 118, name: "Hawk", category: "sports", price: 30, specs: "Custom Concept Car", tags: ["Sports", "Custom"], image: "cars/Hawk.png" },
  { id: 119, name: "Hawk V2", category: "sports", price: 30, specs: "Custom Variant 2", tags: ["Sports", "Custom"], image: "cars/Hawk(2).png" },
  { id: 120, name: "Honda Civic EK9", category: "jdm", price: 30, specs: "Classic Type R Hatch", tags: ["JDM", "Honda"], image: "cars/Honda_Ek9.png" },
  { id: 121, name: "Honda Civic EK9 V1", category: "jdm", price: 30, specs: "EK9 Variant 1", tags: ["JDM", "Honda"], image: "cars/Honda_Ek9(1).png" },
  { id: 122, name: "Honda Civic FD", category: "jdm", price: 30, specs: "Civic FD Type R Spec", tags: ["JDM", "Honda"], image: "cars/Honda_FD.png" },
  { id: 123, name: "Honda Civic FD V1", category: "jdm", price: 30, specs: "FD Variant 1", tags: ["JDM", "Honda"], image: "cars/Honda_FD(1).png" },
  { id: 124, name: "Honda Civic FD V2", category: "jdm", price: 30, specs: "FD Variant 2", tags: ["JDM", "Honda"], image: "cars/Honda_FD(2).png" },
  { id: 125, name: "Honda Civic FD V3", category: "jdm", price: 30, specs: "FD Variant 3", tags: ["JDM", "Honda"], image: "cars/Honda_FD(3).png" },
  { id: 126, name: "Honda Civic FK8", category: "jdm", price: 30, specs: "Modern Type R Hatch", tags: ["JDM", "Honda"], image: "cars/Honda_Fk8.png" },
  { id: 127, name: "Honda Civic FK8 V1", category: "jdm", price: 30, specs: "FK8 Variant 1", tags: ["JDM", "Honda"], image: "cars/Honda_Fk8(1).png" },
  { id: 128, name: "Honda Civic FK8 V2", category: "jdm", price: 30, specs: "FK8 Variant 2", tags: ["JDM", "Honda"], image: "cars/Honda_Fk8(2).png" },
  { id: 129, name: "Honda Civic FK8 V3", category: "jdm", price: 30, specs: "FK8 Variant 3", tags: ["JDM", "Honda"], image: "cars/Honda_Fk8(3).png" },
  { id: 130, name: "Honda Civic FK8 V4", category: "jdm", price: 30, specs: "FK8 Variant 4", tags: ["JDM", "Honda"], image: "cars/Honda_Fk8(4).png" },
  { id: 131, name: "Honda Civic FK8 V5", category: "jdm", price: 30, specs: "FK8 Variant 5", tags: ["JDM", "Honda"], image: "cars/Honda_Fk8(5).png" },
  { id: 132, name: "Honda Civic FK8 V6", category: "jdm", price: 30, specs: "FK8 Variant 6", tags: ["JDM", "Honda"], image: "cars/Honda_Fk8(6).png" },
  { id: 133, name: "Honda NSX", category: "jdm", price: 30, specs: "Legendary Japanese Supercar", tags: ["JDM", "Supercar", "Honda"], image: "cars/Honda_NSX.png" },
  { id: 134, name: "Honda NSX V1", category: "jdm", price: 30, specs: "NSX Variant 1", tags: ["JDM", "Supercar", "Honda"], image: "cars/Honda_NSX(1).png" },
  { id: 135, name: "Honda NSX V2", category: "jdm", price: 30, specs: "NSX Variant 2", tags: ["JDM", "Supercar", "Honda"], image: "cars/Honda_NSX(2).png" },
  { id: 136, name: "Honda NSX V3", category: "jdm", price: 30, specs: "NSX Variant 3", tags: ["JDM", "Supercar", "Honda"], image: "cars/Honda_NSX(3).png" },
  { id: 137, name: "Honda NSX V4", category: "jdm", price: 30, specs: "NSX Variant 4", tags: ["JDM", "Supercar", "Honda"], image: "cars/Honda_NSX(4).png" },
  { id: 138, name: "Honda S2000", category: "jdm", price: 30, specs: "Open Top Roadster", tags: ["JDM", "Sports", "Honda"], image: "cars/Honda_s2k.png" },
  { id: 139, name: "Honda S2000 V1", category: "jdm", price: 30, specs: "S2000 Variant 1", tags: ["JDM", "Sports", "Honda"], image: "cars/Honda_s2k(1).png" },
  { id: 140, name: "Honda S2000 V2", category: "jdm", price: 30, specs: "S2000 Variant 2", tags: ["JDM", "Sports", "Honda"], image: "cars/Honda_s2k(2).png" },
  { id: 141, name: "Honda Civic SiR", category: "jdm", price: 30, specs: "Classic VTEC Hatchback", tags: ["JDM", "Honda"], image: "cars/Honda_SiR.png" },
  { id: 142, name: "Honda Type R", category: "jdm", price: 30, specs: "Track Ready Spec", tags: ["JDM", "Honda"], image: "cars/Honda_TyperR.png" },
  { id: 143, name: "Honda Type R V1", category: "jdm", price: 30, specs: "Type R Variant 1", tags: ["JDM", "Honda"], image: "cars/Honda_TyperR(1).png" },

  // ── HUDSON, INFINITI, KIA & KOENIGSEGG ──
  { id: 144, name: "Hudson", category: "classic", price: 30, specs: "Vintage Classic", tags: ["Classic"], image: "cars/Hudson.png" },
  { id: 145, name: "Infiniti", category: "luxury", price: 30, specs: "Luxury Sedan", tags: ["Luxury", "Infiniti"], image: "cars/infiniti.png" },
  { id: 146, name: "Infiniti Pro", category: "luxury", price: 30, specs: "Custom Infiniti Build", tags: ["Luxury", "Infiniti"], image: "cars/Infiniti.png" },
  { id: 147, name: "Kia", category: "sports", price: 30, specs: "Modern Sedan Build", tags: ["Sedan", "Kia"], image: "cars/Kia.png" },
  { id: 148, name: "Koenigsegg Agera", category: "supercar", price: 30, specs: "Swedish Hypercar", tags: ["Supercar", "Koenigsegg"], image: "cars/Koenigsegg_agera.png" },
  { id: 149, name: "Koenigsegg Agera V1", category: "supercar", price: 30, specs: "Agera Variant 1", tags: ["Supercar", "Koenigsegg"], image: "cars/Koenigsegg_agera(1).png" },
  { id: 150, name: "Koenigsegg Agera V2", category: "supercar", price: 30, specs: "Agera Variant 2", tags: ["Supercar", "Koenigsegg"], image: "cars/Koenigsegg_agera(2).png" },
  { id: 151, name: "Koenigsegg Jesko", category: "supercar", price: 30, specs: "Track Hypercar", tags: ["Supercar", "Koenigsegg"], image: "cars/Koenigsegg_jesko.png" },
  { id: 152, name: "Koenigsegg Jesko V1", category: "supercar", price: 30, specs: "Jesko Variant 1", tags: ["Supercar", "Koenigsegg"], image: "cars/Koenigsegg_jesko(1).png" },
  { id: 153, name: "Koenigsegg Jesko V2", category: "supercar", price: 30, specs: "Jesko Variant 2", tags: ["Supercar", "Koenigsegg"], image: "cars/Koenigsegg_jesko(2).png" },

  // ── LAFERRARI & LAND ROVER ───────────
  { id: 154, name: "LaFerrari", category: "supercar", price: 30, specs: "Hybrid Hypercar Flagship", tags: ["Supercar", "Ferrari"], image: "cars/Laferrari.png" },
  { id: 155, name: "LaFerrari Alt", category: "supercar", price: 30, specs: "Alternate Custom Build", tags: ["Supercar", "Ferrari"], image: "cars/La_Ferrari.png" },
  { id: 156, name: "LaFerrari V1", category: "supercar", price: 30, specs: "Variant 1", tags: ["Supercar", "Ferrari"], image: "cars/La_Ferrari(1).png" },
  { id: 157, name: "LaFerrari V2", category: "supercar", price: 30, specs: "Variant 2", tags: ["Supercar", "Ferrari"], image: "cars/La_Ferrari(2).png" },
  { id: 158, name: "LaFerrari V3", category: "supercar", price: 30, specs: "Variant 3", tags: ["Supercar", "Ferrari"], image: "cars/La_Ferrari(3).png" },
  { id: 159, name: "LaFerrari V4", category: "supercar", price: 30, specs: "Variant 4", tags: ["Supercar", "Ferrari"], image: "cars/La_Ferrari(4).png" },
  { id: 160, name: "LaFerrari V5", category: "supercar", price: 30, specs: "Variant 5", tags: ["Supercar", "Ferrari"], image: "cars/La_Ferrari(5).png" },
  { id: 161, name: "LaFerrari V6", category: "supercar", price: 30, specs: "Variant 6", tags: ["Supercar", "Ferrari"], image: "cars/La_Ferrari(6).png" },
  { id: 162, name: "LaFerrari V7", category: "supercar", price: 30, specs: "Variant 7", tags: ["Supercar", "Ferrari"], image: "cars/La_Ferrari(7).png" },
  { id: 163, name: "Land Rover", category: "suv", price: 30, specs: "Luxury Off-Road SUV", tags: ["SUV", "LandRover"], image: "cars/LandRover.png" },
  { id: 164, name: "Land Rover V1", category: "suv", price: 30, specs: "Variant 1", tags: ["SUV", "LandRover"], image: "cars/LandRover(1).png" },
  { id: 165, name: "Land Rover V2", category: "suv", price: 30, specs: "Variant 2", tags: ["SUV", "LandRover"], image: "cars/LandRover(2).png" },
  { id: 166, name: "Land Rover V3", category: "suv", price: 30, specs: "Variant 3", tags: ["SUV", "LandRover"], image: "cars/LandRover(3).png" },
  { id: 167, name: "Land Rover V4", category: "suv", price: 30, specs: "Variant 4", tags: ["SUV", "LandRover"], image: "cars/LandRover(4).png" },
  { id: 168, name: "Land Rover V5", category: "suv", price: 30, specs: "Variant 5", tags: ["SUV", "LandRover"], image: "cars/LandRover(5).png" },
  { id: 169, name: "Land Rover V10", category: "suv", price: 30, specs: "Variant 10", tags: ["SUV", "LandRover"], image: "cars/LandRover(10).png" },

  // ── LEXUS & LOTUS ────────────────────
  { id: 170, name: "Lexus", category: "luxury", price: 30, specs: "Luxury Sedan", tags: ["Luxury", "Lexus"], image: "cars/Lexus.png" },
  { id: 171, name: "Lexus V1", category: "luxury", price: 30, specs: "Lexus Variant 1", tags: ["Luxury", "Lexus"], image: "cars/Lexus(1).png" },
  { id: 172, name: "Lexus LFA", category: "supercar", price: 30, specs: "V10 Japanese Supercar", tags: ["Supercar", "JDM", "Lexus"], image: "cars/Lexus_Lfa.png" },
  { id: 173, name: "Lexus LFA Pro", category: "supercar", price: 30, specs: "Custom LFA Build", tags: ["Supercar", "JDM", "Lexus"], image: "cars/Lexus_LFA.png" },
  { id: 174, name: "Lexus LFA V1", category: "supercar", price: 30, specs: "LFA Variant 1", tags: ["Supercar", "JDM", "Lexus"], image: "cars/Lexus_LFA(1).png" },
  { id: 175, name: "Lexus LFA V2", category: "supercar", price: 30, specs: "LFA Variant 2", tags: ["Supercar", "JDM", "Lexus"], image: "cars/Lexus_LFA(2).png" },
  { id: 176, name: "Lotus", category: "sports", price: 30, specs: "Lightweight Track Sports Car", tags: ["Sports", "Lotus"], image: "cars/Lotus.png" },
  { id: 177, name: "Lotus V1", category: "sports", price: 30, specs: "Lotus Variant 1", tags: ["Sports", "Lotus"], image: "cars/Lotus(1).png" },
  { id: 178, name: "Lotus V2", category: "sports", price: 30, specs: "Lotus Variant 2", tags: ["Sports", "Lotus"], image: "cars/Lotus(2).png" },

  // ── MASERATI & MCLAREN ───────────────
  { id: 179, name: "Maserati", category: "luxury", price: 30, specs: "Italian Sport Sedan", tags: ["Luxury", "Maserati"], image: "cars/Maserati.png" },
  { id: 180, name: "McLaren 720S", category: "supercar", price: 30, specs: "Super Series Supercar", tags: ["Supercar", "McLaren"], image: "cars/Mclaren_720s.png" },
  { id: 181, name: "McLaren 720S V1", category: "supercar", price: 30, specs: "720S Variant 1", tags: ["Supercar", "McLaren"], image: "cars/Mclaren_720s(1).png" },
  { id: 182, name: "McLaren 720S V2", category: "supercar", price: 30, specs: "720S Variant 2", tags: ["Supercar", "McLaren"], image: "cars/Mclaren_720s(2).png" },
  { id: 183, name: "McLaren 720S V3", category: "supercar", price: 30, specs: "720S Variant 3", tags: ["Supercar", "McLaren"], image: "cars/Mclaren_720s(3).png" },
  { id: 184, name: "McLaren 720S V4", category: "supercar", price: 30, specs: "720S Variant 4", tags: ["Supercar", "McLaren"], image: "cars/Mclaren_720s(4).png" },
  { id: 185, name: "McLaren P1", category: "supercar", price: 30, specs: "Hybrid Hypercar", tags: ["Supercar", "McLaren"], image: "cars/Mclaren_P1.png" },
  { id: 186, name: "McLaren Senna", category: "supercar", price: 30, specs: "Track Focused Hypercar", tags: ["Supercar", "McLaren"], image: "cars/Mclaren_Senna.png" },

  // ── MERCEDES MAYBACH & MAZDA MIATA ───
  { id: 187, name: "Mercedes GT63S", category: "sports", price: 30, specs: "AMG Performance Coupe", tags: ["Sports", "Benz"], image: "cars/Mercedes_GT63s.png" },
  { id: 188, name: "Mercedes Maybach", category: "luxury", price: 30, specs: "Ultimate Luxury Limousine", tags: ["Luxury", "Benz"], image: "cars/Mercedes_Maybach.png" },
  { id: 189, name: "Mercedes Maybach V1", category: "luxury", price: 30, specs: "Maybach Variant 1", tags: ["Luxury", "Benz"], image: "cars/Mercedes_Maybach(1).png" },
  { id: 190, name: "Mercedes Maybach V2", category: "luxury", price: 30, specs: "Maybach Variant 2", tags: ["Luxury", "Benz"], image: "cars/Mercedes_Maybach(2).png" },
  { id: 191, name: "Mazda Miata", category: "jdm", price: 30, specs: "Lightweight JDM Roadster", tags: ["JDM", "Mazda"], image: "cars/Miata.png" },
  { id: 192, name: "Mazda Miata V1", category: "jdm", price: 30, specs: "Miata Variant 1", tags: ["JDM", "Mazda"], image: "cars/Miata(1).png" },
  { id: 193, name: "Mazda Miata V2", category: "jdm", price: 30, specs: "Miata Variant 2", tags: ["JDM", "Mazda"], image: "cars/Miata(2).png" },

  // ── MITSUBISHI ───────────────────────
  { id: 194, name: "Mitsubishi Eclipse", category: "jdm", price: 30, specs: "Classic JDM Sports Coupe", tags: ["JDM", "Mitsubishi"], image: "cars/Mirsubishi_Eclipse.png" },
  { id: 195, name: "Mitsubishi 2000GT", category: "classic", price: 30, specs: "Vintage Classic Sport", tags: ["Classic", "Mitsubishi"], image: "cars/Mitsubishi_2000.png" },
  { id: 196, name: "Mitsubishi Lancer Evo 9", category: "jdm", price: 30, specs: "Rally Legend Evo IX", tags: ["JDM", "Rally", "Mitsubishi"], image: "cars/Mitsubishi_Evo9.png" },
  { id: 197, name: "Mitsubishi Lancer Evo 9 V1", category: "jdm", price: 30, specs: "Evo IX Variant 1", tags: ["JDM", "Rally", "Mitsubishi"], image: "cars/Mitsubishi_Evo9(1).png" },
  { id: 198, name: "Mitsubishi Lancer Evo 9 V2", category: "jdm", price: 30, specs: "Evo IX Variant 2", tags: ["JDM", "Rally", "Mitsubishi"], image: "cars/Mitsubishi_Evo9(2).png" },
  { id: 199, name: "Mitsubishi Lancer Evo 9 V3", category: "jdm", price: 30, specs: "Evo IX Variant 3", tags: ["JDM", "Rally", "Mitsubishi"], image: "cars/Mitsubishi_Evo9(3).png" },
  { id: 200, name: "Mitsubishi Lancer Evo 9 V4", category: "jdm", price: 30, specs: "Evo IX Variant 4", tags: ["JDM", "Rally", "Mitsubishi"], image: "cars/Mitsubishi_Evo9(4).png" },
  { id: 201, name: "Mitsubishi Lancer Evo 10", category: "jdm", price: 30, specs: "Turbo AWD Street Monster", tags: ["JDM", "Rally", "Mitsubishi"], image: "cars/Mitsubishi_Evo10.png" },
  { id: 202, name: "Mitsubishi Lancer Evo 10 V1", category: "jdm", price: 30, specs: "Evo X Variant 1", tags: ["JDM", "Rally", "Mitsubishi"], image: "cars/Mitsubishi_Evo10(1).png" },
  { id: 203, name: "Mitsubishi Lancer Evo 10 V2", category: "jdm", price: 30, specs: "Evo X Variant 2", tags: ["JDM", "Rally", "Mitsubishi"], image: "cars/Mitsubishi_Evo10(2).png" },

  // ── FORD MUSTANG ─────────────────────
  { id: 204, name: "Ford Mustang", category: "muscle", price: 30, specs: "American Muscle Coupe", tags: ["Muscle", "Ford"], image: "cars/Mustang.png" },
  { id: 205, name: "Ford Mustang Cobra Jet", category: "muscle", price: 30, specs: "Drag Strip Spec", tags: ["Muscle", "Ford"], image: "cars/Mustang_CobraJet.png" },
  { id: 206, name: "Ford Mustang Dark", category: "muscle", price: 30, specs: "Dark Horse Edition", tags: ["Muscle", "Ford"], image: "cars/Mustang_Dark.png" },
  { id: 207, name: "Ford Mustang Dark V1", category: "muscle", price: 30, specs: "Dark Horse Variant 1", tags: ["Muscle", "Ford"], image: "cars/Mustang_Dark(1).png" },
  { id: 208, name: "Ford Mustang Fastback", category: "muscle", price: 30, specs: "Classic Fastback Build", tags: ["Muscle", "Classic", "Ford"], image: "cars/Mustang_Fastback.png" },
  { id: 209, name: "Ford Mustang GT", category: "muscle", price: 30, specs: "V8 GT Performance", tags: ["Muscle", "Ford"], image: "cars/Mustang_GT.png" },
  { id: 210, name: "Ford Mustang GT350", category: "muscle", price: 30, specs: "Shelby GT350 Track Spec", tags: ["Muscle", "Ford"], image: "cars/Mustang_GT350.png" },
  { id: 211, name: "Ford Mustang GT350 V1", category: "muscle", price: 30, specs: "GT350 Variant 1", tags: ["Muscle", "Ford"], image: "cars/Mustang_GT350(1).png" },
  { id: 212, name: "Ford Mustang GT500", category: "muscle", price: 30, specs: "Shelby Supercharged V8", tags: ["Muscle", "Ford"], image: "cars/Mustang_GT500.png" },
  { id: 213, name: "Ford Mustang GT500 V1", category: "muscle", price: 30, specs: "GT500 Variant 1", tags: ["Muscle", "Ford"], image: "cars/Mustang_GT500(1).png" },

  // ── NISSAN SKYLINE, GT-R & SILVIA ────
  { id: 214, name: "Nissan 280SX", category: "jdm", price: 30, specs: "Classic Drift Chassis", tags: ["JDM", "Drift", "Nissan"], image: "cars/Nissan_280sx.png" },
  { id: 215, name: "Nissan 280SX V1", category: "jdm", price: 30, specs: "280SX Variant 1", tags: ["JDM", "Drift", "Nissan"], image: "cars/Nissan_280sx(1).png" },
  { id: 216, name: "Nissan Skyline GT-R R32", category: "jdm", price: 30, specs: "Godzilla R32 Legend", tags: ["JDM", "Nissan"], image: "cars/Nissan_GTRR32.png" },
  { id: 217, name: "Nissan Skyline GT-R R32 V1", category: "jdm", price: 30, specs: "R32 Variant 1", tags: ["JDM", "Nissan"], image: "cars/Nissan_GTRR32(1).png" },
  { id: 218, name: "Nissan Skyline GT-R R33", category: "jdm", price: 30, specs: "Midnight Purple R33", tags: ["JDM", "Nissan"], image: "cars/Nissan_GTRR33.png" },
  { id: 219, name: "Nissan Skyline GT-R R34", category: "jdm", price: 30, specs: "Iconic R34 V-Spec", tags: ["JDM", "Nissan"], image: "cars/Nissan_GTRR34.png" },
  { id: 220, name: "Nissan Skyline GT-R R34 V1", category: "jdm", price: 30, specs: "R34 Variant 1", tags: ["JDM", "Nissan"], image: "cars/Nissan_GTRR34(1).png" },
  { id: 221, name: "Nissan Skyline GT-R R34 V2", category: "jdm", price: 30, specs: "R34 Variant 2", tags: ["JDM", "Nissan"], image: "cars/Nissan_GTRR34(2).png" },
  { id: 222, name: "Nissan Skyline GT-R R34 V3", category: "jdm", price: 30, specs: "R34 Variant 3", tags: ["JDM", "Nissan"], image: "cars/Nissan_GTRR34(3).png" },
  { id: 223, name: "Nissan GT-R R35", category: "supercar", price: 30, specs: "Modern Twin-Turbo Supercar", tags: ["Supercar", "Nissan"], image: "cars/Nissan_GTRR35.png" },
  { id: 224, name: "Nissan GT-R R35 V1", category: "supercar", price: 30, specs: "R35 Variant 1", tags: ["Supercar", "Nissan"], image: "cars/Nissan_GTRR35(1).png" },
  { id: 225, name: "Nissan GT-R R35 V2", category: "supercar", price: 30, specs: "R35 Variant 2", tags: ["Supercar", "Nissan"], image: "cars/Nissan_GTRR35(2).png" },
  { id: 226, name: "Nissan GT-R R35 V3", category: "supercar", price: 30, specs: "R35 Variant 3", tags: ["Supercar", "Nissan"], image: "cars/Nissan_GTRR35(3).png" },
  { id: 227, name: "Nissan GT-R R35 V4", category: "supercar", price: 30, specs: "R35 Variant 4", tags: ["Supercar", "Nissan"], image: "cars/Nissan_GTRR35(4).png" },
  { id: 228, name: "Nissan Silvia S13", category: "jdm", price: 30, specs: "Classic Drift Icon S13", tags: ["JDM", "Drift", "Nissan"], image: "cars/Nissan_s13.png" },
  { id: 229, name: "Nissan Silvia S13 V1", category: "jdm", price: 30, specs: "S13 Variant 1", tags: ["JDM", "Drift", "Nissan"], image: "cars/Nissan_s13(1).png" },
  { id: 230, name: "Nissan Silvia S13 V2", category: "jdm", price: 30, specs: "S13 Variant 2", tags: ["JDM", "Drift", "Nissan"], image: "cars/Nissan_s13(2).png" },
  { id: 231, name: "Nissan Silvia S13 V3", category: "jdm", price: 30, specs: "S13 Variant 3", tags: ["JDM", "Drift", "Nissan"], image: "cars/Nissan_s13(3).png" },
  { id: 232, name: "Nissan Silvia S13 V4", category: "jdm", price: 30, specs: "S13 Variant 4", tags: ["JDM", "Drift", "Nissan"], image: "cars/Nissan_s13(4).png" },
  { id: 233, name: "Nissan Silvia S13 V5", category: "jdm", price: 30, specs: "S13 Variant 5", tags: ["JDM", "Drift", "Nissan"], image: "cars/Nissan_s13(5).png" },
  { id: 234, name: "Nissan Silvia S15", category: "jdm", price: 30, specs: "Aero Spec S15", tags: ["JDM", "Drift", "Nissan"], image: "cars/Nissan_s15.png" },
  { id: 235, name: "Nissan Silvia S15 V1", category: "jdm", price: 30, specs: "S15 Variant 1", tags: ["JDM", "Drift", "Nissan"], image: "cars/Nissan_s15(1).png" },
  { id: 236, name: "Nissan Silvia S15 V2", category: "jdm", price: 30, specs: "S15 Variant 2", tags: ["JDM", "Drift", "Nissan"], image: "cars/Nissan_s15(2).png" },
  { id: 237, name: "Nissan Silvia S15 V3", category: "jdm", price: 30, specs: "S15 Variant 3", tags: ["JDM", "Drift", "Nissan"], image: "cars/Nissan_s15(3).png" },
  { id: 238, name: "Nissan Silvia S15 V4", category: "jdm", price: 30, specs: "S15 Variant 4", tags: ["JDM", "Drift", "Nissan"], image: "cars/Nissan_s15(4).png" },

  // ── OTHERS, PAGANI, PEUGEOT & PORSCHE ──
  { id: 239, name: "Old Ford", category: "classic", price: 30, specs: "Vintage Classic Ford", tags: ["Classic", "Ford"], image: "cars/Old_Ford.png" },
  { id: 240, name: "Old GT-R", category: "classic", price: 30, specs: "Hakosuka Classic GT-R", tags: ["Classic", "JDM", "Nissan"], image: "cars/Old_GTR.png" },
  { id: 241, name: "Pagani", category: "supercar", price: 30, specs: "Italian Exotic Hypercar", tags: ["Supercar", "Pagani"], image: "cars/Pagani.png" },
  { id: 242, name: "Pagani V1", category: "supercar", price: 30, specs: "Pagani Variant 1", tags: ["Supercar", "Pagani"], image: "cars/Pagani(1).png" },
  { id: 243, name: "Peugeot", category: "sports", price: 30, specs: "French Hot Hatch", tags: ["Sports", "Peugeot"], image: "cars/Peugeot.png" },
  { id: 244, name: "Porsche 911", category: "sports", price: 30, specs: "Classic Rear-Engine Sports", tags: ["Sports", "Porsche"], image: "cars/Porsche_911.png" },
  { id: 245, name: "Porsche 993", category: "sports", price: 30, specs: "Air-Cooled 911 Legend", tags: ["Sports", "Porsche"], image: "cars/Porsche_993.png" },
  { id: 246, name: "Porsche 993 V1", category: "sports", price: 30, specs: "993 Variant 1", tags: ["Sports", "Porsche"], image: "cars/Porsche_993(1).png" },
  { id: 247, name: "Porsche GT3 RS", category: "supercar", price: 30, specs: "Track Monster GT3 RS", tags: ["Supercar", "Porsche"], image: "cars/Porsche_GT3RS.png" },
  { id: 248, name: "Porsche GT3 RS V1", category: "supercar", price: 30, specs: "GT3 RS Variant 1", tags: ["Supercar", "Porsche"], image: "cars/Porsche_GT3RS(1).png" },
  { id: 249, name: "Porsche GT3 RS V2", category: "supercar", price: 30, specs: "GT3 RS Variant 2", tags: ["Supercar", "Porsche"], image: "cars/Porsche_GT3RS(2).png" },
  { id: 250, name: "Porsche GT3 RS V3", category: "supercar", price: 30, specs: "GT3 RS Variant 3", tags: ["Supercar", "Porsche"], image: "cars/Porsche_GT3RS(3).png" },
  { id: 251, name: "Porsche GT Carrera", category: "supercar", price: 30, specs: "V10 Carrera GT", tags: ["Supercar", "Porsche"], image: "cars/Porsche_GT_Carrera.png" },
  { id: 252, name: "Porsche GT Carrera V1", category: "supercar", price: 30, specs: "Carrera GT Variant 1", tags: ["Supercar", "Porsche"], image: "cars/Porsche_GT_Carrera(1).png" },
  { id: 253, name: "Porsche Panamera", category: "luxury", price: 30, specs: "Luxury Sport Sedan", tags: ["Luxury", "Porsche"], image: "cars/Porsche_Panamera.png" },
  { id: 254, name: "Porsche Spyder", category: "supercar", price: 30, specs: "Supercar Track Spec", tags: ["Supercar", "Porsche"], image: "cars/Porsche_Spider.png" },
  { id: 255, name: "Porsche Spyder Alt", category: "supercar", price: 30, specs: "Custom Spyder Build", tags: ["Supercar", "Porsche"], image: "cars/Porsche_Spyder.png" },
  { id: 256, name: "Porsche Spyder V1", category: "supercar", price: 30, specs: "Spyder Variant 1", tags: ["Supercar", "Porsche"], image: "cars/Porsche_Spyder(1).png" },
  { id: 257, name: "Porsche Spyder V2", category: "supercar", price: 30, specs: "Spyder Variant 2", tags: ["Supercar", "Porsche"], image: "cars/Porsche_Spyder(2).png" },

  // ── RAM TRUCKS & RAPTOR ──────────────
  { id: 258, name: "Ram 1500", category: "truck", price: 30, specs: "Full Size Truck", tags: ["Truck", "Ram"], image: "cars/Ram_1500.png" },
  { id: 259, name: "Ram 1500 V1", category: "truck", price: 30, specs: "Ram Variant 1", tags: ["Truck", "Ram"], image: "cars/Ram_1500(1).png" },
  { id: 260, name: "Ram 1500 V2", category: "truck", price: 30, specs: "Ram Variant 2", tags: ["Truck", "Ram"], image: "cars/Ram_1500(2).png" },
  { id: 261, name: "Ram 1500 V3", category: "truck", price: 30, specs: "Ram Variant 3", tags: ["Truck", "Ram"], image: "cars/Ram_1500(3).png" },
  { id: 262, name: "Ram 1500 V4", category: "truck", price: 30, specs: "Ram Variant 4", tags: ["Truck", "Ram"], image: "cars/Ram_1500(4).png" },
  { id: 263, name: "Ram 1500 Inspired", category: "truck", price: 30, specs: "Custom Lifted Ram", tags: ["Truck", "Ram"], image: "cars/Ram_1500_inspired.png" },
  { id: 264, name: "Ram 1500 Rebel", category: "truck", price: 30, specs: "Off-Road Rebel Edition", tags: ["Truck", "Offroad", "Ram"], image: "cars/Ram_1500Rebel.png" },
  { id: 265, name: "Ram SRT10", category: "truck", price: 30, specs: "V10 Muscle Truck", tags: ["Truck", "Muscle", "Ram"], image: "cars/Ram_SRT10.png" },
  { id: 266, name: "Raptor Inspired", category: "truck", price: 30, specs: "Off-Road Raptor Build", tags: ["Truck", "Offroad"], image: "cars/Raptor_inspired.png" },
  { id: 267, name: "Rolls Royce Cullinan", category: "luxury", price: 30, specs: "Ultra Luxury SUV", tags: ["Luxury", "SUV"], image: "cars/Rolls-Royce_Cullinan.png" },

  // ── MAZDA RX7, SUBARU & TOYOTA ───────
  { id: 268, name: "Mazda RX7", category: "jdm", price: 30, specs: "Rotary Legend RX7", tags: ["JDM", "Sports", "Mazda"], image: "cars/Rx7.png" },
  { id: 269, name: "Mazda RX7 V1", category: "jdm", price: 30, specs: "RX7 Variant 1", tags: ["JDM", "Sports", "Mazda"], image: "cars/Rx7(1).png" },
  { id: 270, name: "Mazda RX7 V2", category: "jdm", price: 30, specs: "RX7 Variant 2", tags: ["JDM", "Sports", "Mazda"], image: "cars/Rx7(2).png" },
  { id: 271, name: "Mazda RX7 V3", category: "jdm", price: 30, specs: "RX7 Variant 3", tags: ["JDM", "Drift", "Mazda"], image: "cars/Rx7(3).png" },
  { id: 272, name: "Silverado", category: "truck", price: 30, specs: "Heavy Duty Pickup", tags: ["Truck", "Chevrolet"], image: "cars/Silverado.png" },
  { id: 273, name: "Civic SiR Inspired", category: "jdm", price: 30, specs: "Classic Hatchback Build", tags: ["JDM", "Honda"], image: "cars/SiR_inspired.png" },
  { id: 274, name: "Skoda", category: "sports", price: 30, specs: "Euro Tuned Sedan", tags: ["Sports", "Sedan"], image: "cars/Skoda.png" },
  { id: 275, name: "Subaru BRZ", category: "jdm", price: 30, specs: "Street BRZ Spec", tags: ["JDM", "Subaru"], image: "cars/Subaru_brz.png" },
  { id: 276, name: "Subaru BRZ Pro", category: "jdm", price: 30, specs: "Time Attack BRZ", tags: ["JDM", "Subaru"], image: "cars/Subaru_BRZ.png" },
  { id: 277, name: "Subaru BRZ V1", category: "jdm", price: 30, specs: "BRZ Variant 1", tags: ["JDM", "Subaru"], image: "cars/Subaru_BRZ(1).png" },
  { id: 278, name: "Subaru WRX", category: "jdm", price: 30, specs: "Rally AWD Turbo", tags: ["JDM", "Rally", "Subaru"], image: "cars/Subaru_WRX.png" },
  { id: 279, name: "Subaru WRX V1", category: "jdm", price: 30, specs: "WRX Variant 1", tags: ["JDM", "Rally", "Subaru"], image: "cars/Subaru_WRX(1).png" },
  { id: 280, name: "Subaru WRX V2", category: "jdm", price: 30, specs: "WRX Variant 2", tags: ["JDM", "Rally", "Subaru"], image: "cars/Subaru_WRX(2).png" },

  // ── TOYOTA (AE86, Camry, Celica, Chaser, Crown, Fortuner, FRS, GT86, Hilux, LC, Supra Mk3/Mk4/Mk5, Yaris) ──
  { id: 281, name: "Toyota AE86", category: "jdm", price: 30, specs: "Legendary Drift Trueno AE86", tags: ["JDM", "Drift", "Toyota"], image: "cars/Toyota_AE86.png" },
  { id: 282, name: "Toyota AE86 V1", category: "jdm", price: 30, specs: "AE86 Variant 1", tags: ["JDM", "Drift", "Toyota"], image: "cars/Toyota_AE86(1).png" },
  { id: 283, name: "Toyota AE86 V2", category: "jdm", price: 30, specs: "AE86 Variant 2", tags: ["JDM", "Drift", "Toyota"], image: "cars/Toyota_AE86(2).png" },
  { id: 284, name: "Toyota Camry", category: "sports", price: 30, specs: "Custom Sport Camry", tags: ["Sedan", "Toyota"], image: "cars/Toyota_camry.png" },
  { id: 285, name: "Toyota Camry Pro", category: "sports", price: 30, specs: "Custom Camry Build", tags: ["Sedan", "Toyota"], image: "cars/Toyota_Camry.png" },
  { id: 286, name: "Toyota Camry V1", category: "sports", price: 30, specs: "Camry Variant 1", tags: ["Sedan", "Toyota"], image: "cars/Toyota_Camry(1).png" },
  { id: 287, name: "Toyota Celica", category: "jdm", price: 30, specs: "Classic Rally Celica", tags: ["JDM", "Toyota"], image: "cars/Toyota_Celica.png" },
  { id: 288, name: "Toyota Celica V1", category: "jdm", price: 30, specs: "Celica Variant 1", tags: ["JDM", "Toyota"], image: "cars/Toyota_Celica(1).png" },
  { id: 289, name: "Toyota Chaser", category: "jdm", price: 30, specs: "VIP Drift Chaser JZX100", tags: ["JDM", "Drift", "Toyota"], image: "cars/Toyota_Chaser.png" },
  { id: 290, name: "Toyota Crown", category: "luxury", price: 30, specs: "Executive VIP Crown", tags: ["Luxury", "Toyota"], image: "cars/Toyota_crown.png" },
  { id: 291, name: "Toyota Crown V1", category: "luxury", price: 30, specs: "Crown Variant 1", tags: ["Luxury", "Toyota"], image: "cars/Toyota_crown(1).png" },
  { id: 292, name: "Toyota Crown Pro", category: "luxury", price: 30, specs: "Custom Crown Build", tags: ["Luxury", "Toyota"], image: "cars/Toyota_Crown.png" },
  { id: 293, name: "Toyota Fortuner", category: "suv", price: 30, specs: "Modified Off-Road Fortuner", tags: ["SUV", "Toyota"], image: "cars/Toyota_Fortuner.png" },
  { id: 294, name: "Toyota Fortuner V1", category: "suv", price: 30, specs: "Fortuner Variant 1", tags: ["SUV", "Toyota"], image: "cars/Toyota_Fortuner(1).png" },
  { id: 295, name: "Toyota Fortuner V2", category: "suv", price: 30, specs: "Fortuner Variant 2", tags: ["SUV", "Toyota"], image: "cars/Toyota_Fortuner(2).png" },
  { id: 296, name: "Toyota Fortuner V3", category: "suv", price: 30, specs: "Fortuner Variant 3", tags: ["SUV", "Toyota"], image: "cars/Toyota_Fortuner(3).png" },
  { id: 297, name: "Toyota Fortuner V4", category: "suv", price: 30, specs: "Fortuner Variant 4", tags: ["SUV", "Toyota"], image: "cars/Toyota_Fortuner(4).png" },
  { id: 298, name: "Toyota Fortuner V5", category: "suv", price: 30, specs: "Fortuner Variant 5", tags: ["SUV", "Toyota"], image: "cars/Toyota_Fortuner(5).png" },
  { id: 299, name: "Toyota Fortuner V6", category: "suv", price: 30, specs: "Fortuner Variant 6", tags: ["SUV", "Toyota"], image: "cars/Toyota_Fortuner(6).png" },
  { id: 300, name: "Toyota FRS", category: "sports", price: 30, specs: "Scion FRS Sport Coupe", tags: ["Sports", "Toyota"], image: "cars/Toyota_FRS.png" },
  { id: 301, name: "Toyota GT86", category: "sports", price: 30, specs: "Track Tuned GT86", tags: ["Sports", "Toyota"], image: "cars/Toyota_GT86.png" },
  { id: 302, name: "Toyota Hilux", category: "truck", price: 30, specs: "Indestructible Pickup", tags: ["Truck", "Toyota"], image: "cars/Toyota_Hilux.png" },
  { id: 303, name: "Toyota Hilux V1", category: "truck", price: 30, specs: "Hilux Variant 1", tags: ["Truck", "Toyota"], image: "cars/Toyota_Hilux(1).png" },
  { id: 304, name: "Toyota Hilux V2", category: "truck", price: 30, specs: "Hilux Variant 2", tags: ["Truck", "Toyota"], image: "cars/Toyota_Hilux(2).png" },
  { id: 305, name: "Toyota Hilux V3", category: "truck", price: 30, specs: "Hilux Variant 3", tags: ["Truck", "Toyota"], image: "cars/Toyota_Hilux(3).png" },
  { id: 306, name: "Toyota Hilux V4", category: "truck", price: 30, specs: "Hilux Variant 4", tags: ["Truck", "Toyota"], image: "cars/Toyota_Hilux(4).png" },
  { id: 307, name: "Toyota Hilux V5", category: "truck", price: 30, specs: "Hilux Variant 5", tags: ["Truck", "Toyota"], image: "cars/Toyota_Hilux(5).png" },
  { id: 308, name: "Toyota Hilux V6", category: "truck", price: 30, specs: "Hilux Variant 6", tags: ["Truck", "Toyota"], image: "cars/Toyota_Hilux(6).png" },
  { id: 309, name: "Toyota Hilux V7", category: "truck", price: 30, specs: "Hilux Variant 7", tags: ["Truck", "Toyota"], image: "cars/Toyota_Hilux(7).png" },
  { id: 310, name: "Toyota Hilux V8", category: "truck", price: 30, specs: "Hilux Variant 8", tags: ["Truck", "Toyota"], image: "cars/Toyota_Hilux(8).png" },
  { id: 311, name: "Toyota Hilux V9", category: "truck", price: 30, specs: "Hilux Variant 9", tags: ["Truck", "Toyota"], image: "cars/Toyota_Hilux(9).png" },
  { id: 312, name: "Toyota Hilux V10", category: "truck", price: 30, specs: "Hilux Variant 10", tags: ["Truck", "Toyota"], image: "cars/Toyota_Hilux(10).png" },
  { id: 313, name: "Toyota Hilux V11", category: "truck", price: 30, specs: "Hilux Variant 11", tags: ["Truck", "Toyota"], image: "cars/Toyota_Hilux(11).png" },
  { id: 314, name: "Toyota Land Cruiser", category: "suv", price: 30, specs: "Ultimate Off-Road SUV", tags: ["SUV", "Toyota"], image: "cars/Toyota_LC.png" },
  { id: 315, name: "Toyota Land Cruiser 80", category: "suv", price: 30, specs: "Classic LC80 Off-Road", tags: ["SUV", "Toyota"], image: "cars/Toyota_LC80.png" },
  { id: 316, name: "Toyota Land Cruiser 80 V1", category: "suv", price: 30, specs: "LC80 Variant 1", tags: ["SUV", "Toyota"], image: "cars/Toyota_LC80(1).png" },
  { id: 317, name: "Toyota Supra Mk3", category: "jdm", price: 30, specs: "Classic Supra A70", tags: ["JDM", "Toyota"], image: "cars/Toyota_Mk3.png" },
  { id: 318, name: "Toyota Supra Mk3 V1", category: "jdm", price: 30, specs: "Mk3 Variant 1", tags: ["JDM", "Toyota"], image: "cars/Toyota_Mk3(1).png" },
  { id: 319, name: "Toyota Supra Mk4", category: "jdm", price: 30, specs: "Legendary 2JZ Supra A80", tags: ["JDM", "Toyota"], image: "cars/Toyota_Mk4.png" },
  { id: 320, name: "Toyota Supra Mk4 V1", category: "jdm", price: 30, specs: "Mk4 Variant 1", tags: ["JDM", "Toyota"], image: "cars/Toyota_Mk4(1).png" },
  { id: 321, name: "Toyota Supra Mk4 V2", category: "jdm", price: 30, specs: "Mk4 Variant 2", tags: ["JDM", "Toyota"], image: "cars/Toyota_Mk4(2).png" },
  { id: 322, name: "Toyota Supra Mk5", category: "sports", price: 30, specs: "Modern A90 Supra", tags: ["Sports", "Toyota"], image: "cars/Toyota_Mk5.png" },
  { id: 323, name: "Toyota Supra Mk5 V1", category: "sports", price: 30, specs: "Mk5 Variant 1", tags: ["Sports", "Toyota"], image: "cars/Toyota_Mk5(1).png" },
  { id: 324, name: "Toyota Selica", category: "jdm", price: 30, specs: "Custom Selica Build", tags: ["JDM", "Toyota"], image: "cars/Toyota_selica.png" },
  { id: 325, name: "Toyota Vellfire", category: "van", price: 30, specs: "Luxury VIP Van", tags: ["Van", "Luxury", "Toyota"], image: "cars/Toyota_vellfire.png" },
  { id: 326, name: "Toyota GR Yaris", category: "sports", price: 30, specs: "Modified Rally Yaris", tags: ["Sports", "Toyota"], image: "cars/Toyota_Yaris.png" },
  { id: 327, name: "Toyota Yaris V1", category: "sports", price: 30, specs: "Yaris Variant 1", tags: ["Sports", "Toyota"], image: "cars/Toyota_Yaris(1).png" },
  { id: 328, name: "Toyota Yaris V2", category: "sports", price: 30, specs: "Yaris Variant 2", tags: ["Sports", "Toyota"], image: "cars/Toyota_Yaris(2).png" },
  { id: 329, name: "Toyota Yaris V3", category: "sports", price: 30, specs: "Yaris Variant 3", tags: ["Sports", "Toyota"], image: "cars/Toyota_Yaris(3).png" },
  { id: 330, name: "Toyota Yaris V4", category: "sports", price: 30, specs: "Yaris Variant 4", tags: ["Sports", "Toyota"], image: "cars/Toyota_Yaris(4).png" },

  // ── DODGE VIPER & VOLKSWAGEN ─────────
  { id: 331, name: "Dodge Viper", category: "muscle", price: 30, specs: "V12/V10 American Viper", tags: ["Muscle", "Dodge"], image: "cars/Viper.png" },
  { id: 332, name: "Dodge Viper V1", category: "muscle", price: 30, specs: "Viper Variant 1", tags: ["Muscle", "Dodge"], image: "cars/Viper(1).png" },
  { id: 333, name: "Volkswagen", category: "sports", price: 30, specs: "Euro Hatchback Build", tags: ["Sports", "VW"], image: "cars/volkswagen.png" },
  { id: 334, name: "Volkswagen Samba", category: "classic", price: 30, specs: "Classic Vintage Bus", tags: ["Classic", "VW"], image: "cars/Volkswagen_Samba.png" },
  { id: 335, name: "Volkswagen Scirocco", category: "sports", price: 30, specs: "Sporty Coupe Hatch", tags: ["Sports", "VW"], image: "cars/Volkswagen_Scirocco.png" }
];

// =====================
// UNIFIED CART & STATE
// =====================
let unifiedCart = {}; // { id: { item, qty } }
let activeFilter = "all";
let discountAmount = 0;
let appliedVoucherCode = "";
let selectedPayment = "GCash";
let sukiPoints = parseInt(localStorage.getItem("zyntSukiPoints") || "0", 10);

// =====================
// NAVIGATION
// =====================
const SECTIONS = {
  accounts: { page: "accountsPage", label: "Accounts" },
  cars:     { page: "carsPage",     label: "Cars" },
  anime:    { page: "animePage",    label: "Anime Cars" },
  cpm1:     { page: "cpm1Page",     label: "CPM1 Services" },
  cpm2:     { page: "cpm2Page",     label: "CPM2 Services" }
};
let currentSection = null;

function buildSectionNav(current) {
  const html = Object.entries(SECTIONS).map(([key, s]) =>
    `<button class="section-chip ${key === current ? "active" : ""}" onclick="goToSection('${key}')">${s.label}</button>`
  ).join("");
  document.querySelectorAll("[data-section-nav]").forEach(el => { el.innerHTML = html; });
}

function hideAllScreens() {
  document.getElementById("welcomeScreen").classList.remove("active");
  Object.values(SECTIONS).forEach(s => document.getElementById(s.page).classList.remove("active"));
}

function _goToSectionNow(section) {
  hideAllScreens();
  document.getElementById("floatingWidget").style.display = "flex";
  document.getElementById(SECTIONS[section].page).classList.add("active");
  currentSection = section;
  buildSectionNav(section);
  renderAllLists();
  updateFloatingCart();
  window.scrollTo(0, 0);
  trackEvent("view", { page: section });
}

function _goBackNow() {
  hideAllScreens();
  document.getElementById("floatingWidget").style.display = "none";
  document.getElementById("welcomeScreen").classList.add("active");
  currentSection = null;
  window.scrollTo(0, 0);
}

// =====================
// PAGE TRANSITION (ZYNT SHUTTER)
// =====================
const ZT_LABELS = {
  accounts: "LOADING ACCOUNTS",
  cars: "LOADING GARAGE",
  anime: "LOADING ANIME GARAGE",
  cpm1: "LOADING CPM1 SERVICES",
  cpm2: "LOADING CPM2 SERVICES",
  home: "BACK TO LOBBY"
};
let ztBusy = false;

function ztBuild() {
  if (document.getElementById("ztOverlay")) return;
  const ov = document.createElement("div");
  ov.className = "zt-overlay";
  ov.id = "ztOverlay";
  ov.setAttribute("aria-hidden", "true");

  let slabs = "";
  for (let i = 0; i < 6; i++) {
    slabs += `<span class="zt-slab" style="--i:${i}"></span>`;
  }
  let segs = "";
  for (let i = 0; i < 12; i++) {
    segs += `<span class="zt-seg${i >= 9 ? " redline" : ""}" style="--i:${i}"></span>`;
  }
  ov.innerHTML = `
    ${slabs}
    <div class="zt-hud">
      <div class="zt-segs">${segs}</div>
      <div class="zt-label" id="ztLabel"></div>
    </div>`;
  document.body.appendChild(ov);
}

function runTransition(label, swapFn) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { swapFn(); triggerLineLoader(); return; }
  if (ztBusy) return;
  ztBusy = true;

  ztBuild();
  const ov = document.getElementById("ztOverlay");
  document.getElementById("ztLabel").textContent = label + "…";

  ov.className = "zt-overlay is-active";
  void ov.offsetWidth;                       // reflow para gumana ang transition
  ov.classList.add("is-cover");              // 1) bumaba ang shutters

  setTimeout(swapFn, 470);                   // 2) palit ng page habang natatakpan

  setTimeout(() => {                         // 3) bukas ulit ang shutters
    ov.classList.remove("is-cover");
    ov.classList.add("is-reveal");
  }, 760);

  setTimeout(() => {                         // 4) linis
    ov.className = "zt-overlay";
    ztBusy = false;
  }, 1260);
}

function goToSection(section) {
  if (!SECTIONS[section] || section === currentSection) return;
  runTransition(ZT_LABELS[section] || "LOADING", () => _goToSectionNow(section));
}

function goBack() {
  runTransition(ZT_LABELS.home, () => _goBackNow());
}

function formatPrice(n) { return "₱" + n.toLocaleString(); }

// =====================
// LINE LOADER ANIMATION
// =====================
let loaderTimer = null;

function triggerLineLoader() {
  const bar = document.getElementById("topLineLoader");
  if (!bar) return;

  clearTimeout(loaderTimer);
  bar.classList.remove("loading", "done");
  bar.style.width = "0%";
  void bar.offsetWidth; // Force reflow para mag-reset ang animation

  bar.classList.add("loading");

  loaderTimer = setTimeout(() => {
    bar.classList.remove("loading");
    bar.classList.add("done");

    setTimeout(() => {
      bar.style.opacity = "0";
      setTimeout(() => {
        bar.classList.remove("done");
        bar.style.width = "0%";
      }, 250);
    }, 220);
  }, 260);
}

// =====================
// RENDER CARDS
// =====================
// Placeholder kapag wala pa ang image file
function imgFallback(img) {
  img.onerror = null;
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#e62e3d";
  const name = (img.dataset.name || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="100%" height="100%" fill="#1c202b"/><text x="50%" y="50%" fill="${accent}" font-family="Arial,sans-serif" font-size="30" font-weight="700" text-anchor="middle" dominant-baseline="middle">${name}</text></svg>`;
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function buildCard(item, itemType) {
  const safe = item.name.replace(/'/g, "\\'");
  const inCart = !!unifiedCart[item.id];
  return `
    <div class="card">
      <div class="car-img" onclick="openLightbox(this.querySelector('img').src,'${safe}')">
        <img src="${item.image}" alt="${item.name}" data-name="${item.name.replace(/"/g, "&quot;")}" loading="lazy" onerror="imgFallback(this)" />
        <span class="zoom-hint">🔍 Expand</span>
      </div>
      <div class="card-body">
        <div class="car-name">${item.name}</div>
        <div class="car-specs">${item.specs}</div>
        <div class="car-tags">${item.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
        <div class="card-footer">
          <div>
            <span class="price-label">Price</span>
            <span class="price">${formatPrice(item.price)}</span>
          </div>
          <button class="add-btn ${inCart ? "added" : ""}" onclick="toggleCartItem(${item.id}, '${itemType}')">
            ${inCart ? "✓ In Cart" : "+ Add"}
          </button>
        </div>
      </div>
    </div>`;
}

function renderPackages() {
  document.getElementById("packagesGrid").innerHTML = accountPackages
    .map(pkg => buildCard(pkg, "ACCOUNT"))
    .join("");
}

function renderServices() {
  const g1 = document.getElementById("cpm1Grid");
  const g2 = document.getElementById("cpm2Grid");
  if (g1) g1.innerHTML = cpm1Services.map(s => buildCard(s, "CPM1 SERVICE")).join("");
  if (g2) g2.innerHTML = cpm2Services.map(s => buildCard(s, "CPM2 SERVICE")).join("");
}

function renderAnime() {
  const grid = document.getElementById("animeGrid");
  const emptyMsg = document.getElementById("animeEmptyMsg");
  if (!grid) return;
  const q = (document.getElementById("animeSearchInput")?.value || "").toLowerCase().trim();
  let list = animeCars;
  if (q) list = list.filter(c => c.name.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q)));
  if (!list.length) {
    grid.innerHTML = "";
    emptyMsg.style.display = "block";
    return;
  }
  emptyMsg.style.display = "none";
  grid.innerHTML = list.map(car => buildCard(car, "ANIME CAR")).join("");
}

function renderAllLists() {
  renderPackages();
  renderServices();
  renderGrid();
  renderAnime();
}

function renderGrid() {
  const grid = document.getElementById("carGrid");
  const emptyMsg = document.getElementById("emptyMsg");
  const searchQuery = (document.getElementById("carSearchInput")?.value || "").toLowerCase().trim();

  let list = activeFilter === "all" ? cars : cars.filter(c => c.category === activeFilter);
  if (searchQuery) {
    list = list.filter(c => c.name.toLowerCase().includes(searchQuery) || c.tags.some(t => t.toLowerCase().includes(searchQuery)));
  }

  if (!list.length) {
    grid.innerHTML = "";
    emptyMsg.style.display = "block";
    return;
  }
  emptyMsg.style.display = "none";
  grid.innerHTML = list.map(car => buildCard(car, "CPM1")).join("");
}

function filterCars(type, btn) {
  activeFilter = type;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderGrid();
  triggerLineLoader();
}

// =====================
// CART OPERATIONS
// =====================
function toggleCartItem(id, type) {
  if (unifiedCart[id]) {
    delete unifiedCart[id];
  } else {
    const SOURCES = {
      "ACCOUNT": accountPackages,
      "CPM1 SERVICE": cpm1Services,
      "CPM2 SERVICE": cpm2Services,
      "ANIME CAR": animeCars
    };
    const source = SOURCES[type] || cars;
    const found = source.find(x => x.id === id);
    if (found) unifiedCart[id] = { ...found, badge: type, qty: 1 };
  }
  refreshUI();
}

function changeItemQty(id, delta) {
  if (!unifiedCart[id]) return;
  unifiedCart[id].qty += delta;
  if (unifiedCart[id].qty <= 0) delete unifiedCart[id];
  refreshUI();
}

function removeCartItem(id) {
  delete unifiedCart[id];
  refreshUI();
}

function refreshUI() {
  renderAllLists();
  updateFloatingCart();
  renderCartDrawer();
}

function calculateCartTotals() {
  const items = Object.values(unifiedCart);
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const finalTotal = Math.max(0, subtotal - discountAmount);
  return { items, totalQty, subtotal, finalTotal };
}

function updateFloatingCart() {
  const { totalQty, finalTotal } = calculateCartTotals();
  document.getElementById("floatCartCount").textContent = totalQty;
  document.getElementById("floatCartTotal").textContent = formatPrice(finalTotal);
}

// =====================
// CART DRAWER & PROMOS
// =====================
function openCartDrawer() {
  document.getElementById("sukiPointsDisplay").textContent = sukiPoints;
  goToCheckoutStep(1);
  renderCartDrawer();
  document.getElementById("cartDrawerOverlay").classList.add("visible");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  document.getElementById("cartDrawerOverlay").classList.remove("visible");
  document.body.style.overflow = "";
}

function closeCartDrawerOnOutside(e) {
  if (e.target.id === "cartDrawerOverlay") closeCartDrawer();
}

function renderCartDrawer() {
  const { items, totalQty, subtotal, finalTotal } = calculateCartTotals();
  const listEl = document.getElementById("drawerItemsList");

  if (!items.length) {
    listEl.innerHTML = `<div style="text-align:center;color:#6b7280;padding:24px;">Your cart is empty. Add cars, packages or services first!</div>`;
  } else {
    listEl.innerHTML = items.map(item => `
      <div class="drawer-item">
        <div class="drawer-item-info">
          <div>
            <span class="drawer-item-badge">${item.badge}</span>
            <span class="drawer-item-name">${item.name}</span>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeItemQty(${item.id}, -1)">−</button>
            <span style="font-size:13px;font-weight:700;">${item.qty}</span>
            <button class="qty-btn" onclick="changeItemQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <div class="drawer-item-right">
          <span class="drawer-item-price">${formatPrice(item.price * item.qty)}</span>
          <button class="remove-btn" onclick="removeCartItem(${item.id})">REMOVE</button>
        </div>
      </div>
    `).join("");
  }

  document.getElementById("drawerTotalPrice").textContent = formatPrice(finalTotal);
  const usdEst = (finalTotal / 58).toFixed(2);
  document.getElementById("currencyEstimate").textContent = `≈ $${usdEst} USD · You pay in PHP.`;

  // Freebie Goal (₱150 target for Free Mystery Car)
  const freebieTarget = 150;
  const remaining = Math.max(0, freebieTarget - subtotal);
  const percent = Math.min(100, (subtotal / freebieTarget) * 100);
  document.getElementById("freebieProgress").style.width = `${percent}%`;
  document.getElementById("freebieText").innerHTML = remaining > 0
    ? `${formatPrice(remaining)} more for your <strong>FREE MYSTERY CAR!</strong>`
    : `🎉 <strong>UNLOCKED: FREE MYSTERY CAR INCLUDED!</strong>`;

  // Update Step 2 Banner
  document.getElementById("step2SummaryBanner").textContent = `${totalQty} ITEM${totalQty !== 1 ? "S" : ""} · TOTAL: ${formatPrice(finalTotal)}`;
}

function applyVoucher() {
  const code = document.getElementById("voucherInput").value.trim().toUpperCase();
  const msgEl = document.getElementById("voucherMsg");
  if (code === "ZYNT10" || code === "RVS10") {
    discountAmount = 10;
    appliedVoucherCode = code;
    msgEl.style.color = "#34d399";
    msgEl.textContent = `✓ Voucher ${code} applied! (-₱10 discount)`;
  } else {
    discountAmount = 0;
    appliedVoucherCode = "";
    msgEl.style.color = "#f87171";
    msgEl.textContent = "Invalid voucher code. Try ZYNT10";
  }
  renderCartDrawer();
  updateFloatingCart();
}

function dailyCheckIn() {
  const today = new Date().toDateString();
  if (localStorage.getItem("zyntLastCheckIn") === today) {
    alert("You already claimed your Suki Points today! Come back tomorrow.");
    return;
  }
  sukiPoints += 5;
  localStorage.setItem("zyntSukiPoints", sukiPoints);
  localStorage.setItem("zyntLastCheckIn", today);
  document.getElementById("sukiPointsDisplay").textContent = sukiPoints;
  alert("🎉 +5 Suki Points added!");
}

// =====================
// CHECKOUT STEPS & MESSENGER
// =====================
function goToCheckoutStep(step) {
  const { items } = calculateCartTotals();
  if (step === 2 && !items.length) {
    alert("Maglagay muna ng kotse, package o service sa cart bago mag-proceed sa payment!");
    return;
  }
  document.getElementById("checkoutStep1").style.display = step === 1 ? "block" : "none";
  document.getElementById("checkoutStep2").style.display = step === 2 ? "block" : "none";
  document.getElementById("step1Label").classList.toggle("active", step === 1);
  document.getElementById("step2Label").classList.toggle("active", step === 2);
}

function selectPaymentMethod(method, btn) {
  selectedPayment = method;
  document.querySelectorAll(".pay-tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");

  const inst = document.getElementById("payInstruction");
  const qrAcc = document.getElementById("qrAccountDetails");
  if (method === "GCash") {
    inst.textContent = "Scan the QR to pay with GCash. Tap Show QR below.";
    qrAcc.textContent = "GCash: 09XX-XXX-XXXX (Zynt Shop)";
  } else if (method === "Maya") {
    inst.textContent = "Scan the QR to pay with Maya. Tap Show QR below.";
    qrAcc.textContent = "Maya: 09XX-XXX-XXXX (Zynt Shop)";
  } else {
    inst.textContent = "International buyers can pay via PayPal. Message us for link.";
    qrAcc.textContent = "PayPal: paypal.me/yourlink";
  }
}

function toggleQRBox() {
  const box = document.getElementById("qrDisplayBox");
  box.style.display = box.style.display === "none" ? "block" : "none";
}

function generateOrderReceiptText(withPhotoNote = false) {
  const { items, subtotal, finalTotal } = calculateCartTotals();
  const note = document.getElementById("sellerNote").value.trim();
  const refNo = document.getElementById("refNoInput").value.trim();
  const sender = document.getElementById("senderNameInput").value.trim();

  let text = `🛒 *ZYNT AUTO-SHOP ORDER*\n`;
  if (orderState.code) text += `🔖 Order #: ${orderState.code}\n`;
  text += `------------------------\n`;
  items.forEach(i => {
    text += `• [${i.badge}] ${i.name} (x${i.qty}) — ${formatPrice(i.price * i.qty)}\n`;
  });
  text += `------------------------\n`;
  if (subtotal >= 150) text += `🎁 FREEBIE: Free Mystery Car Unlocked!\n`;
  if (appliedVoucherCode) text += `🎟️ Voucher (${appliedVoucherCode}): -${formatPrice(discountAmount)}\n`;
  text += `💰 *TOTAL: ${formatPrice(finalTotal)}*\n`;
  text += `💳 Payment: ${selectedPayment}\n`;
  if (refNo) text += `🧾 Ref No.: ${refNo}\n`;
  if (sender) text += `👤 Sender: ${sender}\n`;
  if (note) text += `📝 Note: ${note}\n`;
  if (withPhotoNote) text += `\n📸 *(Attaching payment receipt screenshot below)*`;
  return text;
}

function copyOrderSummary() {
  const { items } = calculateCartTotals();
  if (!items.length) return alert("Walang laman ang cart mo.");
  const receipt = generateOrderReceiptText();
  navigator.clipboard.writeText(receipt).then(() => {
    alert("✓ Order Summary copied! Pwede mo na i-paste sa Messenger.");
  });
}

// =====================
// ORDER IMAGE + MESSENGER
// =====================
let orderState = { blob: null, url: null, code: "", withReceipt: false };

const ORDER_COLORS = {
  bg: "#0d0e12", card: "#151821", border: "#262a36", thumb: "#1c202b",
  text: "#ffffff", muted: "#8b92a5", accent: "#e62e3d"
};
const ORDER_FONT = "'Segoe UI', Arial, sans-serif";

function makeOrderCode() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `ZS-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${rand}`;
}

function loadImageForCanvas(src) {
  return new Promise(resolve => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => resolve(null);
    im.src = src;
  });
}

function canvasRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fitCanvasText(ctx, text, maxW) {
  let t = String(text);
  if (ctx.measureText(t).width <= maxW) return t;
  while (t.length > 1 && ctx.measureText(t + "…").width > maxW) t = t.slice(0, -1);
  return t + "…";
}

function wrapCanvasText(ctx, text, maxW, maxLines) {
  const words = String(text).replace(/\s+/g, " ").trim().split(" ");
  const lines = [];
  let line = "";
  words.forEach(w => {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width <= maxW) { line = test; return; }
    if (line) lines.push(line);
    line = w;
  });
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] += " …";
  }
  return lines.map(l => fitCanvasText(ctx, l, maxW));
}

async function renderOrderCanvas(items, totals, code, note, withPhotos) {
  const C = ORDER_COLORS;
  const W = 1000, PAD = 44, GAP = 14;
  const compact = items.length > 18;
  const rowH = compact ? 104 : 140;
  const thumbW = compact ? 132 : 188;
  const thumbH = rowH - 24;
  const { subtotal, finalTotal } = totals;
  const hasDiscount = discountAmount > 0 && !!appliedVoucherCode;
  const hasFreebie = subtotal >= 150;

  const imgs = withPhotos
    ? await Promise.all(items.map(i => loadImageForCanvas(i.image)))
    : items.map(() => null);

  let stamp = "";
  try {
    stamp = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" });
  } catch (e) { stamp = new Date().toLocaleString(); }

  // Isang paint function: unang takbo = sukat ng taas, pangalawa = totoong drawing
  const paint = (ctx) => {
    const setSpacing = v => { if ("letterSpacing" in ctx) ctx.letterSpacing = v; };
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, 100000);

    // ---- header
    const g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, "#1a1d27");
    g.addColorStop(1, C.bg);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, 150);
    ctx.fillStyle = C.accent;
    ctx.fillRect(0, 0, 10, 150);

    ctx.textAlign = "left";
    ctx.font = `900 54px ${ORDER_FONT}`;
    ctx.fillStyle = C.text;
    ctx.fillText("ZYNT", PAD + 8, 80);
    const zw = ctx.measureText("ZYNT").width;
    ctx.fillStyle = C.accent;
    ctx.fillText("SHOP", PAD + 8 + zw, 80);

    ctx.font = `700 19px ${ORDER_FONT}`;
    ctx.fillStyle = C.muted;
    setSpacing("5px");
    ctx.fillText("ORDER SUMMARY", PAD + 10, 118);
    setSpacing("0px");

    ctx.textAlign = "right";
    ctx.font = `800 28px ${ORDER_FONT}`;
    ctx.fillStyle = C.text;
    ctx.fillText(code, W - PAD, 72);
    ctx.font = `500 20px ${ORDER_FONT}`;
    ctx.fillStyle = C.muted;
    ctx.fillText(stamp, W - PAD, 108);

    // ---- items
    let y = 176;
    items.forEach((item, idx) => {
      ctx.fillStyle = C.card;
      canvasRoundRect(ctx, PAD, y, W - PAD * 2, rowH, 16);
      ctx.fill();
      ctx.strokeStyle = C.border;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // thumbnail (buong larawan, hindi naka-crop)
      const tx = PAD + 12, ty = y + 12;
      ctx.fillStyle = C.thumb;
      canvasRoundRect(ctx, tx, ty, thumbW, thumbH, 10);
      ctx.fill();
      const im = imgs[idx];
      if (im && im.width && im.height) {
        ctx.save();
        canvasRoundRect(ctx, tx, ty, thumbW, thumbH, 10);
        ctx.clip();
        const pad = 6;
        const s = Math.min((thumbW - pad * 2) / im.width, (thumbH - pad * 2) / im.height);
        const dw = im.width * s, dh = im.height * s;
        ctx.drawImage(im, tx + (thumbW - dw) / 2, ty + (thumbH - dh) / 2, dw, dh);
        ctx.restore();
      } else {
        ctx.textAlign = "center";
        ctx.font = `700 14px ${ORDER_FONT}`;
        ctx.fillStyle = C.muted;
        ctx.fillText("NO PHOTO", tx + thumbW / 2, ty + thumbH / 2 + 5);
      }

      const x0 = tx + thumbW + 22;
      const xr = W - PAD - 20;

      // line total (right)
      ctx.textAlign = "right";
      ctx.font = `800 ${compact ? 26 : 32}px ${ORDER_FONT}`;
      ctx.fillStyle = C.text;
      const priceText = formatPrice(item.price * item.qty);
      ctx.fillText(priceText, xr, y + rowH / 2 + (compact ? 9 : 11));
      const pw = ctx.measureText(priceText).width;

      // badge
      ctx.textAlign = "left";
      ctx.font = `800 14px ${ORDER_FONT}`;
      const badge = String(item.badge || "").toUpperCase();
      const bw = ctx.measureText(badge).width + 22;
      const by = y + (compact ? 14 : 18);
      ctx.fillStyle = C.accent;
      canvasRoundRect(ctx, x0, by, bw, 26, 13);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(badge, x0 + 11, by + 18);

      // name
      const maxW = xr - pw - 24 - x0;
      ctx.font = `700 ${compact ? 24 : 30}px ${ORDER_FONT}`;
      ctx.fillStyle = C.text;
      ctx.fillText(fitCanvasText(ctx, item.name, maxW), x0, y + (compact ? 68 : 80));

      // qty line
      ctx.font = `500 ${compact ? 18 : 21}px ${ORDER_FONT}`;
      ctx.fillStyle = C.muted;
      ctx.fillText(`${item.qty} × ${formatPrice(item.price)}`, x0, y + (compact ? 92 : 114));

      y += rowH + GAP;
    });

    y += 10;
    const line = (label, value, color) => {
      ctx.textAlign = "left";
      ctx.font = `500 22px ${ORDER_FONT}`;
      ctx.fillStyle = color || C.muted;
      ctx.fillText(label, PAD + 4, y + 22);
      ctx.textAlign = "right";
      ctx.font = `700 22px ${ORDER_FONT}`;
      ctx.fillStyle = color || C.text;
      ctx.fillText(value, W - PAD - 4, y + 22);
      y += 38;
    };
    line("Subtotal", formatPrice(subtotal));
    if (hasDiscount) line(`Voucher (${appliedVoucherCode})`, `-${formatPrice(discountAmount)}`);
    if (hasFreebie) line("🎁 Free Mystery Car unlocked", "FREE", C.accent);

    // ---- total
    y += 8;
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PAD, y);
    ctx.lineTo(W - PAD, y);
    ctx.stroke();
    y += 16;
    ctx.textAlign = "left";
    ctx.font = `800 30px ${ORDER_FONT}`;
    ctx.fillStyle = C.text;
    ctx.fillText("TOTAL", PAD + 4, y + 52);
    ctx.textAlign = "right";
    ctx.font = `900 56px ${ORDER_FONT}`;
    ctx.fillStyle = C.accent;
    ctx.fillText(formatPrice(finalTotal), W - PAD - 4, y + 56);
    y += 84;

    // ---- payment + note
    ctx.textAlign = "left";
    ctx.font = `500 22px ${ORDER_FONT}`;
    ctx.fillStyle = C.muted;
    ctx.fillText(`Payment: ${selectedPayment}`, PAD + 4, y + 22);
    y += 44;

    if (note) {
      ctx.font = `800 15px ${ORDER_FONT}`;
      ctx.fillStyle = C.accent;
      setSpacing("3px");
      ctx.fillText("NOTE TO SELLER", PAD + 4, y + 16);
      setSpacing("0px");
      ctx.font = `500 22px ${ORDER_FONT}`;
      ctx.fillStyle = C.text;
      const lines = wrapCanvasText(ctx, note, W - PAD * 2 - 8, 3);
      lines.forEach((l, i) => ctx.fillText(l, PAD + 4, y + 48 + i * 30));
      y += 40 + lines.length * 30 + 6;
    }

    // ---- footer
    y += 14;
    ctx.textAlign = "center";
    ctx.font = `700 20px ${ORDER_FONT}`;
    ctx.fillStyle = C.muted;
    ctx.fillText("Salamat sa order! · ZyntShop", W / 2, y + 22);
    ctx.font = `500 16px ${ORDER_FONT}`;
    ctx.fillText("Ipadala ang image na ito sa Messenger para mabilis ma-process.", W / 2, y + 50);
    return y + 78;
  };

  const probe = document.createElement("canvas");
  probe.width = W; probe.height = 10;
  const H = Math.ceil(paint(probe.getContext("2d")));

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  paint(canvas.getContext("2d"));
  return canvas;
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(b => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
    } catch (e) { reject(e); }
  });
}

async function buildOrderImageBlob(items, totals, code, note) {
  try {
    return await canvasToBlob(await renderOrderCanvas(items, totals, code, note, true));
  } catch (e) {
    // Minsan tinatanggihan ng browser ang canvas kapag naka-file:// ang site → ulitin nang walang larawan
    return await canvasToBlob(await renderOrderCanvas(items, totals, code, note, false));
  }
}

function orderFile() {
  if (!orderState.blob || typeof File === "undefined") return null;
  return new File([orderState.blob], `ZyntShop-${orderState.code}.png`, { type: "image/png" });
}

function renderOrderSteps() {
  const steps = [
    "I-<strong>SHARE</strong>, <strong>SAVE</strong> o <strong>COPY</strong> ang order image sa taas.",
    "Pindutin ang <strong>OPEN MESSENGER</strong> — nakopya na ang order text, i-paste lang sa chat.",
    "I-send ang text at ang <strong>order image</strong> (attach o paste) para makita namin ang eksaktong kotse/account na inorder mo."
  ];
  if (orderState.withReceipt) steps.push("Isama rin ang <strong>screenshot ng GCash/Maya receipt</strong> mo.");
  document.getElementById("orderSteps").innerHTML = steps.map(s => `<li>${s}</li>`).join("");
}

function sendOrderToMessenger(withPhotoNote = false) {
  openOrderModal(withPhotoNote);
}

async function openOrderModal(withReceipt) {
  const totals = calculateCartTotals();
  if (!totals.items.length) { alert("Walang laman ang cart mo."); return; }

  orderState.code = makeOrderCode();
  orderState.withReceipt = !!withReceipt;
  if (orderState.url) URL.revokeObjectURL(orderState.url);
  orderState.blob = null;
  orderState.url = null;

  const status = document.getElementById("orderStatus");
  const preview = document.getElementById("orderPreviewImg");
  const shareBtn = document.getElementById("orderShareBtn");
  const saveBtn = document.getElementById("orderSaveBtn");
  const copyBtn = document.getElementById("orderCopyImgBtn");

  status.style.display = "block";
  status.textContent = "Preparing your order image…";
  preview.hidden = true;
  shareBtn.hidden = true;
  copyBtn.hidden = true;
  saveBtn.disabled = true;
  document.getElementById("orderCodeLabel").textContent = `Order # ${orderState.code}`;
  renderOrderSteps();
  document.getElementById("orderModalOverlay").classList.add("visible");

  trackEvent("order", {
    extra: {
      items: totals.items.map(i => ({ n: i.name, q: i.qty, b: i.badge })),
      total: totals.finalTotal,
      pay: selectedPayment,
      code: orderState.code
    }
  });

  const note = document.getElementById("sellerNote").value.trim();
  try {
    const blob = await buildOrderImageBlob(totals.items, totals, orderState.code, note);
    orderState.blob = blob;
    orderState.url = URL.createObjectURL(blob);
    preview.src = orderState.url;
    preview.hidden = false;
    status.style.display = "none";
    saveBtn.disabled = false;

    const f = orderFile();
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) shareBtn.hidden = false;
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) copyBtn.hidden = false;
  } catch (e) {
    status.textContent = "Hindi na-generate ang image. Pindutin ang OPEN MESSENGER at ipadala ang order text, o gamitin ang COPY ORDER SUMMARY.";
  }
}

function closeOrderModal() {
  document.getElementById("orderModalOverlay").classList.remove("visible");
}

async function shareOrderImage() {
  const f = orderFile();
  if (!f) return;
  try {
    await navigator.share({ files: [f], text: generateOrderReceiptText(orderState.withReceipt), title: "ZyntShop Order " + orderState.code });
  } catch (e) {
    if (e && e.name !== "AbortError") alert("Hindi gumana ang Share. Gamitin ang SAVE IMAGE o COPY IMAGE.");
  }
}

function saveOrderImage() {
  if (!orderState.url) return;
  const a = document.createElement("a");
  a.href = orderState.url;
  a.download = `ZyntShop-${orderState.code}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function copyOrderImage() {
  if (!orderState.blob) return;
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": orderState.blob })]);
    alert("✓ Order image copied! I-paste (Ctrl+V / hold & paste) sa Messenger chat.");
  } catch (e) {
    alert("Hindi na-copy ang image. Gamitin ang SAVE IMAGE.");
  }
}

function openMessengerWithOrder() {
  const receipt = generateOrderReceiptText(orderState.withReceipt);
  // Buksan agad ang Messenger (kailangan sa loob ng click para hindi ma-block)
  window.open(`${FB_MESSENGER_LINK}?text=${encodeURIComponent(receipt)}`, "_blank");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(receipt).catch(() => {});
  }
}

// =====================
// INFO MODALS & LIGHTBOX
// =====================
function openInfoModal(type) {
  const titleEl = document.getElementById("infoModalTitle");
  const bodyEl = document.getElementById("infoModalBody");
  if (type === "whatsNew") {
    titleEl.textContent = "✦ WHAT'S NEW?";
    bodyEl.innerHTML = `
      <p>• <strong>335+ Custom CPM Cars</strong> added to our catalog!</p>
      <p>• <strong>Free Mystery Car Promo:</strong> Spend ₱150 or more to automatically unlock a free car.</p>
      <p>• <strong>Voucher Code:</strong> Use code <code>ZYNT10</code> for ₱10 off!</p>
    `;
  } else {
    titleEl.textContent = "? HOW TO ORDER?";
    bodyEl.innerHTML = `
      <p>1. Browse <strong>Cars</strong>, <strong>Accounts</strong> or <strong>CPM1 / CPM2 Services</strong> and click <strong>+ Add</strong>.</p>
      <p>2. Open your <strong>Cart</strong> at the bottom right and click <strong>Proceed to Payment</strong>.</p>
      <p>3. Choose <strong>GCash / Maya</strong>, pay the total, and enter your Reference No.</p>
      <p>4. Click <strong>Order via Messenger</strong> to send your receipt directly to our page!</p>
    `;
  }
  document.getElementById("infoModalOverlay").classList.add("visible");
}

function closeInfoModal() {
  document.getElementById("infoModalOverlay").classList.remove("visible");
}

function openLightbox(src, caption) {
  document.getElementById("lightboxImg").src = src;
  document.getElementById("lightboxCaption").textContent = caption;
  document.getElementById("lightboxOverlay").classList.add("visible");
}

function closeLightbox() {
  document.getElementById("lightboxOverlay").classList.remove("visible");
}
window.addEventListener("DOMContentLoaded", triggerLineLoader);

// =====================
// THEME (DARK = RED, LIGHT = BLUE)
// =====================
function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const label = document.getElementById("themeToggleLabel");
  const btn = document.getElementById("themeToggle");
  const next = theme === "dark" ? "LIGHT MODE" : "DARK MODE";
  if (label) label.textContent = next;
  if (btn) {
    btn.setAttribute("aria-label", "Switch to " + next.toLowerCase());
    btn.title = "Switch to " + next.toLowerCase();
  }
}

function toggleTheme() {
  const root = document.documentElement;
  const next = getTheme() === "dark" ? "light" : "dark";
  root.classList.add("theme-anim");
  applyTheme(next);
  try { localStorage.setItem("zyntTheme", next); } catch (e) {}
  setTimeout(() => root.classList.remove("theme-anim"), 450);
}

window.addEventListener("DOMContentLoaded", () => {
  let saved = "dark";
  try { saved = localStorage.getItem("zyntTheme") === "light" ? "light" : "dark"; } catch (e) {}
  applyTheme(saved);
});

// =====================
// WELCOME INTRO
// =====================
let introTimer = null;
let introEnded = false;

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Magandang madaling-araw";
  if (h < 12) return "Magandang umaga";
  if (h < 18) return "Magandang hapon";
  return "Magandang gabi";
}

function startIntro() {
  const body = document.body;
  const greet = `${timeGreeting()}, ka-Zynt!`;
  const wg = document.getElementById("welcomeGreet");
  if (wg) wg.innerHTML = `<span class="wave">👋</span> ${greet}`;

  const intro = document.getElementById("intro");
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = document.documentElement.classList.contains("skip-intro");
  if (!intro || reduce || seen) {
    if (intro) intro.remove();
    body.classList.remove("intro-playing");
    introEnded = true;
    return;
  }
  const g = document.getElementById("introGreet");
  if (g) g.textContent = greet;
  introTimer = setTimeout(endIntro, 3700);
}

function endIntro() {
  if (introEnded) return;
  introEnded = true;
  clearTimeout(introTimer);
  try { sessionStorage.setItem("zyntIntroSeen", "1"); } catch (e) {}
  const intro = document.getElementById("intro");
  if (intro) intro.classList.add("intro-out");
  setTimeout(() => document.body.classList.remove("intro-playing"), 350);
  setTimeout(() => { if (intro) intro.remove(); }, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
  startIntro();
  trackEvent("visit");
});