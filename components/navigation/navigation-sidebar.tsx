import React from 'react'

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

import { redirect } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModeToggle } from '@/components/ui/dark-mode';

import { UserButton } from '@clerk/nextjs';

import NavigationAction from '@/components/navigation/navigation-action';
import NavigationItem from '@/components/navigation/navigation-item';

async function NavigationSidebar() {

  const profile = await currentProfile();

  if (!profile) {
    return redirect("/")
  }

  const server = await db.server.findMany({
    where: {
      members: {
        some: {
          profile_id: profile.id
        }
      } 
    }
  })

  return (
    <div className='space-y-4 flex flex-col items-center h-full w-full text-primary dark:bg-[#1e1f22] bg-[#E3E5E8] py-3'>
      <NavigationAction />
      <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
      <ScrollArea className='w-full flex-1'>
        {(server).map((server) => (
          <div key={server.id} className='mb-4'>
            <NavigationItem id={server.id} imageUrl={server.imageUrl} name={server.name} />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton afterSignOutUrl='/'
          appearance={{
            elements: {
                avatarBox : "h-[42px] w-[42px]",
            }
          }}
        />
      </div>
    </div>
  )
}

export default NavigationSidebar;