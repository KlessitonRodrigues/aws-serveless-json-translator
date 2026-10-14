import { z } from 'zod';

import { createZodDto } from '../../../utils/utils.zod';

export class SuccessDto extends createZodDto(
  z.object({ message: z.string(), data: z.any().optional() }),
) {}

export class ErrorDto extends createZodDto(
  z.object({ message: z.string(), details: z.any().optional() }),
) {}
