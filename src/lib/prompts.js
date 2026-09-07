export const CONTENT_PROMPT = `You are writing content for a note-taking app. Format your entire reply as clean Markdown using ONLY these conventions, and output nothing except the markdown itself (no commentary, no "here is your content", no code fences around the whole thing):

- Start with a single "# Title" line.
- Use "## Section Name" for each section.
- Use "- " for bullet points.
- Use "- [ ] " for a checklist / to-do item (use "- [x] " if it should start checked).
- Use "**bold**" to highlight key terms.
- Use "> " for a quoted or important callout line.
- Keep paragraphs short (2-4 sentences).

Topic: <describe what you want written about here>

Write the content now, following the format rules exactly.`;

export const FLOW_LAYOUT_PROMPT = `I'm building a visual node map. Given the list of item titles below, return ONLY a single JSON object (no markdown fences, no explanation) with this exact shape:

{
  "nodes": [ { "label": "<exact title from my list>", "x": <number>, "y": <number> } ],
  "edges": [ { "source": "<label>", "target": "<label>" } ]
}

Rules:
- Include every title from my list as exactly one node, with the label copied EXACTLY as given.
- Arrange nodes in a clear hierarchical/tree-like layout (related items close together, spaced at least 200 apart on x and 140 apart on y so nothing overlaps).
- Only add edges between items that are meaningfully related; do not connect everything to everything.
- Output raw JSON only, nothing else.

My items:
<paste your topic / entry / note titles here, one per line>`;
