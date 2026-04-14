"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("cookie-consent") === null) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    window.dispatchEvent(new Event("cookie-consent-changed"));
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem("cookie-consent", "refused");
    setVisible(false);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 inset-x-0 z-50 bg-brand-night border-t-2 border-brand-orange text-white px-6 py-4"
    >
      <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center sm:text-left">
          Ce site utilise des cookies pour mesurer l&apos;audience. Consultez
          notre{" "}
          <Link
            href="/confidentialite"
            className="text-brand-orange underline hover:text-brand-orange/80"
          >
            politique de confidentialité
          </Link>
          .
        </p>
        <div className="flex gap-3">
          <button
            onClick={refuse}
            className="rounded-full border border-white/30 bg-transparent px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="rounded-full bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-orange-dark"
          >
            Accepter
          </button>
        </div>
      </div>
    </motion.div>
  );
}
