import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function PATCH(request: Request, { params }: { params: { serverId: string } }) {

  try {

    const profile = await currentProfile();
    const { name, imageUrl } = await request.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: { id: params.serverId, profile_id: profile.id },
      data: {
        name,
        imageUrl
      }
    })

    return NextResponse.json(server);

  } catch (error) {
    console.log("[SERVER_ID_PATCH]", params.serverId, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

}
export async function DELETE(request: Request, { params }: { params: { serverId: string } }) {

  try {

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.delete({
      where: { id: params.serverId, profile_id: profile.id },
    })

    return NextResponse.json(server);

  } catch (error) {
    console.log("[SERVER_ID_DELETE]", params.serverId, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

}