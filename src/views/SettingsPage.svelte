<script>
  import { CONTENT_PROMPT, FLOW_LAYOUT_PROMPT } from '../lib/prompts.js';
  import { exportData, importDataFromFile } from '../lib/backup.js';
  import CopyableTextBox from '../components/CopyableTextBox.svelte';

  let fileInput = $state(null);
  let importMsg = $state('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importDataFromFile(file);
      importMsg = 'Data imported successfully.';
    } catch (err) {
      importMsg = 'That file could not be read as a valid backup.';
    }
    e.target.value = '';
  }
</script>

<div class="page">
  <header>
    <h1>Settings</h1>
  </header>

  <section>
    <h2>Generate content with AI</h2>
    <p class="hint">
      Copy a prompt below into Claude, ChatGPT or any chat, fill in the blanks, then paste the reply into this app.
    </p>
    <CopyableTextBox
      title="Content prompt"
      description="Formats text to paste straight into an entry's editor."
      text={CONTENT_PROMPT}
    />
    <CopyableTextBox
      title="Map layout prompt"
      description="Generates a node/edge JSON layout — paste the result into the Map tab's Import."
      text={FLOW_LAYOUT_PROMPT}
    />
  </section>

  <section>
    <h2>Backup</h2>
    <p class="hint">Everything is stored only on this device. Export a backup or move it to another device.</p>
    <div class="backup-row">
      <button class="btn" onclick={exportData}>Export data</button>
      <button class="btn btn-ghost" onclick={() => fileInput.click()}>Import data</button>
      <input type="file" accept="application/json" bind:this={fileInput} onchange={handleFile} hidden />
    </div>
    {#if importMsg}<p class="hint">{importMsg}</p>{/if}
  </section>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 22px;
    height: 100%;
    padding: calc(16px + var(--safe-top)) 16px 16px;
    overflow-y: auto;
  }

  header h1 {
    margin: 0;
    font-size: 22px;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  h2 {
    margin: 0;
    font-size: 15px;
  }

  .hint {
    margin: 0;
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.4;
  }

  .backup-row {
    display: flex;
    gap: 10px;
  }
</style>
