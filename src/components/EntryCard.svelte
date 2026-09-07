<script>
  import StatusBadge from './StatusBadge.svelte';

  let { title, status, updatedAt, onclick } = $props();

  function formatDate(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
</script>

<button class="card" {onclick}>
  <div class="text">
    <h4>{title}</h4>
    <span class="date">Updated {formatDate(updatedAt)}</span>
  </div>
  <StatusBadge {status} />
</button>

<style>
  .card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    text-align: left;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px 14px;
    color: var(--text);
  }

  .card:active {
    background: var(--surface-2);
  }

  .text {
    min-width: 0;
  }

  h4 {
    margin: 0 0 4px;
    font-size: 15px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .date {
    font-size: 11px;
    color: var(--text-dim);
  }
</style>
