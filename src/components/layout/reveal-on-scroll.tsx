"use client";

import { useEffect } from "react";

/**
 * Time-based fade-in for every `.reveal` element. Each one plays a slow, fixed-length animation
 * the moment it scrolls into view, so it looks the same however fast you scroll. Siblings are
 * staggered a little. Elements already on screen at load are never hidden (no flash), and nothing
 * is hidden at all without JS or with reduced motion.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    let initial = true;
    const scan = () => {
      const fresh = Array.from(document.querySelectorAll(".reveal")).filter((el) => !seen.has(el));
      for (const el of fresh) {
        seen.add(el);
        if (el.getBoundingClientRect().top < window.innerHeight) {
          // Already on screen at load: show as-is. Added later (tab switch, navigation): animate.
          el.classList.add("is-in");
          if (initial) el.classList.add("is-instant");
          continue;
        }
        const siblings = Array.from(el.parentElement?.children ?? []).filter((c) =>
          c.classList.contains("reveal"),
        );
        const index = Math.min(siblings.indexOf(el), 4);
        (el as HTMLElement).style.setProperty("--reveal-delay", `${index * 0.18}s`);
        io.observe(el);
      }
      initial = false;
    };

    root.classList.add("reveal-ready");
    scan();

    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
