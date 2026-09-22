import type { Metadata } from 'next';
import './globals.css';

const configuredSiteOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const siteOrigin = configuredSiteOrigin && URL.canParse(configuredSiteOrigin)
  ? configuredSiteOrigin
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: 'Prime Accra Property Opportunities | Hotwaves Real Estate Agency',
  description: 'Explore Hotwaves Real Estate Agency\'s current portfolio of land, development properties, and joint ventures across Accra.',
  openGraph: {
    title: 'Prime Accra Property Opportunities | Hotwaves',
    description: 'Land, development properties, and joint ventures backed by 16+ years in the business.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Hotwaves Real Estate Agency' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prime Accra Property Opportunities | Hotwaves',
    description: 'Land, development properties, and joint ventures backed by 16+ years in the business.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
