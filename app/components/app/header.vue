<script setup lang="ts">
const { loggedIn } = useUserSession();

const items = computed(() => {
  const baseItems = [
    {
      label: "Blog",
      to: "/blog",
    },
  ];

  // 로그인했을 때만 메뉴를 추가합니다.
  if (loggedIn.value) {
    baseItems.push(
      {
        label: "Todos",
        to: "/todos",
      },
      {
        label: "Optimistic Todos",
        to: "/optimistic-todos",
      },
    );
  }

  return baseItems;
});
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink
        to="/"
        aria-label="Home"
      >
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>
    </template>

    <template #right>
      <UNavigationMenu
        :items="items"
        variant="link"
        class="hidden sm:block"
      />

      <UColorModeButton />
      <AppAuth />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </UHeader>
</template>
