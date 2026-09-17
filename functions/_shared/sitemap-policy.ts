export const isRedirectSource = (pathname: string, sources: string[]) =>
  sources.some(source => source === pathname || source.endsWith("*") && pathname.startsWith(source.slice(0, -1)));
