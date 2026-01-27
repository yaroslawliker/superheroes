import { z } from 'zod'

export const createHeroSchema = z.object({
    nickname: z.string().min(3),
    realName: z.string().min(3),
    originDescription: z.string().max(500),
    superpowers: z.array(z.string())
})

export type CreateHeroDto = z.infer<typeof createHeroSchema>;

