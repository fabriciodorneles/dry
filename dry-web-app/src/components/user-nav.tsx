'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from './ui/card'

export function UserAvatar() {
  const { data: session } = useSession()
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (session?.user?.image) {
      setImageUrl(session.user.image)
    }
  }, [session])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            {imageUrl ? (
              <Image src={imageUrl} alt="User Avatar" width={40} height={40} />
            ) : (
              <AvatarFallback>{session?.user?.name?.[0] ?? 'U'}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function UserNav() {
  return (
    <Card className="max-w-[220px] mt-10">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium">
                Weight (kg)
              </label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Enter weight"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <Input id="date" type="datetime-local" />
            </div>
          </div>
          <Button className="w-full">Add Weight</Button>
        </div>
      </CardContent>
    </Card>
  )
}
