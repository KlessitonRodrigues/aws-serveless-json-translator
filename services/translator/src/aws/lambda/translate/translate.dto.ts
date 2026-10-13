import { z } from 'zod';

import { createZodDto } from '../../../utils/utils.zod';

export const translateSchema = {
  json: z.json(),
  sourceLanguage: z.string().min(2).max(20).default('auto'),
  targetLanguage: z.string().min(2).max(20),
};

export class TranslateJsonDto extends createZodDto(
  z.object({
    json: translateSchema.json,
    sourceLanguage: translateSchema.sourceLanguage,
    targetLanguage: translateSchema.targetLanguage,
  }),
) {}
