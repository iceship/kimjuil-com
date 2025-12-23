<script setup lang="ts">
const { loggedIn } = useUserSession();

watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo("/");
  }
});

useHead({
  htmlAttrs: { lang: "en" },
  link: [{ rel: "icon", href: "/favicon.ico" }],
});

useSeoMeta({
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  title: "KimJuil",
  description:
    "Personal website of KimJuil.",
});
</script>

<template>
  <u-app>
    <nuxt-loading-indicator />
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </u-app>
</template>
