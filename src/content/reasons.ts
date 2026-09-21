/**
 * "More Reasons to Choose Samrin" — approved copy from "Samrin_Product Description.docx".
 * Two variants exist: loose tea and tea bags. The tea-bag variant discloses that the tea is
 * bagged at a nearby specialist facility and must be used on every tea-bag product.
 */
export type Reason = {
  id: string;
  title: string;
  /** Bold summary line shown while collapsed. */
  summary: string;
  /** Long text, one string per paragraph. */
  body: string[];
  link: { label: string; href: string };
};

export type ReasonsVariant = "loose" | "tea_bags";

const compare: Reason = {
  id: "which-is-right",
  title: "Strong or Premium BOPF — which is right for me?",
  summary:
    "Choose Strong for a darker, bolder cup that works especially well with milk. Choose Premium BOPF for a bright, lively tea flavour that is especially enjoyable plain and can also be taken with milk.",
  body: [
    "Samrin Strong is selected for robust flavour and deep colour. Start here if you usually drink milk tea or enjoy a stronger plain cup.",
    "Samrin Premium BOPF gives you a bright, full-bodied cup with a more noticeable tea flavour. It is best appreciated plain, while retaining enough strength for milk. Choose loose tea when you want to adjust the amount or prepare a pot. Choose tea bags for quick cup-by-cup preparation. Your usual way of drinking tea is the best guide.",
  ],
  link: { label: "Compare Strong and Premium BOPF", href: "/shop" },
};

const ruhuna: Reason = {
  id: "why-ruhuna",
  title: "Why Ruhuna Tea Is Special",
  summary:
    "Ruhuna is known for deep colour, full body and a strong, distinctive flavour. It is the rich and satisfying tea style many Sri Lankan drinkers already enjoy.",
  body: [
    "Ceylon teas do not all taste the same. Sri Lanka has seven recognised tea-growing regions, each with its own cup character. Ruhuna is part of the country's low-grown tea area, where warm conditions help produce richly coloured, full-flavoured black tea.",
    "In your cup, this can mean a deep liquor, satisfying body and a robust character that remains noticeable with milk. Ruhuna gives Samrin a recognisable regional identity rather than only the broad description Ceylon Tea.",
  ],
  link: { label: "Read more about Ruhuna tea", href: "/about#ruhuna" },
};

const visit: Reason = {
  id: "visit-factory",
  title: "Visit Samrin Tea Factory",
  summary:
    "Factory visits are planned from November 2026. See where Samrin tea is made, learn how fresh green leaf becomes black tea and taste Ruhuna tea close to its source.",
  body: [
    "Samrin Tea Factory is in Nakiyadeniya in the Galle district, within the tea-growing landscape between the Kanneliya, Dediyagala and Kottawa forest areas. Visiting gives customers a chance to see the place and meet the people behind the tea.",
    "Planned visits will explain how fresh green leaf becomes black tea, introduce different tea grades and let visitors experience Ruhuna tea at its source. Opening dates, activities and booking arrangements will be confirmed before visits begin. Contact Samrin to register your interest.",
  ],
  link: { label: "Explore the factory visit", href: "/about#visit" },
};

const looseOnly: Reason[] = [
  {
    id: "what-samrin-brings",
    title: "What Samrin Brings to Your Cup",
    summary:
      "Unblended Ruhuna tea from one known factory, made and packed at the same place. You get a clear source and regional character at a price intended for regular tea drinking.",
    body: [
      "Samrin tea comes from one identified factory in Ruhuna. It is not mixed with teas from unrelated factories or regions simply to create a standardised profile. This keeps the connection to the factory's own production and makes the source behind the tea easier to understand.",
      "Tea is a natural product, so its character may change slightly with the season. We keep that natural connection while selecting tea for each Samrin range. The loose tea is packed at the same factory, which reduces unnecessary transfers. Batch identification and consumer-care details also give you a direct way to ask about the pack you bought. Tea with a clear regional and factory source often carries a premium price. Samrin aims to offer this transparency within the price range of good tea bought for regular use.",
    ],
    link: { label: "Read how Samrin is different", href: "/about#story" },
  },
  {
    id: "quality-freshness",
    title: "Our Quality and Freshness Focus",
    summary:
      "The tea is manufactured under Samrin Tea Factory's ISO 22000:2018-certified food-safety management system and packed at the same factory.",
    body: [
      "Samrin Tea Factory's ISO 22000:2018 certification covers black-tea manufacture from withering to sifting. The finished loose tea is then packed at the same factory, keeping the journey from finished tea to sealed pack short and easier to oversee.",
      "Tea can absorb moisture and nearby odours and can gradually lose aroma during storage. We therefore pay attention to the condition of the tea at packing, storage, packaging materials and seal integrity. The pack is selected to help reduce exposure to moisture, air, light and strong odours. After opening, close the pack tightly and keep it in a cool, dry place away from sunlight and strong smells.",
    ],
    link: { label: "Read about quality and freshness", href: "/about#quality" },
  },
];

