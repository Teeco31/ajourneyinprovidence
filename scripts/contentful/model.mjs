// Creates the content types in your Contentful space. Run once: npm run cms:model
import path from "node:path";
import * as migrationPkg from "contentful-migration";

const runMigration = migrationPkg.runMigration ?? migrationPkg.default?.runMigration;
const { CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN, CONTENTFUL_ENVIRONMENT } = process.env;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
  console.error("Set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN in .env.local first. See README.");
  process.exit(1);
}

await runMigration({
  filePath: path.resolve("scripts/contentful/model.cjs"),
  spaceId: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_MANAGEMENT_TOKEN,
  environmentId: CONTENTFUL_ENVIRONMENT || "master",
  yes: true,
});
console.log("Content model created.");
