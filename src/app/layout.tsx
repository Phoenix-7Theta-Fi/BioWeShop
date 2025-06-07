
import type { Metadata } from 'next';
import { Poppins as FontSans } from 'next/font/google'; // Changed from Inter to Poppins
import './globals.css';
import { cn } from '@/lib/utils';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext'; // Added AuthProvider
import { AppLayout } from '@/components/layout/AppLayout';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'], // Added weights for Poppins
});

export const metadata: Metadata = {
  title: 'BioWe',
  description: 'Your one-stop shop for premium gardening and fertilizer products. Nurture your green oasis with BioWe.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <AuthProvider> {/* Added AuthProvider */}
          <CartProvider>
            <AppLayout>{children}</AppLayout>
          </CartProvider>
        </AuthProvider> {/* Added AuthProvider */}
      </body>
    </html>
  );
}
