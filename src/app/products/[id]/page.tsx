"use client"; // For useState and event handlers

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import type { Product } from '@/types';
// REMOVE: import { mockProducts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card'; // Removed CardFooter as it's not used directly here
import { Input } from '@/components/ui/input';
import { ArrowLeft, MinusCircle, PlusCircle, CheckCircle, XCircle, Info, ListChecks, Settings, Leaf, ShieldAlert, MessageSquare, Package, Send } from 'lucide-react';
import { ProductPageAddToCartButton } from '@/components/products/ProductPageAddToCartButton';
import { StarRating } from '@/components/shared/StarRating';
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ProductList } from '@/components/products/ProductList';

import { db } from '@/lib/firebase'; // ADDED
import { doc, getDoc, collection, query, where, limit, getDocs, QueryConstraint } from 'firebase/firestore'; // ADDED, QueryConstraint

// REMOVE: async function getProductById(id: string): Promise<Product | undefined> { ... }
// Firestore fetching will be integrated into useEffect

interface ProductInfoSectionProps {
  title: string;
  content: string[] | string | undefined | React.ReactNode;
  IconComponent: React.ElementType;
  className?: string;
}

const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({ title, content, IconComponent, className }) => {
  if (!content || (Array.isArray(content) && content.length === 0 && typeof content !== 'string' && !React.isValidElement(content))) {
    // Let caller handle empty content display logic
  }

  return (
    <section className={cn("py-6", className)}>
      <h2 className="text-2xl font-semibold mb-4 flex items-center text-secondary">
        <IconComponent className="mr-3 h-6 w-6" />
        {title}
      </h2>
      <div className="text-base text-foreground space-y-2 pl-1">
        {Array.isArray(content) && typeof content[0] === 'string' ? (
          <ul className="list-disc list-outside ml-5 space-y-1">
            {(content as string[]).map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        ) : (
          <div>{content}</div>
        )}
      </div>
    </section>
  );
};

export default function ProductDetailPage() {
  const routeParams = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const fetchProductAndRelated = useCallback(async (productId: string) => {
    setIsLoading(true);
    setProduct(null); // Reset product state on new fetch
    setRelatedProducts([]); // Reset related products

    try {
      // Fetch main product
      const productDocRef = doc(db, 'products', productId);
      const productDocSnap = await getDoc(productDocRef);

      if (productDocSnap.exists()) {
        const fetchedProductData = productDocSnap.data() as Omit<Product, 'id'>;
        const fetchedProduct = { id: productDocSnap.id, ...fetchedProductData };
        setProduct(fetchedProduct);

        // Fetch related products (same category, not the current product, limit 3)
        const relatedProductsQueryConstraints: QueryConstraint[] = [
          where('category', '==', fetchedProduct.category),
          where('id', '!=', fetchedProduct.id), // Firestore allows inequality on document ID
          limit(3)
        ];
        const relatedProductsQuery = query(collection(db, 'products'), ...relatedProductsQueryConstraints);
        const relatedSnapshot = await getDocs(relatedProductsQuery);
        let fetchedRelated = relatedSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));

        // If not enough related products in the same category, fetch some others
        if (fetchedRelated.length < 3) {
          const needed = 3 - fetchedRelated.length;
          // Ensure existingIds does not exceed Firestore's 10-item limit for 'not-in'
          const existingIds = [fetchedProduct.id, ...fetchedRelated.map(p => p.id)].slice(0, 10);

          const otherProductsQueryConstraints: QueryConstraint[] = [
            where('id', 'not-in', existingIds),
            limit(needed)
          ];
          // Create a query for other products
          const otherProductsQuery = query(collection(db, 'products'), ...otherProductsQueryConstraints);
          const otherSnapshot = await getDocs(otherProductsQuery);
          const additionalProducts = otherSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
          fetchedRelated = [...fetchedRelated, ...additionalProducts];
        }
        setRelatedProducts(fetchedRelated.slice(0,3)); // Ensure max 3 related products

      } else {
        console.log("No such product found in Firestore!");
        setProduct(null); // Handled by notFound() if product remains null after loading
      }
    } catch (error) {
      console.error("Error fetching product data from Firestore:", error);
      setProduct(null); // Ensure product is null on error to trigger notFound
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies, as db and firestore functions are stable

  useEffect(() => {
    if (routeParams && typeof routeParams.id === 'string') {
      fetchProductAndRelated(routeParams.id);
    } else {
       if (!routeParams?.id) setIsLoading(false);
    }
  }, [routeParams?.id, fetchProductAndRelated]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-muted h-12 w-12 mb-4 animate-spin border-t-primary"></div>
        <p className="ml-4 text-lg">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => {
      const newQuantity = prev + amount;
      return newQuantity < 1 ? 1 : newQuantity;
    });
  };

  const availabilityColor = product.availability === 'In Stock' ? 'text-green-600' : product.availability === 'Out of Stock' ? 'text-red-600' : 'text-yellow-600';
  const AvailabilityIcon = product.availability === 'In Stock' ? CheckCircle : product.availability === 'Out of Stock' ? XCircle : Info;

  const renderReviews = () => {
    if (product.rating !== undefined && product.reviewCount !== undefined && product.reviewCount > 0) {
      return (
        <div className="flex flex-col items-start space-y-2">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} starClassName="h-6 w-6" />
          <p className="text-sm text-muted-foreground">Based on {product.reviewCount} review{product.reviewCount > 1 ? 's' : ''}.</p>
        </div>
      );
    }
    return <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2 gap-0 md:gap-8">
          <CardHeader className="p-0 md:p-4">
            <div className="aspect-square relative w-full rounded-lg overflow-hidden">
              <Image
                src={product.imageSrc}
                alt={product.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
                data-ai-hint={product.dataAiHint}
              />
            </div>
          </CardHeader>
          
          <div className="flex flex-col p-6 md:p-4">
            <div className="flex-grow">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-secondary mb-2">
                {product.name}
              </h1>

              {product.rating !== undefined && product.reviewCount !== undefined && (
                <div className="mb-3 flex items-center">
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} starClassName="h-5 w-5" showReviewCount={true}/>
                </div>
              )}

              <p className="text-3xl font-semibold text-primary mb-4">
                ${product.price.toFixed(2)}
              </p>

              {product.availability && (
                <div className={`flex items-center text-md font-medium mb-4 ${availabilityColor}`}>
                  <AvailabilityIcon className="mr-2 h-5 w-5" />
                  {product.availability}
                </div>
              )}
              
              <p className="text-base text-foreground mb-6 space-y-3">
                {typeof product.description === 'string' && product.description.split('\n\n').map((paragraph, index) => (
                  <span key={index} className="block">{paragraph}</span>
                ))}
              </p>
            </div>

            <div className="mt-auto">
              <div className="flex items-center space-x-3 mb-6">
                <label htmlFor="quantity" className="font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="h-10 w-10 rounded-r-none">
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                  <Input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-16 text-center h-10 border-y-0 border-x rounded-none focus-visible:ring-0"
                    min="1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} className="h-10 w-10 rounded-l-none">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <ProductPageAddToCartButton product={product} quantity={quantity} disabled={product.availability === 'Out of Stock'} />
               {product.availability === 'Out of Stock' && (
                <p className="text-sm text-destructive mt-2 text-center">This product is currently unavailable.</p>
              )}
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 sm:p-8 border-t">
          <div className="space-y-6">
            {product.features && product.features.length > 0 && (
              <ProductInfoSection
                title="Key Features"
                content={product.features}
                IconComponent={ListChecks}
              />
            )}

            {product.howToUse && (
              <ProductInfoSection
                title="How to Use"
                content={product.howToUse}
                IconComponent={Settings}
              />
            )}
            
            {product.ingredients && product.ingredients.length > 0 && (
              <ProductInfoSection
                title="Ingredients / Composition"
                content={product.ingredients}
                IconComponent={Leaf}
              />
            )}

            {product.safetyInfo && (
               <ProductInfoSection
                title="Safety Information"
                content={product.safetyInfo}
                IconComponent={ShieldAlert}
              />
            )}

            <Separator />

            <ProductInfoSection
              title="Customer Reviews"
              content={renderReviews()}
              IconComponent={MessageSquare}
            />
            
            <Separator />

            <ProductInfoSection
              title="Related Products"
              content={
                relatedProducts.length > 0 ? (
                  <ProductList products={relatedProducts} />
                ) : (
                  <p className="text-muted-foreground">No related products to display at this time.</p>
                )
              }
              IconComponent={Package}
            />

            <Separator />
            
            <ProductInfoSection
              title="Shipping & Return Information"
              content={['We typically ship orders within 1-2 business days. Standard shipping takes 3-5 business days. Expedited options available at checkout.', 'We offer a 30-day return policy on unopened products. Please contact our customer service for return authorizations.']}
              IconComponent={Send}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
