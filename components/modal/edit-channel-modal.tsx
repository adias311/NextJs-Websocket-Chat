"use client"

import qs from 'query-string';
import React, { useEffect } from 'react';
import axios from 'axios';
import {  useRouter } from 'next/navigation';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { useModal } from '@/hooks/use-modal-store';
import { ChannelType } from '@prisma/client';

const formSchema = zod.object({
  name: zod.string().min(1, { message: 'Server name is required' }).refine(name => name !== "general", { message: "Channel name cannot be 'general' " }),
  type: zod.nativeEnum(ChannelType)
})
function EditChannelModal() {

  // Ensure that data.channelType is either present or undefined
  const { isOpen, onclose, type, data } = useModal();
  const { channel, server } = data;

  const isModalOpen = isOpen && type === 'editChannel';


  const Router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: channel?.name || "",
      type: channel?.type || ChannelType.TEXT,
    }
  })

  useEffect(() => {
    if (channel) {
      form.setValue("type", channel.type)
      form.setValue("name", channel.name)
    }
  }, [form])

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: zod.infer<typeof formSchema>) {
    try {

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id
        }
      })

      await axios.patch(url, values);
      form.reset();
      Router.refresh();
      onclose();
    } catch (error) {
      console.error(error);
    }
  }

  const handleClose = () => {
    form.reset();
    onclose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          < DialogTitle className='text-center text-2xl font-bold'>
            Edit Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/90' htmlFor='name'>Channnel Name</FormLabel>
                    <FormControl>
                      <Input id='name' className='bg-zinc-300/50 border-0 focus-visible:ring-0  text-black focus-visible:ring-offset-0' disabled={isLoading} placeholder="Enter Channel Name" autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                          <SelectValue placeholder="Select Channel Type"></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem key={type} value={type} className='capitalize'>
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button variant={'primary'} disabled={isLoading} >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditChannelModal;