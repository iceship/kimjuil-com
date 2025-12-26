<script setup lang="ts">
import type { Config } from "@lichess-org/chessground/config";

import { Chessground } from "@lichess-org/chessground";
import { onMounted, onUnmounted, ref, watch } from "vue";
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
let resizeObserver: ResizeObserver;

function initBoard() {
  if (!boardElement.value)
    return;

  const config: Config = {
    fen: props.fen,
    orientation: props.orientation,
    viewOnly: true,
    coordinates: true,
    animation: { enabled: true, duration: 200 },
    // 체스 기물 이미지가 잘 로드되도록 기본 설정 확인
    drawable: {
      visible: true,
    },
  };

  if (ground) {
    ground.set(config);
  }
  else {
    ground = Chessground(boardElement.value, config);
  }

  // 강제 리드로우 (레이아웃 잡힐 때까지 약간 지연)
  setTimeout(() => ground?.redrawAll(), 100);
}

onMounted(() => {
  initBoard();

  if (boardElement.value) {
    resizeObserver = new ResizeObserver(() => {
      if (ground)
        ground.redrawAll();
    });
    resizeObserver.observe(boardElement.value);
  }
});

onUnmounted(() => {
  if (resizeObserver)
    resizeObserver.disconnect();
  if (ground)
    ground.destroy();
});

watch(() => props.fen, (newFen) => {
  if (ground)
    ground.set({ fen: newFen });
});

watch(() => props.orientation, (newOrientation) => {
  if (ground)
    ground.set({ orientation: newOrientation });
});
</script>

<template>
  <div ref="boardElement" class="w-full h-full block" />
</template>
