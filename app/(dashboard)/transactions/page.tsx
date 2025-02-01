'use client'

import { CurrencyComboBox } from '@/components/currency-combo-box'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TransactionType } from '@/lib/types'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import SkeletonWrapper from '@/components/skeleton-wrapper'
import { PlusSquare, TrendingDown, TrendingUp } from 'lucide-react'
import CreateCategoryDialog from '../_components/create-category-dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Category } from '@prisma/client'
import { TrashIcon } from '@radix-ui/react-icons'
import DeleteCategoryDialog from '../_components/delete-category-dialog'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { differenceInDays, startOfMonth } from 'date-fns'
import { toast } from 'sonner'
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants'
import TransactionTable from './_components/transaction-table'

function Transactions() {
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  })

  return (
    <>
      <div className="h-full bg-background">
        <div className="border-b bg-card px-8">
          <div className="container max-w-full flex flex-wrap items-center justify-between gap-6 py-8">
            <div>
              <p className="text-3xl font-bold">Transactions</p>
              <p className="text-muted-foreground">Manage your transactions</p>
            </div>
            <DateRangePicker
              initialDateFrom={dateRange.from}
              initialDateTo={dateRange.to}
              showCompare={false}
              onUpdate={(values) => {
                const { from, to } = values.range

                if (!from || !to) return
                if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                  toast.error(
                    `The maximum date range is ${MAX_DATE_RANGE_DAYS} days.`
                  )
                  return
                }
                setDateRange({ from, to })
              }}
            />
          </div>
        </div>
        <div className="container max-w-full flex flex-col gap-4 p-4">
          <TransactionTable from={dateRange.from} to={dateRange.to} />
        </div>
      </div>
    </>
  )
}

export default Transactions
