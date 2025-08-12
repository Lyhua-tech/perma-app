import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <main className="relative w-full min-h-[100vh] p-3">
      {/* Animated background layer (Tailwind-only, now inset from edges) */}
      <div
        aria-hidden="true"
        className={[
          "absolute top-3 bottom-3 rounded-lg  from-gray-900 to-gray-600 bg-gradient-to-r",
          // Animate when crossing md
          "transition-all duration-500 ease-in-out",
          // Respect reduced motion
          "motion-reduce:transition-none",
          // On mobile: inset from both sides (matches page padding feel)
          "left-3 right-3",
          // On md+: start after the center gap and give extra space from the right edge
          // gap-3 = 0.75rem, so we offset by half the gap: 0.375rem
          "md:left-[calc(50%+0.375rem)] md:right-3",
        ].join(" ")}
      />

      {/* Foreground content */}
      <div className="relative z-10 flex min-h-[calc(100vh-24px)] flex-col md:flex-row gap-3">
        {/* Left/content column */}
        <section className="w-full md:w-1/2 rounded-lg flex flex-col justify-center items-center p-5">
          <h1 className="text-2xl mb-4 font-semibold md:text-black text-white">
            Welcome Back
          </h1>
          <LoginForm />
        </section>

        {/* Right column placeholder; background layer sits behind */}
        <aside className="hidden md:block w-full md:w-1/2 rounded-lg" />
      </div>
    </main>
  );
}
