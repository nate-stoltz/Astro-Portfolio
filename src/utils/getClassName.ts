export function getElementClassName(block: string, element: string, modifier?: string): string {
  const base = element ? `${block}__${element}` : '';
  const modifierClass = modifier
    ? element
      ? `${block}__${element}--${modifier}`
      : `${block}--${modifier}`
    : '';

  return [block, base, modifierClass].filter(Boolean).join(' ');
}
