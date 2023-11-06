import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
import { db } from "@/lib/db";

export const initialProfile = async () => {

  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  };

  const profile = await db.profile.findUnique({
    where: {
      user_id: user.id
    }
  })

  if (profile) {
    return profile
  }

  const newProfile = await db.profile.create({
    data: {
      user_id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress
    }
  })

  console.table(user);
  return newProfile;
}