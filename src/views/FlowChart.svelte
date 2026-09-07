<script>
  import { SvelteFlow, Background, Controls, BackgroundVariant } from '@xyflow/svelte';
  import { data, updateNodePosition, addFlowEdge, importFlowLayout } from '../lib/store.js';

  const typeIcon = { topic: '📚', entry: '📄', note: '📝' };

  let nodes = $state.raw([]);
  let edges = $state.raw([]);

  $effect(() => {
    nodes = $data.flowNodes.map((n) => ({
      id: n.id,
      type: 'default',
      data: { label: `${typeIcon[n.refType] ?? ''} ${n.label}` },
      position: { x: n.x, y: n.y }
    }));
  });

  $effect(() => {
    edges = $data.flowEdges.map((e) => ({ id: e.id, source: e.source, target: e.target }));
  });

  function handleDragStop({ targetNode }) {
    if (targetNode) updateNodePosition(targetNode.id, targetNode.position.x, targetNode.position.y);
  }

  function handleConnect(connection) {
    addFlowEdge(connection.source, connection.target);
  }

  let showImport = $state(false);
  let importText = $state('');
  let importError = $state('');

  function applyImport() {
    try {
      const parsed = JSON.parse(importText);
      importFlowLayout(parsed);
      importError = '';
      importText = '';
      showImport = false;
    } catch (e) {
      importError = 'Could not parse that JSON. Check it matches the format from Settings.';
    }
  }
</script>

<div class="page">
  <header>
    <h1>Map</h1>
    <button class="icon-btn" onclick={() => (showImport = !showImport)} aria-label="Import layout">⇩</button>
  </header>

  {#if showImport}
    <div class="import-box">
      <textarea
        placeholder="Paste the JSON layout generated from the Settings prompt here…"
        bind:value={importText}
      ></textarea>
      {#if importError}<p class="error">{importError}</p>{/if}
      <button class="btn" onclick={applyImport}>Apply layout</button>
    </div>
  {/if}

  {#if $data.flowNodes.length === 0}
    <p class="empty">Add a topic, entry or note first — it'll show up here automatically.</p>
  {:else}
    <div class="canvas">
      <SvelteFlow bind:nodes bind:edges onnodedragstop={handleDragStop} onconnect={handleConnect} fitView>
        <Background variant={BackgroundVariant.Dots} />
        <Controls showLock={false} />
      </SvelteFlow>
    </div>
  {/if}
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-top: var(--safe-top);
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 16px 10px;
  }

  h1 {
    margin: 0;
    font-size: 22px;
  }

  .import-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 16px 12px;
  }

  .import-box textarea {
    min-height: 100px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    padding: 10px;
    font-size: 13px;
    font-family: monospace;
    resize: vertical;
  }

  .error {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
  }

  .canvas {
    flex: 1;
    min-height: 0;
  }

  .empty {
    color: var(--text-dim);
    font-size: 14px;
    text-align: center;
    margin-top: 40px;
    padding: 0 16px;
  }

  :global(.svelte-flow) {
    background: var(--bg);
  }

  :global(.svelte-flow__node-default) {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 10px;
    font-size: 13px;
    padding: 8px 12px;
    width: auto;
  }

  :global(.svelte-flow__node-default.selected) {
    border-color: var(--accent);
  }

  :global(.svelte-flow__edge-path) {
    stroke: var(--accent);
  }

  :global(.svelte-flow__controls) {
    box-shadow: none;
  }

  :global(.svelte-flow__controls-button) {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    fill: var(--text);
  }
</style>
