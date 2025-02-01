"use server"


import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function DeleteTransaction(id: string) {
    console.log("Deleting transaction with ID:", id); // Debug log
    const user = await currentUser()
    if(!user) {
        redirect('/sign-in')
    }

    const transaction = await prisma.transaction.findUnique({
        where: {
            id,
            userId: user.id,
            
        }
    })

    if(!transaction) {
        throw new Error('Transaction not found')
    }

    await prisma.$transaction([
        prisma.transaction.delete({
            where: {
                id,
                userId: user.id,                
            }
        }),

        prisma.monthHistory.update({
            where: {
                day_month_year_userId:{
                    userId: user.id,
                    day: transaction.date.getDate(),
                    month: transaction.date.getMonth(),
                    year: transaction.date.getFullYear()
                }
            },
            data: {
                ...(transaction.type === 'expense' && {
                    expenses: {
                        decrement: transaction.amount
                    }
                }),
                ...(transaction.type === 'income' && {
                    income: {
                        decrement: transaction.amount
                    }
                })
            }
        }),

        prisma.yearHistory.update({
            where: {
                month_year_userId:{
                    userId: user.id,
                    month: transaction.date.getMonth(),
                    year: transaction.date.getFullYear()
                }
            },
            data: {
                ...(transaction.type === 'expense' && {
                    expenses: {
                        decrement: transaction.amount
                    }
                }),
                ...(transaction.type === 'income' && {
                    income: {
                        decrement: transaction.amount
                    }
                })
            }
        })
    ])
}