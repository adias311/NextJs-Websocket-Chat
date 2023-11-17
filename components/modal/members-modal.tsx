"use client"

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '@/type';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/user-avatar';
import { Check, Gavel, Loader2, MoreVertical, ShieldAlert, ShieldCheck, ShieldClose, ShieldIcon, ShieldQuestion } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuTrigger, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { MemberRole } from '@prisma/client';
import qs from 'query-string';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function MembersModal() {

  const router = useRouter();
  const { isOpen, onOpen, onclose, type, data } = useModal();
  const isModalOpen = isOpen && type === 'members';
  const { server } = data as { server: ServerWithMembersWithProfiles };
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      })

      const response = await axios.delete(url);

      router.refresh();
      onOpen("members", { server: response.data })
    } catch (error) {
      console.error(error);
    }
  }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      })

      const response = await axios.patch(url, {
        role
      })

      router.refresh();
      onOpen("members", { server: response.data })
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId("");
    }
  }

  const roleIconMap = {
    "GUEST": <ShieldIcon className='w-4 h-4 text-amber-600' />,
    "ADMIN": <ShieldCheck className='w-4 h-4 text-indigo-500' />,
    "MODERATOR": <ShieldAlert className='w-4 h-4 text-rose-500' />

  }



  return (
    <Dialog open={isModalOpen} onOpenChange={onclose}>
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          < DialogTitle className='text-center text-2xl font-bold'>
            Manage Members
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='mt-8 max-h-[420px] px-10 justify-center'>
          {server?.members?.map((member) => (
            <div key={member.id} className='flex items-center gap-x-2 mb-6 bg-slate-300/95 p-2 rounded-lg'>
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col  ">
                <div className='text-xs font-semibold gap-x-1 flex items-center mt-1'>
                  {roleIconMap[member.role]}
                  {member.profile.name}
                </div>
                <p className='text-xs text-zinc-500 '>
                  {member.profile.email}
                </p>
              </div>
              {server.profile_id !== member.profile_id && (
                loadingId !== member.id && (
                  <div className='ml-auto'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className='w-4 h-4 text-zinc-500 border-0 ' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side='left'>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className='flex items-center'>
                            <ShieldQuestion className='w-4 h-4 mr-2' />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                                <ShieldIcon className='w-4 h-4 mr-2' />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className='h-4 w-4 ml-auto' />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
                                <ShieldAlert className='w-4 h-4 mr-2' />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className='h-4 w-4 ml-auto' />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <Gavel className='w-4 h-4 mr-2' />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              )}
              {loadingId === member.id && (
                <Loader2 className='w-4 h-4 ml-auto animate-spin text-zinc-500' />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default MembersModal;