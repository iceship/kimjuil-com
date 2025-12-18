<script setup lang="ts">
import type { DropdownMenuItem } from "#ui/types";

const { loggedIn, user, clear } = useUserSession();

const items = computed(() => [{
  label: "Blog",
  to: "/blog",
}]);

const itemLogout = [
  [
    {
      label: "Logout",
      icon: "i-lucide-log-out",
      onSelect: clear,
    },
  ],
] satisfies DropdownMenuItem[][];
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
        class="hidden lg:block"
      />

      <UColorModeButton />
      <UButton
        v-if="!loggedIn"
        to="/api/auth/github"
        icon="i-simple-icons-github"
        label="Login"
        color="neutral"
        size="xs"
        external
      />
      <div
        v-else
        class="flex flex-wrap -mx-2 sm:mx-0"
      >
        <UDropdownMenu
          v-if="user"
          :items="itemLogout"
        >
          <UButton
            color="neutral"
            variant="ghost"
            trailing-icon="i-lucide-chevron-down"
          >
            <UAvatar
              :src="`https://github.com/${user.login}.png`"
              :alt="user.login"
              size="3xs"
            />
            {{ user.login }}
          </UButton>
        </UDropdownMenu>
      </div>
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
