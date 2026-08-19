import { config, collection, singleton, fields } from '@keystatic/core';

/**
 * Content is plain Markdown and YAML in the repo, so the browser admin and direct
 * file editing operate on exactly the same files. Neither path is privileged.
 *
 * Storage is local while developing. In production it talks to GitHub, which needs
 * PUBLIC_KEYSTATIC_GITHUB_REPO set to "owner/name" at build time.
 */
const repo = process.env.PUBLIC_KEYSTATIC_GITHUB_REPO;
const storage =
  process.env.NODE_ENV === 'production' && repo
    ? ({
        kind: 'github',
        repo: { owner: repo.split('/')[0]!, name: repo.split('/')[1]! },
      } as const)
    : ({ kind: 'local' } as const);

const AGE_BAND_OPTIONS = [
  { label: 'Ages 4 to 6', value: '4-6' },
  { label: 'Ages 7 to 9', value: '7-9' },
  { label: 'Ages 10 to 12', value: '10-12' },
  { label: 'Ages 13 and up', value: '13+' },
];

export default config({
  storage,
  ui: {
    brand: { name: 'Offline Childhood' },
    navigation: {
      'The site': ['decisions', 'concepts'],
      'Products and people': ['picks', 'experts'],
    },
  },
  collections: {
    decisions: collection({
      label: 'Decisions',
      slugField: 'title',
      path: 'src/content/decisions/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: { label: 'Short title', description: 'Used in listings. For example, "The first phone".' },
        }),
        question: fields.text({
          label: 'The question',
          description: 'Phrased the way a parent would actually ask it.',
          validation: { length: { min: 1 } },
        }),
        description: fields.text({ label: 'Summary', multiline: true, validation: { length: { min: 1 } } }),
        order: fields.integer({ label: 'Order', validation: { isRequired: true } }),
        appliesToBands: fields.multiselect({
          label: 'Comes up for these ages',
          options: AGE_BAND_OPTIONS,
          defaultValue: ['7-9', '10-12'],
        }),
        shortAnswer: fields.text({
          label: 'The short answer',
          description: 'One paragraph, opinionated, written before any product is mentioned.',
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        stances: fields.array(
          fields.object({
            id: fields.select({
              label: 'Rung',
              options: [
                { label: 'Start here', value: 'start' },
                { label: 'Going further', value: 'further' },
                { label: 'All the way', value: 'allin' },
              ],
              defaultValue: 'start',
            }),
            label: fields.text({ label: 'Label' }),
            summary: fields.text({ label: 'What to do', multiline: true }),
            forFamiliesWho: fields.text({
              label: 'For families who...',
              description: 'Completes the sentence. Lowercase, no full stop needed at the start.',
            }),
          }),
          {
            label: 'The ladder',
            description: 'Exactly three, pointing the same direction. Not neutral options.',
            itemLabel: (props) => props.fields.label.value || 'Rung',
          },
        ),
        picks: fields.array(fields.relationship({ label: 'Product', collection: 'picks' }), {
          label: 'Products worth considering',
          itemLabel: (props) => props.value ?? 'Product',
        }),
        relatedConcepts: fields.array(fields.relationship({ label: 'Conversation', collection: 'concepts' }), {
          label: 'Related conversations',
          itemLabel: (props) => props.value ?? 'Conversation',
        }),
        updated: fields.date({ label: 'Last reviewed', validation: { isRequired: true } }),
        content: fields.mdx({ label: 'Body' }),
      },
    }),

    concepts: collection({
      label: 'Conversations',
      slugField: 'title',
      path: 'src/content/concepts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        idea: fields.text({
          label: 'The idea in one sentence',
          description: 'Short enough that a ten-year-old could repeat it back.',
          multiline: true,
        }),
        description: fields.text({ label: 'Summary', multiline: true }),
        order: fields.integer({ label: 'Order', validation: { isRequired: true } }),
        strand: fields.select({
          label: 'Strand',
          options: [
            { label: 'What it is', value: 'What it is' },
            { label: 'How it works', value: 'How it works' },
            { label: 'Who controls it', value: 'Who controls it' },
            { label: 'How it was built', value: 'How it was built' },
            { label: 'Risks and guardrails', value: 'Risks and guardrails' },
          ],
          defaultValue: 'How it works',
        }),
        bands: fields.array(
          fields.object({
            band: fields.select({ label: 'Age band', options: AGE_BAND_OPTIONS, defaultValue: '7-9' }),
            explain: fields.text({ label: 'How to explain it', multiline: true }),
            tryThis: fields.text({ label: 'Try this', multiline: true }),
            listenFor: fields.text({ label: 'Listen for', multiline: true }),
            ifMoreExperienced: fields.text({
              label: 'If they already have more access than most',
              multiline: true,
            }),
          }),
          { label: 'By age', itemLabel: (props) => `Ages ${props.fields.band.value}` },
        ),
        misconceptions: fields.array(fields.text({ label: 'Misconception', multiline: true }), {
          label: 'What kids get wrong',
          itemLabel: (props) => (props.value || 'Misconception').slice(0, 60),
        }),
        classroom: fields.text({ label: 'Running this with a class', multiline: true }),
        relatedDecisions: fields.array(fields.relationship({ label: 'Decision', collection: 'decisions' }), {
          label: 'Related decisions',
          itemLabel: (props) => props.value ?? 'Decision',
        }),
        updated: fields.date({ label: 'Last reviewed', validation: { isRequired: true } }),
        content: fields.mdx({ label: 'Body' }),
      },
    }),

    picks: collection({
      label: 'Products',
      slugField: 'name',
      path: 'src/content/picks/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Product name' } }),
        maker: fields.text({ label: 'Made by' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Phones and watches', value: 'Phones and watches' },
            { label: 'Audio and stories', value: 'Audio and stories' },
            { label: 'Cameras and making', value: 'Cameras and making' },
            { label: 'Games and play', value: 'Games and play' },
            { label: 'Books and paper', value: 'Books and paper' },
            { label: 'Outdoor', value: 'Outdoor' },
            { label: 'Software and settings', value: 'Software and settings' },
          ],
          defaultValue: 'Phones and watches',
        }),
        summary: fields.text({ label: 'One honest sentence on who it is for', multiline: true }),
        priceBand: fields.select({
          label: 'Price band',
          options: [
            { label: '$', value: '$' },
            { label: '$$', value: '$$' },
            { label: '$$$', value: '$$$' },
          ],
          defaultValue: '$$',
        }),
        url: fields.url({ label: 'Link', validation: { isRequired: true } }),
        affiliate: fields.checkbox({ label: 'This is a paid link', defaultValue: false }),
        limitations: fields.text({
          label: 'What it is not good at',
          description: 'Required in spirit. A pick with no stated downside reads as an advert.',
          multiline: true,
        }),
        updated: fields.date({ label: 'Last checked', validation: { isRequired: true } }),
      },
    }),
  },

  singletons: {
    experts: singleton({
      label: 'People we read',
      path: 'src/content/experts/experts',
      format: { data: 'yaml' },
      schema: {
        entries: fields.array(
          fields.object({
            id: fields.text({ label: 'Key' }),
            name: fields.text({ label: 'Name' }),
            role: fields.text({ label: 'Role' }),
            focus: fields.text({ label: 'Why read them', multiline: true }),
            url: fields.url({ label: 'Link' }),
          }),
          { label: 'People', itemLabel: (props) => props.fields.name.value || 'Person' },
        ),
      },
    }),
  },
});
