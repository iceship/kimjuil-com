import { defineCollection, z } from "@nuxt/content";

export const collections = {
  blog: defineCollection({
    source: "blog.yml",
    type: "page",
  }),
  posts: defineCollection({
    source: "blog/**/*",
    type: "page",
    schema: z.object({
      title: z.string().nonempty(),
      description: z.string().optional(),
      tags: z.optional(z.array(z.string())),
      image: z.object({ src: z.string().nonempty().editor({ input: "media" }) }),
      authors: z.array(
        z.object({
          name: z.string().nonempty(),
          to: z.string().nonempty(),
          avatar: z.object({ src: z.string().nonempty().editor({ input: "media" }) }),
        }),
      ),
      date: z.date(),
      badge: z.object({ label: z.string().nonempty() }),
      rawbody: z.string().optional(),
    }),
  }),
};
