/** Migration 003: the free-text "Formats" field is replaced by Edition entries (hardback, paperback). */
module.exports = function (migration) {
  migration.editContentType("siteSettings").deleteField("formats");
};
