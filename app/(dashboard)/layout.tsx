import NavBar from '@/components/nav-bar'
import React, { ReactNode } from 'react'

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-screen w-full flex-col">
      <NavBar />
      <div className="w-full">{children}</div>
    </div>
  )
}

export default layout
