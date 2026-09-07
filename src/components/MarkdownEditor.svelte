<script>
  import { tick } from 'svelte';
  import { renderMarkdown } from '../lib/markdown.js';

  let { value = $bindable(''), placeholder = 'Start writing…' } = $props();

  let textareaEl = $state(null);
  let previewMode = $state(false);

  const rendered = $derived(renderMarkdown(value));

  async function wrapSelection(prefix, suffix = prefix, placeholderText = '') {
    const el = textareaEl;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || placeholderText;
    value = value.slice(0, start) + prefix + selected + suffix + value.slice(end);
    await tick();
    el.focus();
    const cursor = start + prefix.length;
    el.setSelectionRange(cursor, cursor + selected.length);
  }

  async function prefixLines(prefix) {
    const el = textareaEl;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;
    const block = value.slice(lineStart, lineEnd);
    const newBlock = block
      .split('\n')
      .map((l) => prefix + l)
      .join('\n');
    value = value.slice(0, lineStart) + newBlock + value.slice(lineEnd);
    await tick();
    el.focus();
    el.setSelectionRange(lineStart, lineStart + newBlock.length);
  }

  async function insertAtLineStart(text) {
    await prefixLines(text);
  }

  const tools = [
    { label: 'B', title: 'Bold', action: () => wrapSelection('**', '**', 'bold text') },
    { label: 'I', title: 'Italic', action: () => wrapSelection('*', '*', 'italic text') },
    { label: 'H1', title: 'Heading 1', action: () => insertAtLineStart('# ') },
    { label: 'H2', title: 'Heading 2', action: () => insertAtLineStart('## ') },
    { label: 'H3', title: 'Heading 3', action: () => insertAtLineStart('### ') },
    { label: '•', title: 'Bullet list', action: () => insertAtLineStart('- ') },
    { label: '1.', title: 'Numbered list', action: () => insertAtLineStart('1. ') },
    { label: '☑', title: 'Checklist', action: () => insertAtLineStart('- [ ] ') },
    { label: '"', title: 'Quote', action: () => insertAtLineStart('> ') },
    { label: '</>', title: 'Code', action: () => wrapSelection('`', '`', 'code') },
    { label: '🔗', title: 'Link', action: () => wrapSelection('[', '](https://)', 'link text') }
  ];
</script>

<div class="editor">
  <div class="toolbar">
    <div class="tools">
      {#each tools as tool}
        <button type="button" title={tool.title} disabled={previewMode} onclick={tool.action}>
          {tool.label}
        </button>
      {/each}
    </div>
    <button type="button" class="preview-toggle" onclick={() => (previewMode = !previewMode)}>
      {previewMode ? 'Edit' : 'Preview'}
    </button>
  </div>

  {#if previewMode}
    <div class="preview">
      {@html rendered}
    </div>
  {:else}
    <textarea bind:this={textareaEl} bind:value {placeholder} spellcheck="true"></textarea>
  {/if}
</div>

<style>
  .editor {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    overflow: hidden;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid var(--border);
    background: var(--surface-2);
    padding: 6px;
    flex-shrink: 0;
  }

  .tools {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    flex: 1;
    -webkit-overflow-scrolling: touch;
  }

  .tools button {
    flex-shrink: 0;
    min-width: 40px;
    height: 40px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--text);
    font-size: 14px;
    font-weight: 700;
  }

  .tools button:active {
    background: var(--border);
  }

  .tools button:disabled {
    opacity: 0.35;
  }

  .preview-toggle {
    flex-shrink: 0;
    height: 40px;
    padding: 0 14px;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    color: white;
    font-size: 13px;
    font-weight: 700;
  }

  textarea {
    flex: 1;
    min-height: 200px;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    color: var(--text);
    font-size: 16px;
    line-height: 1.5;
    padding: 14px;
  }

  .preview {
    flex: 1;
    overflow-y: auto;
    padding: 14px;
    line-height: 1.5;
  }

  .preview :global(h1),
  .preview :global(h2),
  .preview :global(h3) {
    margin: 0.6em 0 0.3em;
  }

  .preview :global(p) {
    margin: 0.4em 0;
  }

  .preview :global(ul.checklist) {
    list-style: none;
    padding-left: 4px;
  }

  .preview :global(ul.checklist li)::before {
    content: '☐ ';
  }

  .preview :global(ul.checklist li.checked)::before {
    content: '☑ ';
  }

  .preview :global(ul.checklist li.checked) {
    color: var(--text-dim);
    text-decoration: line-through;
  }

  .preview :global(blockquote) {
    margin: 0.4em 0;
    padding-left: 10px;
    border-left: 3px solid var(--accent);
    color: var(--text-dim);
  }

  .preview :global(code) {
    background: var(--surface-2);
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 0.9em;
  }

  .preview :global(pre) {
    background: var(--surface-2);
    padding: 10px;
    border-radius: 8px;
    overflow-x: auto;
  }
</style>
