'use client'

import React, { use, useCallback } from 'react'
import { TransactionType } from '@/lib/types'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from '@/components/schema/transaction'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import CategoryPicker from './category-picker'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { CreateTransaction } from '../_actions/transactions'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DateToUTCDate } from '@/lib/helpers'

interface Props {
  trigger: React.ReactNode
  type: TransactionType
}

export default function CreateTransactionDialog({ trigger, type }: Props) {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
      description: '',
      amount: 0,
      category: '',
    },
  })
  const [open, setOpen] = React.useState(false)

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue('category', value)
    },
    [form]
  )

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success('Transaction created successfully', {
        id: 'create-transaction',
      })

      form.reset({
        type,
        description: '',
        amount: 0,
        date: new Date(),
        category: undefined,
      })

      queryClient.invalidateQueries({ queryKey: ['overview'] })

      setOpen((prev) => !prev)
    },
  })

  const onSubmit = useCallback(
    (values: CreateTransactionSchemaType) => {
      toast.loading('Creating transaction', {
        id: 'create-transaction',
      })
      mutate({ ...values, date: DateToUTCDate(values.date) })
    },
    [mutate]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{' '}
            <span
              className={`capitalize ${type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}
            >
              {type}
            </span>{' '}
            Transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                  <FormDescription>
                    Transaction Description (optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field}></Input>
                  </FormControl>
                  <FormDescription>
                    Transaction Amount (required)
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>Select a Category</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Transaction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[200px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => {
                            if (!value) return
                            field.onChange(value)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Select a Date</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant={'secondary'}
              type="button"
              onClick={() => {
                form.reset()
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant={'default'}
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Create'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
