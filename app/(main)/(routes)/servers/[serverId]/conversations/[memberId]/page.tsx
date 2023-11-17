
import ChatHeader from '@/components/chat/chat-header'
import ChatInput from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { getOrCreateConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'


interface MemberIdPageProps {
  params: {
    memberId: string,
    serverId: string
  }
}
async function MemberIdPage({ params }: MemberIdPageProps) {

  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const currentMember = await db.member.findFirst({
    where: {
      profile_id: profile.id,
      server_id: params.serverId
    },
    include: {
      profile: true
    }
  })

  if (!currentMember) {
    return redirect('/')
  }

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId)

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`)
  }

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.profile_id === profile.id ? memberTwo : memberOne

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        imageUrl={otherMember.profile?.imageUrl}
        name={otherMember.profile?.name}
        serverId={params.serverId}
        type="conversation"
      />
      <ChatMessages name={otherMember.profile?.name} type='conversation' paramKey='conversationId' paramValue={conversation.id} member={currentMember} chatId={conversation.id} apiUrl='/api/direct-messages' socketUrl='/api/socket/direct-messages' socketQuery={{ conversationId: conversation.id, serverId: params.serverId }} />
      <ChatInput name={otherMember.profile?.name} type="conversation" apiUrl='/api/socket/direct-messages' query={{ conversationId: conversation.id }} />
    </div>
  )
}

export default MemberIdPage