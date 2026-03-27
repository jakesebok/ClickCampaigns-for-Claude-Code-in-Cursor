import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 py-10">
      <div className="max-w-md text-center">
        <h1 className="mb-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Welcome back.
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Pick up where you left off and bring your priorities back into the room.
        </p>
      </div>
      <SignIn
        signUpUrl="/sign-up"
        appearance={{
          variables: {
            colorText: "hsl(220 25% 92%)",
            colorTextSecondary: "hsl(220 15% 70%)",
            colorBackground: "hsl(220 28% 16%)",
            colorInputBackground: "hsl(220 25% 20%)",
            colorInputText: "hsl(220 25% 92%)",
          },
          elements: {
            formButtonPrimary:
              "bg-primary hover:bg-primary/90 text-primary-foreground",
            card: "bg-card border border-border shadow-none",
            socialButtonsBlockButton:
              "bg-white hover:bg-gray-100 text-gray-900 border border-gray-200",
            socialButtonsBlockButtonText: "text-gray-900 font-medium",
          },
        }}
      />
      <p className="text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
