// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://offlinechildhood.com',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },

  /**
   * Redirects from the old Squarespace site. Declared here rather than in a
   * host config file so they survive a change of host. Specific paths are
   * matched before the catch-all patterns below them.
   */
  /**
   * Redirects from the old Squarespace site, enumerated from its sitemap.
   * Declared here rather than in a host config file so they survive a change
   * of host. Astro requires a dynamic redirect to preserve its parameters, so
   * these are explicit paths rather than wildcards.
   *
   * The old faceted category and tag URLs contain '+', which is a modifier in
   * Vercel's route patterns and cannot appear in a redirect source. Those are
   * handled by prerendered forwarding pages instead. See src/lib/moved.ts.
   */
  redirects: {
    // Phone and device entries point at the decision, which is what the
    // visitor was actually weighing.
    '/products-services/gabb-wireless-phones-amp-smartwatch': '/decisions/first-phone',
    '/products-services/noble-mobile': '/decisions/first-phone',
    '/products-services/tag/Communication': '/decisions/first-phone',
    '/products-services/tag/Phones': '/decisions/first-phone',
    '/products-services/tag/Watches': '/decisions/first-phone',
    '/products-services/the-light-phone': '/decisions/first-phone',
    '/resources/category/Smartphones': '/decisions/first-phone',

    // Monitoring and parental-control entries have no equivalent on purpose:
    // we take no commission on surveillance software, and this page says why.
    '/products-services/bark-products-for-monitoring-kids-digital-consumption': '/disclosure',
    '/products-services/canopy-online-safety-app': '/disclosure',

    // The rest of the old product directory.
    '/products-services': '/picks',
    '/products-services/blog-post-title-one-6gthm': '/picks',
    '/products-services/blog-post-title-three-4esac': '/picks',
    '/products-services/blog-post-title-two-692y7': '/picks',
    '/products-services/category/Computers': '/picks',
    '/products-services/category/Products': '/picks',
    '/products-services/category/STEM': '/picks',
    '/products-services/category/Services': '/picks',
    '/products-services/category/Tablets': '/picks',
    '/products-services/category/Toys': '/picks',
    '/products-services/category/clothing': '/picks',
    '/products-services/daylight-computer': '/picks',
    '/products-services/dayo-screen-use-tracker': '/picks',
    '/products-services/huckleberry-toys-to-encourage-outdoor-play': '/picks',
    '/products-services/outdoor-clothing-brands-for-rugged-outerwear': '/picks',
    '/products-services/outschool-learning-portal': '/picks',
    '/products-services/sites-for-finding-activities-and-classes': '/picks',
    '/products-services/tag/Activities': '/picks',
    '/products-services/tag/Apps': '/picks',
    '/products-services/tag/Circuitry': '/picks',
    '/products-services/tag/Classes': '/picks',
    '/products-services/tag/Coding': '/picks',
    '/products-services/tag/Education': '/picks',
    '/products-services/tag/Music': '/picks',
    '/products-services/tag/Stories': '/picks',

    // The old resources section held media literacy material.
    '/resources': '/conversations',
    '/resources/category/AI': '/conversations',
    '/resources/category/Advocacy': '/conversations',
    '/resources/category/Books': '/conversations',
    '/resources/category/Communication': '/conversations',
    '/resources/category/Events': '/conversations',
    '/resources/category/Gaming': '/conversations',
    '/resources/category/Legislation': '/conversations',
    '/resources/generation-ai-discussion-with-author': '/conversations',
    '/resources/ryanhodes': '/conversations',
    '/resources/tag/Critiques': '/conversations',
    '/resources/tag/Guidelines': '/conversations',

    '/expertise': '/trusted',
    '/community': '/about',
    '/home': '/',
  },
});
