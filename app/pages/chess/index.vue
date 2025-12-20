<script setup lang="ts">
import { Chess } from "chess.js";
import { nextTick, onMounted, onUnmounted, ref } from "vue";

// 1. Default Sample PGN
const defaultPgn = `
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

// ✨ Features State
const orientation = ref<"white" | "black">("white");
const isPlaying = ref(false);
const isSoundOn = ref(true);
let playInterval: any = null;

// ✨ New: PGN Modal State
const isPgnModalOpen = ref(false);
const inputPgn = ref("");

// Feature flag: hide PGN import UI for now
const enablePgnImport = false;

// Toast (Nuxt UI)
const toast = useToast();

// 3. Audio Setup
let moveAudio: HTMLAudioElement | null = null;

// 4. Init & Lifecycle
onMounted(() => {
  moveAudio = new Audio("/move.mp3"); // 파일명 확인 필요!
  moveAudio.volume = 0.2;
  moveAudio.load();
  loadGame(defaultPgn);
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  stopAutoPlay();
  window.removeEventListener("keydown", handleKeydown);
});

// 5. Core Game Logic
function loadGame(pgn: string) {
  try {
    game.loadPgn(pgn);
    moves.value = game.history();

    stopAutoPlay();
    displayGame.reset();
    currentMoveIndex.value = -1;
    currentFen.value = displayGame.fen();

    inputPgn.value = pgn;
  }
  catch (e) {
    toast.add({
      title: "Invalid PGN",
      description: "PGN 형식이 올바르지 않습니다!",
      color: "error",
    });
    console.error(e);
  }
}

function updateState() {
  currentFen.value = displayGame.fen();
  scrollToCurrentMove();
}

function playSound() {
  if (!isSoundOn.value || !moveAudio)
    return;
  moveAudio.currentTime = 0;
  moveAudio.play().catch(() => {});
}

function nextMove() {
  if (currentMoveIndex.value < moves.value.length - 1) {
    currentMoveIndex.value++;
    const move = moves.value[currentMoveIndex.value];
    if (move) {
      displayGame.move(move);
      updateState();
      playSound();
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

function goToEnd() {
  stopAutoPlay();
  while (currentMoveIndex.value < moves.value.length - 1) {
    currentMoveIndex.value++;
    const move = moves.value[currentMoveIndex.value];
    if (move)
      displayGame.move(move);
  }
  updateState();
  playSound();
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

function toggleAutoPlay() {
  if (isPlaying.value) {
    stopAutoPlay();
  }
  else {
    if (currentMoveIndex.value === moves.value.length - 1)
      reset();
    isPlaying.value = true;
    playInterval = setInterval(() => nextMove(), 1000);
  }
}

function stopAutoPlay() {
  isPlaying.value = false;
  if (playInterval)
    clearInterval(playInterval);
}

function toggleOrientation() {
  orientation.value = orientation.value === "white" ? "black" : "white";
}

function toggleSound() {
  isSoundOn.value = !isSoundOn.value;
}

function handleKeydown(e: KeyboardEvent) {
  if (isPgnModalOpen.value || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement)
    return;

  switch (e.key) {
    case "ArrowRight":
      nextMove();
      break;
    case "ArrowLeft":
      prevMove();
      break;
    case "ArrowUp":
      reset();
      break;
    case "ArrowDown":
      goToEnd();
      break;
    case " ": e.preventDefault();
      toggleAutoPlay();
      break;
    case "f": case "F":
      toggleOrientation();
      break;
    case "m": case "M":
      toggleSound();
      break;
  }
}

function openPgnModal() {
  if (!enablePgnImport)
    return;
  inputPgn.value = "";
  isPgnModalOpen.value = true;
}

function applyPgn() {
  if (!enablePgnImport)
    return;
  if (!inputPgn.value.trim())
    return;
  loadGame(inputPgn.value);
  isPgnModalOpen.value = false;
}

async function scrollToCurrentMove() {
  await nextTick();
  const container = moveListRef.value;
  const activeElement = container?.querySelector(".active-move") as HTMLElement;

  if (container && activeElement) {
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();
    const absoluteElementTop = container.scrollTop + (activeRect.top - containerRect.top);
    const targetScrollTop = absoluteElementTop - (container.clientHeight / 2) + (activeElement.clientHeight / 2);

    container.scrollTo({ top: targetScrollTop, behavior: "smooth" });
  }
}
</script>

<template>
  <div class="min-h-screen p-6 flex flex-col items-center gap-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 justify-center">
        <UIcon name="i-lucide-gamepad-2" class="w-8 h-8 text-primary-500" />
        Chess PGN Viewer
      </h1>
      <div class="flex items-center gap-2 justify-center">
        <UBadge
          color="neutral"
          variant="soft"
          size="xs"
        >
          Arrow Keys: Move
        </UBadge>
        <UBadge
          color="neutral"
          variant="soft"
          size="xs"
        >
          Space: Auto
        </UBadge>
        <UBadge
          color="neutral"
          variant="soft"
          size="xs"
        >
          F: Flip
        </UBadge>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 items-start w-full max-w-6xl justify-center">
      <div class="flex flex-col gap-4 items-center">
        <ClientOnly>
          <ChessBoard :fen="currentFen" :orientation="orientation" />
        </ClientOnly>

        <div class="flex items-center gap-2 w-full justify-between px-1">
          <div class="flex gap-2">
            <UTooltip text="Flip Board (F)">
              <UButton
                icon="i-lucide-arrow-left-right"
                color="neutral"
                variant="ghost"
                size="sm"
                :class="orientation === 'black' ? 'text-primary-500' : 'text-gray-500'"
                @click="toggleOrientation"
              />
            </UTooltip>
            <UTooltip text="Toggle Sound (M)">
              <UButton
                :icon="isSoundOn ? 'i-lucide-volume-2' : 'i-lucide-volume-x'"
                color="neutral"
                variant="ghost"
                size="sm"
                :class="isSoundOn ? 'text-primary-500' : 'text-gray-400'"
                @click="toggleSound"
              />
            </UTooltip>
            <UTooltip v-if="enablePgnImport" text="Load Custom Game">
              <UButton
                icon="i-lucide-file-input"
                color="neutral"
                variant="ghost"
                size="sm"
                class="text-gray-500 hover:text-primary-500"
                @click="openPgnModal"
              />
            </UTooltip>
          </div>

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
            @click="reset"
          />
          <UButton
            icon="i-lucide-chevron-left"
            color="primary"
            variant="solid"
            size="lg"
            :disabled="currentMoveIndex === -1"
            class="px-6"
            @click="prevMove"
          />
          <UButton
            icon="i-lucide-chevron-right"
            color="primary"
            variant="solid"
            size="lg"
            trailing
            :disabled="currentMoveIndex === moves.length - 1"
            class="px-6"
            @click="nextMove"
          />
          <UButton
            icon="i-lucide-chevrons-right"
            color="neutral"
            variant="outline"
            size="lg"
            trailing
            :disabled="currentMoveIndex === moves.length - 1"
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
            <span class="text-xs text-gray-400 font-mono">{{ moves.length }} moves</span>
          </div>
        </template>

        <div ref="moveListRef" class="h-112.5 overflow-y-auto pr-2 custom-scrollbar">
          <div v-if="moves.length > 0" class="grid grid-cols-[3rem_1fr_1fr] gap-y-1 text-sm">
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
          <div v-else class="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
            <UIcon name="i-lucide-clipboard-list" class="w-8 h-8 opacity-50" />
            <p>No moves loaded</p>
          </div>
        </div>
      </UCard>
    </div>

    <UModal
      v-if="enablePgnImport"
      v-model:open="isPgnModalOpen"
      title="Import PGN"
    >
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Load Chess Game
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              class="-my-1"
              @click="isPgnModalOpen = false"
            />
          </div>
        </template>

        <div class="p-4 space-y-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Paste your PGN (Portable Game Notation) text below to load the game.
          </p>
          <UTextarea
            v-model="inputPgn"
            placeholder="[Event ...] 1. e4 e5 ..."
            :rows="8"
            class="font-mono text-sm"
            autofocus
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              label="Cancel"
              @click="isPgnModalOpen = false"
            />
            <UButton
              color="primary"
              label="Load Game"
              @click="applyPgn"
            />
          </div>
        </template>
      </UCard>
    </UModal>
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
