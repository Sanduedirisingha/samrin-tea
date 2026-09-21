"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-prose py-28 text-center">
      <p className="text-gold-ink text-xs font-semibold tracking-[0.2em] uppercase">
        Something went wrong
      </p>
      <h1 className="text-forest mt-4 text-4xl sm:text-5xl">
        We couldn&apos;t <em className="accent">brew that page.</em>
      </h1>
      <p className="text-muted mx-auto mt-6 max-w-md text-lg">
        Please try again. If it keeps happening, call us on{" "}
        <a href={siteConfig.hotline.href} className="text-forest font-medium underline">
          {siteConfig.hotline.display}
        </a>
        .
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button onClick={() => unstable_retry()} size="lg">
          Try again
        </Button>
        <ButtonLink href="/" variant="secondary" size="lg">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}
