'use client'

import * as React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { toast } from 'sonner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Currencies, Currency } from '@/lib/currencies'
import SkeletonWrapper from './skeleton-wrapper'
import { UserSettings } from '@prisma/client'
import { UpdateUserCurrency } from '@/app/wizard/_actions/userSettings'

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
    null
  )

  const userSettings = useQuery<UserSettings>({
    queryKey: ['userSettings'],
    queryFn: () => fetch('/api/user-settings').then((res) => res.json()),
  })

  React.useEffect(() => {
    if (!userSettings.data) return
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    )
    if (userCurrency) setSelectedOption(userCurrency)
  }, [userSettings.data])

  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast.success('Currency updated succesfully', { id: 'update-currency' })
      setSelectedOption(
        Currencies.find((c) => c.value === data.currency) || null
      )
    },
    onError: (e) => {
      console.error(e)
      toast.error('Error updating currency', { id: 'update-currency' })
    },
  })

  const selectOption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error('Please select a currency')
        return
      }

      toast.success('Updating currency...', {
        id: 'update-currency',
      })

      mutation.mutate(currency.value)
    },
    [mutation]
  )

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={mutation.isPending}
            >
              {selectedOption ? <>{selectedOption.label}</> : <>Set Currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    )
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTitle></DrawerTitle>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={mutation.isPending}
          >
            {selectedOption ? <>{selectedOption.label}</> : <>Set Currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  )
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void
  setSelectedOption: (status: Currency | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value: string) => {
                setSelectedOption(
                  Currencies.find((priority) => priority.value === value) ||
                    null
                )
                setOpen(false)
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
