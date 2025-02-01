import { z } from "zod";

export const CreateTransactionSchema = z.object({
    amount: z.coerce.number().positive().multipleOf(0.01),
    description: z.string().optional(),
    category: z.string(),
    type: z.union([z.literal('income'), z.literal('expense')]),
    date: z.coerce.date(),
})

export type CreateTransactionSchemaType = z.infer<typeof CreateTransactionSchema>