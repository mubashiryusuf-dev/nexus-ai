import Link from "next/link";

import { MarketingNav } from "@/components/layout/marketing-nav";

interface RoutePageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
}

export function RoutePageShell({
  eyebrow,
  title,
  description,
  bullets
}: RoutePageShellProps): JSX.Element {
  return (
    <main className="min-h-screen bg-[#f6f1ea] px-4 pb-12 pt-4 text-[#26231f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <MarketingNav />

        <section className="mx-auto mt-10 max-w-[920px] rounded-[32px] border border-[#eadfd2] bg-white px-6 py-10 shadow-[0_18px_40px_rgba(46,32,18,0.08)] sm:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#cc6a32]">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#2a251f] sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-[720px] text-base leading-8 text-[#70685f]">
            {description}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {bullets.map((bullet) => (
              <article
                key={bullet}
                className="rounded-[22px] border border-[#efe5da] bg-[#fcfaf7] p-5"
              >
                <p className="text-sm leading-7 text-[#4f473f]">{bullet}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-[#d9773a] px-5 py-3 text-sm font-semibold text-white"
              href="/"
            >
              Back to home
            </Link>
            <Link
              className="rounded-full border border-[#eadfd2] px-5 py-3 text-sm font-medium text-[#4f473f]"
              href="/marketplace"
            >
              Open marketplace
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
