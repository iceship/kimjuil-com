<script setup lang="ts">
import { Chess } from "chess.js";
import { nextTick, onMounted, onUnmounted, ref } from "vue";

// 1. Sample PGN
const samplePgn = `
[Event "Paris"]
[Site "Paris FRA"]
[Date "1858.??.??"]
[Round "?"]
[White "Paul Morphy"]
[Black "Duke Karl / Count Isouard"]
[Result "1-0"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0
`;

// 2. State
const game = new Chess();
const displayGame = new Chess();
const moves = ref<string[]>([]);
const currentMoveIndex = ref(-1);
const currentFen = ref("");
const moveListRef = ref<HTMLElement | null>(null);

// ✨ Fun Features State
const orientation = ref<"white" | "black">("white");
const isPlaying = ref(false);
let playInterval: any = null;

// 3. Init
onMounted(() => {
  game.loadPgn(samplePgn);
  moves.value = game.history();
  displayGame.reset();
  currentFen.value = displayGame.fen();
});

onUnmounted(() => {
  stopAutoPlay();
});

// 4. Logic
function updateState() {
  currentFen.value = displayGame.fen();
  scrollToCurrentMove();
}

function nextMove() {
  if (currentMoveIndex.value < moves.value.length - 1) {
    currentMoveIndex.value++;
    // ✅ TS 에러 해결: move가 undefined일 수 있는 상황 방어
    const move = moves.value[currentMoveIndex.value];
    if (move) {
      displayGame.move(move);
      updateState();
    }
  }
  else {
    stopAutoPlay();
  }
}

function prevMove() {
  if (currentMoveIndex.value >= 0) {
    displayGame.undo();
    currentMoveIndex.value--;
    updateState();
  }
}

function reset() {
  stopAutoPlay();
  displayGame.reset();
  currentMoveIndex.value = -1;
  updateState();
}

// ✨ New Feature: Go to End
function goToEnd() {
  stopAutoPlay();
  while (currentMoveIndex.value < moves.value.length - 1) {
    currentMoveIndex.value++;
    // ✅ TS 에러 해결: move 확인
    const move = moves.value[currentMoveIndex.value];
    if (move) {
      displayGame.move(move);
    }
  }
  updateState();
}

function goToMove(index: number) {
  stopAutoPlay();
  if (index > currentMoveIndex.value) {
    while (currentMoveIndex.value < index) nextMove();
  }
  else if (index < currentMoveIndex.value) {
    while (currentMoveIndex.value > index) prevMove();
  }
}

// ✨ Fun Feature 1: Toggle Auto Play
function toggleAutoPlay() {
  if (isPlaying.value) {
    stopAutoPlay();
  }
  else {
    if (currentMoveIndex.value === moves.value.length - 1) {
      reset();
    }
    isPlaying.value = true;
    playInterval = setInterval(() => {
      nextMove();
    }, 1000);
  }
}

function stopAutoPlay() {
  isPlaying.value = false;
  if (playInterval)
    clearInterval(playInterval);
}

// ✨ Fun Feature 2: Flip Board
function toggleOrientation() {
  orientation.value = orientation.value === "white" ? "black" : "white";
}

async function scrollToCurrentMove() {
  await nextTick();
  const container = moveListRef.value;
  const activeElement = container?.querySelector(".active-move") as HTMLElement;

  if (container && activeElement) {
    // 1. 요소의 위치(offsetTop)를 찾아 중앙 정렬 위치 계산
    // 식: (요소 위치) - (컨테이너 높이의 절반) + (요소 높이의 절반)
    const top = activeElement.offsetTop - (container.clientHeight / 2) + (activeElement.clientHeight / 2);

    // 2. 브라우저 전체가 아닌, '컨테이너 내부'만 스크롤
    container.scrollTo({
      top,
      behavior: "smooth",
    });
  }
}
</script>

<template>
  <div class="min-h-screen p-6 flex flex-col items-center gap-8 bg-gray-50 dark:bg-gray-950">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 justify-center">
        <UIcon name="i-lucide-gamepad-2" class="w-8 h-8 text-primary-500" />
        Chess PGN Viewer
      </h1>
      <p class="text-gray-500 dark:text-gray-400">
        Nuxt UI v3 + Fun Features
      </p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 items-start w-full max-w-6xl justify-center">
      <div class="flex flex-col gap-4 items-center">
        <ClientOnly>
          <ChessBoard :fen="currentFen" :orientation="orientation" />
        </ClientOnly>

        <div class="flex items-center gap-2 w-full justify-between px-1">
          <UButton
            icon="i-lucide-arrow-left-right"
            color="neutral"
            variant="ghost"
            size="sm"
            label="Flip Board"
            class="text-gray-500"
            @click="toggleOrientation"
          />
          <UButton
            :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
            :color="isPlaying ? 'error' : 'success'"
            variant="soft"
            size="sm"
            :label="isPlaying ? 'Pause' : 'Auto Play'"
            @click="toggleAutoPlay"
          />
        </div>

        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-chevrons-left"
            color="neutral"
            variant="outline"
            size="lg"
            :disabled="currentMoveIndex === -1"
            label="Start"
            @click="reset"
          />

          <UButton
            icon="i-lucide-chevron-left"
            color="primary"
            variant="solid"
            size="lg"
            :disabled="currentMoveIndex === -1"
            label="Prev"
            @click="prevMove"
          />

          <UButton
            icon="i-lucide-chevron-right"
            color="primary"
            variant="solid"
            size="lg"
            trailing
            :disabled="currentMoveIndex === moves.length - 1"
            label="Next"
            @click="nextMove"
          />

          <UButton
            icon="i-lucide-chevrons-right"
            color="neutral"
            variant="outline"
            size="lg"
            trailing
            :disabled="currentMoveIndex === moves.length - 1"
            label="End"
            @click="goToEnd"
          />
        </div>
      </div>

      <UCard class="w-full lg:w-80 shadow-lg ring-1 ring-gray-200 dark:ring-gray-800">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon name="i-lucide-list" />
              Moves
            </h3>
            <span class="text-xs text-gray-400">{{ moves.length }} moves</span>
          </div>
        </template>

        <div ref="moveListRef" class="h-112.5 overflow-y-auto pr-2 custom-scrollbar">
          <div class="grid grid-cols-[3rem_1fr_1fr] gap-y-1 text-sm">
            <template v-for="(move, i) in moves" :key="i">
              <div v-if="i % 2 === 0" class="flex items-center justify-center text-gray-400 font-mono text-xs">
                {{ Math.floor(i / 2) + 1 }}.
              </div>

              <div
                class="py-1.5 px-2 rounded cursor-pointer transition-all duration-200 text-center select-none"
                :class="[
                  i === currentMoveIndex
                    ? 'active-move bg-primary-500 text-white font-bold shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                ]"
                @click="goToMove(i)"
              >
                {{ move }}
              </div>

              <div v-if="i % 2 === 0 && i === moves.length - 1" class="col-span-1" />
            </template>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 9999px;
}
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>
