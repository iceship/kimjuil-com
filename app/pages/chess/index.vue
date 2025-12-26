<script setup lang="ts">
import { gamesQuery } from "~/queries/games";

// 1. 데이터 페칭 (DB에서 게임 목록 가져오기)
// queryCollection 대신 Pinia Colada의 useQuery를 사용합니다.
const { data: games, status } = useQuery(gamesQuery);

// 2. 페이지 헤더 메타데이터 설정
const page = {
  title: "Chess Games",
  description: "저장된 체스 게임 목록입니다. 언제든지 다시 복기해보세요.",
};

// 3. SEO 설정
useSeoMeta({
  title: page.title,
  ogTitle: page.title,
  description: page.description,
  ogDescription: page.description,
});

// 4. 날짜 포맷팅 함수
function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <UContainer>
    <UPageHeader
      v-bind="page"
      class="py-12"
      icon="i-lucide-gamepad-2"
    />

    <UPageBody>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-2" class="animate-spin w-8 h-8 text-gray-400" />
      </div>

      <div v-else-if="!games?.length" class="text-center py-12 text-gray-500">
        저장된 게임이 없습니다.
      </div>

      <UBlogPosts v-else>
        <UBlogPost
          v-for="(game, index) in games"
          :key="game.id"
          :to="`/chess/${game.id}`"
          :title="game.title"
          :description="game.description || '설명이 없습니다.'"
          :date="formatDate(game.createdAt)"
          :orientation="index === 0 ? 'horizontal' : 'vertical'"
          :class="[index === 0 && 'col-span-full']"
          :image="game.thumbnail ? `/images/${game.thumbnail}` : '/assets/chess-placeholder.webp'"
          variant="naked"
          :ui="{
            description: 'line-clamp-2',
            image: 'object-cover', // 이미지가 꽉 차게 보이도록 설정
          }"
        >
          <template #badge>
            <UBadge
              v-if="index === 0"
              label="Latest"
              variant="subtle"
            />
          </template>

          <template #authors>
            <div class="flex items-center gap-2 mt-2">
              <UAvatar
                src="https://github.com/shadcn.png"
                size="xs"
                alt="User"
              />
              <span class="text-xs text-gray-500">Player</span>
            </div>
          </template>
        </UBlogPost>
      </UBlogPosts>
    </UPageBody>
  </UContainer>
</template>
