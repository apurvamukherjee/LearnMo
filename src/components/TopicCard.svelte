<script>
  let { title, doneCount = 0, totalCount = 0, onclick } = $props();
  const pct = $derived(totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100));
</script>

<button class="card" {onclick}>
  <div class="top">
    <h3>{title}</h3>
    <span class="count">{doneCount}/{totalCount}</span>
  </div>
  <div class="track">
    <div class="fill" style="width: {pct}%"></div>
  </div>
</button>

<style>
  .card {
    display: block;
    width: 100%;
    text-align: left;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px 16px;
    color: var(--text);
  }

  .card:active {
    background: var(--surface-2);
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 8px;
  }

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .count {
    font-size: 12px;
    color: var(--text-dim);
    flex-shrink: 0;
  }

  .track {
    height: 5px;
    border-radius: 999px;
    background: var(--surface-2);
    overflow: hidden;
  }

  .fill {
    height: 100%;
    background: var(--accent);
    border-radius: 999px;
  }
</style>
