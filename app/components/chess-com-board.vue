<script setup lang="ts">
const props = defineProps<{
  id: string | number; // Chess.com 게임 ID (예: 14302337)
}>();

const iframeRef = ref<HTMLIFrameElement | null>(null);

// Chess.com에서 보내오는 높이 조절 메시지를 처리하는 함수
function handleResize(e: MessageEvent) {
  // 데이터가 있고, ID가 현재 컴포넌트의 ID와 일치할 때만 실행
  if (e.data && e.data.id === props.id && iframeRef.value) {
    // iframe 높이 조절 (+37px은 하단 정보창 여유분)
    iframeRef.value.style.height = `${e.data.frameHeight + 37}px`;
  }
}

onMounted(() => {
  // 컴포넌트가 마운트되면 메시지 이벤트 리스너 등록
  window.addEventListener("message", handleResize);
});

onUnmounted(() => {
  // 컴포넌트가 사라지면 리스너 제거 (메모리 누수 방지)
  window.removeEventListener("message", handleResize);
});
</script>

<template>
  <div class="w-full max-w-150 mx-auto">
    <iframe
      :id="`chess-com-${id}`"
      ref="iframeRef"
      :src="`https://www.chess.com/emboard?id=${id}`"
      style="width: 100%; border: none; overflow: hidden;"
      allowtransparency="true"
      frameborder="0"
      scrolling="no"
    />
  </div>
</template>
