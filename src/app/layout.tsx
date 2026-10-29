import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/fx/MotionProvider";

// Display face: variable, with a width axis the stretchy headings animate.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = "https://vawes.site";
const siteName = "VAWES";
const siteTagline = "We craft digital waves";
const siteDescription =
  "VAWES is a South African web design and development studio building fast, modern, conversion-focused websites. Custom design, Next.js & Shopify development, e-commerce, SEO, and ongoing site care — packages from R2,500.";
const siteShortDescription =
  "South African web design & development studio. Fast, modern websites that convert — from R2,500.";
const phoneE164 = "+27833730269";
const contactEmail = "info@vawes.site";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#071E33" },
    { media: "(prefers-color-scheme: dark)", color: "#071E33" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VAWES | Web Design & Development Studio — South Africa",
    template: "%s | VAWES",
  },
  description: siteDescription,
  keywords: [
    "VAWES",
    "vawes.site",
    "web design South Africa",
    "web development South Africa",
    "South African web designer",
    "website design South Africa",
    "e-commerce website South Africa",
    "Shopify developer South Africa",
    "Next.js website South Africa",
    "small business website South Africa",
    "affordable website packages",
    "freelance web designer South Africa",
    "website redesign",
    "Core Web Vitals",
    "SEO South Africa",
  ],
  authors: [{ name: "VAWES", url: siteUrl }],
  creator: "VAWES",
  publisher: "VAWES",
  applicationName: siteName,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteUrl,
    siteName,
    title: `${siteName} — ${siteTagline}`,
    description: siteShortDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VAWES — Web Design & Development Studio in South Africa",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — ${siteTagline}`,
    description: siteShortDescription,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo/vawes-icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/logo/vawes-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Web Design",
  verification: {
    google: "EhM78JAcnBf3uWEHbcne7cfJnjgikzxBEPRCC5nSGMA",
  },
};

const orgId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;
const localBusinessId = `${siteUrl}/#localbusiness`;
const logoId = `${siteUrl}/#logo`;

const logoSchema = {
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "@id": logoId,
  url: `${siteUrl}/logo/vawes-icon-512.png`,
  contentUrl: `${siteUrl}/logo/vawes-icon-512.png`,
  width: 512,
  height: 512,
  caption: "VAWES logo",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": orgId,
  name: siteName,
  url: siteUrl,
  logo: { "@id": logoId },
  image: { "@id": logoId },
  description: siteDescription,
  email: contactEmail,
  telephone: phoneE164,
  address: {
    "@type": "PostalAddress",
    addressCountry: "ZA",
  },
  founder: [
    { "@type": "Person", name: "Aidan Roach" },
    { "@type": "Person", name: "Liam" },
  ],
  areaServed: { "@type": "Country", name: "South Africa" },
  slogan: siteTagline,
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: phoneE164,
      email: contactEmail,
      contactType: "customer support",
      areaServed: "ZA",
      availableLanguage: ["en"],
    },
    {
      "@type": "ContactPoint",
      email: contactEmail,
      contactType: "sales",
      areaServed: "ZA",
      availableLanguage: ["en"],
    },
  ],
  knowsAbout: [
    "Web design",
    "Web development",
    "Next.js",
    "React",
    "Shopify",
    "E-commerce",
    "SEO",
    "Core Web Vitals",
    "UI/UX design",
    "Branding",
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": localBusinessId,
  name: siteName,
  url: siteUrl,
  logo: { "@id": logoId },
  image: `${siteUrl}/og-image.png`,
  description: siteDescription,
  email: contactEmail,
  telephone: phoneE164,
  priceRange: "R2,500 – R16,500",
  currenciesAccepted: "ZAR",
  paymentAccepted: ["Bank transfer (EFT)", "Card"],
  address: {
    "@type": "PostalAddress",
    addressCountry: "ZA",
  },
  areaServed: { "@type": "Country", name: "South Africa" },
  parentOrganization: { "@id": orgId },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "VAWES Web Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web Design",
          description:
            "Custom, brand-led website design with pixel-perfect layouts that convert.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web Development",
          description:
            "Modern Next.js and React websites built for performance and scale.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "E-Commerce Development",
          description:
            "Shopify, WooCommerce, or custom storefronts with secure checkout and inventory management.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "SEO Strategy",
          description:
            "Technical SEO, structured data, and content optimisation for higher organic ranking.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Performance Optimization",
          description:
            "Core Web Vitals tuning, lazy loading, and CDN configuration for sub-2s loads.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Website Maintenance",
          description:
            "Ongoing support, security updates, backups, and content changes.",
        },
      },
    ],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  name: siteName,
  alternateName: "VAWES — Web Design & Development",
  url: siteUrl,
  description: siteDescription,
  inLanguage: "en-ZA",
  publisher: { "@id": orgId },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteUrl}/#webpage`,
  url: siteUrl,
  name: "VAWES | Web Design & Development Studio — South Africa",
  description: siteDescription,
  isPartOf: { "@id": websiteId },
  about: { "@id": orgId },
  primaryImageOfPage: `${siteUrl}/og-image.png`,
  inLanguage: "en-ZA",
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    logoSchema,
    organizationSchema,
    localBusinessSchema,
    websiteSchema,
    webPageSchema,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en-ZA"
      className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        {/* Runs before first paint: enables the reveal styles and applies a
            remembered "animations off" choice so nothing flashes. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('js');try{if(localStorage.getItem('vawes-motion')==='off')d.dataset.motion='off'}catch(e){}})();",
          }}
        />
        <meta name="geo.region" content="ZA" />
        <meta name="geo.placename" content="South Africa" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
