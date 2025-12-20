<script setup lang="ts">
import type { DropdownMenuItem } from "#ui/types";

const { clear } = useUserSession();

const itemLogout = [
  [{
    label: "Logout",
    icon: "i-lucide-log-out",
    onSelect: () => clear(),
  }],
] satisfies DropdownMenuItem[][];
</script>

<template>
  <AuthState>
    <template #default="{ loggedIn, user }">
      <div v-if="loggedIn && user" class="flex flex-wrap -mx-2 sm:mx-0">
        <UDropdownMenu :items="itemLogout">
          <UButton
            color="neutral"
            variant="ghost"
            trailing-icon="i-lucide-chevron-down"
          >
            <UAvatar
              :src="`https://github.com/${user.login}.png`"
              :alt="user.login"
              size="2xs"
              :width="20"
              :height="20"
              loading="eager"
            />
            {{ user.login }}
          </UButton>
        </UDropdownMenu>
      </div>

      <UButton
        v-else
        to="/api/auth/github"
        icon="i-simple-icons-github"
        label="Login"
        color="neutral"
        size="xs"
        external
      />
    </template>

    <template #placeholder>
      <UButton
        loading
        label="Loading"
        color="neutral"
        variant="ghost"
        size="xs"
        disabled
      />
    </template>
  </AuthState>
</template>
