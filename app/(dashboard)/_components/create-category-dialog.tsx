'use client'

import React, { useCallback, useState } from 'react'
import { TransactionType } from '@/lib/types'
import { useForm } from 'react-hook-form'
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from '@/components/schema/categories'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { CircleOff, Loader2, Plus, PlusSquareIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateCategory } from '../_actions/categories'
import { Category } from '@prisma/client'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

interface Props {
  type: TransactionType
  successCallback: (category: Category) => void
  trigger?: React.ReactNode
}

export default function CreateCategoryDialog({
  type,
  successCallback,
  trigger,
}: Props) {
  const [open, setOpen] = useState(false)
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: '',
      icon: '',
      type,
    },
  })

  const queryClient = useQueryClient()
  const theme = useTheme()

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: '',
        icon: '',
        type,
      })

      toast.success(`Category ${data.name} created successfully.`, {
        id: 'create-category',
      })

      successCallback(data)

      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      })

      setOpen((prev) => !prev)
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.', {
        id: 'create-category',
      })
    },
  })

  const onSubmit = useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading('Creating category...', {
        id: 'create-category',
      })
      mutate(values)
    },
    [mutate]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="ghost"
            className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
          >
            <PlusSquareIcon className="mr-2 h-4 w-4" />
            Create Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create{' '}
            <span
              className={`capitalize ${type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}
            >
              {type}
            </span>{' '}
            Category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your transaction
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field}></Input>
                  </FormControl>
                  <FormDescription>Category Name (required)</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className="h-[100px] w-full"
                        >
                          {form.watch('icon') ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-[48px] w-[48px]" />
                              <p className="text-xs text-muted-foreground">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          theme={theme.resolvedTheme}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native)
                          }}
                        ></Picker>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
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
