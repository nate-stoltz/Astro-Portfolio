import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    year: z.number(),
    type: z.string(),
    previewImage: z.string(),
    headline: z.string(),
    subheadline: z.string(),
    description: z.string(),
    siteUrl: z.string().url(),
    media: z.array(
      z.union([
        z.string(),
        z.object({
          src: z.string(),
          poster: z.string().optional(),
        }),
      ])
    )
  }),
});

export const collections = {
  projects,
};