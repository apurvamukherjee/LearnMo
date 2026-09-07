import { data } from './store.js';
import { get } from 'svelte/store';

export function exportData() {
  const value = get(data);
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `learnmo-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importDataFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        data.set({
          topics: parsed.topics ?? [],
          entries: parsed.entries ?? [],
          notes: parsed.notes ?? [],
          flowNodes: parsed.flowNodes ?? [],
          flowEdges: parsed.flowEdges ?? []
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
