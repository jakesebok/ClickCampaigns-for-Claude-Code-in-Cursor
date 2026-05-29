import type { ReactNode } from "react";

export type EditorialFAQItem = {
  q: string;
  a: ReactNode;
};

/**
 * EditorialFAQ
 *
 * Wraps a list of Q/A pairs as native <details>/<summary> elements,
 * styled by `.editorial-faq` and `.editorial-faq__item` in globals.css.
 *
 * The toggle is a CSS-drawn +/− cross-morph in accent orange, replacing
 * the native triangle marker. Native <details> gives us keyboard +
 * screen-reader semantics for free.
 */
export function EditorialFAQ({ items }: { items: EditorialFAQItem[] }) {
  return (
    <div className="editorial-faq">
      {items.map((item, i) => (
        <details key={i} className="editorial-faq__item">
          <summary>
            <span className="editorial-faq__summary-text">{item.q}</span>
            <span className="editorial-faq__toggle" aria-hidden />
          </summary>
          <div className="editorial-faq__body">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
