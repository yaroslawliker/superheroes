import { z } from 'zod'

export const updateHeroSchema = z.object({
    nickname: z.string().min(3),
    realName: z.string().min(3),
    originDescription: z.string().max(500),
    superpowers: z.array(z.string()),
    catchPhrase: z.string().max(200).optional(),
    deletedImages: z.array(z.string())
})

export type UpdateHeroDto = z.infer<typeof updateHeroSchema>;

