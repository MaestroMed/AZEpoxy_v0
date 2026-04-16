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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
