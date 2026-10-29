import { Hero } from "@/components/sections/hero";
import { AboutBook } from "@/components/sections/about-book";
import { AboutAuthor } from "@/components/sections/about-author";
import { Trailers } from "@/components/sections/trailers";
import { Launch } from "@/components/sections/launch";
import { Buy } from "@/components/sections/buy";
import { Voices } from "@/components/sections/voices";
import { Gallery } from "@/components/sections/gallery";
import { Contact } from "@/components/sections/contact";
import { JsonLd } from "@/components/json-ld";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Hero />
      <AboutBook />
      <AboutAuthor />
      <Trailers />
      <Launch />
      <Buy />
      <Voices />
      <Gallery />
      <Contact />
    </>
  );
}
