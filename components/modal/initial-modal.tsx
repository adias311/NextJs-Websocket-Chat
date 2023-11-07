"use client"

import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import FileUpload from '@/components/FileUpload';

const formSchema = zod.object({
  name: zod.string().min(1, { message: 'Server name is required' }),
  imageUrl: zod.string().min(1, { message: 'Server image is required' }),
})
function InitialModal() {

  const [mounted, setMounted] = React.useState(false);
  const Router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    }
  })

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: zod.infer<typeof formSchema>) {
    try {
      await axios.post('/api/servers', values);

      form.reset();
      Router.refresh();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    mounted && (
      <Dialog open={true}>
        <DialogContent className='bg-white text-black p-0 overflow-hidden'>
          <DialogHeader className='pt-8 px-6'>
            < DialogTitle className='text-center text-2xl font-bold'>
              Customize your server
            </DialogTitle>
            <DialogDescription className='text-center text-zinc-500'>
              Give your server a personality with a name and image. You can always change it later.
            </DialogDescription>
          </DialogHeader>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <div className='space-y-8 px-6'>
                <div className='flex items-center justify-center text-center'>
                  <FormField control={form.control} name='imageUrl' render={({ field }) =>
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onchange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  } />
                </div>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/90' htmlFor='name'>Server Name</FormLabel>
                      <FormControl>
                        <Input id='name' className='bg-zinc-300/50 border-0 focus-visible:ring-0  text-black focus-visible:ring-offset-0' disabled={isLoading} placeholder="Server Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
              <DialogFooter className='bg-gray-100 px-6 py-4'>
                <Button variant={'primary'} disabled={isLoading} >
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  )
}

export default InitialModal;