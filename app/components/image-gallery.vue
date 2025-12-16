<script setup lang="ts">
const toast = useToast();
const { data: images, refresh } = await useFetch("/api/images");

async function uploadImage(e: Event) {
  // https://hub.nuxt.com/docs/storage/blob#useupload
  const upload = useUpload("/api/images/upload", {
    multiple: false,
  });
  const form = e.target as HTMLFormElement;
  await upload(form.image)
    .then(async () => {
      form.reset();
      await refresh();
      toast.add({ title: "Image uploaded successfully", color: "success" });
    })
    .catch(err => toast.add({ title: "Failed to upload image", description: err.data?.message, color: "error" }));
}

async function deleteImage(pathname: string) {
  await $fetch(`/api/images/${pathname}`, { method: "DELETE" });
  await refresh();
}
</script>

<template>
  <div>
    <h3>Images</h3>
    <form @submit.prevent="uploadImage">
      <label>Upload an image: <input
        type="file"
        name="image"
        accept="image/jpg,image/png"
      ></label>
      <button type="submit">
        Upload
      </button>
    </form>
    <p>
      <img
        v-for="image of images"
        :key="image.pathname"
        width="200"
        :src="`/images/${image.pathname}`"
        :alt="image.pathname"
        @dblclick="deleteImage(image.pathname)"
      >
    </p>
    <p v-if="images?.length">
      <i>Tip: delete an image by double-clicking on it.</i>
    </p>
  </div>
</template>
