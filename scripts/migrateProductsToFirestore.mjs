// scripts/migrateProductsToFirestore.mjs
import { db } from '../src/lib/firebase.js'; // Ensure .js extension if your tsconfig module is not NodeNext/ESNext
import { mockProducts } from '../src/lib/mock-data.js'; // Ensure .js extension
import { collection, addDoc, Timestamp } from 'firebase/firestore';

async function migrateProducts() {
  const productsCollectionRef = collection(db, 'products');
  let successCount = 0;
  let errorCount = 0;

  console.log(`Starting migration of ${mockProducts.length} products...`);

  for (const product of mockProducts) {
    try {
      // Firebase doesn't like 'undefined' values. Convert them to 'null' or omit.
      // Also, ensure any Date objects are converted to Firebase Timestamps if needed.
      // For this example, we assume mockProducts are already serializable.
      // If you have Date objects in your mock data, convert them:
      // const productData = { ...product };
      // if (productData.someDateField instanceof Date) {
      //   productData.someDateField = Timestamp.fromDate(productData.someDateField);
      // }

      const docRef = await addDoc(productsCollectionRef, product);
      console.log(`Successfully added product: ${product.name} (ID: ${docRef.id})`);
      successCount++;
    } catch (error) {
      console.error(`Error adding product ${product.name}:`, error);
      errorCount++;
    }
  }

  console.log('\nMigration Complete!');
  console.log(`Successfully migrated ${successCount} products.`);
  console.log(`Failed to migrate ${errorCount} products.`);
  if (errorCount > 0) {
    console.log('Please check the error messages above for details on failures.');
  }
}

migrateProducts().then(() => {
  console.log('Product migration script finished.');
}).catch(error => {
  console.error('Unhandled error in migration script:', error);
});
