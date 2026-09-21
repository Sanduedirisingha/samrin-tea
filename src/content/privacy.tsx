import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";

export const PRIVACY_LAST_UPDATED = "21 September 2026";

export type PrivacySection = { id: string; title: string; body: ReactNode };

const contactLine = (
  <>
    Consumer care on{" "}
    <a href={siteConfig.hotline.href} className="text-forest font-medium underline">
      {siteConfig.hotline.display}
    </a>
    {siteConfig.email && (
      <>
        {" "}
        or by email at{" "}
        <a href={`mailto:${siteConfig.email}`} className="text-forest font-medium underline">
          {siteConfig.email}
        </a>
      </>
    )}
    , or by post to {siteConfig.distributor.name}, {siteConfig.distributor.address.join(", ")}.
  </>
);

/** Plain-language policy for the Samrin online store. Reviewed by counsel before launch. */
export const privacySections: PrivacySection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          This website sells Samrin tea online. It is operated by {siteConfig.distributor.name},{" "}
          {siteConfig.distributor.address.join(", ")} (&ldquo;we&rdquo;, &ldquo;us&rdquo;), the
          distributor of Samrin tea. We are responsible for the personal data described in this
          policy.
        </p>
        <p>You can reach us through {contactLine}</p>
      </>
    ),
  },
  {
    id: "data-we-collect",
    title: "The data we collect",
    body: (
      <>
        <p>We collect only what we need to serve you:</p>
        <ul>
          <li>
            <strong>Order data</strong> — the items you order, prices and totals, order number and
            order status.
          </li>
          <li>
            <strong>Delivery and contact data</strong> — your name, email address, phone number,
            delivery address, district, postal code and any notes you add to an order.
          </li>
          <li>
            <strong>Enquiry data</strong> — what you tell us when you use the contact form (name,
            phone or email, your message and, for business or sample enquiries, business name, type,
            location and monthly usage).
          </li>
          <li>
            <strong>Technical data</strong> — a one-way hashed version of your IP address, used only
            to limit spam and repeated form submissions. We do not store your raw IP address in our
            enquiry records.
          </li>
          <li>
            <strong>Cart data on your device</strong> — see &ldquo;Cookies and local storage&rdquo;
            below.
          </li>
        </ul>
        <p>We do not knowingly collect payment card details on this website.</p>
      </>
    ),
  },
  {
    id: "why-we-use-it",
    title: "Why we use your data",
    body: (
      <>
        <p>We use personal data to:</p>
        <ul>
          <li>fulfil your order, including confirming payment details and arranging delivery;</li>
          <li>respond to your enquiries, sample requests and factory-visit interest;</li>
          <li>keep our records and meet our legal and tax obligations;</li>
          <li>protect the site and our customers from spam and misuse.</li>
        </ul>
        <p>
          We handle personal data in line with Sri Lanka&apos;s Personal Data Protection Act, No. 9
          of 2022. We rely on the need to perform our contract with you, to comply with the law, and
          our legitimate interest in running a secure shop. We do not sell your personal data and we
          do not use it for automated decisions about you.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>We share data only where needed to provide the service:</p>
        <ul>
          <li>
            <strong>Delivery partners</strong>, so your order can reach you;
          </li>
          <li>
            <strong>A payment provider</strong>, if and when online payment is added — we will
            update this policy before that happens;
          </li>
          <li>
            <strong>Technology providers</strong> that host this website and its database on our
            behalf;
          </li>
          <li>
            <strong>Authorities</strong>, where the law requires it.
          </li>
        </ul>
        <p>
          These providers may process data outside Sri Lanka. We only use providers that protect
          data appropriately.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    body: (
      <>
        <p>
          Your cart is kept in your browser&apos;s local storage (under the name{" "}
          <code>samrin_cart_v1</code>) so it is still there when you come back. It contains only
          product identifiers and quantities. It is not sent to us until you place an order and it
          is not used for tracking. You can clear it at any time by emptying your cart or clearing
          your browser data.
        </p>
        <p>
          This website does not currently use advertising or analytics cookies. If that changes, we
          will update this policy and ask for your consent where required.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <p>
        We keep order records for as long as needed to fulfil the order, handle any after-sales
        questions and meet our accounting and legal obligations. Enquiries are kept for as long as
        needed to respond and follow up. When data is no longer needed, we delete or anonymise it.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <p>
        We use reasonable technical and organisational measures to protect personal data, including
        encrypted connections, validated forms, restricted access to our database and limiting what
        is shown on public pages (for example, order confirmation pages do not show your address or
        contact details). No online service is completely secure, so please take care when sharing
        information.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>Subject to the law, you can ask us to:</p>
        <ul>
          <li>tell you what personal data we hold about you and give you a copy;</li>
          <li>correct data that is inaccurate or incomplete;</li>
          <li>delete your data, or restrict or object to how we use it;</li>
          <li>withdraw consent where we rely on it.</li>
        </ul>
        <p>
          To exercise a right, contact us through {contactLine} We may need to confirm who you are
          first. If you are unhappy with how we handle your data, you can also raise it with the
          authority responsible for data protection in Sri Lanka.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        This website is intended for adults. We do not knowingly collect personal data from
        children. If you believe a child has given us their data, please contact us and we will
        delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy as our services change. The &ldquo;last updated&rdquo; date at the
        top of this page shows when it was last revised, and material changes will be highlighted on
        this website.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: <p>Questions about this policy or your data? Reach us through {contactLine}</p>,
  },
];
