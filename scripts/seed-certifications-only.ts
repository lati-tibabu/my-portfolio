import "dotenv/config";

import { createClient } from "@supabase/supabase-js";
import { certifications } from "../app/data/cms";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env",
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

async function seedCertifications() {
  console.log(`Seeding ${certifications.length} certifications...`);

  const rows = certifications.map((item) => ({
    title: item.title,
    issuer: item.issuer ?? null,
    url: item.url ?? null,
    issued_at: item.issuedAt ?? null,
    sort_order: item.sortOrder ?? 0,
  }));

  const seededTitles = rows.map((row) => row.title);
  await supabase.from("certifications").delete().in("title", seededTitles);

  const { error } = await supabase.from("certifications").insert(rows);

  if (error) {
    throw new Error(`Failed to seed certifications: ${error.message}`);
  }
}

async function main() {
  await seedCertifications();
  console.log("Certifications seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
