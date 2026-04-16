import type { SchemaTypeDefinition } from "sanity";
import { post } from "./post";
import { realisation } from "./realisation";
import { testimonial } from "./testimonial";
import { service } from "./service";
import { specialite } from "./specialite";
import { ville } from "./ville";
import { faqItem } from "./faq-item";
import { lead } from "./lead";
import { review } from "./review";
import { siteSettings } from "./site-settings";

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  realisation,
  testimonial,
  service,
  specialite,
  ville,
  faqItem,
  lead,
  review,
  siteSettings,
];
