
import ChatHeader from '@/components/chat/chat-header';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

interface ChannelIdPageProps {
  params: {
    serverId: string
    channelId: string
  }
}

async function ChannelIdPage({ params }: ChannelIdPageProps) {

  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId
    }
  })

  const member = await db.member.findFirst({
    where: {
      server_id: params.serverId,
      profile_id: profile.id
    }
  })

  if (!channel || !member) {
    return redirect('/')
  }

  return (
    <div className='bg-white  dark:bg-[#313338] flex flex-col h-full '>
      <ChatHeader serverId={params.serverId} name={channel.name} type="channel"/>
    </div>
  )
}

export default ChannelIdPage; 