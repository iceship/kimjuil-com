<template>
  <div class="flex flex-col min-h-screen">
    <app-header />

    <u-main>
      <u-container>
        <slot />
      </u-container>
    </u-main>

    <app-footer />
  </div>
</template>
