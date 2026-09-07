import { writable } from 'svelte/store';

function parseHash() {
  const hash = window.location.hash.slice(1) || '/topics';
  const segments = hash.split('/').filter(Boolean);
  return { path: '/' + segments.join('/'), segments };
}

export const route = writable(parseHash());

window.addEventListener('hashchange', () => {
  route.set(parseHash());
});

export function navigate(path) {
  window.location.hash = path;
}

export function goBack() {
  window.history.back();
}
