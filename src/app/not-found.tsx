import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { GoldCurves } from "@/components/ui/gold-curves";
import { Trilingual } from "@/components/ui/trilingual";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="on-dark bg-forest text-cream relative isolate overflow-hidden py-28 text-center">
      <GoldCurves />
      <div className="container-prose relative">
        <Trilingual />
        <h1 className="text-cream mt-6 text-5xl sm:text-6xl">
          This page has <em className="accent">wandered off.</em>
        </h1>
        <p className="text-cream/85 mx-auto mt-6 max-w-md text-lg">
          The page you were looking for isn&apos;t here. Let&apos;s get you back to the tea.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/shop" variant="on-dark" size="lg">
            Shop tea
          </ButtonLink>
          <ButtonLink href="/" variant="secondary-on-dark" size="lg">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
