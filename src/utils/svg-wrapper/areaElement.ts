export const findAreaIdFromTarget = (
  target: EventTarget | null,
  root: Element
) => {
  if (!(target instanceof Element)) return null;
  const group = target.closest("[data-area-id]");
  if (!group || !root.contains(group)) return null;

  return group.getAttribute("data-area-id");
};
