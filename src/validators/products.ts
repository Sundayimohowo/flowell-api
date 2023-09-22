import { z } from 'zod';

export const productValidatorSchema = z.object({
  name: z.string().nonempty('Product name is required'),
  description: z.string().nonempty('Product description is required'),
  price: z.number().min(1, 'Price is required'),
  sellingPrice: z.number().min(1, 'Selling price is required'),
  attachments: z
    .array(
      z.object({
        thumbnailUrl: z.string(),
        url: z.string().optional(),
      }),
    )
    .optional(),
});
