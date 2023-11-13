"use client"

import axios from 'axios';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


 function DeleteServerModal() {

  const { isOpen, onclose, type, data } = useModal();

  const isModalOpen = isOpen && type === 'deleteServer';
  const { server } = data;

  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

const onClick = async () => {
  try {

    setIsLoading(true);
    await axios.delete(`/api/servers/${server?.id}`);

    onclose();
    router.refresh();
    router.push("/");
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
}



  return (
    <Dialog open={isModalOpen} onOpenChange={onclose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          < DialogTitle className='text-center text-2xl font-bold'>
            Delete Server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to do this ? <br /> <span className='font-semibold text-indigo-500'>{server?.name}</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" disabled={isLoading} onClick={onclose}>
              Cancel
            </Button>
            <Button variant="primary" disabled={isLoading} onClick={onClick}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteServerModal;