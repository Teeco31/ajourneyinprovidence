import Image from "next/image";
import { content } from "@/lib/content";

/**
 * Hardback built from the real files: front cover plus the spine cut from the full wrap.
 * The book is turned 22 degrees so the spine shows. Static, no script. The spine is 14.3% of the cover
 * width, which is its true proportion on the printed wrap.
 */
export function BookCover({ priority = false }: { priority?: boolean }) {
  const { book, author } = content.site;
  return (
    <div className="mx-auto w-72 pl-8 sm:w-80 md:w-96" style={{ perspective: "1600px" }}>
      <div className="relative" style={{ transformStyle: "preserve-3d", transform: "rotateY(22deg)" }}>
        <div
          aria-hidden="true"
          className="absolute top-0 h-full overflow-hidden"
          style={{ right: "100%", width: "14.3%", transformOrigin: "right center", transform: "rotateY(-90deg)" }}
        >
          <Image src="/images/spine.webp" alt="" fill sizes="3rem" className="object-cover" />
        </div>
        <Image
          src="/images/cover-800.webp"
          alt={`Front cover of ${book.title}: ${book.subtitle}, by ${author.shortName}. A portrait of the author in a grey top hat and white traditional attire.`}
          width={800}
          height={1071}
          sizes="(min-width: 768px) 24rem, 18rem"
          priority={priority}
          className="h-auto w-full shadow-overlay"
        />
      </div>
    </div>
  );
}
