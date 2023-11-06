import React from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'
import { UploadDropzone } from '@/lib/uploadthing'
import "@uploadthing/react/styles.css"

interface FieldUploadProps {
  onchange: (url?: string) => void
  value: string
  endpoint: "messageFile" | "serverImage"
}
function FileUpload({ onchange, value, endpoint }: FieldUploadProps) {

  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className='relative h-20 w-20'>
        <Image
          fill
          src={value}
          alt='Upload'
          className='rounded-full'
        />
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => onchange(res?.[0].url)}
      onUploadError={(error: Error) => console.log("error" + error)} />
  )
}

export default FileUpload;