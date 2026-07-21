import "dotenv/config";

import { createClient } from "@supabase/supabase-js";
import { stats } from "../app/data/cms";

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

async function seedStats() {
  console.log(`Seeding ${stats.length} stats...`);

  const rows = stats.map((item) => ({
    label: item.label,
    value: item.value,
    sort_order: item.sortOrder ?? 0,
  }));

  const seededLabels = rows.map((row) => row.label);
  await supabase.from("stats").delete().in("label", seededLabels);

  const { error } = await supabase.from("stats").insert(rows);

  if (error) {
    throw new Error(`Failed to seed stats: ${error.message}`);
  }

  console.log("Stats seeded successfully.");
}

seedStats().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
