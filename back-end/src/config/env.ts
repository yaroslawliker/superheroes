import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
    MINIO_ENDPOINT: z.string(),
    MINIO_PORT: z.coerce.number(),
    MINIO_USER: z.string(),
    MINIO_PASSWORD: z.string()
});

export const env = envSchema.parse(process.env);