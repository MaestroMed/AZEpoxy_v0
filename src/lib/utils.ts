import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  name: "AZ Époxy",
  tagline: "Thermolaquage Poudre Époxy Professionnel",
  url: "https://azepoxy.fr",
  phone: "09 71 35 74 96",
  phoneHref: "tel:+33971357496",
  email: "contact@azepoxy.fr",
  emailHref: "mailto:contact@azepoxy.fr",
  address: {
    street: "23 Chemin du Bac des Aubins",
    zip: "95820",
    city: "Bruyères-sur-Oise",
    country: "France",
  },
  parent: {
    name: "AZ Construction",
    url: "https://azconstruction.fr",
  },
  social: {
    instagram: "https://instagram.com/azepoxy",
  },
} as const;
