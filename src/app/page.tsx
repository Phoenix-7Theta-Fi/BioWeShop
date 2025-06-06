
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductList } from '@/components/products/ProductList';
import { mockTestimonials, mockBlogPosts } from '@/lib/mock-data'; // mockProducts removed
import type { Product, Testimonial, BlogPost } from '@/types';
import { ChevronRight, Leaf, ShieldCheck, Smile, Truck, MessageSquareQuote, Rss } from 'lucide-react';
import { TestimonialCard } from '@/components/home/TestimonialCard';
import { BlogPostCard } from '@/components/blog/BlogPostCard'; // Import BlogPostCard
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';

// Fetch featured products from Firestore
async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const productsCollectionRef = collection(db, 'products');
    // Example: Order by name and take the first 4.
    // In a real app, you might have a 'featured' flag or order by popularity/date.
    const q = query(productsCollectionRef, orderBy('name'), limit(4));
    const querySnapshot = await getDocs(q);
    const products: Product[] = querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as Product;
    });
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return []; // Return empty array on error
  }
}

async function getTestimonials(): Promise<Testimonial[]> {
  return Promise.resolve(mockTestimonials.slice(0, 3)); // Show first 3 testimonials
}

async function getRecentBlogPosts(): Promise<BlogPost[]> {
  return Promise.resolve(mockBlogPosts.slice(0, 2)); // Show first 2 blog posts
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-green-100 via-emerald-50 to-teal-100 dark:from-green-900 dark:via-emerald-950 dark:to-teal-900 py-20 md:py-32 rounded-xl shadow-lg overflow-hidden mb-16">
      <div className="absolute inset-0 opacity-10">
        {/* Decorative background elements if desired */}
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <Leaf className="mx-auto h-16 w-16 text-secondary mb-6" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Welcome to <span className="text-secondary">BioWe</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Nurturing your green oasis with premium, eco-friendly gardening supplies. Grow healthier, happier plants with BioWe.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/products">Shop All Products</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/contact">Get Expert Advice</Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}

// Featured Products Section Component
interface FeaturedProductsProps {
  products: Product[];
}
function FeaturedProductsSection({ products }: FeaturedProductsProps) {
  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-secondary">Featured Products</h2>
        <Button variant="link" asChild className="text-secondary hover:text-primary">
          <Link href="/products">
            View All <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </Button>
      </div>
      <ProductList products={products} />
    </section>
  );
}

// Why Choose Us Section Component
function WhyChooseUsSection() {
  const features = [
    {
      icon: <Leaf className="h-10 w-10 text-secondary mb-4" />,
      title: 'Eco-Friendly Solutions',
      description: 'Our products are sustainably sourced and environmentally conscious, helping you garden responsibly.',
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-secondary mb-4" />,
      title: 'Quality Guaranteed',
      description: 'We stand by the quality of our supplies, ensuring you get the best for your plants and garden.',
    },
    {
      icon: <Smile className="h-10 w-10 text-secondary mb-4" />,
      title: 'Expert Support',
      description: 'Our team of gardening enthusiasts is here to help you with advice and support for your projects.',
    },
  ];

  return (
    <section className="mb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold tracking-tight text-center text-secondary mb-12">Why BioWe?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="items-center">
                {feature.icon}
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section Component
interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}
function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  return (
    <section className="mb-16 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-12">
           <MessageSquareQuote className="h-10 w-10 text-secondary mr-4" />
          <h2 className="text-3xl font-bold tracking-tight text-center text-secondary">
            What Our Customers Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Blog Snippets Section Component
interface BlogSnippetsSectionProps {
  posts: BlogPost[];
}
function BlogSnippetsSection({ posts }: BlogSnippetsSectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }
  return (
    <section className="mb-16 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <Rss className="h-10 w-10 text-secondary mr-4" />
            <h2 className="text-3xl font-bold tracking-tight text-secondary">
              From Our Blog
            </h2>
          </div>
          <Button variant="link" asChild className="text-secondary hover:text-primary">
            <Link href="/blog">
              Read More on the Blog <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}


// Call to Action Section Component
function CallToActionSection() {
  return (
    <section className="py-16 bg-secondary text-secondary-foreground rounded-xl shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Watch Your Garden Flourish?</h2>
        <p className="text-lg text-secondary-foreground/90 max-w-xl mx-auto mb-10">
          Explore our collection of premium gardening supplies and start your journey to a greener thumb today.
        </p>
        <Button size="lg" variant="default" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-shadow">
          <Link href="/products">Start Shopping Now</Link>
        </Button>
      </div>
    </section>
  );
}


export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const testimonials = await getTestimonials();
  const recentBlogPosts = await getRecentBlogPosts(); // Fetch recent blog posts

  return (
    <div className="space-y-12">
      <HeroSection />
      <FeaturedProductsSection products={featuredProducts} />
      <WhyChooseUsSection />
      <TestimonialsSection testimonials={testimonials} />
      <BlogSnippetsSection posts={recentBlogPosts} /> {/* Add BlogSnippetsSection */}
      <CallToActionSection />
    </div>
  );
}

