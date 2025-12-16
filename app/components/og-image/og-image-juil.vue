<script setup lang="ts">
import { useSiteConfig } from "#site-config/app/composables";
import { computed } from "vue";

const props = withDefaults(defineProps<{
  title?: string;
  description?: string;
  date?: string;
  siteName?: string;
  siteLogo?: string;
  authorName?: string;
  authorAvatar?: string;
  theme?: string;
  colorMode?: "dark" | "light";
  icon?: string | boolean;
  emoji?: string;
}>(), {
  title: "Title",
  theme: "#00DC82",
  emoji: "👻",
});

// 2. 다크 모드 판별 로직
const isDark = computed(() => props.colorMode === "dark");

// 3. 색상 계산 유틸리티 (RGB 변환)
const HexRegex = /^#(?:[0-9a-f]{3}){1,2}$/i;
const themeHex = computed(() => {
  if (HexRegex.test(props.theme))
    return props.theme;
  if (HexRegex.test(`#${props.theme}`))
    return `#${props.theme}`;
  return "#00DC82";
});

const themeRgb = computed(() => {
  return themeHex.value
    .replace("#", "")
    .match(/.{1,2}/g)
    ?.map(v => Number.parseInt(v, 16))
    .join(", ");
});

const siteConfig = useSiteConfig();
const siteName = computed(() => {
  return props.siteName || siteConfig.name;
});
const siteLogo = computed(() => {
  return props.siteLogo || siteConfig.logo;
});
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-between relative overflow-hidden p-15"
    :class="[
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
    ]"
  >
    <div
      class="absolute inset-0 pointer-events-none"
      :style="{
        background: `radial-gradient(circle at 90% 10%, rgba(${themeRgb}, ${isDark ? 0.25 : 0.15}) 0%, transparent 60%)`,
      }"
    />

    <div class="flex flex-row justify-between items-center relative">
      <div class="flex items-center gap-3">
        <img
          v-if="siteLogo"
          :src="siteLogo"
          class="h-10 w-auto object-contain"
        >
        <div
          v-else
          class="w-3 h-3 rounded-full"
          :style="{ backgroundColor: themeHex }"
        />
        <span
          class="text-2xl font-bold uppercase tracking-wider"
          :style="{ color: isDark ? '#E5E7EB' : themeHex }"
        >
          {{ siteName }}
        </span>
      </div>
      <div
        v-if="date"
        class="text-xl"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
      >
        {{ date }}
      </div>
    </div>

    <div class="flex flex-row items-center justify-between relative my-auto w-full">
      <div class="flex flex-col max-w-[75%]">
        <h1
          class="text-[70px] font-extrabold leading-tight mb-6 line-clamp-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          {{ title }}
        </h1>
        <p
          v-if="description"
          class="text-[32px] leading-normal line-clamp-3"
          :class="isDark ? 'text-gray-300' : 'text-gray-600'"
        >
          {{ description }}
        </p>
      </div>

      <div class="flex items-center justify-center w-[20%]">
        <UIcon
          v-if="typeof icon === 'string'"
          :name="icon"
          size="180px"
          class="opacity-90"
          mode="svg"
        />
        <div v-else-if="emoji" class="text-[150px]">
          {{ emoji }}
        </div>
      </div>
    </div>

    <div class="flex flex-row items-center relative mt-auto">
      <img
        v-if="authorAvatar"
        :src="authorAvatar"
        class="w-20 h-20 rounded-full mr-5 border-4 object-cover shadow-sm"
        :class="isDark ? 'border-gray-700' : 'border-gray-100'"
      >
      <div class="flex flex-col justify-center">
        <span class="text-lg mb-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
          Written by
        </span>
        <span class="text-3xl font-bold" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
          {{ authorName || siteName }}
        </span>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 w-full h-4" :style="{ backgroundColor: themeHex }" />
  </div>
</template>
