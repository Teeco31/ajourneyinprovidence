import { content } from "@/lib/content";
import { EventsList } from "../events-list";
import { SectionHeading } from "../section-heading";

export function Launch() {
  return (
    <section id="launch" aria-labelledby="launch-title" className="bg-white py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          id="launch-title"
          label="Launch events"
          title="Join us for the launch"
          intro="The book is launched at the 44th Annual NAPE Conference and Exhibition in Lagos. More readings and talks will be added here."
        />
        <EventsList events={content.events} contactEmail={content.site.contact.email} />
      </div>
    </section>
  );
}
