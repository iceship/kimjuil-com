<script setup lang="ts">
useSeoMeta({
  title: "KimJuil - Iceship's Log",
  description: "Coding, Chess, and Traveling adventures by KimJuil.",
});
</script>

<template>
  <div>
    <UContainer class="py-20 sm:py-32">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          세상을 바꾸는 작은 아이디어, <br>
          <span class="text-primary-500">KimJuil</span>과 함께하세요.
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Public Sans와 Nuxt UI를 사용하여 만든 빠르고 아름다운 웹사이트입니다.
          원하는 기능을 마음껏 탐색해보세요.
        </p>

        <div class="mt-10 flex items-center justify-center gap-x-6">
          <UButton
            size="xl"
            label="지금 바로 시작하기"
            trailing-icon="i-heroicons-arrow-right-20-solid"
          />
          <UButton
            variant="ghost"
            size="xl"
            label="더 알아보기"
          />
        </div>
      </div>
    </UContainer>

    <UContainer id="features" class="py-24 border-t border-gray-200 dark:border-gray-800">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="i in 3"
          :key="i"
          class="p-6 rounded-xl border border-gray-200 dark:border-gray-800"
        >
          <UIcon name="i-heroicons-rocket-launch" class="w-8 h-8 text-primary-500 mb-4" />
          <h3 class="text-xl font-bold mb-2">
            기능 {{ i }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            이곳에 서비스의 핵심 장점을 설명하는 글을 넣으세요.
          </p>
        </div>
      </div>
    </UContainer>
  </div>
</template>
