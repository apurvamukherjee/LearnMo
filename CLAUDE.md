# LearnMo — internal project context

Personal, mobile-first, local-only web app for organizing reading/notes by topic, tracking done/reading status per entry, a separate Notes/read-next page, and a manual drag-and-drop flow chart linking everything. Full requirements discussion and the original approved plan live in this repo's conversation history; this file is the living summary for future sessions.

## Standing rules (do not violate)

- **Never `git commit` or `git push` in this repo.** The user set up the GitHub remote (`origin` → apurvamukherjee/LearnMo) themselves and explicitly does not want Claude touching git history. Editing files on disk is fine; committing/pushing is not, even if asked to "save progress" — confirm with the user first if this seems to conflict with a request.
- **README.md is product-facing only.** No mention of AI/Claude/tooling, no reference to this file or any internal doc. Update it whenever a user-visible feature changes, and keep `screenshots/` in sync (regenerate via Playwright against the dev server, see below).
- **This file (CLAUDE.md) is internal.** Keep it current after every meaningful chunk of work so a brand-new chat has full context without re-reading the whole codebase.

## Stack & why

- **Svelte 5 (runes) + Vite**, plain Vite project (no SvelteKit — single static bundle, no server rendering needed).
- **vite-plugin-pwa** for the manifest + service worker (installable, offline-capable).
- **@xyflow/svelte 1.6.x** (Svelte Flow) for the Map view — requires Svelte ^5.25, handles touch drag/pan/zoom and connections out of the box.
- No router library — `src/router.js` is a ~20-line hash router (`#/topics`, `#/topics/:id`, `#/entry/:id`, `#/notes`, `#/map`, `#/settings`). Back button works via `window.history`.
- No WYSIWYG/rich-text library — `src/components/MarkdownEditor.svelte` is a `<textarea>` + custom mobile-friendly formatting toolbar that inserts markdown syntax at the cursor, plus a preview toggle rendered via `src/lib/markdown.js` (hand-rolled, minimal markdown → HTML).
- Storage is **entirely local**: one JSON blob in `localStorage` (key `learnmo-data-v1`), managed by `src/lib/store.js`. No backend, no login, no cross-device sync (user's explicit choice — export/import JSON from Settings is the only backup path, via `src/lib/backup.js`).

## Critical gotcha: immutable store updates required

Svelte 5's `$derived` compares values by reference (`Object.is`) to decide whether to propagate changes downstream. Early on, `store.js` mutated objects/arrays in place (e.g. `Object.assign(entry, patch)`) — this silently broke reactivity anywhere a `$derived` narrowed to a single item (e.g. `$data.entries.find(...)` in `EntryEditor.svelte`): the mutation happened and persisted to `localStorage` correctly, but the UI never re-rendered because the found object's reference never changed.

**Fix applied:** every updater in `src/lib/store.js` now returns a brand-new top-level state object and replaces (never mutates) any array/object it touches — e.g. `state.entries.map(e => e.id === id ? { ...e, ...patch } : e)` instead of `Object.assign`. Keep this pattern for any future store changes.

A related gotcha: `EntryEditor.svelte`'s autosave `$effect`s must not reactively depend on the `entry` derived value (since updating it produces a new reference every time), or they loop forever. They read `entry` inside `untrack()` from `'svelte'` — see that file for the pattern if adding more autosave-style effects elsewhere.

## Data model (all in the one localStorage blob)

- `Topic { id, title, order, createdAt }`
- `Entry { id, topicId, title, content, status: 'reading' | 'done', order, createdAt, updatedAt }`
- `Note { id, text, done, order, createdAt }`
- `FlowNode { id, refType: 'topic' | 'entry' | 'note', refId, x, y }` — auto-created whenever a Topic/Entry/Note is created, so the Map never has "missing" items.
- `FlowEdge { id, source, target }` — only created by user action (manual connect on the canvas, or via Settings' "Import layout JSON").

## File layout

```
src/
  main.js              # mounts App, imports Svelte Flow CSS + app.css
  app.css              # global theme (dark, CSS variables), mobile-first resets
  App.svelte           # route switch + BottomNav (hidden on /entry/:id for max editor space)
  router.js            # hash router
  lib/
    store.js           # the writable store + all CRUD (immutable updates only, see above)
    backup.js          # export/import full JSON backup
    markdown.js         # minimal markdown -> HTML renderer (used by MarkdownEditor preview)
    prompts.js         # the two AI prompt template strings shown in Settings
    actions.js         # `autofocus` action (use:autofocus) - avoids the native autofocus a11y lint warning
  views/
    TopicsList.svelte, TopicDetail.svelte, EntryEditor.svelte,
    NotesPage.svelte, FlowChart.svelte, SettingsPage.svelte
  components/
    BottomNav, StatusBadge, TopicCard, EntryCard, NoteItem,
    MarkdownEditor (toolbar + textarea + preview), CopyableTextBox (prompt box + copy button)
public/icons/           # PWA icons (placeholder "LM" mark generated via Pillow — replace with real branding whenever the user has one)
screenshots/            # used by README.md; regenerate when the UI changes meaningfully
```

## Settings tab / AI prompt workflow

Two copy-paste prompt templates live in `src/lib/prompts.js`:
1. `CONTENT_PROMPT` — makes an external LLM output markdown matching this app's conventions, ready to paste into an entry.
2. `FLOW_LAYOUT_PROMPT` — makes an external LLM return `{ nodes: [{label,x,y}], edges: [{source,target}] }`; pasted into the Map view's "Import layout JSON" box (⇩ icon), which matches nodes by label (case-insensitive) via `importFlowLayout()` in `store.js`.

## Current status

Initial build complete and manually verified end-to-end with Playwright against the dev server (topic/entry CRUD, done-toggle, markdown editor + preview, notes CRUD, node drag persistence, edge connect, layout JSON import, topic delete cascade, backup export/import, PWA manifest, reload persistence — all confirmed working, zero console errors).

Known rough edges / possible next steps if the user asks:
- No topic rename UI yet (only create + delete).
- Flow Chart nodes are all the default Svelte Flow node style differentiated only by an emoji prefix (📚/📄/📝) — could add real custom node components later if the user wants richer styling.
- PWA icons are placeholder "LM" monogram — swap for real branding when available.
- No automated test suite — verification so far has been manual/Playwright-scripted, not committed as a repo test suite.

## Verifying changes

Run `npm run dev`, open the printed localhost URL. To script a check headlessly (as used during the initial build), install Playwright in a scratch directory (not as a project dependency) and drive the page — see conversation history for working example scripts if needed again.
