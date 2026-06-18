import { Product, ShopInfo } from './types';

export const SHOP_INFO: ShopInfo = {
  name: "goodtobe.sparkle",
  slogan: "Dope unisex beaded accessories for everyone. Handcrafted in IDN.",
  about: "goodtobe.sparkle adalah creative hub independen penyedia aksesori gelang dan cincin manik-manik estetik berdesain unisex, bergaya soft brutalism, playful dan dinamis untuk melengkapi OOTD harian anak muda Gen-Z. Setiap rajutan butir manik kami dirancang netral-gender (unisex), kokoh, ramah lingkungan, dan pas untuk menonjolkan keunikan dirimu!",
  whatsappNumber: "6285123324775", // WhatsApp number
  igUsername: "goodtobe.sparkle",
  tiktokUsername: "goodtobe.sparkle",
  address: "Jl. Mangga Dalam, Jakarta Selatan, DKI Jakarta 12420",
  shippingOptions: [
    "Kurir Toko (Rp 5.000)"
  ]
};

export const PRODUCTS: Product[] = [
  {
    id: "g1",
    name: "Gelang Obsidian Star",
    code: "S-0001",
    description: "Gelang manik karet bertema gelap luar angkasa dengan perpaduan beads hitam matte bertekstur, manik abu-abu chrome, dan bintang perak. Sangat kokoh dan maskulin namun tetap playful untuk gaya kasual.",
    price: 18500,
    originalPrice: 24000,
    image: "star-black-chrome",
    category: "Gelang",
    colors: ["#121212", "#e0e0e0", "#b3e5fc"],
    beadsUsed: ["Black Matte Bead", "Chrome Grey Pearl", "Silver Metal Star"],
    isBestSeller: true
  },
  {
    id: "g2",
    name: "Gelang Aurora Pastel",
    code: "S-0002",
    description: "Kombinasi warna mint sage yang menenangkan dengan mutiara biru laut lembut dan kuning cerah. Memberikan vibes segar pagi hari ala retro Y2K vibes yang segar dan netral gender.",
    price: 16000,
    image: "mint-blue-yellow",
    category: "Gelang",
    colors: ["#c8e6c9", "#b3e5fc", "#ffe57f"],
    beadsUsed: ["Mint Sage Bead", "Soft Blue Pearl", "Happy Sunny Bead"]
  },
  {
    id: "g3",
    name: "Gelang Cosmic Dream",
    code: "S-0003",
    description: "Jalinan warna ungu galaksi lembut dikombinasikan dengan putih gading murni dan bintang holografis. Sangat elegan di tangan siapa saja untuk melengkapi outfit monokrom.",
    price: 17500,
    originalPrice: 22000,
    image: "galaxy-purple-white",
    category: "Gelang",
    colors: ["#d1c4e9", "#ffffff", "#ffe57f"],
    beadsUsed: ["Lavender Galaxy Bead", "Pearl White Ring", "Holo Star Accent"],
    isNew: true
  },
  {
    id: "g4",
    name: "Gelang Retro Acid Street",
    code: "S-0004",
    description: "Tampilkan jiwa petualangmu dengan perpaduan warna kontras hijau asam elektrik, hitam arang pekat, dan oranye senja. Sangat pas bagi pencinta streetwear & techno gairah tinggi.",
    price: 19000,
    image: "acid-green-black-orange",
    category: "Gelang",
    colors: ["#00e676", "#121212", "#ffab91"],
    beadsUsed: ["Acid Green Bead", "Charcoal Dark Block", "Sunset Peach Bead"],
    isBestSeller: true
  },
  {
    id: "c1",
    name: "Cincin YinYang Retro",
    code: "S-0005",
    description: "Cincin manik elastis berpola kontras klasik hitam dan putih monokrom dengan aksen pembatas metalik. Sederhana, keren, dan pas untuk dipakai bertumpuk (stacking ring).",
    price: 8500,
    originalPrice: 12000,
    image: "yinyang-black-white",
    category: "Cincin",
    colors: ["#121212", "#ffffff"],
    beadsUsed: ["Minimalist Black Bead", "Pure Pearl White"],
    isBestSeller: true
  },
  {
    id: "c2",
    name: "Cincin Cyber Acid Neon",
    code: "S-0006",
    description: "Cincin mini estetik dengan kombinasi manik biru neon elektrik dan abu-abu chrome metalik yang berkelas mendalam. Siap mencuri perhatian di jemarimu.",
    price: 9000,
    image: "cyber-neon-blue",
    category: "Cincin",
    colors: ["#b3e5fc", "#121212", "#c8e6c9"],
    beadsUsed: ["Electric Blue Bead", "Smoky Matte Bead"],
    isNew: true
  },
  {
    id: "c3",
    name: "Cincin Smiley Sunrise",
    code: "S-0007",
    description: "Cincin manik penuh keceriaan bermotif emoticon senyum kuning diapit oleh manik-manik berwarna jingga oranye senja yang segar nan ceria.",
    price: 8000,
    image: "smiley-peach",
    category: "Cincin",
    colors: ["#ffe57f", "#ffab91", "#ffffff"],
    beadsUsed: ["Happy Smiley Bead", "Orange Sunset Pearl"],
    isNew: true
  },
  {
    id: "c4",
    name: "Cincin Amethyst Earth",
    code: "S-0008",
    description: "Keseimbangan alam luar biasa dari manik kristal ungu lavender muda dengan butiran manik pasir coklat tanah yang hangat & membumi.",
    price: 9500,
    image: "earth-purple-brown",
    category: "Cincin",
    colors: ["#d1c4e9", "#ffccbc", "#c8e6c9"],
    beadsUsed: ["Amethyst Lilac Bead", "Warm Sand Bead"]
  }
];
