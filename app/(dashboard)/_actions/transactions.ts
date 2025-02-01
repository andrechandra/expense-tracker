'use server'

import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/components/schema/transaction";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
    const parsedBody = CreateTransactionSchema.safeParse(form);

    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message)
    }

    const user = await currentUser();
    if (!user) {
        redirect('/sign-in')
    }

    const {amount, category, date, description, type} = parsedBody.data;
    const categoryRow = await prisma.category.findFirst({where: {userId: user.id, name: category}})
    if(!categoryRow) {
        throw new Error('Category not found')
    }

    await prisma.$transaction([
        prisma.transaction.create({
            data: {
                amount,
                category: categoryRow.name,
                categoryIcon: categoryRow.icon,
                date,
                description: description || "",
                type,
                userId: user.id
            }
        }),

        // Update month aggreagate table
        prisma.monthHistory.upsert({
            where: {
                day_month_year_userId: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                }
            },
            create:{
                userId: user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expenses: type === 'expense' ? amount : 0,
                income: type === 'income' ? amount : 0,                
            },
            update: {
                expenses: {
                    increment: type === 'expense' ? amount : 0,
                },
                income: {
                    increment: type === 'income' ? amount : 0
                }
            }
        }),

        // Update year aggregate table
        prisma.yearHistory.upsert({
            where: {
                month_year_userId: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                }
            },
            create:{
                userId: user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expenses: type === 'expense' ? amount : 0,
                income: type === 'income' ? amount : 0,                
            },
            update: {
                expenses: {
                    increment: type === 'expense' ? amount : 0,
                },
                income: {
                    increment: type === 'income' ? amount : 0
                }
            }
        })
    ])
}