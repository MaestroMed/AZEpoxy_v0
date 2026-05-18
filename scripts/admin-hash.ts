/**
 * Generate the bcrypt hash to put in ADMIN_PASSWORD_HASH.
 *
 *   npm run admin:hash -- 'monMotDePasse'
 *
 * Also emits a fresh ADMIN_JWT_SECRET suggestion (cryptographically
 * random) and prints the env vars in a ready-to-paste block.
 */
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

async function main() {
  const plaintext = process.argv[2];
  if (!plaintext) {
    console.error("Usage: npm run admin:hash -- 'yourPassword'");
    process.exit(1);
  }
  if (plaintext.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(plaintext, 12);
  const jwtSecret = crypto.randomBytes(48).toString("base64");

  console.log("");
  console.log("─ Paste these into Vercel env vars + .env.local ─");
  console.log("");
  console.log(`ADMIN_PASSWORD_HASH='${hash}'`);
  console.log(`ADMIN_JWT_SECRET='${jwtSecret}'`);
  console.log("");
  console.log("(set ADMIN_EMAIL separately with your login email)");
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
