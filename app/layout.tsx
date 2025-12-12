import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModalProvider } from "@/components/providers/modal-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const robo = Roboto({
  variable: "--font-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Your Personalized Tracker",
  description: "Track anything and everything you like.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: '/LogoLight.svg',
        href: '/LogoLight.svg'
      }, {
        media: "(prefers-color-scheme: dark)",
        url: '/Logo Dark.svg',
        href: '/Logo Dark.svg'
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robo.variable} antialiased text-sans`}

      >
        <ConvexClientProvider>
          <ThemeProvider attribute={'class'} defaultTheme="system" enableSystem disableTransitionOnChange storageKey="tracker-theme">
            <Toaster position="bottom-center" />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
