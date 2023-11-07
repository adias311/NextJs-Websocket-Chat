"use client"
import CreateServerModal from "@/components/modal/create-server-modal";
import React from "react";


export function ModalProvider() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  })

  if (!mounted) {
    return null
  }

  return (
    <div>
      <CreateServerModal />
    </div>
  )
}

export default ModalProvider;