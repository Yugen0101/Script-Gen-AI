import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalHaptics from "@/components/GlobalHaptics";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'ScriptGo - AI Script Generator',
    description: 'Generate professional scripts for TikTok, YouTube, Reels, and LinkedIn with AI.',
    keywords: ['AI script generator', 'YouTube script', 'Instagram Reels', 'content creation', 'AI writer'],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen smooth-transition`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <GlobalHaptics />
                    <Header />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
