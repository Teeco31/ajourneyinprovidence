/**
 * Migration 002, after model.cjs. Run on an existing space with: npm run cms:update
 *
 * - The book has two editions, hardback and paperback, each with its own ISBN. New "Edition" type.
 * - Stores say which edition a link sells (dropdown).
 * - The single ISBN field on Site settings is removed. ISBNs now live on the editions.
 * - Contact field help text explains the custom email address.
 */
module.exports = function (migration) {
  const edition = migration.createContentType("edition", {
    name: "Edition",
    displayField: "name",
    description: "Hardback or paperback. Each can have its own ISBN. Both show on the site so visitors know they can choose either or both.",
  });
  edition.createField("name").name("Edition").type("Symbol").required(true).validations([{ in: ["Hardback", "Paperback"] }]);
  edition.createField("isbn").name("ISBN").type("Symbol");
  edition.createField("note").name("Short note").type("Symbol");
  edition.createField("order").name("Order").type("Integer");
  edition.changeFieldControl("name", "builtin", "dropdown", { helpText: "Pick Hardback or Paperback. Add one entry for each edition." });
  edition.changeFieldControl("isbn", "builtin", "singleLine", { helpText: "Shown in small print. For example: 978-978-63469-1-5. Leave blank until confirmed and it will not show." });
  edition.changeFieldControl("note", "builtin", "singleLine", { helpText: "Optional, one short line. For example: A durable cloth-bound copy for your shelf." });
  edition.changeFieldControl("order", "builtin", "numberEditor", { helpText: "Lowest number shows first." });

  const store = migration.editContentType("store");
  store.editField("format").validations([{ in: ["Hardback", "Paperback", "Hardback and paperback"] }]);
  store.changeFieldControl("format", "builtin", "dropdown", {
    helpText: "Which edition this link sells. If a store sells both, add one entry per edition, each with its own link.",
  });

  const site = migration.editContentType("siteSettings");
  site.deleteField("isbn");
  site.changeFieldControl("contactEmail", "builtin", "singleLine", {
    helpText: "Shown in the Contact section and the footer. Use the publisher's custom address, for example info@ajourneyinprovidence.com, forwarded to an existing inbox.",
  });
  site.changeFieldControl("contactPhone", "builtin", "singleLine", {
    helpText: "Shown in the Contact section and the footer. Include the country code, for example +234 800 000 0000. A WhatsApp button appears when it starts with +.",
  });
};
