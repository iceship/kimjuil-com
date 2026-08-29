import { blob } from "hub:blob";

export default eventHandler(async (event) => {
  await requireUserSession(event);
  const { blobs } = await blob.list();

  return blobs;
});
