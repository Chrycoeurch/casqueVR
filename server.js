const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

const questions = [
  {
    id: 1,
    question: "Quel est votre objectif principal en VR ?",
    multiple: true,
    options: [
      "🎮 Jouer (action, aventure, FPS, RPG…)",
      "🏋️ Bouger et faire du sport",
      "🧘 Méditer et se relaxer",
      "🎬 Regarder films & vidéos immersives",
      "🖥️ Travailler & être plus productif",
      "👥 Socialiser & rencontrer des gens en VR",
      "🏗️ Créer du contenu en VR"
    ]
  },
  {
    id: 2,
    question: "Comment qualifieriez-vous votre rapport à la technologie ?",
    options: [
      "🛠 Geek confirmé",
      "🔍 Curieux mais pas expert",
      "🏖 Casual"
    ]
  },
  {
    id: 3,
    question: "Quelle est votre tolérance au motion sickness ?",
    options: [
      "✅ Aucune",
      "⚠️ Légère",
      "❌ Forte"
    ]
  },
  {
    id: 4,
    question: "Combien de temps pensez-vous passer en VR par semaine ?",
    type: "range",
    min: 1,
    max: 30,
    step: 1,
    unit: "h"
  },
  {
    id: 5,
    question: "Aimez-vous bidouiller votre matériel ?",
    options: [
      "✅ Oui, j'adore modder",
      "🤷 Moyen",
      "❌ Non"
    ]
  },
  {
    id: 6,
    question: "Préférez-vous une expérience solo ou multijoueur en VR ?",
    options: [
      "👤 Plutôt solo",
      "👥 Plutôt multi",
      "🎭 Un mix des deux"
    ]
  },
  {
    id: 7,
    question: "Quel est votre budget total pour votre équipement VR ?",
    type: "range",
    min: 100,
    max: 3000,
    step: 100,
    unit: "€"
  },
  {
    id: 8,
    question: "Avez-vous un PC puissant ?",
    options: [
      "✅ Oui, une config gamer",
      "⚠️ Moyen",
      "❌ Non"
    ]
  },
  {
    id: 9,
    question: "Quel espace de jeu avez-vous à disposition ?",
    options: [
      "🪑 Petit (<2m²)",
      "🏠 Moyen (2-4m²)",
      "🏟️ Grand (>4m²)"
    ]
  },
  {
    id: 10,
    question: "Êtes-vous sensible au poids et au confort du casque ?",
    options: [
      "❌ Pas du tout",
      "🤷 Moyen",
      "✅ Oui"
    ]
  }
];

const vrHeadsets = {
  quest3: {
    name: "Meta Quest 3",
    image: "/images/quest3.avif",
    description: "Le Meta Quest 3 est le choix parfait pour ceux qui cherchent un casque VR polyvalent et performant. Avec sa puissance accrue et sa technologie de réalité mixte, il offre une expérience immersive exceptionnelle pour le gaming et bien plus encore.",
    pointsForts: [
      "Technologie de réalité mixte avancée",
      "Autonomie complète sans PC",
      "Processeur Snapdragon XR2 Gen 2",
      "Bibliothèque de jeux Meta exclusive"
    ],
    price: 549.99,
    link: "https://fliz.ly/XPn6n_6527b35ebe99f942031cfc37?location=https%3A%2F%2Fwww.realite-virtuelle.com%2Fguide-comparatif-casque-vr%2F"
  },
  psvr2: {
    name: "Sony PlayStation VR2",
    image: "/images/vr2.webp",
    description: "Le PlayStation VR2 est idéal pour les joueurs PS5. Avec ses contrôleurs haptiques et son affichage 4K HDR, il offre une expérience gaming premium et des exclusivités PlayStation impressionnantes.",
    pointsForts: [
      "Retour haptique révolutionnaire",
      "Exclusivités PlayStation",
      "Écran OLED 4K HDR",
      "Suivi oculaire intégré"
    ],
    price: 599.99,
    link: "https://fliz.ly/ZrnMW_648ba3bfe44f3b7fca50c5dd?location=https%3A%2F%2Fwww.realite-virtuelle.com%2Fguide-comparatif-casque-vr%2F"
  },
  pico4: {
    name: "Pico 4",
    image: "/images/pico.webp",
    description: "Le Pico 4 se distingue par son excellent rapport qualité-prix et son design compact. Particulièrement adapté pour ceux qui recherchent un casque léger et confortable avec une bonne qualité d'image.",
    pointsForts: [
      "Design ultra-compact et léger",
      "Meilleur rapport qualité-prix",
      "Pancake lenses innovantes",
      "Batterie arrière équilibrée"
    ],
    price: 429.99,
    link: "https://fliz.ly/4qgkz_67cf08c57a12d901deeaca22?location=https%3A%2F%2Fwww.realite-virtuelle.com%2Fguide-comparatif-casque-vr%2F"
  },
  vivepro2: {
    name: "HTC Vive Pro 2",
    image: "/images/vivepro.jpg",
    description: "Le HTC Vive Pro 2 est le choix des professionnels et des enthousiastes exigeants. Avec sa résolution 5K et son grand champ de vision, il offre une qualité visuelle incomparable pour la VR sur PC.",
    pointsForts: [
      "Résolution 5K exceptionnelle",
      "Tracking précis lighthouse",
      "Audio haute-fidélité intégré",
      "Compatible SteamVR natif"
    ],
    price: 1399.99,
    link: "https://fliz.ly/7zwBb_6396f67258bdcee7c6b671cb?location=https%3A%2F%2Fwww.realite-virtuelle.com%2Fguide-comparatif-casque-vr%2F"
  },
  cosmos: {
    name: "HTC Vive Cosmos Elite",
    image: "/images/cosmos.jpg",
    description: "Le Vive Cosmos Elite combine modularité et précision. Parfait pour les utilisateurs cherchant un système évolutif avec un excellent suivi et une compatibilité SteamVR native.",
    pointsForts: [
      "Façade modulaire unique",
      "Compatibilité accessoires Vive",
      "Tracking hybride innovant",
      "Casque flip-up pratique"
    ],
    price: 899.99,
    link: "https://fliz.ly/E5MgW_63c26ea7dd44cadc8264f8d0?location=https%3A%2F%2Fwww.realite-virtuelle.com%2Fguide-comparatif-casque-vr%2F"
  },
  visionpro: {
    name: "Apple Vision Pro",
    image: "/images/apple.avif",
    description: "L'Apple Vision Pro représente le summum de la technologie XR. Avec son interface révolutionnaire et sa qualité de fabrication premium, il est idéal pour la productivité et les expériences mixed reality haut de gamme.",
    pointsForts: [
      "Interface EyeSight unique",
      "Processeur M2 ultra-puissant",
      "Écrans micro-OLED 4K",
      "Écosystème Apple intégré"
    ],
    price: 3499.99,
    link: "https://fliz.ly/dlXzx_65c418aced814ea5e4572c4f?location=https%3A%2F%2Fwww.realite-virtuelle.com%2Fguide-comparatif-casque-vr%2F"
  }
};

app.get('/', (req, res) => {
  res.render('index', { questions });
});

app.post('/submit', (req, res) => {
  const allHeadsets = Object.values(vrHeadsets);
  res.json({ headsets: allHeadsets });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});