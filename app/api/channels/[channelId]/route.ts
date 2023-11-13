import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";


export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {

  try {

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID not found", { status: 404 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID not found", { status: 404 });
    }


    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profile_id: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        Channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general"
            }
          }
        }
      }
    })

    return NextResponse.json(server);

  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", params.channelId, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

}
export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {

  try {
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const profile = await currentProfile();
    const { name, type } = await req.json();
    console.log('Name:', name);
    console.log('Type:', type);

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID not found", { status: 404 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID not found", { status: 404 });
    }

    if (name === "general") {
      return new NextResponse("Channel name cannot be 'general'", { status: 404 });
    }


    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profile_id: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        Channels: {
          update: {
            where: {
              id: params.channelId,
              name: {
                not: "general"
              }
            },
            data: {
              name,
              type
            }
          }
        }
      }
    })

    return NextResponse.json(server);

  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", params.channelId, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}