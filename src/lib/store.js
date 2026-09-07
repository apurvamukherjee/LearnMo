import { writable, get } from 'svelte/store';

const STORAGE_KEY = 'learnmo-data-v1';

function uid() {
  return crypto.randomUUID();
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        topics: parsed.topics ?? [],
        entries: parsed.entries ?? [],
        notes: parsed.notes ?? [],
        flowNodes: parsed.flowNodes ?? [],
        flowEdges: parsed.flowEdges ?? []
      };
    }
  } catch (e) {
    console.error('Failed to load saved data, starting fresh.', e);
  }
  return { topics: [], entries: [], notes: [], flowNodes: [], flowEdges: [] };
}

export const data = writable(loadData());

let saveTimer;
data.subscribe((value) => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save data', e);
    }
  }, 200);
});

function nextGridPosition(existingCount) {
  const col = existingCount % 5;
  const row = Math.floor(existingCount / 5);
  return { x: col * 220 + 40, y: row * 150 + 40 };
}

function newFlowNode(existingCount, refType, refId, label) {
  const pos = nextGridPosition(existingCount);
  return { id: uid(), refType, refId, label, x: pos.x, y: pos.y };
}

// Every updater below returns a brand-new top-level state object, and replaces
// (rather than mutates) any array/object it touches. Svelte 5's $derived compares
// values by reference, so mutating objects/arrays in place would silently break
// reactivity anywhere a derived value narrows down to a single item (e.g. `.find`).

// ---------- Topics ----------

export function addTopic(title) {
  data.update((state) => {
    const id = uid();
    const topic = { id, title, order: state.topics.length, createdAt: Date.now() };
    return {
      ...state,
      topics: [...state.topics, topic],
      flowNodes: [...state.flowNodes, newFlowNode(state.flowNodes.length, 'topic', id, title)]
    };
  });
}

export function updateTopic(id, patch) {
  data.update((state) => ({
    ...state,
    topics: state.topics.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    flowNodes: patch.title
      ? state.flowNodes.map((n) => (n.refType === 'topic' && n.refId === id ? { ...n, label: patch.title } : n))
      : state.flowNodes
  }));
}

export function deleteTopic(id) {
  data.update((state) => {
    const entryIds = state.entries.filter((e) => e.topicId === id).map((e) => e.id);
    const removedNodeIds = state.flowNodes
      .filter((n) => (n.refType === 'topic' && n.refId === id) || (n.refType === 'entry' && entryIds.includes(n.refId)))
      .map((n) => n.id);
    return {
      ...state,
      topics: state.topics.filter((t) => t.id !== id),
      entries: state.entries.filter((e) => e.topicId !== id),
      flowNodes: state.flowNodes.filter((n) => !removedNodeIds.includes(n.id)),
      flowEdges: state.flowEdges.filter((e) => !removedNodeIds.includes(e.source) && !removedNodeIds.includes(e.target))
    };
  });
}

// ---------- Entries ----------

export function addEntry(topicId, title) {
  const id = uid();
  data.update((state) => {
    const count = state.entries.filter((e) => e.topicId === topicId).length;
    const entry = {
      id,
      topicId,
      title,
      content: '',
      status: 'reading',
      order: count,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    return {
      ...state,
      entries: [...state.entries, entry],
      flowNodes: [...state.flowNodes, newFlowNode(state.flowNodes.length, 'entry', id, title)]
    };
  });
  return id;
}

export function updateEntry(id, patch) {
  data.update((state) => ({
    ...state,
    entries: state.entries.map((e) => (e.id === id ? { ...e, ...patch, updatedAt: Date.now() } : e)),
    flowNodes: patch.title
      ? state.flowNodes.map((n) => (n.refType === 'entry' && n.refId === id ? { ...n, label: patch.title } : n))
      : state.flowNodes
  }));
}

export function deleteEntry(id) {
  data.update((state) => {
    const removedNodeIds = state.flowNodes.filter((n) => n.refType === 'entry' && n.refId === id).map((n) => n.id);
    return {
      ...state,
      entries: state.entries.filter((e) => e.id !== id),
      flowNodes: state.flowNodes.filter((n) => !removedNodeIds.includes(n.id)),
      flowEdges: state.flowEdges.filter((e) => !removedNodeIds.includes(e.source) && !removedNodeIds.includes(e.target))
    };
  });
}

// ---------- Notes ----------

export function addNote(text) {
  data.update((state) => {
    const id = uid();
    const note = { id, text, done: false, order: state.notes.length, createdAt: Date.now() };
    return {
      ...state,
      notes: [...state.notes, note],
      flowNodes: [...state.flowNodes, newFlowNode(state.flowNodes.length, 'note', id, text)]
    };
  });
}

export function updateNote(id, patch) {
  data.update((state) => ({
    ...state,
    notes: state.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    flowNodes: patch.text
      ? state.flowNodes.map((n) => (n.refType === 'note' && n.refId === id ? { ...n, label: patch.text } : n))
      : state.flowNodes
  }));
}

export function deleteNote(id) {
  data.update((state) => {
    const removedNodeIds = state.flowNodes.filter((n) => n.refType === 'note' && n.refId === id).map((n) => n.id);
    return {
      ...state,
      notes: state.notes.filter((n) => n.id !== id),
      flowNodes: state.flowNodes.filter((n) => !removedNodeIds.includes(n.id)),
      flowEdges: state.flowEdges.filter((e) => !removedNodeIds.includes(e.source) && !removedNodeIds.includes(e.target))
    };
  });
}

// ---------- Flow ----------

export function updateNodePosition(id, x, y) {
  data.update((state) => ({
    ...state,
    flowNodes: state.flowNodes.map((n) => (n.id === id ? { ...n, x, y } : n))
  }));
}

export function addFlowEdge(source, target) {
  if (source === target) return;
  data.update((state) => {
    const exists = state.flowEdges.some(
      (e) => (e.source === source && e.target === target) || (e.source === target && e.target === source)
    );
    if (exists) return state;
    return { ...state, flowEdges: [...state.flowEdges, { id: uid(), source, target }] };
  });
}

export function deleteFlowEdge(id) {
  data.update((state) => ({ ...state, flowEdges: state.flowEdges.filter((e) => e.id !== id) }));
}

export function importFlowLayout({ nodes = [], edges = [] }) {
  data.update((state) => {
    const byLabel = new Map();
    for (const n of state.flowNodes) {
      byLabel.set(n.label.trim().toLowerCase(), n);
    }

    const positionUpdates = new Map();
    for (const incoming of nodes) {
      const match = byLabel.get(String(incoming.label ?? '').trim().toLowerCase());
      if (match && typeof incoming.x === 'number' && typeof incoming.y === 'number') {
        positionUpdates.set(match.id, { x: incoming.x, y: incoming.y });
      }
    }
    const newFlowNodes = state.flowNodes.map((n) =>
      positionUpdates.has(n.id) ? { ...n, ...positionUpdates.get(n.id) } : n
    );

    const newEdges = [...state.flowEdges];
    for (const incoming of edges) {
      const source = byLabel.get(String(incoming.source ?? '').trim().toLowerCase());
      const target = byLabel.get(String(incoming.target ?? '').trim().toLowerCase());
      if (source && target && source.id !== target.id) {
        const exists = newEdges.some(
          (e) =>
            (e.source === source.id && e.target === target.id) || (e.source === target.id && e.target === source.id)
        );
        if (!exists) newEdges.push({ id: uid(), source: source.id, target: target.id });
      }
    }

    return { ...state, flowNodes: newFlowNodes, flowEdges: newEdges };
  });
}

export function getState() {
  return get(data);
}
