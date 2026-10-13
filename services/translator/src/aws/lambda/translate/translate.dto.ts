import { z } from 'zod';

import { createZodDto } from '../../../utils/zod';

const jsonValue: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValue),
    z.record(z.string(), jsonValue),
  ]),
);

export const translateSchema = {
  json: z.union([z.array(jsonValue), z.record(z.string(), jsonValue)]),
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
