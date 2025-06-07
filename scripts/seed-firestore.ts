import 'dotenv/config';

// Firestore seeding script with all products hardcoded

import { db } from '../src/lib/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import type { Product } from '../src/types';

// Verify Firebase config is loaded (optional, for debugging)
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error("ERROR: Firebase project ID is not loaded. Ensure .env file is configured and dotenv/config is imported first.");
  process.exit(1);
}

// All products hardcoded from mock-data.ts
const products: Product[] = [
  {
    id: 'agri-1',
    name: 'De-Compose',
    description: 'An advanced bio-formulation to accelerate the decomposition of organic farm waste, turning it into nutrient-rich compost quickly. Ideal for breaking down crop residues, manure, and other organic materials, enriching your soil naturally.',
    price: 25.99,
    imageSrc: '/images/products/de compose.png',
    imageAlt: 'Container of De-Compose',
    category: 'Agriculture',
    dataAiHint: 'compost accelerator',
    rating: 4.5,
    reviewCount: 120,
    availability: 'In Stock',
    features: [
      'Rapidly breaks down organic farm waste.',
      'Enriches soil with vital nutrients.',
      'Reduces waste volume significantly.',
      'Easy to apply formulation.',
      'Eco-friendly and sustainable solution.'
    ],
    howToUse: [
      'Prepare a 1:100 solution (1 part De-Compose to 100 parts water).',
      'Evenly spray the solution over the organic waste pile.',
      'Turn the pile weekly for optimal aeration and decomposition.',
      'Compost is typically ready in 4-6 weeks, depending on conditions.'
    ],
    ingredients: ['Consortium of cellulolytic and lignolytic microorganisms', 'Stabilizers', 'Carrier materials'],
    safetyInfo: 'Store in a cool, dry place away from direct sunlight. Keep out of reach of children. Wear gloves during application if sensitive skin.'
  },
  {
    id: 'agri-2',
    name: 'Bio fertilizer',
    description: 'A powerful blend of beneficial microbes that enhance soil fertility, improve nutrient uptake, and promote vigorous plant growth for various crops.',
    price: 18.50,
    imageSrc: '/images/products/bio fertilizer.png',
    imageAlt: 'Bag of Bio fertilizer',
    category: 'Agriculture',
    dataAiHint: 'fertilizer bag',
    rating: 4.2,
    reviewCount: 95,
    availability: 'In Stock',
    features: [
      'Boosts soil microbial activity.',
      'Improves nutrient availability to plants.',
      'Enhances root development.',
      'Suitable for a wide range of crops.'
    ],
    howToUse: [
      'Mix with soil during planting or top-dress around existing plants. Follow package instructions for specific crop application rates.'
    ],
    ingredients: ['Nitrogen-fixing bacteria (e.g., Azotobacter, Rhizobium)', 'Phosphate-solubilizing bacteria', 'Potash-mobilizing bacteria', 'Organic carrier material'],
    safetyInfo: 'Wash hands after use. Keep away from pets and children.'
  },
  {
    id: 'agri-3',
    name: 'Bio Fungicide',
    description: 'An organic solution to control and prevent fungal diseases in crops, ensuring healthier plants and better yields without harmful chemicals.',
    price: 22.00,
    imageSrc: '/images/products/bio fungicide.png',
    imageAlt: 'Bottle of Bio Fungicide',
    category: 'Agriculture',
    dataAiHint: 'fungicide bottle',
    rating: 4.0,
    reviewCount: 78,
    availability: 'In Stock',
    features: [
      'Effective against common fungal pathogens.',
      'Safe for beneficial insects and pollinators.',
      'No chemical residues.',
      'Strengthens plant defense mechanisms.'
    ],
    howToUse: [
      'Dilute as per instructions and apply as a foliar spray or soil drench. Repeat applications as needed for disease prevention or control.'
    ],
    ingredients: ['Bacillus subtilis strains', 'Trichoderma species', 'Natural plant extracts with fungicidal properties'],
    safetyInfo: 'Avoid inhalation of spray mist. Wash hands after use. Store in a cool place.'
  },
  {
    id: 'agri-4',
    name: 'Bio Pesticide',
    description: 'Effectively manages a broad spectrum of agricultural pests using natural ingredients, safe for the environment and beneficial insects.',
    price: 20.75,
    imageSrc: '/images/products/bio pesticide.png',
    imageAlt: 'Bottle of Bio Pesticide',
    category: 'Agriculture',
    dataAiHint: 'pesticide spray',
    rating: 3.9,
    reviewCount: 0,
    availability: 'Out of Stock',
    features: ['Broad-spectrum pest control.', 'Non-toxic to humans and pets when used as directed.', 'Biodegradable formulation.'],
    howToUse: [
      'Apply at first sign of pest infestation. Ensure thorough coverage of plant surfaces. Refer to label for specific pest instructions.'
    ],
    ingredients: ['Neem oil extract', 'Beauveria bassiana', 'Pyrethrins (from chrysanthemum flowers)'],
    safetyInfo: 'Keep out of eyes. Use in well-ventilated areas.'
  },
  {
    id: 'agri-5',
    name: 'MYCO POWER',
    description: 'A mycorrhizal inoculant that establishes a symbiotic relationship with plant roots, greatly enhancing nutrient and water absorption.',
    price: 29.99,
    imageSrc: '/images/products/myco powder.png',
    imageAlt: 'Container of MYCO POWER',
    category: 'Agriculture',
    dataAiHint: 'mycorrhizal inoculant',
    rating: 4.8,
    reviewCount: 150,
    availability: 'In Stock',
    features: ['Increases root surface area.', 'Improves drought tolerance.', 'Enhances plant establishment.'],
    howToUse: [
      'Apply directly to roots during transplanting or mix into planting soil.'
    ],
    ingredients: ['Endomycorrhizal fungi spores', 'Ectomycorrhizal fungi spores', 'Bio-stimulants', 'Carrier material'],
    safetyInfo: 'Store in a cool, dry environment.'
  },
  {
    id: 'agri-6',
    name: 'Sea Wonder- Seaweed Extract',
    description: 'Concentrated seaweed extract rich in natural growth stimulants, trace elements, and vitamins to boost plant health and stress resistance.',
    price: 15.50,
    imageSrc: '/images/products/sea wonder.png',
    imageAlt: 'Bottle of Sea Wonder Seaweed Extract',
    category: 'Agriculture',
    dataAiHint: 'seaweed extract',
    rating: 4.6,
    reviewCount: 110,
    availability: 'In Stock',
    features: ['Rich in micronutrients and plant hormones.', 'Improves plant vigor and stress recovery.', 'Enhances fruit set and quality.'],
    howToUse: [
      'Dilute with water and apply as a foliar spray or soil drench. Suitable for all stages of plant growth.'
    ],
    ingredients: ['Concentrated Ascophyllum nodosum seaweed extract'],
    safetyInfo: 'Do not ingest. Keep away from children.'
  },
  {
    id: 'agri-7',
    name: 'Nature Choice',
    description: 'A versatile organic plant food suitable for a wide range of crops, providing balanced nutrition for optimal growth and productivity.',
    price: 17.00,
    imageSrc: '/images/products/nature choice.png',
    imageAlt: 'Bag of Nature Choice plant food',
    category: 'Agriculture',
    dataAiHint: 'organic fertilizer',
    rating: 4.3,
    reviewCount: 88,
    availability: 'Pre-Order',
    features: ['Slow-release nutrients.', 'Improves soil structure.', 'Derived from natural sources.'],
    howToUse: [
      'Incorporate into soil before planting or use as a top dressing for established plants.'
    ],
    ingredients: ['Composted plant matter', 'Aged manure', 'Bone meal', 'Blood meal', 'Rock phosphate'],
    safetyInfo: 'Wear gloves when handling.'
  },
  {
    id: 'agri-8',
    name: 'SILICIC',
    description: 'A bio-available silicon supplement that strengthens plant cell walls, improves drought tolerance, and enhances resistance to pests and diseases.',
    price: 24.50,
    imageSrc: '/images/products/silicic.png',
    imageAlt: 'Container of SILICIC supplement',
    category: 'Agriculture',
    dataAiHint: 'silicon supplement',
    rating: 4.7,
    reviewCount: 92,
    availability: 'In Stock',
    features: ['Strengthens plant tissues.', 'Increases resistance to lodging.', 'Improves nutrient uptake efficiency.'],
    howToUse: [
      'Add to nutrient solution or apply as a foliar spray according to product guidelines.'
    ],
    ingredients: ['Stabilized silicic acid', 'Micronutrients'],
    safetyInfo: 'Follow dilution rates carefully.'
  },
  {
    id: 'agri-9',
    name: 'Palm Nutrients',
    description: 'Specially formulated nutrient mix to meet the specific dietary requirements of palm trees, promoting lush fronds and healthy growth.',
    price: 21.00,
    imageSrc: '/images/products/palm nutrients.png',
    imageAlt: 'Bag of Palm Nutrients',
    category: 'Agriculture',
    dataAiHint: 'palm fertilizer',
    rating: 4.4,
    reviewCount: 70,
    availability: 'In Stock',
    features: ['Balanced NPK ratio for palms.', 'Contains essential micronutrients like magnesium and manganese.', 'Promotes deep green frond color.'],
    howToUse: [
      'Apply around the base of palm trees, avoiding direct contact with the trunk. Water thoroughly after application.'
    ],
    ingredients: ['Nitrogen, Phosphorus, Potassium sources', 'Magnesium sulfate', 'Manganese sulfate', 'Iron chelates'],
    safetyInfo: 'Store in a dry place.'
  },
  {
    id: 'gard-1',
    name: 'Enriched Cocopeat',
    description: 'High-quality cocopeat block, enriched with essential nutrients. Provides excellent aeration and water retention for potting mixes.',
    price: 8.99,
    imageSrc: '/images/products/cocpeat.png',
    imageAlt: 'Block of Enriched Cocopeat',
    category: 'Gardening Products',
    dataAiHint: 'cocopeat block',
    rating: 4.5,
    reviewCount: 180,
    availability: 'In Stock',
    features: ['Sustainable and renewable resource.', 'Neutral pH.', 'Improves soil structure.'],
    howToUse: [
      'Soak the cocopeat block in water until it expands. Mix with other soil amendments or use as a standalone growing medium.'
    ],
    ingredients: ['Dehydrated coconut coir pith', 'Slow-release NPK fertilizer'],
    safetyInfo: 'Ensure complete hydration before use.'
  },
  {
    id: 'gard-2',
    name: 'Vermiculite',
    description: 'A natural mineral that improves soil aeration and moisture retention. Ideal for seed starting and conditioning potting mixes.',
    price: 10.50,
    imageSrc: '/images/products/vermiculite.png',
    imageAlt: 'Bag of Vermiculite',
    category: 'Gardening Products',
    dataAiHint: 'vermiculite bag',
    rating: 4.3,
    reviewCount: 130,
    availability: 'In Stock',
    features: ['Lightweight and sterile.', 'Excellent for seed germination.', 'Helps prevent soil compaction.'],
    howToUse: [
      'Mix with potting soil or peat moss to improve aeration and water retention. Can also be used as a top layer for seed starting.'
    ],
    ingredients: ['Exfoliated vermiculite mineral'],
    safetyInfo: 'May produce dust; wear a mask if sensitive.'
  },
  {
    id: 'gard-3',
    name: 'Perlite',
    description: 'Lightweight volcanic glass that enhances drainage and aeration in soil, preventing compaction and promoting healthy root growth.',
    price: 9.75,
    imageSrc: '/images/products/perlite.png',
    imageAlt: 'Bag of Perlite',
    category: 'Gardening Products',
    dataAiHint: 'perlite bag',
    rating: 4.2,
    reviewCount: 145,
    availability: 'In Stock',
    features: ['Improves drainage significantly.', 'Prevents waterlogging.', 'Encourages strong root systems.'],
    howToUse: [
      'Add to potting mixes for plants that require excellent drainage, such as succulents and cacti. Typically 10-30% of the mix.'
    ],
    ingredients: ['Expanded perlite (volcanic glass)'],
    safetyInfo: 'May produce dust; wear a mask if sensitive.'
  },
  {
    id: 'gard-4',
    name: 'Phytosil',
    description: 'A silicon-based soil conditioner and plant health booster for home gardens. Strengthens plants against stress and diseases.',
    price: 16.00,
    imageSrc: '/images/products/phytosil.png',
    imageAlt: 'Bottle of Phytosil',
    category: 'Gardening Products',
    dataAiHint: 'plant supplement',
    rating: 4.7,
    reviewCount: 90,
    availability: 'In Stock',
    features: ['Enhances plant structural integrity.', 'Improves resistance to pests and diseases.', 'Boosts overall plant health.'],
    howToUse: [
      'Mix with water according to label instructions and apply as a soil drench or foliar spray.'
    ],
    ingredients: ['Potassium silicate', 'Trace elements'],
    safetyInfo: 'Follow dilution instructions carefully to avoid leaf burn.'
  },
  {
    id: 'gard-5',
    name: 'Organic health booster',
    description: 'A comprehensive organic mix to revitalize garden soil and boost plant vitality, packed with micronutrients and beneficial microbes.',
    price: 14.99,
    imageSrc: '/images/products/organic health booster.png',
    imageAlt: 'Bag of Organic health booster',
    category: 'Gardening Products',
    dataAiHint: 'soil amendment',
    rating: 4.6,
    reviewCount: 210,
    availability: 'In Stock',
    features: ['Rich in humus and organic matter.', 'Contains a diverse range of beneficial microorganisms.', 'Improves soil fertility and plant resilience.'],
    howToUse: [
      'Incorporate into garden beds before planting or top-dress around existing plants. Can also be used to enrich potting mixes.'
    ],
    ingredients: ['Composted manures', 'Worm castings', 'Kelp meal', 'Fish meal', 'Humic acids'],
    safetyInfo: 'Contains natural ingredients; store in a cool, dry place.'
  },
  {
    id: 'gard-6',
    name: 'Vermicompost',
    description: 'Nutrient-rich organic compost created by earthworms. Excellent for improving soil structure and providing essential plant nutrients.',
    price: 12.50,
    imageSrc: '/images/products/vermicompost.png',
    imageAlt: 'Bag of Vermicompost',
    category: 'Gardening Products',
    dataAiHint: 'worm castings',
    rating: 4.9,
    reviewCount: 250,
    availability: 'In Stock',
    features: ['High in beneficial microbes.', 'Improves soil aeration and water retention.', 'Gentle on plants, will not burn roots.'],
    howToUse: [
      'Use as a soil amendment, top dressing, or ingredient in potting mixes. Can also be brewed into a compost tea.'
    ],
    ingredients: ['100% Pure Earthworm Castings'],
    safetyInfo: 'Store sealed to maintain moisture and microbial life.'
  },
  {
    id: 'gard-7',
    name: 'Grow cubes',
    description: 'Convenient, pre-formed cubes made of high-quality substrate, perfect for seed starting and rooting cuttings with minimal mess.',
    price: 7.50,
    imageSrc: '/images/products/grow cubes.png',
    imageAlt: 'Pack of Grow cubes',
    category: 'Gardening Products',
    dataAiHint: 'seed starters',
    rating: 4.0,
    reviewCount: 10,
    availability: 'Out of Stock',
    features: ['Provides optimal moisture and aeration for germination.', 'Easy to transplant seedlings.', 'Reduces transplant shock.'],
    howToUse: [
      'Moisten cubes thoroughly before sowing seeds or inserting cuttings. Keep moist until roots develop.'
    ],
    ingredients: ['Compressed peat moss or coco coir', 'Wetting agent'],
    safetyInfo: 'Keep unused cubes dry.'
  },
  {
    id: 'gard-8',
    name: 'Rose mixture',
    description: 'A specialized blend of organic ingredients tailored to the needs of rose plants, promoting abundant blooms and vigorous growth.',
    price: 13.75,
    imageSrc: '/images/products/rose mixture.png',
    imageAlt: 'Bag of Rose mixture',
    category: 'Gardening Products',
    dataAiHint: 'rose fertilizer',
    rating: 4.5,
    reviewCount: 160,
    availability: 'In Stock',
    features: ['Formulated for heavy-feeding roses.', 'Encourages strong canes and vibrant flowers.', 'Contains essential nutrients and organic matter.'],
    howToUse: [
      'Apply around the base of rose bushes in early spring and after each bloom cycle. Water in well.'
    ],
    ingredients: ['Alfalfa meal', 'Bone meal', 'Blood meal', 'Fish meal', 'Sulfate of potash', 'Compost'],
    safetyInfo: 'Specific to rose care; avoid use on other plants unless compatible.'
  },
  {
    id: 'gard-9',
    name: 'Garden Mix',
    description: 'A ready-to-use premium soil mix for all your gardening needs, perfect for pots, raised beds, and garden plots. Promotes healthy plant growth.',
    price: 11.99,
    imageSrc: '/images/products/garden mix.png',
    imageAlt: 'Bag of Garden Mix soil',
    category: 'Gardening Products',
    dataAiHint: 'potting soil',
    rating: 4.4,
    reviewCount: 190,
    availability: 'In Stock',
    features: ['Balanced for general garden use.', 'Good drainage and aeration.', 'Contains starter nutrients.'],
    howToUse: [
      'Use directly in containers, raised beds, or to amend existing garden soil.'
    ],
    ingredients: ['Aged forest products', 'Peat moss', 'Compost', 'Perlite or pumice', 'Organic fertilizers'],
    safetyInfo: 'Ready to use. Store excess in a cool, dry place.'
  }
];

const seedDatabase = async () => {
  const productsCollection = collection(db, 'products');
  const batch = writeBatch(db);

  products.forEach((product) => {
    const docRef = doc(productsCollection, product.id); // product.id is already a string
    batch.set(docRef, product);
  });

  try {
    console.log(`Attempting to seed database for project: ${db.app.options.projectId || 'N/A'}...`);
    if (!db.app.options.projectId) {
      console.error("Firebase project ID not available in db.app.options. Aborting.");
      process.exit(1);
    }
    await batch.commit();
    console.log('Database seeded successfully with all hardcoded products!');
  } catch (error) {
    console.error('Error seeding database:');
    if (error instanceof Error) {
      console.error(`Message: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
};

seedDatabase()
  .then(() => {
    console.log('Seeding process finished.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Unhandled error in seeding process:', err);
    process.exit(1);
  });
