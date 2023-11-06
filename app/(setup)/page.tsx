import { db } from '@/lib/db';
import { initialProfile } from '@/services/initial-profile';
import { redirect } from 'next/navigation';
import InitialModal from '@/components/modal/initial-modal';
import { UserButton } from '@clerk/nextjs';


async function SetupPage() {

  const profile: any = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profile_id: profile.id
        }
      }
    }
  })

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
      <InitialModal />
  )
}

export default SetupPage;