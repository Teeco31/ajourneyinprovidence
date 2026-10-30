/**
 * Migration 005:
 * - Gallery photos get a "Show on the home page" tick, so the client chooses the few photos that appear on the home page.
 *   Every photo always appears on the Gallery page.
 * - The edition ISBN is no longer shown on the site, so its help text says so.
 */
module.exports = function (migration) {
  const photo = migration.editContentType("galleryPhoto");
  photo.createField("featured").name("Show on the home page").type("Boolean");
  photo.changeFieldControl("featured", "builtin", "boolean", {
    helpText: "Tick up to 3 photos to show on the home page. If none are ticked, the 3 newest are shown. Every photo always appears on the Gallery page.",
  });

  const edition = migration.editContentType("edition");
  edition.changeFieldControl("isbn", "builtin", "singleLine", {
    helpText: "Not shown on the site. Kept for search-engine data only. For example: 978-978-63469-1-5.",
  });
};
