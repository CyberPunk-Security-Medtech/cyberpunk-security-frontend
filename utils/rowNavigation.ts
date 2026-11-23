/**
 * True when a click landed on a control inside a clickable table row, such as a link or button.
 * Rows that open a record on click should ignore these so the control does its own job.
 */
export const isInteractiveTarget = (target: EventTarget | null): boolean =>
  target instanceof Element && !!target.closest("a, button, input, select, textarea, label");
