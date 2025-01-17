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
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export function UserNav() {
  const { data: session } = useSession()
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (session?.user?.image) {
      setImageUrl(session.user.image)
    }
  }, [session])

  console.log('User image URL:', imageUrl)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
