import { z } from 'zod';

export const catalogSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(5),
  search: z.string().optional()
});