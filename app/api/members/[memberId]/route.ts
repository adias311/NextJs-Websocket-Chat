import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
  try {

    const profile = await currentProfile();
    const { role } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");


    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: { id: serverId, profile_id: profile.id },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profile_id: {
                not: profile.id
              }
            },
            data: {
              role
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true
          },
          orderBy: {
            role: "asc"
          }
        }
      }
    })

    return NextResponse.json(server);
  } catch (error) {
    console.log("MEMBER_ID_PATCH", params.memberId, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: { id: serverId, profile_id: profile.id },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profile_id : {
              not : profile.id
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true
          },
          orderBy: {
            role: "asc"
          }
        }
      }
    })

    return NextResponse.json(server);

  } catch (error) {
    console.log("MEMBER_ID_DELETE", params.memberId, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}