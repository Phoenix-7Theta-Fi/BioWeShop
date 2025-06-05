import type { Product, BlogPost, Testimonial } from '@/types';

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'getting-started-with-organic-gardening',
    title: 'Getting Started with Organic Gardening: A Beginner\'s Guide',
    excerpt: 'Discover the joys of organic gardening! This guide covers the basics, from soil preparation to choosing the right plants for your eco-friendly garden.',
    imageSrc: 'https://placehold.co/800x450.png',
    imageAlt: 'Lush organic vegetable garden',
    dataAiHint: 'organic garden',
    date: '2024-05-15T10:00:00Z',
    author: 'Jane GreenThumb',
    content: '<p>Organic gardening is more than just a trend; it’s a commitment to sustainable practices and healthier living. This guide will walk you through the essentials to start your own organic garden, no matter the size of your space.</p><h3>Understanding Your Soil</h3><p>Healthy soil is the cornerstone of organic gardening. Get a soil test to understand its pH and nutrient levels. Amend your soil with compost and other organic matter to improve its structure and fertility. BioWe offers excellent organic compost to get you started!</p><h3>Choosing Your Plants</h3><p>Opt for native plants or varieties well-suited to your climate. This reduces the need for excessive watering and pest control. Consider companion planting to naturally deter pests and enhance growth. For example, basil planted near tomatoes can repel certain insects and improve tomato flavor.</p><h3>Watering Effectively</h3><p>Water deeply but infrequently to encourage strong root development. Morning is the best time to water, as it allows leaves to dry during the day, reducing the risk of fungal diseases.</p><h3>Natural Pest and Disease Control</h3><p>Embrace natural pest and disease control. Encourage beneficial insects like ladybugs and lacewings. Use physical barriers or organic sprays like neem oil if pests become a problem. BioWe’s Eco-Friendly Pest Control Spray is a great option. Happy gardening!</p>',
  },
  {
    id: '2',
    slug: 'top-5-fertilizers-for-vibrant-blooms',
    title: 'Top 5 BioWe Fertilizers for Vibrant Blooms',
    excerpt: 'Unlock the secret to stunning flowers with our top-rated organic fertilizers. Learn which BioWe product is perfect for your blooming beauties.',
    imageSrc: 'https://placehold.co/800x450.png',
    imageAlt: 'Colorful flowers blooming in a garden',
    dataAiHint: 'colorful flowers',
    date: '2024-05-22T14:30:00Z',
    author: 'Alex Roots',
    content: '<p>Every gardener dreams of a profusion of vibrant blooms. The key? The right nutrition. At BioWe, we’ve formulated a range of organic fertilizers to help your flowering plants thrive. Here are our top 5 picks:</p><ol><li><strong>BioWe Organic Bloom Booster:</strong> Specially designed to enhance flowering and fruiting. Rich in phosphorus and potassium, it encourages abundant, long-lasting blooms.</li><li><strong>BioWe All-Purpose Plant Food:</strong> A balanced fertilizer that supports overall plant health, leading to stronger stems and more resilient flowers. Great for a wide variety of flowering annuals and perennials.</li><li><strong>BioWe Rose & Flower Care:</strong> Tailored for roses and other demanding flowering shrubs, this mix promotes brilliant colors and healthy foliage.</li><li><strong>BioWe Liquid Seaweed Extract:</strong> A fantastic supplement that provides trace minerals and growth hormones, acting as a biostimulant for impressive floral displays.</li><li><strong>BioWe Bone Meal:</strong> A natural source of phosphorus, essential for root development and flower production. Incorporate it into the soil when planting or as a top dressing for established plants.</li></ol><p>Remember to follow application instructions for each product to achieve the best results. With BioWe, your garden will be the envy of the neighborhood!</p>',
  },
  {
    id: '3',
    slug: 'container-gardening-tips-for-small-spaces',
    title: 'Container Gardening Magic: Tips for Small Spaces',
    excerpt: 'No backyard? No problem! Explore creative container gardening ideas to grow your own food and flowers, even on a balcony or patio.',
    imageSrc: 'https://placehold.co/800x450.png',
    imageAlt: 'Assortment of plants in pots on a balcony',
    dataAiHint: 'balcony garden',
    date: '2024-06-01T09:15:00Z',
    author: 'Sarah Sprouts',
    content: '<p>Living in an apartment or home with limited outdoor space doesn’t mean you have to give up on your gardening dreams. Container gardening offers a fantastic way to cultivate plants on balconies, patios, or even sunny windowsills.</p><h3>Key Considerations for Container Gardening</h3><h4>1. Choose the Right Containers</h4><p>Ensure they have adequate drainage holes. The size of the container should match the mature size of the plant. Materials vary:</p><ul><li><strong>Terracotta:</strong> Dries out faster, good for plants liking drier soil.</li><li><strong>Plastic:</strong> Retains moisture longer, lighter weight.</li><li><strong>Fabric pots:</strong> Excellent aeration, prevents root circling.</li></ul><p>BioWe offers a range of stylish and functional self-watering planters to simplify watering.</p><h4>2. Use Quality Potting Mix</h4><p>Do not use garden soil in containers, as it compacts easily and may harbor pests or diseases. BioWe Premium Potting Mix is specifically formulated for container gardening, providing good drainage, aeration, and retaining necessary moisture and nutrients.</p><h4>3. Select Appropriate Plants</h4><p>Many vegetables, herbs, and flowers thrive in containers. Consider dwarf varieties of your favorite plants. Some excellent choices include:</p><ul><li><strong>Herbs:</strong> Basil, mint, rosemary, thyme, parsley.</li><li><strong>Vegetables:</strong> Compact tomatoes, peppers, lettuce, radishes, spinach.</li><li><strong>Flowers:</strong> Petunias, geraniums, marigolds, succulents.</li></ul><h4>4. Watering and Fertilizing</h4><p>Container plants dry out more quickly than those in the ground, so monitor moisture levels regularly. Water thoroughly until water drains from the bottom, then allow the top inch or two of soil to dry before watering again. Fertilize as needed, as nutrients can leach out with watering. BioWe’s liquid fertilizers are easy to apply and ideal for container plants.</p><h4>5. Maximize Your Space</h4><p>Get creative with your small space! Use vertical planters, hanging baskets, window boxes, and tiered shelving to grow more in less area.</p><p>With a little planning and the right supplies from BioWe, your small space can become a productive and beautiful green oasis!</p>',
  },
  {
    id: '4',
    slug: 'understanding-soil-health',
    title: 'The Dirt on Soil: Understanding Soil Health for a Thriving Garden',
    excerpt: 'Healthy soil is the foundation of a successful garden. Learn about soil composition, amendments, and how BioWe products can help improve your soil structure.',
    imageSrc: 'https://placehold.co/800x450.png',
    imageAlt: 'Close up of rich, dark garden soil',
    dataAiHint: 'garden soil',
    date: '2024-06-10T11:00:00Z',
    author: 'Mike Gardener',
    content: '<p>Often overlooked, soil is the single most important ingredient for a flourishing garden. Understanding and nurturing your soil’s health will pay dividends in the form of robust plants and bountiful harvests.</p><h3>The Living Ecosystem Below</h3><p>Soil is a living ecosystem, teeming with microorganisms, fungi, and earthworms that break down organic matter and make nutrients available to plants. Good soil structure allows for proper aeration, drainage, and root penetration.</p><h3>Key Components of Healthy Soil</h3><ul><li><strong>Organic Matter:</strong> Compost, manure, leaf mold are crucial.</li><li><strong>Minerals:</strong> Sand, silt, and clay define texture.</li><li><strong>Pore Spaces:</strong> Essential for air and water movement.</li></ul><p>The ideal soil, often called loam, has a balanced mix of these.</p><h3>How to Improve Your Soil</h3><p>Add organic matter regularly. Compost is king! It improves soil structure, water retention, and nutrient content. BioWe’s Premium Potting Mix and Organic Bloom Booster are excellent sources of organic matter for different needs. Avoid tilling excessively, as it can damage soil structure and harm beneficial organisms. Consider cover crops like clover or rye during the off-season to prevent erosion and add organic matter when tilled in.</p><h3>The Magic of Mulching</h3><p>Mulching is another great practice. A layer of organic mulch (wood chips, straw, shredded leaves) helps retain moisture, suppress weeds, and regulate soil temperature. As it decomposes, it also adds organic matter to the soil.</p><p>By focusing on building healthy soil, you’re creating a sustainable foundation for your garden to thrive for years to come. BioWe is here to support your journey to better soil and better gardening!</p>',
  },
];


export const mockTestimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote: "BioWe's De-Compose turned my kitchen scraps into black gold faster than I ever thought possible! My veggies have never been happier.",
    author: 'Maria S.',
    role: 'Home Gardener',
    avatarSrc: 'https://placehold.co/100x100.png',
    dataAiHint: 'happy person'
  },
  {
    id: 'testimonial-2',
    quote: "Since using MYCO POWER on my crops, I've seen a significant increase in yield and resilience, even during dry spells. Highly recommend for serious farmers.",
    author: 'John B.',
    role: 'Commercial Farmer',
    avatarSrc: 'https://placehold.co/100x100.png',
    dataAiHint: 'farmer field'
  },
  {
    id: 'testimonial-3',
    quote: "The Organic Health Booster revived my struggling flower beds! The colors are more vibrant, and the plants look so much healthier. Thank you, BioWe!",
    author: 'Lisa P.',
    role: 'Flower Enthusiast',
    avatarSrc: 'https://placehold.co/100x100.png',
    dataAiHint: 'smiling woman'
  },
];
