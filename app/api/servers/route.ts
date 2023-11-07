import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("masuk");

    const server = await db.server.create({
      data: {
        profile_id: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        Channels: {
          create: { name: "general", profile_id: profile.id }
        },
        members: {
          create: { profile_id: profile.id, role: MemberRole.ADMIN }
        }
      }
    })
    return NextResponse.json(server);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}