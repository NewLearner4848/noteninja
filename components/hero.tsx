import Link from "next/link";

export default function Hero() {
  return (
    <>
      <section className="w-full max-w-5xl text-center mt-10">
        <h1 className="text-5xl font-bold mb-4">Welcome to <span className="text-primary">Note Ninja</span></h1>
        <p className="text-lg text-muted-foreground mb-6">
          Your minimal, lightning-fast, and secure note-taking companion.
        </p>
        <p className="text-sm text-muted-foreground">Capture thoughts. Stay organized. Move faster.</p>
      </section>
      <section className="mt-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Master Your Notes?</h2>
        <p className="text-muted-foreground mb-6">Sign up in seconds and start capturing everything that matters.</p>
        <Link
          href="/sign-up"
          className="inline-block bg-primary dark:bg-white dark:text-black text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition duration-200"
        >
          Get Started — It’s Free
        </Link>
      </section>
    </>
  );
}
