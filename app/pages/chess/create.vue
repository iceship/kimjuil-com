<script lang="ts" setup>
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
});

const { mutate: createPost, isLoading: loading } = useMutation({
  mutation: () => {
    if (!state.title.trim())
      throw new Error("Title is required");

    return $fetch("/api/games", {
      method: "POST",
      body: {
        title: state.title,
        description: state.description,
        fen: state.fen,
        pgn: state.pgn,
      },
    });
  },

  async onSuccess() {
    await queryCache.invalidateQueries(gamesQuery);
    toast.add({ title: "Game posted successfully!", color: "success" });
    navigateTo("/chess");
  },

  onError(err) {
    if (isNuxtZodError(err)) {
      const title = (err as any).data.data.issues.map((issue: { message: string }) => issue.message).join("\n");
      toast.add({ title, color: "error" });
    }
    else {
      console.error(err);
      toast.add({ title: "Failed to post game", color: "error" });
    }
  },
});
</script>

<template>
  <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Share Chess Game
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Share your analysis or memorable games with others.
      </p>
    </div>

    <form @submit.prevent="createPost()">
      <UCard class="w-full">
        <div class="space-y-6">
          <UFormGroup
            label="Title"
            name="title"
            required
          >
            <UInput
              v-model="state.title"
              placeholder="e.g. Immortal Game"
              autofocus
              size="lg"
            />
          </UFormGroup>

          <UFormGroup label="Description" name="description">
            <UTextarea
              v-model="state.description"
              placeholder="Describe the game context or analysis..."
              :rows="3"
              autoresize
            />
          </UFormGroup>
        </div>

        <UDivider class="my-6" label="Game Data" />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div class="space-y-6 order-2 lg:order-1">
            <UFormGroup
              label="FEN String"
              name="fen"
              help="Current board position"
            >
              <UInput
                v-model="state.fen"
                placeholder="Paste FEN here..."
                icon="i-heroicons-puzzle-piece"
              />
            </UFormGroup>

            <UFormGroup
              label="PGN Move List"
              name="pgn"
              help="Full game moves (Optional)"
            >
              <UTextarea
                v-model="state.pgn"
                placeholder="1. e4 e5 2. Nf3 Nc6..."
                :rows="12"
                class="font-mono text-sm"
              />
            </UFormGroup>
          </div>

          <div class="order-1 lg:order-2 flex flex-col items-center">
            <div class="sticky top-4">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3 block text-center">
                Preview
              </span>
              <div class="rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-1">
                <ChessBoard :fen="state.fen || 'start'" />
              </div>
              <p v-if="!state.fen" class="text-xs text-gray-500 mt-2 text-center">
                Enter a FEN string to see the position
              </p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              to="/chess"
              variant="ghost"
              color="neutral"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              icon="i-lucide-share-2"
              color="primary"
              :loading="loading"
              :disabled="!state.title.trim() || loading"
            >
              Post Game
            </UButton>
          </div>
        </template>
      </UCard>
    </form>
  </div>
</template>
