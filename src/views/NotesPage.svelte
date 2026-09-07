<script>
  import { data, addNote, updateNote, deleteNote } from '../lib/store.js';
  import NoteItem from '../components/NoteItem.svelte';

  let newText = $state('');

  function submit() {
    const text = newText.trim();
    if (text) addNote(text);
    newText = '';
  }

  const pending = $derived($data.notes.filter((n) => !n.done).sort((a, b) => a.createdAt - b.createdAt));
  const finished = $derived($data.notes.filter((n) => n.done).sort((a, b) => b.createdAt - a.createdAt));
</script>

<div class="page">
  <header>
    <h1>Notes</h1>
  </header>

  <div class="add-row">
    <input
      placeholder="What should you read or do next?"
      bind:value={newText}
      onkeydown={(e) => e.key === 'Enter' && submit()}
    />
    <button class="btn" onclick={submit}>Add</button>
  </div>

  <div class="list">
    {#if pending.length === 0 && finished.length === 0}
      <p class="empty">No notes yet. Add tasks or a "read next" queue here.</p>
    {/if}

    {#each pending as note (note.id)}
      <NoteItem
        text={note.text}
        done={note.done}
        ontoggle={() => updateNote(note.id, { done: !note.done })}
        ondelete={() => deleteNote(note.id)}
        onedit={(text) => updateNote(note.id, { text })}
      />
    {/each}

    {#if finished.length > 0}
      <p class="section-label">Done</p>
      {#each finished as note (note.id)}
        <NoteItem
          text={note.text}
          done={note.done}
          ontoggle={() => updateNote(note.id, { done: !note.done })}
          ondelete={() => deleteNote(note.id)}
          onedit={(text) => updateNote(note.id, { text })}
        />
      {/each}
    {/if}
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
    margin-bottom: 14px;
  }

  h1 {
    margin: 0;
    font-size: 22px;
  }

  .add-row {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
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
    gap: 8px;
  }

  .section-label {
    margin: 10px 0 0;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  .empty {
    color: var(--text-dim);
    font-size: 14px;
    text-align: center;
    margin-top: 40px;
  }
</style>
