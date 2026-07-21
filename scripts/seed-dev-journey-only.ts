import "dotenv/config";

import { createClient } from "@supabase/supabase-js";
import { devJourneyItems } from "../app/data/cms";

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

async function seedDevJourney() {
  console.log(`Seeding ${devJourneyItems.length} dev journey items...`);

  const rows = devJourneyItems.map((item) => ({
    title: item.title,
    description: item.description,
    links: item.links ?? [],
    sort_order: item.sortOrder ?? 0,
  }));

  const seededTitles = rows.map((row) => row.title);
  await supabase.from("dev_journey_items").delete().in("title", seededTitles);

  const { error } = await supabase.from("dev_journey_items").insert(rows);

  if (error) {
    throw new Error(`Failed to seed dev journey: ${error.message}`);
  }
}

async function main() {
  await seedDevJourney();
  console.log("Dev journey seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
