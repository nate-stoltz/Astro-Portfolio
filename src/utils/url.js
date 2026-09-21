const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (path) => {
  if (typeof path !== 'string' || !path.startsWith('/')) return path;
  if (base && path.startsWith(base + '/')) return path;
  return `${base}${path}`;
};
