"use client";

import { useEffect } from "react";

/**
 * Root error boundary — attrape les erreurs du root layout lui-même,
 * là où app/error.tsx ne peut plus rien faire. Doit fournir ses propres
 * balises <html>/<body> et des styles inline : à ce stade, le CSS
 * (Tailwind) peut ne pas être chargé du tout.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1A1A2E",
          color: "#FFFFFF",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "420px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#E85D2C",
            }}
          >
            AZ Époxy
          </p>
          <h1
            style={{
              margin: "16px 0 8px",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            Une erreur est survenue
          </h1>
          <p
            style={{
              margin: "0 0 24px",
              fontSize: "15px",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.65)",
            }}
          >
            Le site a rencontré un problème inattendu. Vous pouvez réessayer ;
            si le souci persiste, appelez-nous directement.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: "9999px",
              padding: "12px 28px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#FFFFFF",
              backgroundColor: "#E85D2C",
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
