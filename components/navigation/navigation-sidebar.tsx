import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'
import NavigationAction from '@/components/navigation/navigation-action';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className='space-y-4 flex flex-col items-center h-full w-full text-primary dark:bg-[#1e1f22] py-3'>
      <NavigationAction />
      <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
      <ScrollArea className='w-full flex-1'>
        {(server).map((server) => (
          <div key={server.id}>
            {server.name}
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

export default NavigationSidebar;