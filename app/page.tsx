import Hero from "@/components/hero";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-6 md:px-16 pb-24 text-foreground">
      <Hero />

      <section className="mt-10 w-full max-w-5xl text-center">
        <h2 className="text-3xl font-semibold mb-6">Why Note Ninja?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "📝 Lightning-fast Notes",
              description: "Capture your thoughts instantly with a super-smooth editor designed for speed and simplicity."
            },
            {
              title: "📦 Organize with Folders & Tags",
              description: "Keep your ideas sorted with intuitive folders, color labels, and smart tags."
            },
            {
              title: "🔒 Private & Secure",
              description: "End-to-end encryption ensures your notes stay private, and accessible only to you."
            }
          ].map(({ title, description }, idx) => (
            <div key={idx} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
