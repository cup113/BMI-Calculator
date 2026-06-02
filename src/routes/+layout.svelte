<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.ico";
  import { m } from "$lib/paraglide/messages";
  import Header from "$lib/components/Header.svelte";

  let { children } = $props();
  const UMAMI_URL = "https://umami.cup11.top/script.js";
  const UMAMI_WEBSITE_ID = "e777187b-38f3-4401-bbcf-068d447b70e9";
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <meta name="description" content={m.meta_description()} />
  <meta name="keywords" content={m.meta_keywords()} />
  <meta name="author" content="Jason Li" />
  <meta property="og:title" content={m.meta_og_title()} />
  <meta property="og:description" content={m.meta_og_description()} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://bmi.cup11.top" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={m.meta_twitter_title()} />
  <meta name="twitter:description" content={m.meta_twitter_description()} />
  <script defer src={UMAMI_URL} data-website-id={UMAMI_WEBSITE_ID}></script>
  <title>{m.meta_page_title()}</title>
</svelte:head>

<Header />

{@render children()}
