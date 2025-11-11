/**
 * Zod Schema for Client Validation
 */

import { z } from 'zod';

export const validateClientSchema = z.object({
  notes: z.string().optional(),
});

export type ValidateClientFormData = z.infer<typeof validateClientSchema>;
