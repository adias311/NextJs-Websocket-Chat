"use client"

import React from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import ActionTooltip from '@/components/action-tooltip'

type NavigationItemProps = {
  id: string,
  imageUrl: string,
  name: string
}

function NavigationItem({ id, imageUrl, name }: NavigationItemProps) {

  const params = useParams();
  console.log(params?.serverId);
  const router = useRouter();

  const changeServer = () => {
    router.push(`/servers/${id}`)
  }

  return (
    <ActionTooltip side='right' align='center' label={name}>
      <button onClick={() => { changeServer() }} className='group relative flex items-center'>
        <div
          className={cn("absolute left-0 bg-primary rounded-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]")}>
        </div>
        <div className={cn(
          "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
          params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]")}>
          <Image
            fill
            src={imageUrl}
            alt='Channel'
          />
        </div>
      </button>
    </ActionTooltip>
  )
}

export default NavigationItem;