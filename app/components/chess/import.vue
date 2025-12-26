<script setup lang="ts">
// Define the shape of the data
export interface ImportResponse {
  title: string;
  description: string;
  pgn: string;
  fen: string;
  source: string;
}

// Define emits to pass data to the parent
const emit = defineEmits<{
  (e: "imported", data: ImportResponse): void;
}>();

const toast = useToast();
const importUrl = ref("");
const isImporting = ref(false);

async function importGame() {
  if (!importUrl.value.trim())
    return;

  isImporting.value = true;
  try {
    const data = await $fetch<ImportResponse>("/api/import/chesscom", {
      method: "POST",
      body: { url: importUrl.value },
    });

    // Instead of setting state directly, emit the data to the parent
    emit("imported", data);

    toast.add({ title: "Game imported successfully!", color: "success" });
    importUrl.value = "";
  }
  catch (e) {
    const message = e instanceof Error ? e.message : "An unknown error occurred";
    toast.add({ title: "Failed to import game", description: message, color: "error" });
  }
  finally {
    isImporting.value = false;
  }
}
</script>

<template>
  <UCard class="ring-1 ring-gray-200 dark:ring-gray-800 shadow-sm bg-gray-50 dark:bg-gray-900/50">
    <div class="flex gap-2 items-end">
      <UFormField
        label="Import from Chess.com"
        name="import"
        class="flex-1"
        help="Paste a Chess.com analysis link to auto-fill."
      >
        <UInput
          v-model="importUrl"
          placeholder="https://www.chess.com/analysis/game/live/..."
          icon="i-simple-icons-chessdotcom"
          :loading="isImporting"
          class="w-full"
          @keyup.enter="importGame"
        />
      </UFormField>
      <UButton
        label="Import"
        color="neutral"
        :loading="isImporting"
        :disabled="!importUrl"
        @click="importGame"
      />
    </div>
  </UCard>
</template>
