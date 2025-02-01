'use client'

import { ThemeProvider } from 'next-themes'
import React, { useState, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function RootProviders({ children }: { children: ReactNode }) {
  const [queryclient] = useState(() => new QueryClient({}))
  return (
    <QueryClientProvider client={queryclient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default RootProviders
