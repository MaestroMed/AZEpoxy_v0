interface JsonLdProps {
  id?: string;
  data: unknown;
}

/**
 * Server-renders a JSON-LD <script> tag inline so crawlers see it without
 * waiting for hydration.
 */
export function JsonLd({ id, data }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Échappe "<" en séquence unicode pour empêcher toute injection
        // de balise fermante script via les données sérialisées.
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
