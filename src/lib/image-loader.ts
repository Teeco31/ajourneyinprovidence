/**
 * Image loader for the static export.
 * Contentful images are resized and converted to WebP by Contentful's Images API.
 * Files in /public are served as they are.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  if (src.startsWith("https://images.ctfassets.net")) {
    return `${src}?w=${width}&q=${quality ?? 75}&fm=webp`;
  }
  return `${src}?w=${width}`;
}
