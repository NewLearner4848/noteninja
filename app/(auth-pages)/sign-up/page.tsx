import { signUpAction, googleSignInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex items-center justify-center h-screen p-6">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-xl shadow-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create your Note Ninja account</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Already have an account?{" "}
            <Link
              className="text-primary font-medium underline"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
        </div>
        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
            />
          </div>
          <SubmitButton className="w-full" formAction={signUpAction} pendingText="Signing up...">
            Sign up
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
          <span className="text-sm font-medium">Sign up with Google</span>
        </button>

        <FormMessage message={searchParams} />
      </div>
    </main >
  );
}
