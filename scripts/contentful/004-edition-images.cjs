/**
 * Migration 004: each edition carries its own pictures, so the site can show the hardback and the paperback
 * side by side and the client can replace a cover later without a developer.
 */
module.exports = function (migration) {
  const edition = migration.editContentType("edition");
  const image = [{ linkMimetypeGroup: ["image"] }];

  edition.createField("cover").name("Front cover").type("Link").linkType("Asset").validations(image);
  edition.createField("spine").name("Spine").type("Link").linkType("Asset").validations(image);
  edition.createField("fullJacket").name("Full jacket (back, spine and front)").type("Link").linkType("Asset").validations(image);

  edition.changeFieldControl("cover", "builtin", "assetLinkEditor", {
    helpText: "The front cover only. Shown in the hero book and on the Buy card. Upload a JPG or PNG; the site resizes it for phones.",
  });
  edition.changeFieldControl("spine", "builtin", "assetLinkEditor", {
    helpText: "The spine only, tall and narrow. It makes the hero book look three-dimensional. Optional.",
  });
  edition.changeFieldControl("fullJacket", "builtin", "assetLinkEditor", {
    helpText: "The whole printed jacket laid flat. Shown in the About the book section. Optional.",
  });
};
