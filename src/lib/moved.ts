/**
 * Old Squarespace URLs that cannot be expressed as host redirects because they
 * contain "+", which is a modifier in Vercel's route patterns. These are
 * prerendered as forwarding pages instead, which works on any host.
 *
 * All of them are faceted category and tag listings from the old product
 * directory. None had meaningful search traffic, but a dead link is still a
 * dead link.
 */
export const MOVED: Record<string, string> = {
  '/products-services/category/Audio+players': '/picks',
  '/products-services/category/Communication+devices': '/decisions/first-phone',
  '/products-services/category/Home+monitoring': '/disclosure',
  '/products-services/category/Parental+control': '/disclosure',
  '/products-services/category/Smart+home+devices': '/picks',
  '/products-services/tag/Attention+and+focus': '/picks',
  '/products-services/tag/Parental+control': '/disclosure',
  '/products-services/tag/Smart+monitoring': '/disclosure',
  '/resources/category/Communication+devices': '/decisions/first-phone',
  '/resources/category/Internet+culture': '/conversations',
  '/resources/category/Parental+controls': '/disclosure',
  '/resources/category/Thought+leadership': '/conversations',
  '/resources/tag/AI+companions': '/conversations',
};

export function movedUnder(prefix: string) {
  return Object.entries(MOVED)
    .filter(([from]) => from.startsWith(prefix))
    .map(([from, to]) => ({ slug: from.slice(prefix.length), to }));
}
