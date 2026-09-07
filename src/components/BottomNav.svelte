<script>
  import { route, navigate } from '../router.js';

  const tabs = [
    { path: '/topics', label: 'Topics', icon: '📚' },
    { path: '/notes', label: 'Notes', icon: '✅' },
    { path: '/map', label: 'Map', icon: '🕸️' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  function isActive(tabPath) {
    return $route.segments[0] === tabPath.slice(1);
  }
</script>

<nav>
  {#each tabs as tab}
    <button class:active={isActive(tab.path)} on:click={() => navigate(tab.path)}>
      <span class="icon">{tab.icon}</span>
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
    gap: 2px;
    background: none;
    border: none;
    color: var(--text-dim);
  }

  button.active {
    color: var(--accent);
  }

  .icon {
    font-size: 20px;
    line-height: 1;
  }

  .label {
    font-size: 11px;
    font-weight: 600;
  }
</style>
