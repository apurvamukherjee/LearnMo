<script>
  import { data, addEntry, deleteTopic } from '../lib/store.js';
  import { navigate, goBack } from '../router.js';
  import EntryCard from '../components/EntryCard.svelte';
  import { autofocus } from '../lib/actions.js';

  let { topicId } = $props();

  const topic = $derived($data.topics.find((t) => t.id === topicId));
  const entries = $derived(
    $data.entries.filter((e) => e.topicId === topicId).slice().sort((a, b) => b.updatedAt - a.updatedAt)
  );

  let showAdd = $state(false);
  let newTitle = $state('');

  function submit() {
    const title = newTitle.trim();
    if (title) {
      const id = addEntry(topicId, title);
      newTitle = '';
      showAdd = false;
      navigate(`/entry/${id}`);
    }
  }

  function removeTopic() {
    if (confirm(`Delete "${topic.title}" and all its entries?`)) {
      deleteTopic(topicId);
      navigate('/topics');
    }
  }
</script>

<div class="page">
  <header>
    <button class="icon-btn" onclick={goBack} aria-label="Back">←</button>
    <h1>{topic ? topic.title : 'Topic'}</h1>
    <button class="icon-btn" onclick={() => (showAdd = !showAdd)} aria-label="Add entry">+</button>
  </header>

  {#if showAdd}
    <div class="add-row">
      <input
        placeholder="New entry title…"
        bind:value={newTitle}
        onkeydown={(e) => e.key === 'Enter' && submit()}
        use:autofocus
      />
      <button class="btn" onclick={submit}>Add</button>
    </div>
  {/if}

  <div class="list">
    {#if entries.length === 0}
      <p class="empty">No entries yet. Tap + to add content to read and edit.</p>
    {/if}
    {#each entries as entry (entry.id)}
      <EntryCard
        title={entry.title}
        status={entry.status}
        updatedAt={entry.updatedAt}
        onclick={() => navigate(`/entry/${entry.id}`)}
      />
    {/each}
  </div>

  {#if topic}
    <button class="delete-topic" onclick={removeTopic}>Delete topic</button>
  {/if}
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: calc(16px + var(--safe-top)) 16px 16px;
    overflow-y: auto;
  }

  header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }

  h1 {
    flex: 1;
    margin: 0;
    font-size: 19px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .add-row {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
  }

  .add-row input {
    flex: 1;
    min-width: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    padding: 10px 12px;
    font-size: 15px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .empty {
    color: var(--text-dim);
    font-size: 14px;
    text-align: center;
    margin-top: 40px;
  }

  .delete-topic {
    margin-top: 24px;
    align-self: center;
    background: none;
    border: none;
    color: var(--danger);
    font-size: 13px;
    padding: 10px;
  }
</style>
