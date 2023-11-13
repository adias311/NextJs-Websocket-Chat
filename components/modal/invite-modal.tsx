"use client"

import React from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import { cn } from '@/lib/utils';

function InviteModal() {

  const { isOpen, onOpen, onclose, type, data } = useModal();

  const origin = useOrigin();

  const isModalOpen = isOpen && type === 'invite';
  const { server } = data;

  const [copied, setCopied] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      onOpen('invite', { server: response.data });
      console.table(response);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={onclose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          < DialogTitle className='text-center text-2xl font-bold'>
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0' value={inviteUrl} disabled={isLoading} />
            <Button
              size="icon"
              onClick={onCopy}
              className={cn(
                copied ? 'bg-[#221f1d]' : 'bg-zinc-300/50',
                'text-black hover:text-white hover:bg-black'
              )}
              disabled={copied || isLoading}
            >
              {copied ? <Check className='w-4 h-4 text-lime-500' strokeWidth={5} size={25} /> : <Copy className='w-4 h-4' />}
            </Button>
          </div>
          <Button variant='link' size="sm" className='text-xs text-zinc-500 mt-4' disabled={isLoading} onClick={onNew}>
            Generate a new link
            <RefreshCw className='w-4 h-4 ml-2' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InviteModal;