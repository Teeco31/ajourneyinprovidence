/** Flat wave edge that nods to the Niger Delta waterways. Sits at the bottom of a section and takes its colour from `className` (text-*). */
export function Wave({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      className={`block h-6 w-full md:h-10 ${className}`}
      fill="currentColor"
    >
      <path d="M0 24c120 24 240 24 360 0s240-24 360 0 240 24 360 0 240-24 360 0v24H0z" />
    </svg>
  );
}
