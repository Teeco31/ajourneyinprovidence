export function SectionHeading({ id, label, title, intro }: { id: string; label: string; title: string; intro?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="label-caps">{label}</p>
      <h2 id={id} className="mt-2 text-4xl text-ink-900 md:text-6xl">{title}</h2>
      {intro ? <p className="mt-4 text-base text-ink-700">{intro}</p> : null}
    </div>
  );
}