const bagsOnly: Reason[] = [
  {
    id: "what-samrin-brings",
    title: "What Samrin Brings to Your Cup",
    summary:
      "The tea comes from one known Ruhuna factory and is not mixed with teas from unrelated factories or regions. It is tea-bagged at a nearby specialist facility using Samrin's quality and freshness requirements.",
    body: [
      "Samrin selects the tea at its identified factory in Ruhuna. Keeping the factory source clear helps preserve the connection to the tea's regional and natural character, although small seasonal changes may still be noticeable.",
      "Samrin Tea Factory does not currently have tea-bagging machinery, so the tea travels a short distance to a nearby specialist packing facility. Our process sets requirements for protected transfer, suitable packaging materials, secure seals, storage and batch identification. This allows us to offer convenient tea bags while keeping the source clear and maintaining a strong focus on freshness.",
    ],
    link: { label: "Read how Samrin is different", href: "/about#story" },
  },
  {
    id: "quality-freshness",
    title: "Our Quality and Freshness Focus",
    summary:
      "The tea is manufactured at Samrin under its ISO 22000:2018-certified food-safety management system. Tea-bag packing then takes place at a specialist facility using Samrin's quality and freshness requirements.",
    body: [
      "Tea-bag packing is a separate step carried out at specialist facility. Tea can absorb moisture and nearby odours and can gradually lose aroma during storage. The selected packaging helps reduce exposure to moisture, air, light and strong odours. After opening, close the pack properly and keep it in a cool, dry place away from sunlight and strong smells.",
    ],
    link: { label: "Read about quality and freshness", href: "/about#quality" },
  },
];

export const reasonsByVariant: Record<ReasonsVariant, Reason[]> = {
  loose: [compare, ruhuna, ...looseOnly, visit],
  tea_bags: [compare, ruhuna, ...bagsOnly, visit],
};

/** "Still unsure" block copy. */
export const stillUnsure = {
  consumer: {
    body: "Taste Samrin Strong and Premium BOPF in the way you normally make tea, then choose the cup you prefer. Samples are subject to availability. We will confirm the delivery arrangements and any applicable charge before sending.",
    cta: "Request a Tasting Sample",
  },
  business: {
    body: "Choosing tea for an office, shop, restaurant or cafe? Request a business tasting sample and try it in your usual service setting with the people who will prepare and drink it. We will confirm the sample format, availability and delivery arrangements with you.",
    cta: "Request a Business Tasting Sample",
  },
} as const;

/** Approved brewing-instruction artwork per format. */
export const brewArtwork = {
  loose: {
    src: "/images/brew/loose-leaf.png",
    width: 1672,
    height: 941,
    alt: "How to prepare loose-leaf tea: rinse the cup with hot water and pour out the water; add 2 g of tea (about 1 teaspoon per cup); add 200 ml of boiling water at 100°C; brew for 3–5 minutes, or as preferred; filter and enjoy.",
  },
  tea_bags: {
    src: "/images/brew/tea-bags.png",
    width: 2079,
    height: 756,
    alt: "How to prepare tea bags: place one tea bag in a cup; add approximately 200 ml of freshly boiled water; brew for 3–5 minutes, or as preferred; remove the tea bag; add milk or sugar if desired, and enjoy.",
  },
} as const;
