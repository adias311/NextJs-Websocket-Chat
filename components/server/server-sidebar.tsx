import React from 'react'
import { currentProfile } from '@/lib/current-profile';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import ServerHeader from '@/components/server/server-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import ServerSearch from '@/components/server/server-search';
import { ShieldClose, ShieldCheck, ShieldAlert, Hash, Mic, Video } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import ServerMember from './server-member';

interface ServerSidebarProps {
  serverId: string
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
}

const roleIconMap = {
  [MemberRole.GUEST]: <ShieldClose className='w-4 h-4 text-amber-600 mr-2' />,
  [MemberRole.MODERATOR]: <ShieldAlert className='w-4 h-4 text-rose-500 mr-2' />,
  [MemberRole.ADMIN]: <ShieldCheck className='w-4 h-4 text-indigo-500 mr-2' />
}



async function ServerSidebar({ serverId }: ServerSidebarProps) {

  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      Channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        }
      }
    }
  });


  const TextChannels = server?.Channels.filter((channel) => channel.type === ChannelType.TEXT) || [];
  const AudioChannels = server?.Channels.filter((channel) => channel.type === ChannelType.AUDIO) || [];
  const VideoChannels = server?.Channels.filter((channel) => channel.type === ChannelType.VIDEO) || [];

  const members = server?.members.filter((member) => member.profile_id !== profile.id) || [];

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find((member) => member.profile_id === profile.id)?.role ?? MemberRole.GUEST;

  return (
    <div className='flex flex-col h-full w-full text-primary dark:bg-[#39404d] bg-[#F2F3F5] '>
      <ServerHeader server={server} role={role} />
      <ScrollArea className='flex px-3'>
        <div className="mt-2">
          <ServerSearch data={[
            {
              label: "Text Channels",
              type: "channel",
              data: TextChannels?.map((channel) => (
                {
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }
              ))
            },
            {
              label: "Video Channels",
              type: "channel",
              data: VideoChannels?.map((channel) => (
                {
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }
              ))
            },
            {
              label: "Voice Channels",
              type: "channel",
              data: AudioChannels?.map((channel) => (
                {
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }
              ))
            },
            {
              label: "Members",
              type: "member",
              data: members?.map((member) => (
                {
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role]
                }
              ))
            },
          ]} />
        </div>
        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
        {!!TextChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            {TextChannels.map((channel) => (
              <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
            ))}
          </div>
        )}
        {!!AudioChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            {AudioChannels.map((channel) => (
              <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
            ))}
          </div>
        )}
        {!!VideoChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            {VideoChannels.map((channel) => (
              <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
            ))}
          </div>
        )}
        {!!members?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='members'
              role={role}
              label="Members"
              server={server}
            />
            {members.map((member) => (
              <ServerMember key={member.id} member={member} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default ServerSidebar;