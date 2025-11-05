import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from '../components/Layout';
import { Providers } from './providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Canada Guide Immigration",
  description: "Votre partenaire de confiance pour réussir votre projet d'immigration au Canada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}