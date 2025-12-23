<script setup lang="ts">
const route = useRoute();
const { data: post } = await useFetch(`/api/games/${route.params.id}`);
</script>

<template>
  <div v-if="post">
    <h1 class="text-2xl font-bold mb-2">
      {{ post.title }}
    </h1>
    <p class="mb-4">
      {{ post.description }}
    </p>

    <div class="flex justify-center my-8">
      <ChessBoard :fen="post.fen || 'start'" />
    </div>

    <div v-if="post.pgn" class=" p-4 rounded">
      <h3>PGN</h3>
      <pre>{{ post.pgn }}</pre>
    </div>
  </div>
</template>
