'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet'
import { Button } from './ui/button'
import { Logo, LogoMobile } from './logo'
import { ThemeToggle } from './theme-toggle'
import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'

const navItem = [
  {
    label: 'Dashboard',
    link: '/',
  },
  {
    label: 'Transactions',
    link: '/transactions',
  },
  {
    label: 'Manage',
    link: '/manage',
  },
]
function NavBar() {
  return (
    <>
      <MobileNavbar />
      <DesktopNavbar />
    </>
  )
}

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between max-w-full px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={'ghost'} className="border-[0.5px] shadow-sm">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side={'left'}>
            <SheetTitle />
            <Logo />
            <div className="flex flex-col gap-1 pt-4">
              {navItem.map((item) => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  onClick={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <LogoMobile />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  )
}
function DesktopNavbar() {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {navItem.map((item) => (
              <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  )
}

function NavbarItem({
  link,
  label,
  onClick,
}: {
  link: string
  label: string
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === link

  return (
    <div className="relative flex items-center">
      <Button
        variant="ghost"
        asChild
        className={
          isActive
            ? 'relative w-full justify-start text-lg text-foreground'
            : 'relative w-full justify-start text-lg text-muted-foreground hover:text-foreground'
        }
      >
        <Link
          href={link}
          onClick={() => {
            if (onClick) onClick()
          }}
        >
          {label}
        </Link>
      </Button>
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
      )}
    </div>
  )
}
export default NavBar
