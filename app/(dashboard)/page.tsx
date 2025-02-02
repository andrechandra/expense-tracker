import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import CreateTransactionDialog from './_components/create-transaction-dialog'
import Overview from './_components/overview'
import History from './_components/history'

async function Page() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (!userSettings) {
    redirect('/wizard')
  }

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card px-8">
        <div className="container max-w-full flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold"> Hello, {user.firstName}!</p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                >
                  + Income
                </Button>
              }
              type={'income'}
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                >
                  - Expense
                </Button>
              }
              type={'expense'}
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  )
}
export default Page
