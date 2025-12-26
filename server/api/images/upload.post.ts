import { blob } from "hub:blob";

export default eventHandler(async (event) => {
  await requireUserSession(event);
  return blob.handleUpload(event, {
    multiple: false,
    ensure: {
      maxSize: "1MB",
      types: ["image/png", "image/jpeg", "image/webp"],
    },
    put: {
      prefix: "games",
      addRandomSuffix: true,
    },
  });
});
