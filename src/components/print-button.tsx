"use client";

export function PrintButton() {
  return (
    <button type="button" className="btn btn-dark mt-6 print:hidden" onClick={() => window.print()}>
      Print or save as PDF
    </button>
  );
}
