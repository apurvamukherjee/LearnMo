<script>
  import Check from '@lucide/svelte/icons/check';
  import Copy from '@lucide/svelte/icons/copy';

  let { title = '', description = '', text = '' } = $props();

  let copied = $state(false);
  let timer;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // Fallback for browsers without clipboard API access.
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    copied = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied = false), 1600);
  }
</script>

<div class="box">
  <div class="head">
    <div>
      <h4>{title}</h4>
      {#if description}<p class="desc">{description}</p>{/if}
    </div>
    <button class="copy-btn" onclick={copy}>
      {#if copied}<Check size={15} strokeWidth={3} /> Copied{:else}<Copy size={15} /> Copy{/if}
    </button>
  </div>
  <pre class="content">{text}</pre>
</div>

<style>
  .box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 14px;
    border-bottom: 1px solid var(--border);
    background: var(--surface-2);
  }

  h4 {
    margin: 0 0 2px;
    font-size: 14px;
  }

  .desc {
    margin: 0;
    font-size: 12px;
    color: var(--text-dim);
  }

  .copy-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    border: none;
    border-radius: 8px;
    padding: 8px 14px;
    background: var(--accent);
    color: white;
    font-size: 13px;
    font-weight: 700;
  }

  .content {
    margin: 0;
    padding: 14px;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 13px;
    line-height: 1.5;
    color: var(--text-dim);
    max-height: 220px;
    overflow-y: auto;
  }
</style>
