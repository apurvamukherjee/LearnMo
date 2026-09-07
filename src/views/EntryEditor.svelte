<script>
  import { untrack } from 'svelte';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import Check from '@lucide/svelte/icons/check';
  import { data, updateEntry, deleteEntry } from '../lib/store.js';
  import { goBack, navigate } from '../router.js';
  import MarkdownEditor from '../components/MarkdownEditor.svelte';

  let { entryId } = $props();

  const entry = $derived($data.entries.find((e) => e.id === entryId));

  // Seeded once from the initial entry (App.svelte remounts this component per
  // entryId via {#key}), then owned locally; the effects below write changes back out.
  let title = $state(untrack(() => entry?.title ?? ''));
  let content = $state(untrack(() => entry?.content ?? ''));

  // untrack() keeps these effects from depending on `entry` itself: updateEntry()
  // produces a new entry reference every time, so reading `entry` reactively here
  // would re-trigger the effect right after it writes, looping forever.
  $effect(() => {
    const value = title;
    untrack(() => {
      if (entry) updateEntry(entryId, { title: value });
    });
  });

  $effect(() => {
    const value = content;
    untrack(() => {
      if (entry) updateEntry(entryId, { content: value });
    });
  });

  function toggleDone() {
    updateEntry(entryId, { status: entry.status === 'done' ? 'reading' : 'done' });
  }

  function removeEntry() {
    if (confirm(`Delete "${entry.title}"?`)) {
      deleteEntry(entryId);
      navigate(`/topics/${entry.topicId}`);
    }
  }
</script>

{#if entry}
  <div class="page">
    <header>
      <button class="icon-btn" onclick={goBack} aria-label="Back"><ArrowLeft size={20} /></button>
      <input class="title-input" bind:value={title} placeholder="Entry title" />
      <button class="icon-btn" onclick={removeEntry} aria-label="Delete entry"><Trash2 size={19} /></button>
    </header>

    <button class="status-toggle" class:done={entry.status === 'done'} onclick={toggleDone}>
      {#if entry.status === 'done'}<Check size={15} strokeWidth={3} />{/if}
      {entry.status === 'done' ? 'Done reading' : 'Mark as done'}
    </button>

    <MarkdownEditor bind:value={content} placeholder="Add your notes and content here…" />
  </div>
{:else}
  <div class="page">
    <p class="empty">This entry no longer exists.</p>
  </div>
{/if}

<style>
  .page {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: calc(12px + var(--safe-top)) 16px 16px;
    min-height: 0;
  }

  header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .title-input {
    flex: 1;
    min-width: 0;
    background: none;
    border: none;
    color: var(--text);
    font-size: 18px;
    font-weight: 700;
    padding: 8px 4px;
  }

  .status-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    align-self: flex-start;
    margin-bottom: 12px;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 8px 16px;
    background: var(--surface);
    color: var(--text-dim);
    font-size: 13px;
    font-weight: 700;
  }

  .status-toggle.done {
    background: rgba(62, 207, 142, 0.15);
    border-color: var(--done);
    color: var(--done);
  }

  .empty {
    color: var(--text-dim);
    text-align: center;
    margin-top: 60px;
  }
</style>
