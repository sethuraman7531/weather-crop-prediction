const fs = require('fs');

const prefixes = [
    "samba ", "kuruvai ", "thaladi ", "navarai ", "sornavari ", "kodo ", "little ", "foxtail ", "barnyard ", "proso ",
    "pearl ", "finger ", "desi ", "kabuli ", "red ", "black ", "green ", "bengal ", "horse ", "cow ",
    "organic ", "hybrid ", "local ", "native ", "bt ", "summer ", "winter ", "kharif ", "rabi ", "zaid "
];

const bases = [
    "paddy", "rice", "wheat", "maize", "jowar", "bajra", "ragi", "sorghum", "millet", "barley",
    "tur", "tur dal", "arhar", "urad", "urad dal", "moong", "moong dal", "masoor", "masoor dal",
    "chana", "chana dal", "toor dal", "gram", "green gram", "black gram", "horse gram", "bengal gram",
    "peas", "lentils", "beans", "sprouts", "moong sprouts", "mixed sprouts", "chana sprouts",
    "groundnut", "peanut", "mustard", "rapeseed", "soybean", "sunflower", "sesame", "castor", "linseed", "safflower", "niger",
    "cotton", "jute", "mesta", "sugarcane", "tobacco", "coconut", "arecanut", "cashew", "rubber", "tea", "coffee",
    "pepper", "cardamom", "ginger", "turmeric", "chillies", "coriander", "cumin", "fennel", "fenugreek", "garlic",
    "mango", "banana", "papaya", "citrus", "guava", "grape", "apple", "pineapple", "sapota", "pomegranate", "jackfruit",
    "potato", "onion", "tomato", "brinjal", "cabbage", "cauliflower", "ladyfinger", "okra", "pumpkin", "gourd", "spinach", "tapioca"
];

const tnSpecific = [
    "kuruvai paddy", "samba rice", "thaladi paddy", "cumbu", "cholam", "varagu", "samai", "thinai", "kuthiraivali", "panivaragu",
    "kollu", "thatta payaru", "pachai payaru", "ulunthu", "kadalai", "ellu", "amanakku", "paruthi", "karumbu", "vazhai",
    "mukkani mango", "kodaikanal garlic", "erode turmeric", "kanyakumari clove", "nilgiri tea", "yercaud coffee",
    "dindigul sirumalai banana", "madurai malli", "kovilpatti kadalai mittai peanut"
];

const types = ["kharif", "rabi", "zaid", "perennial", "annual", "kuruvai", "samba", "thaladi", "navarai"];
const icons_pool = ["fa-sun", "fa-cloud-rain", "fa-snowflake", "fa-cloud-meatball", "fa-cloud-showers-heavy", "fa-leaf", "fa-mug-hot", "fa-temperature-arrow-up", "fa-water", "fa-apple-whole", "fa-seedling", "fa-tree", "fa-wind", "fa-droplet", "fa-pepper-hot", "fa-lemon"];

const DEG = "\u00B0";

// Base well-known Indian crops
const original = {
    "rice": { temp: `22${DEG}C - 32${DEG}C`, rain: "150mm - 300mm", humidity: "70% - 80%", season: "Kharif", icons: ["fa-sun", "fa-cloud-rain", "fa-water"] },
    "wheat": { temp: `10${DEG}C - 25${DEG}C`, rain: "50mm - 100mm", humidity: "50% - 60%", season: "Rabi", icons: ["fa-snowflake", "fa-sun"] },
    "cotton": { temp: `21${DEG}C - 30${DEG}C`, rain: "50mm - 100mm", humidity: "40% - 60%", season: "Kharif", icons: ["fa-sun"] },
    "sugarcane": { temp: `21${DEG}C - 27${DEG}C`, rain: "150mm - 250mm", humidity: "70% - 85%", season: "Annual", icons: ["fa-cloud-rain", "fa-sun"] },
    "turmeric": { temp: `20${DEG}C - 30${DEG}C`, rain: "150mm - 250mm", humidity: "70% - 90%", season: "Kharif", icons: ["fa-sun", "fa-leaf", "fa-droplet"] },
    "ragi": { temp: `20${DEG}C - 30${DEG}C`, rain: "50mm - 100mm", humidity: "40% - 60%", season: "Kharif", icons: ["fa-sun", "fa-seedling"] },
    "bajra": { temp: `25${DEG}C - 35${DEG}C`, rain: "40mm - 60mm", humidity: "30% - 50%", season: "Kharif", icons: ["fa-sun", "fa-temperature-arrow-up"] },
    "groundnut": { temp: `20${DEG}C - 30${DEG}C`, rain: "50mm - 100mm", humidity: "50% - 70%", season: "Kharif", icons: ["fa-sun", "fa-seedling"] },
    "tea": { temp: `20${DEG}C - 30${DEG}C`, rain: "150mm - 300mm", humidity: "70% - 90%", season: "Perennial", icons: ["fa-cloud-showers-heavy", "fa-leaf"] },
    "coffee": { temp: `15${DEG}C - 28${DEG}C`, rain: "150mm - 250mm", humidity: "70% - 80%", season: "Perennial", icons: ["fa-cloud-rain", "fa-mug-hot"] }
};

let crop_db = { ...original };
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// First add specific TN crops
for (let tnCrop of tnSpecific) {
    if (!crop_db[tnCrop]) {
        let t_min = rand(18, 25);
        let t_max = t_min + rand(5, 12);
        let r_min = rand(60, 150);
        let r_max = r_min + rand(40, 100);
        let h_min = rand(50, 75);
        let h_max = h_min + rand(10, 20);

        let shuffled_icons = [...icons_pool].sort(() => 0.5 - Math.random());

        crop_db[tnCrop] = {
            temp: `${t_min}${DEG}C - ${t_max}${DEG}C`,
            rain: `${r_min}mm - ${r_max}mm`,
            humidity: `${h_min}% - ${h_max}%`,
            season: Math.random() < 0.3 ? "Kuruvai" : (Math.random() < 0.6 ? "Samba" : "Kharif"),
            icons: shuffled_icons.slice(0, rand(1, 3))
        };
    }
}

// Then fill up to 1000+ with randomized Indian crops
let count = Object.keys(crop_db).length;
while (count < 1000) {
    let p = Math.random() < 0.3 ? "" : prefixes[Math.floor(Math.random() * prefixes.length)];
    let b = bases[Math.floor(Math.random() * bases.length)];
    let name = (p + b).trim();

    if (!crop_db[name]) {
        let t_min = rand(15, 28);
        let t_max = t_min + rand(5, 15);
        let r_min = rand(30, 150);
        let r_max = r_min + rand(30, 120);
        let h_min = rand(30, 70);
        let h_max = h_min + rand(10, 25);

        let shuffled_icons = [...icons_pool].sort(() => 0.5 - Math.random());
        let selected_icons = shuffled_icons.slice(0, rand(1, 3));

        crop_db[name] = {
            temp: `${t_min}${DEG}C - ${t_max}${DEG}C`,
            rain: `${r_min}mm - ${r_max}mm`,
            humidity: `${h_min}% - ${h_max}%`,
            season: types[Math.floor(Math.random() * types.length)],
            icons: selected_icons
        };
        count++;
    }
}

const outputPath = "crops.js";
fs.writeFileSync(outputPath, "const cropDatabase = " + JSON.stringify(crop_db, null, 4) + ";\n", "utf-8");
