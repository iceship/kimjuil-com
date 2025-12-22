<script setup lang="ts">
import type { Config } from "@lichess-org/chessground/config";

import { Chessground } from "@lichess-org/chessground";
import { onMounted, ref, watch } from "vue";
import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";
import "@lichess-org/chessground/assets/chessground.cburnett.css";

const props = withDefaults(defineProps<{
  fen: string;
  orientation?: "white" | "black";
}>(), {
  orientation: "white",
});

const boardElement = ref<HTMLElement | null>(null);
let ground: any = null;

function initBoard() {
  if (!boardElement.value)
    return;

  const config: Config = {
    fen: props.fen,
    orientation: props.orientation, // 방향 설정
    viewOnly: true,
    coordinates: true,
    animation: { enabled: true, duration: 200 },
  };

  if (ground) {
    ground.set(config);
  }
  else {
    ground = Chessground(boardElement.value, config);
  }
}

onMounted(() => {
  initBoard();
});

watch(() => props.fen, (newFen) => {
  if (ground)
    ground.set({ fen: newFen });
});

// ✅ 방향이 바뀌면 보드도 뒤집기
watch(() => props.orientation, (newOrientation) => {
  if (ground)
    ground.set({ orientation: newOrientation });
});
</script>

<template>
  <div class="flex justify-center items-center rounded-lg overflow-hidden bg-[#f0d9b5] shadow-md ring-1 ring-gray-200 dark:ring-gray-800">
    <div ref="boardElement" class="chess-board" />
  </div>
</template>

<style scoped>
.chess-board {
  width: 500px;
  height: 500px;
  background: #f0d9b5;
}

@media (max-width: 640px) {
  .chess-board {
    width: 350px;
    height: 350px;
  }
}
</style>
