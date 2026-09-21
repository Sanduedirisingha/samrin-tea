/**
 * Photo slots used across the site. Every slot starts empty (`null`) and shows the design's
 * hatch texture. To add a photo:
 *   1. Put the file in `public/images/site/` (JPG or WebP, about 2000 px on the long edge).
 *   2. Replace the slot's `null` below with an entry, for example:
 *        storyFactory: {
 *          src: "/images/site/factory.jpg",
 *          alt: "Samrin Tea Factory in Nakiyadeniya, seen from the road",
 *          width: 2000,
 *          height: 1333,
 *        },
 *   3. If the photo needs a credit (Creative Commons etc.), add `credit: { text, href }` — it is
 *      listed automatically under "Photo credits" on the Story page.
 * Use authentic Samrin photography only (brand guide: no generic or misleading origin imagery).
 */
export type SiteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit?: { text: string; href: string };
};

export const siteImages = {
  /** Home hero: full-bleed background, decorative (faded and tinted behind the headline). */
  heroMain: {
    src: "/images/site/hero-leaves.jpg",
    alt: "Fresh tea leaves in bright sunlight on a tea bush",
    width: 1920,
    height: 1080,
  },
  /** Origin section: large tile ("Nakiyadeniya, Galle district"). */
  originMain: {
    src: "/images/site/origin-factory.webp",
    alt: "A white two-storey factory building with a blue roof, seen across a paved yard with trees around it",
    width: 680,
    height: 510,
  },
  /** Brewing sequence: one photo per step (one per step). */
  brew1: {
    src: "/images/site/brew-1-rinse.webp",
    alt: "Hot water running from a tap into a white mug held over a sink",
    width: 1009,
    height: 1200,
  },
  brew2: {
    src: "/images/site/brew-2-add-tea.webp",
    alt: "Tea being poured from a white teapot into a cup on a saucer",
    width: 1200,
    height: 810,
  },
  brew3: {
    src: "/images/site/brew-3-boiling-water.webp",
    alt: "A steel kettle pouring boiling water into a mug with a tea bag",
    width: 960,
    height: 1200,
  },
  brew4: {
    src: "/images/site/brew-4-brew.webp",
    alt: "Boiling water poured onto a tea bag in a white cup, with a bowl of loose tea beside it",
    width: 960,
    height: 1200,
  },
  brew5: {
    src: "/images/site/brew-5-enjoy.webp",
    alt: "A white teacup and saucer on a wooden tray with an open book, candles and small white flowers",
    width: 1400,
    height: 946,
  },
  /** Making strip: one photo per card, in order. */
  making1: {
    src: "/images/site/making-withering.jpg",
    alt: "Dark tea leaves beside a scoop, with a glass teapot of brewed tea seen from above",
    width: 1600,
    height: 1080,
  },
  making2: {
    src: "/images/site/making-sifting.jpg",
    alt: "A hand holding a fine mesh sieve of dried leaves and seeds over a metal tray",
    width: 1600,
    height: 1080,
  },
  making3: {
    src: "/images/site/making-packed.jpg",
    alt: "Tea leaves travelling along a conveyor in a factory",
    width: 1600,
    height: 1080,
  },
  making4: {
    src: "/images/site/making-tea-bags.jpg",
    alt: "Tea bags beside a glass cup of black tea and a sugar cube",
    width: 1600,
    height: 1080,
  },
  /** Story page: the three photo tiles. */
  storyRuhuna: null,
  storyFactory: null,
  storyCup: null,
} satisfies Record<string, SiteImage | null>;

export type SlotId = keyof typeof siteImages;

export const getSlot = (slot: SlotId): SiteImage | null => siteImages[slot] as SiteImage | null;

export type CreditedImage = SiteImage & { credit: NonNullable<SiteImage["credit"]> };

export const creditedImages = (): CreditedImage[] =>
  (Object.keys(siteImages) as SlotId[])
    .map(getSlot)
    .filter((i): i is CreditedImage => Boolean(i?.credit));
