import prisma from '@/lib/prisma'; // Assuming prisma is correctly configured
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react'; // Using CheckCircle2 for the checkmark icon

export default async function ProfilePage() {
  const users = await prisma.user.findMany();
  // Get the latest user. Ensure 'users' is not empty before accessing index.
  const latestUser = users.length > 0 ? users[users.length - 1] : null;

  // Determine the user's name for the greeting (though not directly used in the H1 now, kept for context)
  const userName = latestUser?.firstName || latestUser?.email || 'there';

  return (
    // Main container with black background
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white font-sans p-4">
      {/* Central content area - replaces the card/square */}
      <div className="w-full max-w-2xl text-center flex flex-col items-center">
        {/* Checkmark Icon - prominent and styled for dark background */}
        <div className="p-4 rounded-full inline-flex items-center justify-center mb-8 bg-white border border-white"> {/* White background for icon circle */}
          <CheckCircle2 className="h-16 w-16 text-black" strokeWidth={1.5} /> {/* Black icon on white background */}
        </div>

        {/* Main Thank You Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
          Thank You for regester !!
        </h1>

        {/* Optional Descriptive Paragraph (removed for simplicity if not needed) */}
        {/* Keeping it commented out in case you want to add it back without the "square" */}
        {/*
        <p className="text-white text-lg max-w-xl mx-auto mb-10 opacity-80">
          We appreciate your interest. Our team is reviewing your request and will reach out shortly.
        </p>
        */}

        {/* Call to Action Button - styled for black background consistency */}
        <div className="pt-4">
          <Link href="/">
            <Button
              className="px-8 py-3 sm:px-10 sm:py-4 rounded-lg font-semibold text-lg
                         bg-white text-black hover:bg-black hover:text-white border border-white
                         transition-all duration-200 ease-in-out flex items-center justify-center
                         focus-visible:ring-2 focus-visible:ring-white"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
