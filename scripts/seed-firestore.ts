import { db } from '../src/lib/firebase'; // Adjusted path
import { mockProducts } from '../src/lib/mock-data'; // Adjusted path
import { collection, writeBatch, doc } from 'firebase/firestore';

const seedDatabase = async () => {
  const productsCollection = collection(db, 'products');
  const batch = writeBatch(db);

  mockProducts.forEach((product) => {
    const docRef = doc(productsCollection, product.id.toString()); // Assuming product.id can be string or number
    batch.set(docRef, product);
  });

  try {
    await batch.commit();
    console.log('Database seeded successfully with mock products!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1); // Exit with error code
  }
};

seedDatabase()
  .then(() => {
    console.log('Seeding process finished.');
    process.exit(0); // Exit with success code
  })
  .catch(() => {
    // Error already logged in seedDatabase, so just exit
    process.exit(1);
  });
