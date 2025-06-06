
import { ProductList } from '@/components/products/ProductList';
import type { Product } from '@/types';
import { PackageSearch } from 'lucide-react';
import { db } from '@/lib/firebase'; // Firebase instance
import { collection, getDocs, query, where, orderBy, QueryConstraint } from 'firebase/firestore';

interface ProductsPageProps {
  searchParams: { q?: string; category?: string }; // Allow category filtering via searchParams
}

async function getFilteredProducts(search?: string, categorySearch?: string): Promise<Product[]> {
  const productsCollectionRef = collection(db, 'products');
  const queryConstraints: QueryConstraint[] = [];

  if (search) {
    // Simple "starts with" query for name. Case-sensitive in Firestore.
    // For case-insensitive, you'd typically store a lowercase version of the name.
    queryConstraints.push(where('name', '>=', search));
    queryConstraints.push(where('name', '<=', search + '\uf8ff'));
  }

  if (categorySearch) {
    queryConstraints.push(where('category', '==', categorySearch));
  }

  // Add a default sort order if needed, e.g., by name
  if (!queryConstraints.some(constraint => constraint.type === 'orderBy')) {
    queryConstraints.push(orderBy('name'));
  }

  const finalQuery = query(productsCollectionRef, ...queryConstraints);

  try {
    const querySnapshot = await getDocs(finalQuery);
    const products: Product[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure all fields from Product type are mapped
      return {
        id: doc.id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        imageSrc: data.imageSrc || '',
        imageAlt: data.imageAlt || '',
        category: data.category || '',
        dataAiHint: data.dataAiHint || '',
        rating: data.rating, // Optional
        reviewCount: data.reviewCount, // Optional
        availability: data.availability, // Optional
        features: data.features, // Optional
        howToUse: data.howToUse, // Optional
        ingredients: data.ingredients, // Optional
        safetyInfo: data.safetyInfo, // Optional
      } as Product; // Type assertion
    });

    // If both search and categorySearch are provided, and Firestore's OR queries are not used (they are complex),
    // you might need to do a client-side intersection if you queried them separately.
    // Or, if you want to filter by search term across multiple fields (name, description, etc.) after an initial category filter:
    if (search && categorySearch && products.length > 0) {
      // This is a client-side filter on top of Firestore results if Firestore couldn't handle the combined logic perfectly.
      const searchLower = search.toLowerCase();
      return products.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
        // Add other fields to search if desired
      );
    }
    
    // If only search (without category) is used and we want to search more broadly than just name:
    if (search && !categorySearch && products.length > 0) {
        const searchLower = search.toLowerCase();
        // This client-side filter is applied if the Firestore query for 'name' was too restrictive
        // or if you want to search other fields too.
        // Note: This fetches products where name STARTS WITH search, then filters more broadly.
        // If you want a general text search, you'd fetch all or use a search service.
        const allProductsSnapshot = await getDocs(query(productsCollectionRef, orderBy('name')));
        const allProducts = allProductsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

        return allProducts.filter(product => {
            const searchableText = [
              product.name,
              product.description,
              // product.category, // Already filtered by category if categorySearch was present
              product.dataAiHint,
              ...(product.features || []),
              ...(Array.isArray(product.ingredients) ? product.ingredients : (typeof product.ingredients === 'string' ? [product.ingredients] : [])),
            ].join(' ').toLowerCase();
            return searchableText.includes(searchLower);
        });
    }


    return products;
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    return []; // Return empty array on error
  }
}

export const metadata = {
  title: 'Our Products | BioWe',
  description: 'Explore the full range of BioWe gardening and fertilizer products.',
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Pass both search query and category to the fetching function
  const products = await getFilteredProducts(searchParams.q, searchParams.category);

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-950/30 dark:to-teal-900/30 rounded-xl shadow-md">
        <PackageSearch className="mx-auto h-16 w-16 text-secondary mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-secondary mb-4">
          Our Product Collection
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse all our premium, eco-friendly gardening supplies designed to help your green oasis flourish.
        </p>
      </section>

      {products.length > 0 ? (
        <section>
          <ProductList products={products} />
        </section>
      ) : (
        <section className="text-center py-10">
          <PackageSearch className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold mb-4">No Products Available Yet</h2>
          <p className="text-muted-foreground">
            We're busy cultivating our product line! Check back soon for our latest offerings.
          </p>
        </section>
      )}
    </div>
  );
}
