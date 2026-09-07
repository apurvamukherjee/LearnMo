<script>
  import { untrack } from 'svelte';
  import { autofocus } from '../lib/actions.js';

  let { text, done, ontoggle, ondelete, onedit } = $props();

  let editing = $state(false);
  let draft = $state(untrack(() => text));

  function startEdit() {
    draft = text;
    editing = true;
  }

  function commit() {
    editing = false;
    const trimmed = draft.trim();
    if (trimmed && trimmed !== text) onedit(trimmed);
  }
</script>

<div class="row">
  <button class="check" class:done aria-label="Toggle done" onclick={ontoggle}>
    {#if done}✓{/if}
  </button>

  {#if editing}
    <input
      class="edit-input"
      bind:value={draft}
      onblur={commit}
      onkeydown={(e) => e.key === 'Enter' && commit()}
      use:autofocus
    />
  {:else}
    <button class="text" class:done onclick={startEdit}>{text}</button>
  {/if}

  <button class="icon-btn del" aria-label="Delete note" onclick={ondelete}>✕</button>
</div>

<style>
  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 10px 12px;
  }

  .check {
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: none;
    color: var(--done);
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .check.done {
    border-color: var(--done);
    background: rgba(62, 207, 142, 0.15);
  }

  .text {
    flex: 1;
    min-width: 0;
    text-align: left;
    background: none;
    border: none;
    color: var(--text);
    font-size: 15px;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text.done {
    color: var(--text-dim);
    text-decoration: line-through;
  }

  .edit-input {
    flex: 1;
    min-width: 0;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-size: 15px;
    padding: 6px 8px;
  }

  .del {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    color: var(--text-dim);
    background: none;
  }
</style>
