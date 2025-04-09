import { signInAction, googleSignInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <main className="flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-xl shadow-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign into your Note Ninja account</h1>
          <p className="text-muted-foreground mt-2 text-sm">
          Don't have an account?{" "}
            <Link
              className="text-primary font-medium underline"
              href="/sign-up"
            >
              Sign up
            </Link>
          </p>
        </div>
        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                className="text-xs text-foreground underline"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              required
            />
          </div>
          <SubmitButton className="w-full" pendingText="Signing In..." formAction={signInAction}>
            Sign in
          </SubmitButton>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={googleSignInAction}
          className="flex items-center w-full justify-center gap-3 border border-border rounded-md py-2 px-4 hover:bg-muted transition text-sm font-medium"
        >
          <FcGoogle className="text-xl" />
          <span className="text-sm font-medium">Sign in with Google</span>
        </button>

        <FormMessage message={searchParams} />
      </div>
    </main>
  );
}
