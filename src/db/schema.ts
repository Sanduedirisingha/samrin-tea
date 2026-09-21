import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgSequence,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const productRange = pgEnum("product_range", ["strong", "bopf"]);
export const productFormat = pgEnum("product_format", ["loose", "tea_bags"]);
export const orderStatus = pgEnum("order_status", [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);
export const paymentStatus = pgEnum("payment_status", ["unpaid", "paid", "failed", "refunded"]);
export const inquiryType = pgEnum("inquiry_type", [
  "general",
  "order_help",
  "business",
  "sample",
  "visit",
]);
export const inquiryStatus = pgEnum("inquiry_status", ["new", "handled"]);

/** Drives SMR-000001 style order numbers; safe under concurrent checkouts. */
export const orderNumberSeq = pgSequence("order_number_seq", { startWith: 1 });

export type ProductDetail = { label: string; value: string };
export type ProductImage = { src: string; alt: string; width: number; height: number };

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  range: productRange("range").notNull(),
  format: productFormat("format").notNull(),
  packLabel: text("pack_label").notNull(),
  netWeightG: integer("net_weight_g").notNull(),
  unitsPerPack: integer("units_per_pack"),
  tagline: text("tagline").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  chooseThisIf: text("choose_this_if").notNull(),
  details: jsonb("details").$type<ProductDetail[]>().notNull().default([]),
  images: jsonb("images").$type<ProductImage[]>().notNull().default([]),
  /** Price in minor units (Rs. 320.00 → 32000). NULL = business quote only. */
  priceLkr: integer("price_lkr"),
  isBusinessOnly: boolean("is_business_only").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  inStock: boolean("in_stock").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: text("order_number").notNull().unique(),
    status: orderStatus("status").notNull().default("pending"),
    paymentStatus: paymentStatus("payment_status").notNull().default("unpaid"),
    paymentProvider: text("payment_provider").notNull().default("manual"),
    paymentReference: text("payment_reference"),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone").notNull(),
    addressLine1: text("address_line1").notNull(),
    addressLine2: text("address_line2"),
    city: text("city").notNull(),
    district: text("district").notNull(),
    postalCode: text("postal_code").notNull(),
    notes: text("notes"),
    subtotalLkr: integer("subtotal_lkr").notNull(),
    deliveryFeeLkr: integer("delivery_fee_lkr").notNull().default(0),
    totalLkr: integer("total_lkr").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("orders_idempotency_key_idx").on(t.idempotencyKey)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    nameSnapshot: text("name_snapshot").notNull(),
    unitPriceLkr: integer("unit_price_lkr").notNull(),
    qty: integer("qty").notNull(),
    lineTotalLkr: integer("line_total_lkr").notNull(),
  },
  (t) => [index("order_items_order_id_idx").on(t.orderId)],
);

export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: inquiryType("type").notNull(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    businessName: text("business_name"),
    businessType: text("business_type"),
    location: text("location"),
    monthlyUsage: text("monthly_usage"),
    productSlug: text("product_slug"),
    message: text("message"),
    ipHash: text("ip_hash"),
    status: inquiryStatus("status").notNull().default("new"),
    ...timestamps,
  },
  (t) => [index("inquiries_ip_created_idx").on(t.ipHash, t.createdAt)],
);
