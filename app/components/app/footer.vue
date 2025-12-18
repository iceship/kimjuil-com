<template>
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">
        Iceship • © {{ new Date().getFullYear() }}
      </p>
    </template>
    <template #right>
      <UButton
        to="https://github.com/iceship"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="Iceship on GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
