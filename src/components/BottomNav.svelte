<script>
  import BookOpen from '@lucide/svelte/icons/book-open';
  import ListChecks from '@lucide/svelte/icons/list-checks';
  import Network from '@lucide/svelte/icons/network';
  import Settings from '@lucide/svelte/icons/settings';
  import { route, navigate } from '../router.js';

  const tabs = [
    { path: '/topics', label: 'Topics', icon: BookOpen },
    { path: '/notes', label: 'Notes', icon: ListChecks },
    { path: '/map', label: 'Map', icon: Network },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  function isActive(tabPath) {
    return $route.segments[0] === tabPath.slice(1);
  }
</script>

<nav>
  {#each tabs as tab}
    <button class:active={isActive(tab.path)} onclick={() => navigate(tab.path)}>
      <tab.icon size={22} strokeWidth={2} />
      <span class="label">{tab.label}</span>
    </button>
  {/each}
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: calc(var(--nav-height) + var(--safe-bottom));
    padding-bottom: var(--safe-bottom);
    background: var(--surface);
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }

  button {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    background: none;
    border: none;
    color: var(--text-dim);
  }

  button.active {
    color: var(--accent);
  }

  .label {
    font-size: 11px;
    font-weight: 600;
  }
</style>
