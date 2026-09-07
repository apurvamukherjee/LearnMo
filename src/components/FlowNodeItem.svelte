<script>
  import { Handle, Position } from '@xyflow/svelte';
  import BookOpen from '@lucide/svelte/icons/book-open';
  import FileText from '@lucide/svelte/icons/file-text';
  import StickyNote from '@lucide/svelte/icons/sticky-note';

  const icons = { topic: BookOpen, entry: FileText, note: StickyNote };

  let { data } = $props();
  const Icon = $derived(icons[data.refType] ?? FileText);
</script>

<Handle type="target" position={Position.Top} />
<div class="node">
  <Icon size={15} />
  <span>{data.label}</span>
</div>
<Handle type="source" position={Position.Bottom} />

<style>
  .node {
    display: flex;
    align-items: center;
    gap: 7px;
  }
</style>
