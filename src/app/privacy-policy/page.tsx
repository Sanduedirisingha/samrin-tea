import type { Metadata } from "next";
import { PRIVACY_LAST_UPDATED, privacySections } from "@/content/privacy";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Samrin collects, uses and protects your personal data.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <article className="container-prose py-16 sm:py-24">
      <p className="text-gold-ink text-xs font-semibold tracking-[0.2em] uppercase">Legal</p>
      <h1 className="text-forest mt-4 text-4xl sm:text-5xl">Privacy policy</h1>
      <p className="text-muted mt-4">Last updated: {PRIVACY_LAST_UPDATED}</p>

      <nav aria-label="On this page" className="border-line bg-ivory mt-10 rounded-xl border p-6">
        <h2 className="text-muted font-sans text-xs font-semibold tracking-[0.2em] uppercase">
          On this page
        </h2>
        <ol className="mt-3 columns-1 gap-8 sm:columns-2">
          {privacySections.map((s) => (
            <li key={s.id} className="py-1">
              <a href={`#${s.id}`} className="text-forest underline-offset-4 hover:underline">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-12">
        {privacySections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28">
            <h2 id={`${s.id}-h`} className="text-forest text-2xl sm:text-3xl">
              {s.title}
            </h2>
            <div className="[&_code]:bg-sand mt-4 space-y-4 leading-relaxed [&_code]:rounded [&_code]:px-1.5 [&_li]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
              {s.body}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
