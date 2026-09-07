<script>
  import { route } from './router.js';
  import BottomNav from './components/BottomNav.svelte';
  import TopicsList from './views/TopicsList.svelte';
  import TopicDetail from './views/TopicDetail.svelte';
  import EntryEditor from './views/EntryEditor.svelte';
  import NotesPage from './views/NotesPage.svelte';
  import FlowChart from './views/FlowChart.svelte';
  import SettingsPage from './views/SettingsPage.svelte';

  const showNav = $derived($route.segments[0] !== 'entry');
</script>

<main>
  {#key $route.path}
    {#if $route.segments[0] === 'topics' && $route.segments[1]}
      <TopicDetail topicId={$route.segments[1]} />
    {:else if $route.segments[0] === 'entry' && $route.segments[1]}
      <EntryEditor entryId={$route.segments[1]} />
    {:else if $route.segments[0] === 'notes'}
      <NotesPage />
    {:else if $route.segments[0] === 'map'}
      <FlowChart />
    {:else if $route.segments[0] === 'settings'}
      <SettingsPage />
    {:else}
      <TopicsList />
    {/if}
  {/key}
</main>

{#if showNav}
  <BottomNav />
{/if}

<style>
  main {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
</style>
