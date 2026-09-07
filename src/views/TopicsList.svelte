<script>
  import { data, addTopic } from '../lib/store.js';
  import { navigate } from '../router.js';
  import TopicCard from '../components/TopicCard.svelte';
  import { autofocus } from '../lib/actions.js';

  let showAdd = $state(false);
  let newTitle = $state('');

  function submit() {
    const title = newTitle.trim();
    if (title) addTopic(title);
    newTitle = '';
    showAdd = false;
  }

  const rows = $derived(
    $data.topics
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((topic) => {
        const entries = $data.entries.filter((e) => e.topicId === topic.id);
        const doneCount = entries.filter((e) => e.status === 'done').length;
        return { topic, doneCount, totalCount: entries.length };
      })
  );
</script>

<div class="page">
  <header>
    <h1>Topics</h1>
    <button class="icon-btn" onclick={() => (showAdd = !showAdd)} aria-label="Add topic">+</button>
  </header>

  {#if showAdd}
    <div class="add-row">
      <input
        placeholder="New topic name…"
        bind:value={newTitle}
        onkeydown={(e) => e.key === 'Enter' && submit()}
        use:autofocus
      />
      <button class="btn" onclick={submit}>Add</button>
    </div>
  {/if}

  <div class="list">
    {#if rows.length === 0}
      <p class="empty">No topics yet. Tap + to create your first one.</p>
    {/if}
    {#each rows as row (row.topic.id)}
      <TopicCard
        title={row.topic.title}
        doneCount={row.doneCount}
        totalCount={row.totalCount}
        onclick={() => navigate(`/topics/${row.topic.id}`)}
      />
    {/each}
  </div>
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
    justify-content: space-between;
    margin-bottom: 14px;
  }

  h1 {
    margin: 0;
    font-size: 22px;
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
</style>
