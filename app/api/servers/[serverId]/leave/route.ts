import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {

  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if(!params.serverId) {
      return new NextResponse("Server ID not found", { status: 404 });
    }

    const server = await db.server.update({
      where : { id: params.serverId , profile_id: {
        not : profile.id
      }, members : {
        some : {
          profile_id : profile.id
        }
      } },
      data: {
        members : {
          deleteMany : {
            profile_id : profile.id
          }
        }
      }
    }); 

    return NextResponse.json(server);

  } catch (error) {
    console.error(`[SERVER_ID] ${params.serverId}`, error);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }

}