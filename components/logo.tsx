'use client'

import { Wallet } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Wallet className="stroke h-11 w-11 stroke-yellow-400 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        ExpenseTracker
      </p>
    </Link>
  )
}

export function LogoMobile() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <p className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        ExpenseTracker
      </p>
    </Link>
  )
}
