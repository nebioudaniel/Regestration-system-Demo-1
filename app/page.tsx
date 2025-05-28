'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    // Main container with dark background
    <div className="flex flex-col min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Header with logo (subtler on dark background) */}
      <header className="w-full py-4 px-6 flex items-center justify-start relative z-10">
        {/* Adjusted image for better visibility on dark background, potentially a white logo version */}
       
      </header>

      {/*
        Main Content Section:
        Designed to mimic the central, focused layout of the Next.js page.
        Uses flexbox to center content vertically and horizontally.
        The "grid" background is achieved with pseudo-elements or a background image,
        but for simplicity here, we'll focus on the core layout.
      */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 relative z-0">
        {/*
          This div acts as the container for the text and buttons,
          limiting their width similar to the Next.js example.
        */}
        <div className="max-w-4xl text-center space-y-8 lg:space-y-10 relative z-10">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabrabold tracking-tighter leading-tight select-none">
            Welcome to the <br className="md:hidden" />
            <span className="bg-gradient-to-r from-gray-300 via-white to-gray-400 text-transparent bg-clip-text">
              Multiverse Enterprise Plc
            </span>
          </h1>

          {/* Introductory Paragraph */}
       <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400">
  Trusted by international partners, Multiverse Enterprise Plc connects markets through
  <span className="font-semibold text-white ml-1">reliable import and export services</span>
  focused on quality, efficiency, and global reach.
</p>


          {/* Buttons container, mimicking the Next.js button group */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Button
              onClick={() => router.push("/register")}
              className="px-8 py-3 sm:px-10 sm:py-4 rounded-lg font-semibold text-lg
                         bg-white text-black hover:bg-gray-200 transition-colors duration-200
                         shadow-lg flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Register to join Multiverse Enterprise Plc"
            >
              Get Started
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>

            <Button
              variant="outline" // Assuming shadcn/ui outline variant styling will be adjusted
              onClick={() => router.push("/")}
              className="px-8 py-3 sm:px-10 sm:py-4 rounded-lg font-semibold text-lg
                         bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 hover:border-gray-600
                         transition-colors duration-200 shadow-md focus-visible:ring-2 focus-visible:ring-gray-400"
              aria-label="Learn more about Multiverse Enterprise Plc"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* This could be for the 'npm create-next-app@latest' type of text */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 text-sm font-mono mt-8 hidden sm:block">
         Secure & Reliable Registration System
        </div>

        {/* Background Grid - a simple way to simulate, for a true grid, use SVG or a more complex CSS approach */}
        <div className="absolute inset-0 z-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)'
        }}></div>
      </main>

      {/* Footer (subtler on dark background) */}
      <footer className="w-full border-t border-gray-800 py-4 px-6 text-center text-sm text-gray-600 bg-black relative z-10">
        © {new Date().getFullYear()} Multiverse Enterprise Plc. All rights reserved.
      </footer>
    </div>
  );
}