import {z} from "zod";

export const transactionSchema = z.object({
    title: z.string().min(1, "title is required"),
    amount: z.number().min(1, "amount is required").max(15),
    type: z.enum(["income", "expense"]),
    category: z.string().min(1, "category is required"),
    date: z.string().datetime()
})