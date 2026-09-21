import { creditedImages } from "@/content/site-images";

/** Lists credits for any photo that needs one. Renders nothing when there are none. */
export function PhotoCredits() {
  const credited = creditedImages();
  if (credited.length === 0) return null;
  return (
    <section
      aria-labelledby="credits-heading"
      className="container-page border-line border-t py-10"
    >
      <h2
        id="credits-heading"
        className="text-muted text-xs font-semibold tracking-[0.2em] uppercase"
      >
        Photo credits
      </h2>
      <ul className="text-muted mt-3 space-y-1 text-sm">
        {credited.map((i) => (
          <li key={i.src}>
            <a href={i.credit.href} className="underline underline-offset-4">
              {i.credit.text}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
