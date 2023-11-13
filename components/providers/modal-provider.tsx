"use client"
import CreateServerModal from "@/components/modal/create-server-modal";
import React from "react";
import InviteModal from "@/components/modal/invite-modal";
import EditServerModal from "@/components/modal/edit-server-modal";
import MembersModal from "@/components/modal/members-modal";
import CreateChannelModal from "@/components/modal/create-channel-modal";
import LeaveServerModal from "@/components/modal/leave-server-modal";
import DeleteServerModal from "@/components/modal/delete-server-modal";
import DeleteChannelModal from "@/components/modal/delete-channel-modal";
import EditChannelModal from "@/components/modal/edit-channel-modal";


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
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
    </div>
  )
}

export default ModalProvider;