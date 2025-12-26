<script lang="ts" setup>
import { Chess } from "chess.js";

import { gamesQuery } from "~/queries/games";

definePageMeta({
  middleware: "auth",
});

const toast = useToast();
const queryCache = useQueryCache();

const state = reactive({
  title: "",
  description: "",
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  pgn: "",
  thumbnail: "",
});

const isUploadingImage = ref(false);
// multiple: false 이므로 리턴값은 단일 객체입니다.
const upload = useUpload("/api/images/upload", { multiple: false });

async function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files || input.files.length === 0)
    return;

  isUploadingImage.value = true;
  try {
    const file = input.files[0];
    if (!file)
      return; // TypeScript safety check

    // multiple: false일 때 upload(file)은 단일 BlobObject를 반환합니다.
    const blob = await upload(file);

    // 배열이 아니므로 바로 접근
    if (blob && blob.pathname) {
      state.thumbnail = blob.pathname;
      toast.add({ title: "Image uploaded successfully", color: "success" });
    }
  }
  catch (err: any) {
    toast.add({
      title: "Failed to upload image",
      description: err.data?.message || err.message,
      color: "error",
    });
  }
  finally {
    isUploadingImage.value = false;
    // input 초기화 (같은 파일 다시 선택 가능하게)
    input.value = "";
  }
}

function removeThumbnail() {
  state.thumbnail = "";
}

function onPgnInput(val: string) {
  try {
    const chess = new Chess();
    chess.loadPgn(val);
    state.fen = chess.fen();
  }
  catch {
    // Ignore parsing errors
  }
}

const isValidFen = computed(() => {
  try {
    const _chess = new Chess(state.fen);
    return true;
  }
  catch {
    return false;
  }
});

const { mutate: createPost, isLoading: loading } = useMutation({
  mutation: () => {
    if (!state.title.trim())
      throw new Error("Title is required");

    return $fetch<any>("/api/games", {
      method: "POST",
      body: {
        title: state.title,
        description: state.description,
        fen: state.fen,
        pgn: state.pgn,
        thumbnail: state.thumbnail,
      },
    });
  },

  async onSuccess() {
    await queryCache.invalidateQueries(gamesQuery);
    toast.add({ title: "Game posted successfully!", color: "success", icon: "i-heroicons-check-circle" });
    navigateTo("/chess");
  },

  onError(err) {
    if (isNuxtZodError(err)) {
      const title = (err as any).data.data.issues.map((issue: { message: string }) => issue.message).join("\n");
      toast.add({ title, color: "error", icon: "i-heroicons-exclamation-circle" });
    }
    else {
      console.error(err);
      toast.add({ title: "Failed to post game", color: "error", icon: "i-heroicons-x-circle" });
    }
  },
});
</script>

<template>
  <div class="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-lucide-swords" class="w-8 h-8 text-primary" />
          Share Chess Game
        </h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Share your memorable games or analysis with others.
        </p>
      </div>
    </div>

    <form @submit.prevent="createPost()">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-7 space-y-6">
          <UCard class="ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm">
            <template #header>
              <div class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" />
                Basic Info
              </div>
            </template>

            <div class="space-y-6">
              <UFormField
                label="Title"
                name="title"
                required
                help="Give your game a catchy title."
              >
                <UInput
                  v-model="state.title"
                  placeholder="e.g. The Immortal Game"
                  icon="i-heroicons-pencil"
                  size="lg"
                  autofocus
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Description" name="description">
                <UTextarea
                  v-model="state.description"
                  placeholder="Describe the context or key moments..."
                  :rows="4"
                  autoresize
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Thumbnail Image"
                name="thumbnail"
                help="Upload a custom thumbnail (optional). Supports JPG, PNG."
              >
                <div v-if="!state.thumbnail" class="flex items-center gap-2">
                  <UInput
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    icon="i-heroicons-photo"
                    :loading="isUploadingImage"
                    class="w-full"
                    @change="onFileSelect"
                  />
                </div>

                <div v-else class="relative group mt-2 w-fit">
                  <div class="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <img
                      :src="`/images/${state.thumbnail}`"
                      alt="Thumbnail Preview"
                      class="h-40 w-auto object-cover bg-gray-100 dark:bg-gray-800"
                    >
                    <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <UButton
                        color="error"
                        variant="soft"
                        icon="i-heroicons-trash"
                        size="sm"
                        @click="removeThumbnail"
                      >
                        Remove
                      </UButton>
                    </div>
                  </div>
                </div>
              </UFormField>
            </div>
          </UCard>

          <UCard class="ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm">
            <template #header>
              <div class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UIcon name="i-lucide-database" />
                Game Data
              </div>
            </template>

            <div class="space-y-6">
              <UFormField
                label="FEN String"
                name="fen"
                :error="!isValidFen && state.fen ? 'Invalid FEN string' : undefined"
                help="Represents the current board position."
              >
                <UInput
                  v-model="state.fen"
                  placeholder="Paste FEN here..."
                  icon="i-heroicons-puzzle-piece"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="PGN (Portable Game Notation)"
                name="pgn"
                help="Paste the full game PGN here. FEN will be extracted automatically."
              >
                <UTextarea
                  v-model="state.pgn"
                  placeholder="1. e4 e5 2. Nf3 Nc6..."
                  :rows="8"
                  class="font-mono text-sm w-full"
                  variant="outline"
                  @input="(e: Event) => onPgnInput((e.target as HTMLTextAreaElement).value)"
                />
              </UFormField>
            </div>
          </UCard>
        </div>

        <div class="lg:col-span-5 lg:sticky lg:top-8">
          <UCard class="overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
            <template #header>
              <div class="text-sm font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                <span class="flex items-center gap-2">
                  <UIcon name="i-heroicons-eye" />
                  Preview
                </span>
                <UBadge
                  v-if="isValidFen"
                  color="success"
                  variant="subtle"
                  size="sm"
                >
                  Valid Position
                </UBadge>
                <UBadge
                  v-else
                  color="error"
                  variant="subtle"
                  size="sm"
                >
                  Invalid Position
                </UBadge>
              </div>
            </template>

            <div class="flex flex-col items-center justify-center py-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div class="w-full max-w-100 px-4">
                <div class="aspect-square w-full rounded overflow-hidden shadow-md border-[3px] border-[#b58863] bg-[#f0d9b5]">
                  <ChessBoard
                    :fen="isValidFen ? state.fen : 'start'"
                  />
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-4 text-center px-4">
                * The board updates automatically when you enter a PGN.
              </p>
            </div>

            <template #footer>
              <div class="flex flex-col gap-3">
                <UButton
                  type="submit"
                  icon="i-lucide-upload"
                  color="primary"
                  block
                  size="lg"
                  :loading="loading"
                  :disabled="!state.title.trim() || loading"
                  @click="() => createPost()"
                >
                  Post Game
                </UButton>
                <UButton
                  to="/chess"
                  variant="ghost"
                  color="neutral"
                  block
                >
                  Cancel
                </UButton>
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </form>
  </div>
</template>
