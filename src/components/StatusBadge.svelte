<script>
  let { status = 'reading' } = $props();
</script>

<span class="badge" class:done={status === 'done'}>
  {status === 'done' ? 'Done' : 'Reading'}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
    padding: 3px 9px;
    border-radius: 999px;
    background: var(--surface-2);
    color: var(--text-dim);
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .badge.done {
    background: rgba(62, 207, 142, 0.15);
    color: var(--done);
  }
</style>
