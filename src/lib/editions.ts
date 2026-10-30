import type { Edition } from "./types";

/** "Available in hardback and paperback. Choose either, or both." Empty when no editions are published. */
export function editionSentence(editions: Edition[]): string {
  const names = editions.map((e) => e.name.toLowerCase());
  if (names.length === 0) return "";
  if (names.length === 1) return `Available in ${names[0]}.`;
  return `Available in ${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}. Choose either, or both.`;
}
