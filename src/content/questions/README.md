# Publishing an answer

Each answered question is one `.mdx` file here (the loader only picks up
`.mdx`, so this README never renders). To publish:

1. Anonymize the question: no names, no school names, nothing identifying.
2. Create `a-short-slug.mdx` with this shape:

```mdx
---
question: How do I handle the Switch my kid got from a grandparent?
asker: A parent of a 6-year-old
description: One sentence for the index card and search results.
updated: 2026-09-15
sources: []            # ids from src/lib/sources.ts, optional
relatedDecisions: []   # e.g. [video-games]
relatedConcepts: []    # e.g. [hard-to-put-down]
---

The answer, in the site's voice. Markdown works: headings, links, lists.
```

3. `git add`, commit, push. The Questions page lists newest first by `updated`.
