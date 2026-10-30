// Runs a Contentful migration file from scripts/contentful/. Default is the first model.
//   npm run cms:model    creates the content types on an empty space (model.cjs)
//   npm run cms:update   applies migration 002 (editions) to an existing space
import path from "node:path";
import * as migrationPkg from "contentful-migration";

const runMigration = migrationPkg.runMigration ?? migrationPkg.default?.runMigration;
const { CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN, CONTENTFUL_ENVIRONMENT } = process.env;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
  console.error("Set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN in .env.local first. See README.");
  process.exit(1);
}

await runMigration({
  filePath: path.resolve("scripts/contentful", process.argv[2] ?? "model.cjs"),
  spaceId: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_MANAGEMENT_TOKEN,
  environmentId: CONTENTFUL_ENVIRONMENT || "master",
  yes: true,
});
console.log("Migration applied.");
